import type { CartItem } from '../../domain/entities/Cart';

interface PunchOutOrderParams {
    buyerCookie: string;
    items: CartItem[];
    currency?: string;
    buyerIdentity: string;
    supplierIdentity: string;
}

export function buildPunchOutOrderMessage({
    buyerCookie,
    items,
    currency = 'BRL',
    buyerIdentity,
    supplierIdentity

}: PunchOutOrderParams): string {
    const timestamp = new Date().toISOString();
    const payloadID = `${Date.now()}@sap-ariba-punchout`;

    const total = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const itemsXml = items
        .map(
            (item) => `
            <ItemIn quantity="${item.quantity}">
                <ItemID>
                    <SupplierPartID>${escapeXml(String(item.id))}</SupplierPartID>
                </ItemID>
                <ItemDetail>
                    <UnitPrice>
                        <Money currency="${currency}">${Number(item.price).toFixed(2)}</Money>
                    </UnitPrice>
                    <Description xml:lang="pt">${escapeXml(item.name)}</Description>
                    <UnitOfMeasure>EA</UnitOfMeasure>
                </ItemDetail>
            </ItemIn>`
        )
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
<cXML payloadID="${payloadID}" timestamp="${timestamp}">
    <Header>
        <From>
            <Credential domain="NetworkID">
                <Identity>${supplierIdentity}</Identity>
            </Credential>
        </From>
        <To>
            <Credential domain="NetworkID">
                <Identity>${buyerIdentity}</Identity>
            </Credential>
        </To>
        <Sender>
            <Credential domain="NetworkID">
                <Identity>${supplierIdentity}</Identity>
            </Credential>
            <UserAgent>Falco PunchOut Catalog</UserAgent>
        </Sender>
    </Header>
    <Message>
        <PunchOutOrderMessage>
            <BuyerCookie>${escapeXml(buyerCookie)}</BuyerCookie>
            <PunchOutOrderMessageHeader operationAllowed="edit">
                <Total>
                    <Money currency="${currency}">${total.toFixed(2)}</Money>
                </Total>
            </PunchOutOrderMessageHeader>${itemsXml}
        </PunchOutOrderMessage>
    </Message>
</cXML>`;
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function submitPunchOutOrder(postUrl: string, xml: string): Promise<void> {
    return new Promise((resolve) => {
        const encoded = btoa(unescape(encodeURIComponent(xml)));

        const iframeName = `punchout-iframe-${Date.now()}`;
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = postUrl;
        form.target = iframeName;
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cxml-base64';
        input.value = encoded;

        form.appendChild(input);
        document.body.appendChild(form);

        iframe.addEventListener('load', () => {
            document.body.removeChild(iframe);
            document.body.removeChild(form);
            resolve();
        });

        form.submit();
    });
}

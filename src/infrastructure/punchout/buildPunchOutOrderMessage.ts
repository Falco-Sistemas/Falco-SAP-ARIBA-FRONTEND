import type { CartItem } from '../../domain/entities/Cart';

interface PunchOutOrderParams {
    buyerCookie: string;
    items: CartItem[];
    currency?: string;
}

export function buildPunchOutOrderMessage({
    buyerCookie,
    items,
    currency = 'BRL',
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
                <Identity>AN01012345678</Identity>
            </Credential>
        </From>
        <To>
            <Credential domain="NetworkID">
                <Identity>AN01000002792</Identity>
            </Credential>
        </To>
        <Sender>
            <Credential domain="NetworkID">
                <Identity>AN01012345678</Identity>
            </Credential>
            <UserAgent>SAP Ariba PunchOut Catalog</UserAgent>
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

export function submitPunchOutOrder(postUrl: string, xml: string): void {
    const encoded = btoa(unescape(encodeURIComponent(xml)));

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = postUrl;
    form.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'cxml-base64';
    input.value = encoded;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

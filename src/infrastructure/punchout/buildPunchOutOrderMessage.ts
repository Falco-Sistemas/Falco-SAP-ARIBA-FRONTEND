// A montagem do XML do PunchOutOrderMessage agora acontece no backend
// (endpoint POST /ariba/cart), que revalida preço e estoque reais dos
// produtos no banco antes de gerar o cXML. Aqui fica só o envio (POST via
// formulário oculto no navegador), que precisa mesmo rodar no client porque
// é o navegador do comprador que precisa fazer esse POST pro
// browserFormPostUrl da Ariba.

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

        let resolved = false;
        const cleanup = () => {
            if (resolved) return;
            resolved = true;
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
            if (document.body.contains(form)) document.body.removeChild(form);
            resolve();
        };

        iframe.addEventListener('load', cleanup);

        // O POST já foi enviado, não precisa esperar resposta do Ariba
        setTimeout(cleanup, 2000);

        form.submit();
    });
}

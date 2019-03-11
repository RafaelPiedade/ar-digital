const controller = {};

const puppeteer = require('puppeteer');


controller.home = (req, res) => {
    res.render('index')
}
controller.pdf = (req, res) => {
    console.log('gerando pdf')
    console.log(req.query)
    createPDF(req.query);
    res.send('ok');
}


controller.edit = (req, res) => {
    console.log('chegou no ar', req.query)
    res.render('ar', {
        lote: req.query
    })
}

controller.allpdf = (req, res) => {
    console.log('ALLPDF')
    const lotes = JSON.parse(req.body.dados)
    console.log(lotes)

    /*

    json.forEach(element => {
        createPDF(element.id);
    });
*/
    res.sendStatus(200)
}




const createPDF = async (lote) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    const options = {
        path: `pdf/AR_${lote.lote}.pdf`,
        format: 'A4',
        margin: {
            top: '5mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm',
        }
    }

    await page.goto(`http://localhost:3000/ar?lote=${lote.lote}&notificacao=${lote.notificacao}&placa=${lote.placa}&renvan=${lote.renavan}&marcaModelo=${lote.marcaModelo}&chassi=${lote.chassi}&motor=${lote.motor}&obs=${lote.obs}&cliente=${lote.cliente}&endereco=${lote.endereco}&bairro=${lote.bairro}&cep=${lote.cep}&cidade=${lote.cidade}`, { waitUntil: 'networkidle2' });
    await page.pdf(options);

    await browser.close();
}

module.exports = controller;
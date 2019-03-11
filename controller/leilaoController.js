const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM leiloes', (err, leiloes) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify({leiloes});
            res.end(json);
        });
    })
}

controller.listEmpresa = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT CodigoLeilao, Descricao FROM leilao WHERE leilao.CodigoEmpresa = ? ORDER BY Descricao',[req.params.idEmpresa], (err, leiloes) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify({leiloes});
            res.end(json);
        });
    })
}

module.exports = controller;
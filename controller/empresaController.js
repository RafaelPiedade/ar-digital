const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT CodigoEmpresa, RazaoSocial FROM empresa ORDER BY empresa.RazaoSocial', (err, empresas) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify({empresas});
            res.end(json);
        });
    })
}

module.exports = controller;
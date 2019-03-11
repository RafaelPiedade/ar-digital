const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM leiloes', (err, leiloes) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify({ leiloes });
            res.end(json);
        });
    })
}

controller.listProprietario = (req, res) => {
    req.getConnection((err, conn) => {
        sql = `SELECT 
        Lote,
        veiculo.VEIPLACA AS Placa,
        veiculo.VEIRENAVM AS Renavan,
        marca.MARDESC AS Marca,
        modelo.MODDESC AS Modelo,
        CONCAT(veiculo.VEIANOFAB,' / ', VEIANOMOD) Ano,
        ordem_servico.Observacao,
        cliente.CLINOMERAZ AS Cliente,
        cliente.CLIEND Endereco,
        cliente.CLIBAIRRO Bairro,
        cliente.CLICPFCNPJ CFP,
        concat(cidade.CIDNOME,' / ',cidade.CIDUF) Cidade
    FROM 
    ordem_servico
        LEFT OUTER JOIN veiculo ON (ordem_servico.CodigoVeiculo = veiculo.VEICOD)
        LEFT OUTER JOIN modelo ON (veiculo.VEIMODELO = modelo.MODCOD)
        LEFT OUTER JOIN marca ON (veiculo.VEIMARCA = marca.MARCOD)
        INNER JOIN leilao ON (ordem_servico.CodigoLeilao = leilao.CodigoLeilao)
        LEFT OUTER JOIN cliente ON (ordem_servico.CodigoCliente = cliente.CLICOD)
        LEFT OUTER JOIN cidade ON (cliente.CLICID = cidade.CIDCOD)
    WHERE 
        ordem_servico.CodigoEmpresa = ${req.query.empresa} 
        AND ordem_servico.CodigoLeilao = ${req.query.leilao}`
        sql += judicial(req.query.judicial)
        sql += retirado(req.query.retirado)
        conn.query(sql, (err, leiloes) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify({ leiloes });
            res.end(json);
        });
    })
}

controller.listComunicacao1 = (req, res) => {
    req.getConnection((err, conn) => {
        const sql = `
        SELECT 
            Lote,
            veiculo.VEIPLACA AS Placa,
            veiculo.VEIRENAVM AS Renavan,
            marca.MARDESC AS Marca,
            modelo.MODDESC AS Modelo,
            CONCAT(veiculo.VEIANOFAB,' / ', VEIANOMOD) Ano,
            ordem_servico.Observacao,
            cliente.CLINOMERAZ AS Cliente,
            cliente.CLIEND Endereco,
            cliente.CLIBAIRRO Bairro,
            cliente.CLICPFCNPJ CFP,
            concat(cidade.CIDNOME,' / ',cidade.CIDUF) Cidade
        FROM 
        ordem_servico
            LEFT OUTER JOIN veiculo ON (ordem_servico.CodigoVeiculo = veiculo.VEICOD)
            LEFT OUTER JOIN modelo ON (veiculo.VEIMODELO = modelo.MODCOD)
            LEFT OUTER JOIN marca ON (veiculo.VEIMARCA = marca.MARCOD)
            INNER JOIN leilao ON (ordem_servico.CodigoLeilao = leilao.CodigoLeilao)
            LEFT OUTER JOIN cliente ON (ordem_servico.CodigoClienteComunicaVenda1 = cliente.CLICOD)
            LEFT OUTER JOIN cidade ON (cliente.CLICID = cidade.CIDCOD)
        WHERE 
            ordem_servico.CodigoEmpresa = ${req.query.empresa} 
            AND ordem_servico.CodigoLeilao = ${req.query.leilao}
            AND ordem_servico.CodigoClienteComunicaVenda1 <> 0
        `
        sql += judicial(req.query.judicial)
        sql += retirado(req.query.retirado)
        conn.query(sql, (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify({ data });
            res.end(json);
        });
    })
}

controller.listComunicacao2 = (req, res) => {
    req.getConnection((err, conn) => {
        const sql = `
        SELECT 
        Lote,
        veiculo.VEIPLACA AS Placa,
        veiculo.VEIRENAVM AS Renavan,
        marca.MARDESC AS Marca,
        modelo.MODDESC AS Modelo,
        CONCAT(veiculo.VEIANOFAB,' / ', VEIANOMOD) Ano,
        ordem_servico.Observacao,
        cliente.CLINOMERAZ AS Cliente,
        cliente.CLIEND Endereco,
        cliente.CLIBAIRRO Bairro,
        cliente.CLICPFCNPJ CFP,
        concat(cidade.CIDNOME,' / ',cidade.CIDUF) Cidade
    FROM 
    ordem_servico
        LEFT OUTER JOIN veiculo ON (ordem_servico.CodigoVeiculo = veiculo.VEICOD)
        LEFT OUTER JOIN modelo ON (veiculo.VEIMODELO = modelo.MODCOD)
        LEFT OUTER JOIN marca ON (veiculo.VEIMARCA = marca.MARCOD)
        INNER JOIN leilao ON (ordem_servico.CodigoLeilao = leilao.CodigoLeilao)
        LEFT OUTER JOIN cliente ON (ordem_servico.CodigoClienteComunicaVenda2 = cliente.CLICOD)
        LEFT OUTER JOIN cidade ON (cliente.CLICID = cidade.CIDCOD)
    WHERE 
        ordem_servico.CodigoEmpresa = ${req.query.empresa} 
        AND ordem_servico.CodigoLeilao = ${req.query.leilao}
        AND ordem_servico.CodigoClienteComunicaVenda2 IS NOT null
        AND ordem_servico.CodigoClienteComunicaVenda2 <> 0
        `
        sql += judicial(req.query.judicial)
        sql += retirado(req.query.retirado)
        conn.query(sql, (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify({ data });
            res.end(json);
        });
    })
}


const judicial = (judicial) => {
    if (judicial == 'n') {
        return `and ordem_servico.Observacao not like  '%RENA%' AND
        ordem_servico.Observacao  not like  '%DROGA%' AND
        ordem_servico.Observacao  not like  '%TRABALH%' AND
        ordem_servico.Observacao  not like  '%ADULTERADO%' AND
        ordem_servico.Observacao  not like  '%ESTELION%' AND
        ordem_servico.Observacao  not like  '%BITO%' AND
        ordem_servico.Observacao  not like  '%JUDICIAL%' AND
        ordem_servico.Observacao  not like  '%FURTO%' AND
        ordem_servico.Observacao  not like  '%FORA DO PADR%' AND
        ordem_servico.Observacao  not like  '%INDEBITA%' AND
        ordem_servico.Observacao  not like  '%FORA DO PADR%' AND
        ordem_servico.Observacao  not like  '%INDĂ‰BITA%' AND
        ordem_servico.Observacao  not like  '%QUEIXA%' AND
        ordem_servico.Observacao not like  '%REF IP%' AND
        ordem_servico.Observacao not like  '%CONTRA NOTIFICACAO%' AND
        ordem_servico.Observacao not like  '%RETIRADO%' AND
        ordem_servico.Observacao not like  '%INDISPON%' AND
        ordem_servico.Observacao not like  '%4VCIVIL%' AND
        ordem_servico.Observacao not like  '%CRIMINAL%' AND
        ordem_servico.Observacao not like  '%BOLETIM%' AND
        ordem_servico.Observacao not like  '%DCT%' AND
        ordem_servico.Observacao  not like  '%INQUERI%'
        or ordem_servico.Observacao is null`
    } else if (judicial == 's') {
        return `and ordem_servico.Observacao like '%RENA%' AND
ordem_servico.Observacao like '%DROGA%' AND
ordem_servico.Observacao like '%TRABALH%' AND
ordem_servico.Observacao like '%ADULTERADO%' AND
ordem_servico.Observacao like '%ESTELION%' AND
ordem_servico.Observacao like '%BITO%' AND
ordem_servico.Observacao like '%JUDICIAL%' AND
ordem_servico.Observacao like '%FURTO%' AND
ordem_servico.Observacao like '%FORA DO PADR%' AND
ordem_servico.Observacao like '%INDEBITA%' AND
ordem_servico.Observacao like '%FORA DO PADR%' AND
ordem_servico.Observacao like '%INDĂ‰BITA%' AND
ordem_servico.Observacao like '%QUEIXA%' AND
ordem_servico.Observacao like '%REF IP%' AND
ordem_servico.Observacao like '%CONTRA IFICACAO%' AND
ordem_servico.Observacao like '%RETIRADO%' AND
ordem_servico.Observacao like '%INDISPON%' AND
ordem_servico.Observacao like '%4VCIVIL%' AND
ordem_servico.Observacao like '%CRIMINAL%' AND
ordem_servico.Observacao like '%BOLETIM%' AND
ordem_servico.Observacao like '%DCT%' AND
ordem_servico.Observacao like '%INQUERI%'
or ordem_servico.Observacao is null`
    } else {
        return '';
    }
}

const retirado = (retirado) => {
    if (retirado == 's') {
        return " and ExcluidoDiario = 'S'"
    } else if (retirado == 'n') {
        return " and ExcluidoDiario = 'N'"
    } else if (retirado == 't') {
        return ''
    } else {
        console.log('ERRO RETIRADO')
    }
}


module.exports = controller;
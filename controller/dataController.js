const controller = {};
const parseRTF = require('rtf-parser');
const deEncapsulateSync = require('rtf-stream-parser');
const icovLite = require('iconv-lite');

controller.home = (req, res) => {
    res.render('testeDataTable')
}

controller.data = (req, res) => {
    req.getConnection((err, conn) => {
        const dados = req.query;
        //console.log("!!qury", req.query)
        //console.log("dados: ", dados.comunicacao)

        var sql = `SELECT
        lote, 
        notificacao,
        veiculo.VEIPLACA AS Placa,
        veiculo.VEIRENAVM AS Renavan,
        CONCAT(marca.MARDESC,' / ', modelo.MODDESC) MarModelo, 
        ChassiVeiculoBase,
        MotorVeiculoBase,
        Observacao,
        cliente.CLINOMERAZ AS Cliente, 
        cliente.CLIEND as Endereco,
        cliente.CLIBAIRRO as Bairro, 
        cliente.CLICEP as CEP, 
        concat(cidade.CIDNOME,' / ',cidade.CIDUF) as Cidade,
        leilao.ObservacaoLeilao
        from (`
        //console.log("proprietario::::", dados.comunicacao.includes('1'))

        if (dados.comunicacao.includes('1')) {
            console.log("ENTROU 1")
            sql += `SELECT lote,
            'PROPRIETARIO' as notificacao,
            ordem_servico.CodigoVeiculo,
            ordem_servico.CodigoLeilao,
            ordem_servico.CodigoCliente ,
            ordem_servico.ChassiVeiculoBase,
            ordem_servico.MotorVeiculoBase,
            ordem_servico.ExcluidoDiario,
            ordem_servico.Observacao
            FROM 
            ordem_servico 
            WHERE
            ordem_servico.CodigoEmpresa = ${dados.empresa} AND
            ordem_servico.CodigoLeilao = ${dados.leilao}`

            dados.comunicacao.splice(dados.comunicacao.indexOf('1'), 1);
            if (dados.comunicacao.length != 0) {
                sql += ' UNION ';
            }
        }

        if (req.query.comunicacao.includes('2')) {
            sql += `SELECT 
        lote,
        'COMUNICAÇÃO 1' as notificacao,
        ordem_servico.CodigoVeiculo,
        ordem_servico.CodigoLeilao,
        ordem_servico.CodigoClienteComunicaVenda1 as CodigoCliente,
        ordem_servico.ChassiVeiculoBase,
        ordem_servico.MotorVeiculoBase,
        ordem_servico.ExcluidoDiario,
        ordem_servico.Observacao
            FROM
        ordem_servico	
            WHERE 
        ordem_servico.CodigoEmpresa = ${dados.empresa} AND
        ordem_servico.CodigoLeilao = ${dados.leilao} AND
        ordem_servico.CodigoClienteComunicaVenda1 <> 0`

            dados.comunicacao.splice(dados.comunicacao.indexOf('2'), 1);
            if (dados.comunicacao.length != 0) {
                sql += ' UNION '
            }
        }

        if (req.query.comunicacao.includes('3')) {
            sql += ` SELECT 
        lote,
        'COMUNICAÇÃO 2' as notificacao,
        ordem_servico.CodigoVeiculo,
        ordem_servico.CodigoLeilao,
        ordem_servico.CodigoClienteComunicaVenda2 as CodigoCliente,
        ordem_servico.ChassiVeiculoBase,
        ordem_servico.MotorVeiculoBase,
        ordem_servico.ExcluidoDiario,
        ordem_servico.Observacao
    FROM
        ordem_servico
    WHERE 
        ordem_servico.CodigoEmpresa = ${dados.empresa} AND
        ordem_servico.CodigoLeilao = ${dados.leilao} AND
        ordem_servico.CodigoClienteComunicaVenda2 IS NOT null AND
        ordem_servico.CodigoClienteComunicaVenda2 <> 0`
        }

        sql += `)AS p1
        inner JOIN veiculo ON (p1.CodigoVeiculo = veiculo.VEICOD)
        inner JOIN marca ON (veiculo.VEIMARCA = marca.MARCOD)
        inner JOIN modelo ON (veiculo.VEIMODELO = modelo.MODCOD)
    inner JOIN cliente ON (p1.CodigoCliente = cliente.CLICOD)
    inner JOIN cidade ON (cliente.CLICID = cidade.CIDCOD)
    inner JOIN leilao ON (P1.CodigoLeilao = leilao.CodigoLeilao)`



        if (dados.judicial == 's') {
            sql += ` where 
        P1.Observacao like '%RENA%' OR
        P1.Observacao like '%DROGA%' OR
        P1.Observacao like '%TRABALH%' OR
        P1.Observacao like '%ADULTERADO%' OR
        P1.Observacao like '%ESTELION%' OR
        P1.Observacao like '%BITO%' OR
        P1.Observacao like '%JUDICIAL%' OR
        P1.Observacao like '%FURTO%' OR
        P1.Observacao like '%FORA DO PADR%' OR
        P1.Observacao like '%INDEBITA%' OR
        P1.Observacao like '%FORA DO PADR%' OR
        P1.Observacao like '%INDEBITA%' OR
        P1.Observacao like '%QUEIXA%' OR
        P1.Observacao like '%REF IP%' OR
        P1.Observacao like '%CONTRA IFICACAO%' OR
        P1.Observacao like '%RETIRADO%' OR
        P1.Observacao like '%INDISPON%' OR
        P1.Observacao like '%4VCIVIL%' OR
        P1.Observacao like '%CRIMINAL%' OR
        P1.Observacao like '%BOLETIM%' OR
        P1.Observacao like '%DCT%' OR
        P1.Observacao like '%INQUERI%'
        or P1.Observacao is null `
        } else if (dados.judicial == 'n') {
            sql += ` where
            (P1.Observacao not like '%RENA%' and
            P1.Observacao not like '%DROGA%' and
            P1.Observacao not like '%TRABALH%' and
            P1.Observacao not like '%ADULTERADO%' and
            P1.Observacao not like '%ESTELION%' and
            P1.Observacao not like '%BITO%' and
            P1.Observacao not like '%JUDICIAL%' and
            P1.Observacao not like '%FURTO%' and
            P1.Observacao not like '%FORA DO PADR%' and
            P1.Observacao not like '%INDEBITA%' and
            P1.Observacao not like '%FORA DO PADR%' and
            P1.Observacao not like '%INDEBITA%' and
            P1.Observacao not like '%QUEIXA%' and
            P1.Observacao not like '%REF IP%' and
            P1.Observacao not like '%CONTRA NOTIFICACAO%' and
            P1.Observacao not like '%RETIRADO%' and
            P1.Observacao not like '%INDISPON%' and
            P1.Observacao not like '%4VCIVIL%' and
            P1.Observacao not like '%CRIMINAL%' and
            P1.Observacao not like '%BOLETIM%' and
            P1.Observacao not like '%DCT%' and
            P1.Observacao not like '%INQUERI%'
            or P1.Observacao is null) `
        }

        if (dados.judicial == 't' && dados.retirado != 't') {
            sql += " where "
        } else if (dados.retirado != 't') {
            sql += " and "
        }

        if (dados.retirado == 's') {
            sql += " ExcluidoDiario like 'S'"
        }

        if (dados.retirado == 'n') {
            sql += " ExcluidoDiario like 'N'"
        }


        sql += " ORDER BY lote"

        //console.log(sql)
        conn.query(sql, (err, data) => {
            if (err) {
                throw err;
            }

            //const result = deEncapsulateSync.deEncapsulateSync(data[0].ObservacaoLeilao, { decode: icovLite.decode })
            //console.log(result)
            /* parseRTF.string(data[0].ObservacaoLeilao, (err, doc) => {
                 console.log('SSSSSSSSSSS', doc.content[0] )
             })*/

            const json = JSON.stringify({ data })
            res.end(json)
        });


    })
}

module.exports = controller;


$(document).ready(() => {

    console.log('pagina carregada')
    carregarEmpresas();

    $('#empresa').change(() => {
        $("#leilao").html('<option value="">Selecione</option>');
        carregarLeiloes();
    })

    $('#go').click(() => {
        apagarLinhas();
        let empresa = $('#empresa').val();
        let leilao = $('#leilao').val();
        let judicial = $("input[name='judicial']:checked").val();
        let retirado = $("input[name='judicial']:checked").val();
        let comunicacao = [];

        $('input[name="comunicacao"]:checked').toArray().map(function (check) {
            return comunicacao.push($(check).val());
        });

        if (empresa == '' || leilao == '' || judicial == '' || retirado == '' || comunicacao.length == 0) {
            window.alert('preencha todos os campos')
        } else {

            $.ajax({
                url: '/data/teste',
                type: 'GET',
                dataType: 'json',
                data: { empresa, leilao, judicial, retirado, comunicacao },
                success: (data) => {
                    //console.log(data)
                    const codigos = [
                        { cod1: 'AR257505806LS', cod2: 'BG257505806BR' },
                        { cod1: 'AR257505806LS', cod2: 'BG257505806BR' },
                        { cod1: 'AR257505806LS', cod2: 'BG257505806BR' },
                        { cod1: 'AR257505806LS', cod2: 'BG257505806BR' },
                        { cod1: 'AR257505806LS', cod2: 'BG257505806BR' },
                    ]
                    var i = 0
                    console.log("data:::", data.data)
                    data.data.forEach(lote => {
                        lote.CEP = lote.CEP.replace('-', '').replace(' ', '')

                        let end = '';
                        let bair = '';
                        let endNum = lote.Endereco.substring(lote.Endereco.indexOf(',') + 1)


                        $.ajax({
                            url: `https://viacep.com.br/ws/${lote.CEP}/json/`,
                            type: 'GET',
                            dataType: 'json',
                            async: false,
                            success: (data) => {
                                //console.log(data)
                                if (data.erro == true || data.complemento == '') {
                                    end = lote.Endereco;
                                    bair = lote.Bairro;
                                } else {
                                    end = `${data.logradouro} ${lote.Endereco.substring(lote.Endereco.indexOf(','))}`;
                                    bair = data.bairro
                                }

                                //console.log('dentro',end, bair)
                            }
                        })

   


                        $("#tb-body").append(`
                            <tr class="lote">
                                <td>${lote.lote}</td>
                                <td>${lote.notificacao}</td>
                                <td>${lote.Placa}</td>
                                <td>${lote.Renavan}</td>
                                <td>${lote.MarModelo}</td>
                                <td>${lote.ChassiVeiculoBase}</td>
                                <td>${lote.MotorVeiculoBase}</td>
                                <td>${lote.Observacao}</td>
                                <td>${lote.Cliente}</td>
                                <td>${end}</td>
                                <td>${bair}</td>
                                <td>${lote.CEP}</td>
                                <td>${lote.Cidade}</td>
                                <td>
                                <a
                                href="./ar?lote=${lote.lote}&notificacao=${lote.notificacao}&placa=${lote.Placa}&renvan=${lote.Renavan}&marcaModelo=${lote.MarModelo}&chassi=${lote.ChassiVeiculoBase}&motor=${lote.MotorVeiculoBase}&obs=${lote.Observacao}&cliente=${lote.Cliente}&endereco=${end}&bairro=${bair}&cep=${lote.CEP}&cidade=${lote.Cidade}&cod1=${codigos[i] == undefined ? 'undefined' : codigos[i].cod1}&cod2=${codigos[i] == undefined ? 'undefined' : codigos[i].cod2}" target="_blank" >visualizar pdf</a><br><br>
                                <a class="pdf" >gerar pdf</a>  </td>
                                <td> 
                                ${codigos[i] == undefined ? 'undefined' : codigos[i].cod1}
                                </td>
                                <td> 
                                ${codigos[i] == undefined ? 'undefined' : codigos[i].cod2}
                                </td>
                            </tr>
                            `);
                        //console.log(i);
                        i++;
                        //console.log(i);
                    })
                    $("#descricao-leilao").text(data.data[0].ObservacaoLeilao)

                },
                error: (err) => {
                    console.log('erro: ', err)
                }
            })

        }
    })



    $('#allpdf').click(() => {
        console.log('allpdf')
        const trs = document.querySelectorAll('#tb-body tr');
        const lotes = [];


        //console.log('!!!', trs[1].children[0].textContent)

        trs.forEach((tr) => {
            // console.log(tr.children[0].textContent)

            lotes.push({
                lote: tr.children[0].textContent,
                notificacao: tr.children[1].textContent,
                placa: tr.children[2].textContent,
                renavan: tr.children[3].textContent,
                marcaModelo: tr.children[4].textContent,
                chassi: tr.children[5].textContent,
                motor: tr.children[6].textContent,
                obs: tr.children[7].textContent,
                cliente: tr.children[8].textContent,
                endereco: tr.children[9].textContent,
                bairro: tr.children[10].textContent,
                cep: tr.children[11].textContent,
                cidade: tr.children[12].textContent,
                cod1: tr.children[14].textContent,
                cod2: tr.children[15].textContent
            })
        })

        $.ajax({
            url: './allpdf',
            type: 'POST',
            dataType: 'json',
            data: { dados: JSON.stringify(lotes) },
            success: (data) => {
                if (data.success) {
                    console.log('ok')
                    window.alert(`PDF gerado: ${dataLote.lote}`)
                }

            }
        })



    })








    $("#tb-body").on("click", ".pdf", function () {
        console.log('executando pdf')

        const dataLote = getLoteTable($(this)[0])

        $.ajax({
            url: './pdf/',
            type: 'get',
            dataType: 'json',
            data: dataLote,
            success: () => {
                console.log('ok')
                window.alert(`PDF gerado: ${dataLote.lote}`)
            }
        })

    });

});



const carregarEmpresas = () => {
    $.ajax({
        url: '/empresa/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            data.empresas.forEach(empresa => {
                $('#empresa').append(`<option value="${empresa.CodigoEmpresa}">${empresa.RazaoSocial} </option>`)
            });
        }
    })
}

const carregarLeiloes = () => {
    const idEmpresa = $('#empresa').val();
    $.ajax({
        url: `/leilao/empresa/${idEmpresa}`,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            data.leiloes.forEach(leilao => {
                $('#leilao').append(`<option value="${leilao.CodigoLeilao}">${leilao.Descricao} </option>`);
            });
        }
    })
}

const apagarLinhas = () => {
    var linhas = document.getElementById("tb-body").rows;
    let tamanho = linhas.length
    for (let i = 0; i < tamanho; i++) {
        document.getElementById("tb-body").deleteRow(0);
    }
}

function getLoteTable(elemento) {
    let tr = elemento.parentNode.parentNode

    let array = [];

    for (let index = 0; index < tr.children.length - 1; index++) {
        array.push(tr.children[index].textContent)
    }
    var lote = {
        lote: array[0],
        notificacao: array[1],
        placa: array[2],
        renavan: array[3],
        marcaModelo: array[4],
        chassi: array[5],
        motor: array[6],
        cliente: array[8],
        endereco: array[9],
        bairro: array[10],
        cep: array[11],
        cidade: array[12],
        cod1: array[14],
        cod2: array[15]
    }

    return lote;
}

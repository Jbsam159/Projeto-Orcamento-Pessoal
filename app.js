//Criação de um objeto por meio de modelo de classe
class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {

        //-----Atributos-----//

        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor

    }

    //-----Métodos-----//

    //Método para averiguar se os atributos possuem informações ou não
    validarDados() {

        for (let i in this) {

            if (this[i] == undefined || this[i] == '' || this[i] == null) {

                return false

            }

        }

        return true

    }

}

class Bd {

    constructor() {

        let id = localStorage.getItem('id')

        if (id === null) {

            localStorage.setItem('id', 0)

        }

    }

    getProximoId() {

        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1

    }

    gravar(d) {

        //localStorage.setItem("despesa", JSON.stringify(d))//método pra converter de Js para JSON
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem("id", id)

    }

    recuperarTodosRegistros() {

        let despesas = []

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {

            //Converter JSON para Js
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {

                continue

            }

            despesa.id = i

            despesas.push(despesa)

        }

        return despesas

    }

    pesquisar(despesa) {

        let despesasFiltradas = []

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)

        console.log(despesasFiltradas)

        //Filtros por valores
        if (despesa.ano != '') {

            console.log("Filtro de Ano")
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)

        }

        if (despesa.mes != '') {

            console.log("Filtro de Mês")
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)

        }

        if (despesa.dia != '') {

            console.log("Filtro de Dia")
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)

        }

        if (despesa.tipo != '') {

            console.log("Filtro de Tipo")
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)

        }

        if (despesa.descricao != '') {

            console.log("Filtro de Descrição")
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)

        }

        if (despesa.valor != '') {

            console.log("Filtro de Valor")
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)

        }

        return despesasFiltradas
    }

    remover(id) {

        localStorage.removeItem(id)

    }

}

let bd = new Bd()

//Função para resgatar dados dos campos preenchidos
function cadastrarDespesa() {

    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    //Duas formas de recuperar o valor.
    //1° Instanciandos todas com . value que nem acima ou dar console.log da variavel.value

    //Instanciando um novo objeto a partir do modelo de objeto Despesa
    // Todos os parâmetros vão direto para o constructor

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if (despesa.validarDados()) {

        bd.gravar(despesa)

        //.innerrHTML:Significa o conteudo interno da tag podendo modificar-lo
        document.getElementById("modal_titulo").innerHTML = "Registro Inserido com Sucesso"

        document.getElementById("modal_titulo_div").className = "modal-header text-success"

        document.getElementById("modal_mensagem").innerHTML = "Despesa cadastrada com sucesso"

        document.getElementById("modal_botao").innerHTML = "Voltar"

        document.getElementById("modal_botao").className = "btn btn-success"

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

        $('#modalRegistraDespesa').modal('show')

    } else {

        document.getElementById("modal_titulo").innerHTML = "Existe campos obrigatórios vazios"

        document.getElementById("modal_titulo_div").className = "modal-header text-danger"

        document.getElementById("modal_mensagem").innerHTML = "Erro na gravação de inormação nos campos"

        document.getElementById("modal_botao").innerHTML = "Voltar e Corrigir"

        document.getElementById("modal_botao").className = "btn btn-danger"

        $('#modalRegistraDespesa').modal('show')

    }

}

function carregaListaDespesa(despesas = [], filtro = false) {
    if (despesas.length == 0 && filtro == false) {

        despesas = bd.recuperarTodosRegistros()

    }

    let listaDespesa = document.getElementById("lista_despesa")
    listaDespesa.innerHTML = ''

    despesas.forEach(function (d) {

        let linha = listaDespesa.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {

            case '1': d.tipo = "Alimentação"
                break

            case '2': d.tipo = "Educação"
                break

            case '3': d.tipo = "Lazer"
                break

            case '4': d.tipo = "Saúde"
                break

            case '5': d.tipo = "Transporte"
                break

        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //Criação do botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times"  ></i>'
        btn.id = 'ID_Despesa' + d.id
        btn.onclick = function () {

            let id = this.id.replace('ID_Despesa', '')

            bd.remover(id)

            window.location.reload()

        }
        linha.insertCell(4).append(btn)

    })

}

function pesquisarDespesa() {

    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesa(despesas, true)

}




var CHAVE_STORAGE = "minhas-tarefas";
var tarefas = [];

$(document).ready(function () {

    tarefas = carregarTarefas();
    renderizarTarefas();

    // Abre a janela de nova tarefa
    $('#btn-nova-tarefa').click(function () {
        $('#input-nova-tarefa').val("");
        var modal = new bootstrap.Modal(document.getElementById('modal-nova-tarefa'));
        modal.show();
    });

    // Clique no botão "Salvar" dentro da janela
    $('#btn-salvar-tarefa').click(function () {
        criarNovaTarefa();
    });

    $('#lista-tarefas').on('click', '.btn-concluir', function () {
        var id = $(this).attr('data-id');
        marcarComoConcluida(id);
    });

    $('#lista-tarefas').on('click', '.btn-excluir', function () {
        var id = $(this).attr('data-id');
        excluirTarefa(id);
    });

});

function carregarTarefas() {
    var dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos === null) {
        return [];
    } else {
        return JSON.parse(dadosSalvos);
    }
}

function salvarTarefas() {
    var textoParaSalvar = JSON.stringify(tarefas);
    localStorage.setItem(CHAVE_STORAGE, textoParaSalvar);
}

function criarNovaTarefa() {
    var texto = $('#input-nova-tarefa').val();

    if (texto === "") {
        return;
    }

    var novaTarefa = {
        id: Date.now(),
        texto: texto,
        criadaEm: new Date().toLocaleString("pt-BR"),
        concluida: false
    };

    tarefas.push(novaTarefa);
    salvarTarefas();
    renderizarTarefas();

    // Fecha a janela depois de salvar
    var modal = bootstrap.Modal.getInstance(document.getElementById('modal-nova-tarefa'));
    modal.hide();
}

function marcarComoConcluida(id) {
    for (var i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id == id) {
            if (tarefas[i].concluida == true) {
                tarefas[i].concluida = false;
            } else {
                tarefas[i].concluida = true;
            }
        }
    }

    salvarTarefas();
    renderizarTarefas();
}

function excluirTarefa(id) {
    var novaLista = [];

    for (var i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id != id) {
            novaLista.push(tarefas[i]);
        }
    }

    tarefas = novaLista;
    salvarTarefas();
    renderizarTarefas();
}

function renderizarTarefas() {
    var lista = $('#lista-tarefas');
    lista.empty();

    if (tarefas.length === 0) {
        $('#mensagem-vazia').show();
    } else {
        $('#mensagem-vazia').hide();
    }

    for (var i = 0; i < tarefas.length; i++) {
        var tarefa = tarefas[i];

        var textoBotaoConcluir = "";
        var classDoItem = "";

        if (tarefa.concluida == true) {
            textoBotaoConcluir = "Desmarcar";
            classDoItem = "concluida";
        } else {
            textoBotaoConcluir = "Concluir";
            classDoItem = "";
        }

        var html = '<li class="' + classDoItem + '">' +
            '<button class="btn-concluir" data-id="' + tarefa.id + '">' + textoBotaoConcluir + '</button>' +
            '<div class="conteudo">' +
            '<span class="texto"></span>' +
            '<span class="data">' + tarefa.criadaEm + '</span>' +
            '</div>' +
            '<button class="btn-excluir" data-id="' + tarefa.id + '">Excluir</button>' +
            '</li>';

        var newElemento = $(html);
        newElemento.find('.texto').text(tarefa.texto);

        lista.append(newElemento);
    }
}
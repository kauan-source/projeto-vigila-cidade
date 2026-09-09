// ==========================================
// FILTRO DE CÂMERAS
// ==========================================

function filtrarCameras() {

    const pesquisa = document
        .getElementById("pesquisaCamera")
        .value
        .toLowerCase();

    const status = document
        .getElementById("filtroStatus")
        .value;

    const cameras = document.querySelectorAll(".camera-card");

    cameras.forEach(camera => {

        const texto = camera.innerText.toLowerCase();

        const statusCamera = camera.dataset.status;

        const correspondePesquisa =
            texto.includes(pesquisa);

        const correspondeStatus =
            status === "todos" ||
            statusCamera === status;

        if (correspondePesquisa && correspondeStatus) {

            camera.style.display = "block";

        } else {

            camera.style.display = "none";

        }

    });

}


// ==========================================
// REGISTRAR OCORRÊNCIA
// ==========================================

const formulario =
    document.getElementById("formOcorrencia");


formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const local =
        document.getElementById("localOcorrencia").value;

    const tipo =
        document.getElementById("tipoOcorrencia").value;

    const prioridade =
        document.getElementById("prioridadeOcorrencia").value;

    const descricao =
        document.getElementById("descricaoOcorrencia").value;


    const horario =
        new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });


    const novaOcorrencia =
        document.createElement("div");

    novaOcorrencia.classList.add("ocorrencia");


    novaOcorrencia.innerHTML = `

        <div class="ocorrencia-icone">
            🚨
        </div>

        <div>

            <strong>${tipo}</strong>

            <p>${local}</p>

            <small>
                Hoje às ${horario}
            </small>

        </div>

        <span class="prioridade ${prioridade.toLowerCase()}">
            ${prioridade}
        </span>

    `;


    document
        .getElementById("listaOcorrencias")
        .prepend(novaOcorrencia);


    formulario.reset();


    atualizarOcorrencias();

    alert(
        "Ocorrência registrada no sistema demonstrativo."
    );

});


// ==========================================
// ATUALIZAR INDICADOR
// ==========================================

function atualizarOcorrencias() {

    const ocorrencias =
        document.querySelectorAll(".ocorrencia");

    document.getElementById("ocorrenciasHoje")
        .innerText = ocorrencias.length
            .toString()
            .padStart(2, "0");

}


// ==========================================
// ÁREA DO OPERADOR
// ==========================================

function abrirPainel() {

    alert(
        "Área demonstrativa do operador.\n\n" +
        "Em uma versão real, esta área teria autenticação, " +
        "controle de permissões e registro de atividades."
    );

}


// ==========================================
// EFEITO NO DASHBOARD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarOcorrencias();

        console.log(
            "VigilaCidade iniciado com sucesso."
        );

    }
);

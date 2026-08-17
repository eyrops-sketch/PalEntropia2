/*
========================================================
PalEntropía
CAB10.js
Generador de Paleofichas 1.1

ECOLOGÍA — COORDINADOR

CAB10
 ├── CAB12 → Modo de vida
 ├── CAB13 → Medio de vida
 └── CAB14 → Hábitats

CAB10 controla únicamente:
- Botón Ecología
- Lightbox
- Contenedores de los módulos
========================================================
*/


let fichaActualCAB10 = null;


/* =====================================================
   RECIBIR FICHA ACTUAL
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        fichaActualCAB10 =
            evento.detail || null;

        console.log(
            "CAB10: ficha recibida:",
            fichaActualCAB10
        );

        /*
        ----------------------------------------
        SI EL LIGHTBOX YA ESTÁ ABIERTO
        ACTUALIZAR ECOLOGÍA
        ----------------------------------------
        */

        const contenedor =
            document.getElementById(
                "contenidoEcologia"
            );

        if (
            contenedor &&
            window.CAB12 &&
            typeof window.CAB12.mostrar ===
                "function"
        ) {

            window.CAB12.mostrar(
                document.getElementById(
                    "cab12Ecologia"
                ),
                fichaActualCAB10
            );

        }

    }
);


/* =====================================================
   INICIALIZAR CAB10
   ===================================================== */

function inicializarCAB10() {


    const ficha =
        document.getElementById(
            "ficha"
        );


    if (!ficha) {

        return;

    }


    /* =================================================
       EVITAR DUPLICADO
       ================================================= */

    if (
        document.getElementById(
            "botonEcologia"
        )
    ) {

        return;

    }


    /* =================================================
       BUSCAR CONTENEDOR DE BOTONES
       ================================================= */

    const contenedor =
        document.getElementById(
            "botonesCAB09"
        );


    if (!contenedor) {

        console.warn(
            "CAB10: no existe #botonesCAB09."
        );

        return;

    }


    /* =================================================
       BOTÓN ECOLOGÍA
       ================================================= */

    const boton =
        document.createElement(
            "button"
        );


    boton.id =
        "botonEcologia";


    boton.type =
        "button";


    boton.textContent =
        "Ecología";


    contenedor.appendChild(
        boton
    );


    /* =================================================
       ABRIR ECOLOGÍA
       ================================================= */

    boton.onclick =
        function() {

            abrirEcologia();

        };


    console.log(
        "CAB10: botón Ecología creado."
    );

}


/* =====================================================
   ABRIR LIGHTBOX ECOLOGÍA
   ===================================================== */

function abrirEcologia() {


    /*
    ----------------------------------------
    EVITAR DUPLICADO
    ----------------------------------------
    */

    if (
        document.getElementById(
            "lightboxEcologia"
        )
    ) {

        return;

    }


    /* =================================================
       LIGHTBOX
       ================================================= */

    const lightbox =
        document.createElement(
            "div"
        );


    lightbox.id =
        "lightboxEcologia";


    /* =================================================
       VENTANA
       ================================================= */

    const ventana =
        document.createElement(
            "div"
        );


    /* =================================================
       TÍTULO
       ================================================= */

    const titulo =
        document.createElement(
            "h2"
        );


    titulo.textContent =
        "Ecología";


    ventana.appendChild(
        titulo
    );


    /* =================================================
       CONTENIDO ECOLOGÍA
       ================================================= */

    const contenido =
        document.createElement(
            "div"
        );


    contenido.id =
        "contenidoEcologia";


    /* =================================================
       CAB12 — MODO DE VIDA
       ================================================= */

    const cab12 =
        document.createElement(
            "div"
        );


    cab12.id =
        "cab12Ecologia";


    contenido.appendChild(
        cab12
    );


    /* =================================================
       CAB13 — MEDIO DE VIDA
       ================================================= */

    const cab13 =
        document.createElement(
            "div"
        );


    cab13.id =
        "cab13Ecologia";


    contenido.appendChild(
        cab13
    );


    /* =================================================
       CAB14 — HÁBITATS
       ================================================= */

    const cab14 =
        document.createElement(
            "div"
        );


    cab14.id =
        "cab14Ecologia";


    contenido.appendChild(
        cab14
    );


    ventana.appendChild(
        contenido
    );


    /* =================================================
       BOTÓN CERRAR
       ================================================= */

    const cerrar =
        document.createElement(
            "button"
        );


    cerrar.type =
        "button";


    cerrar.textContent =
        "×";


    cerrar.setAttribute(
        "aria-label",
        "Cerrar ecología"
    );


    cerrar.onclick =
        function() {

            lightbox.remove();

        };


    ventana.appendChild(
        cerrar
    );


    /* =================================================
       MOSTRAR LIGHTBOX
       ================================================= */

    lightbox.appendChild(
        ventana
    );


    document.body.appendChild(
        lightbox
    );


    /* =================================================
       CAB12
       ================================================= */

    if (
        window.CAB12 &&
        typeof window.CAB12.mostrar ===
            "function"
    ) {

        window.CAB12.mostrar(
            cab12,
            fichaActualCAB10
        );

    } else {

        cab12.innerHTML =
            "<h3>Modo de vida</h3>" +
            "<p>CAB12 no está disponible.</p>";

    }


    /* =================================================
       CAB13
       ================================================= */

    if (
        window.CAB13 &&
        typeof window.CAB13.mostrar ===
            "function"
    ) {

        window.CAB13.mostrar(
            cab13,
            fichaActualCAB10
        );

    }


    /* =================================================
       CAB14
       ================================================= */

    if (
        window.CAB14 &&
        typeof window.CAB14.mostrar ===
            "function"
    ) {

        window.CAB14.mostrar(
            cab14,
            fichaActualCAB10
        );

    }


    console.log(
        "CAB10: Ecología abierta."
    );

}


/* =====================================================
   EVENTO PRINCIPAL
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function() {

        inicializarCAB10();

    }
);


/* =====================================================
   RESPALDO
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            function() {

                inicializarCAB10();

            },
            100
        );

    }
);


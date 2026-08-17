/*
========================================================
PalEntropía
CAB12.js
Generador de Paleofichas 1.1

ECOLOGÍA — MODO DE VIDA

CAB12 recibe:

MASTER_ACTUAL.j9

y consulta:

PALMODO

No crea botones.
No crea lightbox.
No modifica la ficha principal.

CAB10 se encarga del lightbox.
CAB12 únicamente genera el contenido.
========================================================
*/


window.CAB12 = {


    /* =================================================
       MOSTRAR MODO DE VIDA
       ================================================= */

    mostrar: function(contenedor) {


        /*
        ----------------------------------------
        COMPROBAR CONTENEDOR
        ----------------------------------------
        */

        if (!contenedor) {

            console.error(
                "CAB12: no existe contenedor."
            );

            return;

        }


        /*
        ----------------------------------------
        COMPROBAR PALMODO
        ----------------------------------------
        */

        if (
            !window.PALMODO
        ) {

            console.error(
                "CAB12: PALMODO no está cargado."
            );

            return;

        }


        /*
        ----------------------------------------
        COMPROBAR MASTER
        ----------------------------------------
        */

        if (
            !window.MASTER_ACTUAL
        ) {

            console.warn(
                "CAB12: MASTER_ACTUAL no disponible."
            );

            return;

        }


        /*
        ----------------------------------------
        LEER j9
        ----------------------------------------
        */

        const j9 =
            String(
                window.MASTER_ACTUAL.j9 || ""
            ).trim();


        if (!j9) {

            console.warn(
                "CAB12: j9 vacío."
            );

            return;

        }


        /*
        ----------------------------------------
        NORMALIZAR j9
        ----------------------------------------
        */

        const codigo =
            "MV" +
            j9.padStart(
                3,
                "0"
            );


        /*
        ----------------------------------------
        BUSCAR EN PALMODO
        ----------------------------------------
        */

        const modo =
            window.PALMODO[
                codigo
            ];


        if (!modo) {

            console.warn(
                "CAB12: modo de vida no encontrado:",
                codigo
            );

            return;

        }


        /*
        ----------------------------------------
        LIMPIAR CONTENEDOR
        ----------------------------------------
        */

        contenedor.innerHTML = "";


        /*
        ----------------------------------------
        TÍTULO
        ----------------------------------------
        */

        const titulo =
            document.createElement(
                "h3"
            );


        titulo.textContent =
            "Modo de vida";


        contenedor.appendChild(
            titulo
        );


        /*
        ----------------------------------------
        NOMBRE
        ----------------------------------------
        */

        const nombre =
            document.createElement(
                "div"
            );


        nombre.className =
            "nombreModoVidaCAB12";


        nombre.textContent =
            modo.nombre;


        contenedor.appendChild(
            nombre
        );


        /*
        ----------------------------------------
        DESCRIPCIÓN
        ----------------------------------------
        */

        const descripcion =
            document.createElement(
                "p"
            );


        descripcion.className =
            "descripcionModoVidaCAB12";


        descripcion.textContent =
            modo.descripcion;


        contenedor.appendChild(
            descripcion
        );


        /*
        ----------------------------------------
        INFORMACIÓN TÉCNICA
        ----------------------------------------
        */

        const codigoElemento =
            document.createElement(
                "div"
            );


        codigoElemento.className =
            "codigoModoVidaCAB12";


        codigoElemento.textContent =
            codigo;


        contenedor.appendChild(
            codigoElemento
        );


        console.log(
            "CAB12 — Modo de vida:",
            codigo,
            modo.nombre
        );

    }

};

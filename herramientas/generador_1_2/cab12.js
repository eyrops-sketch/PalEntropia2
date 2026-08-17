/*
========================================================
PalEntropía
CAB12.js
Generador de Paleofichas 1.1

ECOLOGÍA — MODO DE VIDA

Lee directamente:

MASTER_ACTUAL.j9

y consulta:

PALMODO

No crea botones.
No crea lightbox.
No modifica CAB10.
========================================================
*/


window.CAB12 = {


    /* =================================================
       MOSTRAR MODO DE VIDA
       ================================================= */

    mostrar: function(contenedor) {


        console.log(
            "CAB12: iniciado."
        );


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
        COMPROBAR MASTER
        ----------------------------------------
        */

        if (!window.MASTER_ACTUAL) {

            console.error(
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


        console.log(
            "CAB12: j9 recibido =",
            j9
        );


        /*
        ----------------------------------------
        COMPROBAR j9
        ----------------------------------------
        */

        if (!j9) {

            contenedor.innerHTML =
                "<p>Modo de vida no definido.</p>";

            return;

        }


        /*
        ----------------------------------------
        COMPROBAR PALMODO
        ----------------------------------------
        */

        if (!window.PALMODO) {

            console.error(
                "CAB12: PALMODO no está cargado."
            );

            contenedor.innerHTML =
                "<p>Error: catálogo de modos de vida no disponible.</p>";

            return;

        }


        /*
        ----------------------------------------
        CONSTRUIR CLAVE DEL CATÁLOGO
        ----------------------------------------

        j9:

        001

        se convierte en:

        MV001
        ----------------------------------------
        */

        const codigo =
            "MV" +
            j9.padStart(
                3,
                "0"
            );


        console.log(
            "CAB12: buscando =",
            codigo
        );


        /*
        ----------------------------------------
        BUSCAR MODO DE VIDA
        ----------------------------------------
        */

        const modo =
            window.PALMODO[
                codigo
            ];


        /*
        ----------------------------------------
        SI NO EXISTE
        ----------------------------------------
        */

        if (!modo) {

            console.error(
                "CAB12: no existe:",
                codigo
            );

            contenedor.innerHTML =

                "<h3>Modo de vida</h3>" +

                "<p>" +
                "Modo de vida no definido." +
                "</p>";

            return;

        }


        /*
        ----------------------------------------
        LIMPIAR
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
        CÓDIGO
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
            "CAB12: modo de vida mostrado:",
            modo.nombre
        );

    }

};

/*
========================================================
PalEntropía
CAB12.js
Generador de Paleofichas 1.1

ECOLOGÍA — MODO DE VIDA

CAB12 recibe la ficha actual mediante:

palentropia:contenedor-cargado

y utiliza:

j9 → PALMODO
========================================================
*/


let fichaActualCAB12 = null;


/* =====================================================
   RECIBIR FICHA ACTUAL
   ===================================================== */

document.addEventListener(
    "palentropia:contenedor-cargado",
    function(evento) {

        fichaActualCAB12 =
            evento.detail || null;


        console.log(
            "CAB12: ficha recibida:",
            fichaActualCAB12
        );

    }
);


/* =====================================================
   CAB12
   ===================================================== */

window.CAB12 = {


    /* =================================================
       MOSTRAR
       ================================================= */

    mostrar: function(contenedor) {


        console.log(
            "CAB12: mostrando modo de vida."
        );


        if (!contenedor) {

            console.error(
                "CAB12: no existe contenedor."
            );

            return;

        }


        /*
        ----------------------------------------
        COMPROBAR FICHA
        ----------------------------------------
        */

        if (!fichaActualCAB12) {

            console.error(
                "CAB12: no se ha recibido la ficha actual."
            );

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido obtener la ficha actual.</p>";

            return;

        }


        /*
        ----------------------------------------
        LEER j9
        ----------------------------------------
        */

        const j9 =
            String(
                fichaActualCAB12.j9 || ""
            ).trim();


        console.log(
            "CAB12: j9 =",
            j9
        );


        if (!j9) {

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
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
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido cargar el catálogo.</p>";

            return;

        }


        /*
        ----------------------------------------
        CONSTRUIR CLAVE
        ----------------------------------------

        j9 = 001

        PALMODO = MV001
        ----------------------------------------
        */

        const clave =
            "MV" +
            j9.padStart(
                3,
                "0"
            );


        console.log(
            "CAB12: clave PALMODO =",
            clave
        );


        /*
        ----------------------------------------
        BUSCAR
        ----------------------------------------
        */

        const modo =
            window.PALMODO[
                clave
            ];


        if (!modo) {

            console.error(
                "CAB12: no existe:",
                clave
            );

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>Modo de vida no definido.</p>";

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


        console.log(
            "CAB12: mostrado correctamente:",
            modo.nombre
        );

    }

};

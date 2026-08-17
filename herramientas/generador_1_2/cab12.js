/*
========================================================
PalEntropía
CAB12.js
Generador de Paleofichas 1.1

ECOLOGÍA — MODO DE VIDA

CAB12 recibe la ficha actual mediante:

palentropia:contenedor-cargado

Utiliza:

j2 → Nombre de la paleoficha
j9 → PALMODO

El código MV es interno.
NO se muestra al usuario.
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


        /* -----------------------------------------
           COMPROBAR CONTENEDOR
        ----------------------------------------- */

        if (!contenedor) {

            console.error(
                "CAB12: no existe contenedor."
            );

            return;

        }


        /* -----------------------------------------
           COMPROBAR FICHA
        ----------------------------------------- */

        if (!fichaActualCAB12) {

            console.error(
                "CAB12: no se ha recibido la ficha actual."
            );

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido obtener la ficha actual.</p>";

            return;

        }


        /* -----------------------------------------
           LEER j2
        ----------------------------------------- */

        const j2 =
            String(
                fichaActualCAB12.j2 || ""
            ).trim();


        /* -----------------------------------------
           LEER j9
        ----------------------------------------- */

        const j9 =
            String(
                fichaActualCAB12.j9 || ""
            ).trim();


        console.log(
            "CAB12: j2 =",
            j2
        );


        console.log(
            "CAB12: j9 =",
            j9
        );


        /* -----------------------------------------
           COMPROBAR j9
        ----------------------------------------- */

        if (!j9) {

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>Modo de vida no definido.</p>";

            return;

        }


        /* -----------------------------------------
           COMPROBAR PALMODO
        ----------------------------------------- */

        if (!window.PALMODO) {

            console.error(
                "CAB12: PALMODO no está cargado."
            );

            contenedor.innerHTML =
                "<h3>Modo de vida</h3>" +
                "<p>No se ha podido cargar el catálogo.</p>";

            return;

        }


        /* =================================================
           CONSTRUIR CLAVE INTERNA
           
           j9 = 001
           ↓
           MV001

           ESTA CLAVE NO SE MUESTRA.
        ================================================= */

        const clave =
            "MV" +
            j9.padStart(
                3,
                "0"
            );


        console.log(
            "CAB12: clave PALMODO interna =",
            clave
        );


        /* -----------------------------------------
           BUSCAR MODO DE VIDA
        ----------------------------------------- */

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


        /* =================================================
           LIMPIAR CONTENEDOR
        ================================================= */

        contenedor.innerHTML = "";


        /* =================================================
           NOMBRE DE LA PALEOFICHA — j2
        ================================================= */

        if (j2) {

            const nombreFicha =
                document.createElement(
                    "div"
                );


            nombreFicha.className =
                "nombreFichaCAB12";


            nombreFicha.textContent =
                j2;


            contenedor.appendChild(
                nombreFicha
            );

        }


        /* =================================================
           TÍTULO
        ================================================= */

        const titulo =
            document.createElement(
                "h3"
            );


        titulo.textContent =
            "Modo de vida";


        contenedor.appendChild(
            titulo
        );


        /* =================================================
           NOMBRE DEL MODO DE VIDA
           
           Ejemplo:
           Terrestre
        ================================================= */

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


        /* =================================================
           DESCRIPCIÓN
        ================================================= */

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


        /* =================================================
           CONFIRMACIÓN
        ================================================= */

        console.log(
            "CAB12: mostrado correctamente:",
            j2,
            modo.nombre
        );

    }

};

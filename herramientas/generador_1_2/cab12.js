/*
========================================================
PalEntropía
CAB12.js v1.0
MODO DE VIDA

CAB12 recibe:
MASTER_ACTUAL.j9

Consulta:
PALMODO

Resultado:
- Código
- Nombre
- Descripción

No modifica master.csv.
No modifica MASTER_ACTUAL.
========================================================
*/

window.CAB12 = {

    mostrar: function() {

        /*
        ----------------------------------------
        COMPROBAR CONTENEDOR
        ----------------------------------------
        */

        const contenedor =
            document.getElementById(
                "cab12Ecologia"
            );


        if (!contenedor) {

            console.error(
                "CAB12: no existe #cab12Ecologia."
            );

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
        COMPROBAR MASTER_ACTUAL
        ----------------------------------------
        */

        if (
            !window.MASTER_ACTUAL
        ) {

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


        if (
            j9 === ""
        ) {

            console.error(
                "CAB12: j9 vacío."
            );

            return;

        }


        /*
        ----------------------------------------
        VALIDAR j9
        ----------------------------------------
        */

        if (
            !/^\d{3}$/.test(j9)
        ) {

            console.error(
                "CAB12: j9 no tiene formato válido:",
                j9
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
        CONSTRUIR CLAVE DEL CATÁLOGO
        ----------------------------------------
        */

        const clave =
            "MV" + j9;


        const modo =
            window.PALMODO[
                clave
            ];


        /*
        ----------------------------------------
        COMPROBAR RESULTADO
        ----------------------------------------
        */

        if (
            !modo
        ) {

            console.error(
                "CAB12: modo de vida no encontrado:",
                clave
            );

            return;

        }


        /*
        ----------------------------------------
        CREAR BLOQUE
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
        CÓDIGO
        ----------------------------------------
        */

        const codigo =
            document.createElement(
                "div"
            );


        codigo.className =
            "cab12Codigo";


        codigo.textContent =
            modo.codigo;


        contenedor.appendChild(
            codigo
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
            "cab12Nombre";


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
                "div"
            );


        descripcion.className =
            "cab12Descripcion";


        descripcion.textContent =
            modo.descripcion;


        contenedor.appendChild(
            descripcion
        );


        console.log(
            "CAB12: Modo de vida cargado:",
            clave
        );

    }

};

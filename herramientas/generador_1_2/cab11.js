/*
========================================================
PalEntropía
CAB11.js v1.1
ECOLOGÍA

Coordinador de la sección de Ecología.

CAB11
 ├── CAB12 → Modo de vida
 ├── CAB13 → Medio de vida
 └── CAB14 → Hábitats

CAB11 no contiene la lógica específica
de cada módulo.
========================================================
*/

window.CAB11 = {


    /*
    ====================================================
    MOSTRAR ECOLOGÍA
    ====================================================
    */

    mostrar: function() {


        /*
        ----------------------------------------
        COMPROBAR PALEOFICHA
        ----------------------------------------
        */

        const ficha =
            document.getElementById(
                "ficha"
            );


        if (!ficha) {

            console.error(
                "CAB11: no existe #ficha."
            );

            return;

        }


        /*
        ----------------------------------------
        COMPROBAR MASTER_ACTUAL
        ----------------------------------------
        */

        if (
            !window.MASTER_ACTUAL
        ) {

            console.warn(
                "CAB11: MASTER_ACTUAL todavía no está disponible."
            );

            return;

        }


        /*
        ----------------------------------------
        EVITAR DUPLICADOS
        ----------------------------------------
        */

        let bloque =
            document.getElementById(
                "bloqueEcologia"
            );


        if (bloque) {

            /*
            Si ya existe, simplemente
            volvemos a cargar sus módulos.
            */

            this.cargarModulos();

            return;

        }


        /*
        ----------------------------------------
        CREAR BLOQUE ECOLOGÍA
        ----------------------------------------
        */

        bloque =
            document.createElement(
                "section"
            );


        bloque.id =
            "bloqueEcologia";


        /*
        ----------------------------------------
        TÍTULO
        ----------------------------------------
        */

        const titulo =
            document.createElement(
                "h2"
            );


        titulo.textContent =
            "Ecología";


        bloque.appendChild(
            titulo
        );


        /*
        ----------------------------------------
        CONTENEDOR GENERAL
        ----------------------------------------
        */

        const contenido =
            document.createElement(
                "div"
            );


        contenido.id =
            "contenidoEcologia";


        /*
        ----------------------------------------
        CAB12
        ----------------------------------------
        */

        const cab12 =
            document.createElement(
                "div"
            );


        cab12.id =
            "cab12Ecologia";


        contenido.appendChild(
            cab12
        );


        /*
        ----------------------------------------
        CAB13
        ----------------------------------------
        */

        const cab13 =
            document.createElement(
                "div"
            );


        cab13.id =
            "cab13Ecologia";


        contenido.appendChild(
            cab13
        );


        /*
        ----------------------------------------
        CAB14
        ----------------------------------------
        */

        const cab14 =
            document.createElement(
                "div"
            );


        cab14.id =
            "cab14Ecologia";


        contenido.appendChild(
            cab14
        );


        /*
        ----------------------------------------
        INSERTAR CONTENIDO
        ----------------------------------------
        */

        bloque.appendChild(
            contenido
        );


        ficha.appendChild(
            bloque
        );


        /*
        ----------------------------------------
        CARGAR MÓDULOS
        ----------------------------------------
        */

        this.cargarModulos();


        console.log(
            "CAB11: Ecología creada."
        );

    },


    /*
    ====================================================
    CARGAR MÓDULOS
    ====================================================
    */

    cargarModulos: function() {


        /*
        ----------------------------------------
        CAB12 — MODO DE VIDA
        ----------------------------------------
        */

        if (
            window.CAB12 &&
            typeof window.CAB12.mostrar ===
                "function"
        ) {

            window.CAB12.mostrar();

        }


        /*
        ----------------------------------------
        CAB13 — MEDIO DE VIDA
        ----------------------------------------

        Se activará cuando CAB13 exista.
        ----------------------------------------
        */


        if (
            window.CAB13 &&
            typeof window.CAB13.mostrar ===
                "function"
        ) {

            window.CAB13.mostrar();

        }


        /*
        ----------------------------------------
        CAB14 — HÁBITATS
        ----------------------------------------

        Se activará cuando CAB14 exista.
        ----------------------------------------
        */


        if (
            window.CAB14 &&
            typeof window.CAB14.mostrar ===
                "function"
        ) {

            window.CAB14.mostrar();

        }

    }

};

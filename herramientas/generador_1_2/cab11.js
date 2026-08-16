/*
========================================================
PalEntropía
CAB11.js v1.2
ECOLOGÍA

Coordinador de la sección de Ecología.

CAB11
 ├── CAB12 → Modo de vida
 ├── CAB13 → Medio de vida
 └── CAB14 → Hábitats

CAB11 NO muestra Ecología automáticamente.

La sección solamente se abre cuando
el usuario pulsa el botón Ecología.

CAB11 no contiene la lógica específica
de cada módulo.
========================================================
*/

window.CAB11 = {


    /*
    ====================================================
    INICIALIZAR
    ====================================================
    */

    inicializar: function() {


        /*
        ----------------------------------------
        COMPROBAR SI YA EXISTE EL BOTÓN
        ----------------------------------------
        */

        if (
            document.getElementById(
                "botonEcologia"
            )
        ) {

            return;

        }


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

            console.warn(
                "CAB11: #ficha todavía no existe."
            );

            return;

        }


        /*
        ----------------------------------------
        CREAR BOTÓN
        ----------------------------------------
        */

        const boton =
            document.createElement(
                "button"
            );


        boton.id =
            "botonEcologia";


        boton.type =
            "button";


        boton.textContent =
            "🌿 Ecología";


        boton.title =
            "Información ecológica";


        /*
        ----------------------------------------
        EVENTO
        ----------------------------------------
        */

        boton.addEventListener(
            "click",
            function() {

                window.CAB11.mostrar();

            }
        );


        /*
        ----------------------------------------
        INSERTAR DESPUÉS DE ESTADÍSTICAS
        ----------------------------------------
        */

        const estadisticas =
            document.getElementById(
                "bloqueEstadisticas"
            );


        if (estadisticas) {

            estadisticas.insertAdjacentElement(
                "afterend",
                boton
            );

        }
        else {

            ficha.appendChild(
                boton
            );

        }


        console.log(
            "CAB11: botón Ecología preparado."
        );

    },


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
        BUSCAR BLOQUE EXISTENTE
        ----------------------------------------
        */

        let bloque =
            document.getElementById(
                "bloqueEcologia"
            );


        /*
        ----------------------------------------
        SI YA EXISTE
        ----------------------------------------
        */

        if (bloque) {

            /*
            Alternar visibilidad.
            */

            if (
                bloque.style.display ===
                "none"
            ) {

                bloque.style.display =
                    "";

                this.cargarModulos();

            }
            else {

                bloque.style.display =
                    "none";

            }

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
        AHORA SÍ:
        CARGAR LOS MÓDULOS
        ----------------------------------------
        */

        this.cargarModulos();


        console.log(
            "CAB11: Ecología abierta."
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


/*
========================================================
INICIALIZACIÓN SEGURA
========================================================

CAB11 solamente prepara el botón.

NO abre Ecología.
========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function() {

        window.CAB11.inicializar();

    }
);

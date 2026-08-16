/*
========================================================
PalEntropía
CAB11.js v1.3
ECOLOGÍA

CAB11
 ├── CAB12 → Modo de vida
 ├── CAB13 → Medio de vida
 └── CAB14 → Hábitats

CAB11:
- No muestra Ecología automáticamente.
- Se actualiza cuando cambia MASTER_ACTUAL.
- Solo muestra el botón 🌿 Ecología.
- Los módulos se ejecutan al pulsar el botón.
========================================================
*/

window.CAB11 = {


    /*
    ====================================================
    ACTUALIZAR
    ====================================================
    */

    actualizar: function() {


        /*
        ----------------------------------------
        ELIMINAR BLOQUE ANTERIOR
        ----------------------------------------
        */

        const bloqueAnterior =
            document.getElementById(
                "bloqueEcologia"
            );


        if (bloqueAnterior) {

            bloqueAnterior.remove();

        }


        /*
        ----------------------------------------
        ELIMINAR BOTÓN ANTERIOR
        ----------------------------------------
        */

        const botonAnterior =
            document.getElementById(
                "botonEcologia"
            );


        if (botonAnterior) {

            botonAnterior.remove();

        }


        /*
        ----------------------------------------
        COMPROBAR FICHA
        ----------------------------------------
        */

        const ficha =
            document.getElementById(
                "ficha"
            );


        if (!ficha) {

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
        ESTILO BÁSICO

        Se fuerza una línea independiente.
        ----------------------------------------
        */

        boton.style.display =
            "block";

        boton.style.width =
            "fit-content";

        boton.style.margin =
            "14px auto";


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
        INSERTAR DESPUÉS
        DE ESTADÍSTICAS
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
            "CAB11: preparado para",
            window.MASTER_ACTUAL.j1
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
        COMPROBAR MASTER
        ----------------------------------------
        */

        if (
            !window.MASTER_ACTUAL
        ) {

            console.warn(
                "CAB11: MASTER_ACTUAL no disponible."
            );

            return;

        }


        /*
        ----------------------------------------
        EVITAR DUPLICADO
        ----------------------------------------
        */

        const existente =
            document.getElementById(
                "bloqueEcologia"
            );


        if (existente) {

            if (
                existente.style.display ===
                "none"
            ) {

                existente.style.display =
                    "";

            }
            else {

                existente.style.display =
                    "none";

            }

            return;

        }


        /*
        ----------------------------------------
        CREAR BLOQUE
        ----------------------------------------
        */

        const bloque =
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
        CONTENEDOR
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
        AÑADIR CONTENIDO
        ----------------------------------------
        */

        bloque.appendChild(
            contenido
        );


        /*
        ----------------------------------------
        INSERTAR
        ----------------------------------------
        */

        const ficha =
            document.getElementById(
                "ficha"
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
            "CAB11: Ecología abierta para",
            window.MASTER_ACTUAL.j1
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
        CAB12
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
        CAB13
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
        CAB14
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
ESCUCHAR CAMBIO DE PALEOFICHA
========================================================
*/

document.addEventListener(
    "masterActualizado",
    function() {

        window.CAB11.actualizar();

    }
);

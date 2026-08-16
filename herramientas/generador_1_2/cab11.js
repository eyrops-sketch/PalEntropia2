/*
========================================================
PalEntropía
CAB11.js v1.0
ECOLOGÍA

Coordinador de la sección de Ecología.

CAB11
 ├── CAB12 → Modo de vida
 ├── CAB13 → Medio de vida
 └── CAB14 → Hábitats

CAB11 no contiene la lógica específica de cada módulo.
========================================================
*/

window.CAB11 = {

    inicializar: function() {

        console.log(
            "CAB11: inicializando Ecología."
        );

        return true;

    },


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
        EVITAR DUPLICADOS
        ----------------------------------------
        */

        let bloque =
            document.getElementById(
                "bloqueEcologia"
            );


        if (bloque) {

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
        CONTENEDOR DE LOS TRES MÓDULOS
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
        INSERTAR
        ----------------------------------------
        */

        bloque.appendChild(
            contenido
        );


        ficha.appendChild(
            bloque
        );


        console.log(
            "CAB11: Ecología creada."
        );

    }

};


/*
========================================================
INICIALIZACIÓN
========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function() {

        window.CAB11.inicializar();

    }
);

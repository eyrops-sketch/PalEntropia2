/*
========================================================
PalEntropía
CAB11.js v1.0
ECOLOGÍA

Coordinador de Ecología.

CAB10
  ↓
Lightbox Ecología
  ↓
CAB11
  ├── CAB12 → Modo de vida
  ├── CAB13 → Medio de vida
  └── CAB14 → Hábitats

CAB11 NO muestra nada en la paleoficha principal.
========================================================
*/

window.CAB11 = {

    mostrar: function(contenedor) {

        /*
        ====================================================
        COMPROBAR CONTENEDOR
        ====================================================
        */

        if (!contenedor) {

            console.error(
                "CAB11: no existe el contenedor de Ecología."
            );

            return;

        }


        /*
        ====================================================
        LIMPIAR CONTENIDO ANTERIOR
        ====================================================
        */

        contenedor.innerHTML = "";


        /*
        ====================================================
        TÍTULO
        ====================================================
        */

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            "Ecología";

        contenedor.appendChild(
            titulo
        );


        /*
        ====================================================
        CONTENEDOR CAB12
        ====================================================
        */

        const bloque12 =
            document.createElement("div");

        bloque12.id =
            "cab12Ecologia";

        contenedor.appendChild(
            bloque12
        );


        /*
        ====================================================
        CONTENEDOR CAB13
        ====================================================
        */

        const bloque13 =
            document.createElement("div");

        bloque13.id =
            "cab13Ecologia";

        contenedor.appendChild(
            bloque13
        );


        /*
        ====================================================
        CONTENEDOR CAB14
        ====================================================
        */

        const bloque14 =
            document.createElement("div");

        bloque14.id =
            "cab14Ecologia";

        contenedor.appendChild(
            bloque14
        );


        /*
        ====================================================
        LLAMAR CAB12
        ====================================================
        */

        if (
            window.CAB12 &&
            typeof window.CAB12.mostrar ===
                "function"
        ) {

            window.CAB12.mostrar(
                bloque12
            );

        }


        /*
        ====================================================
        LLAMAR CAB13
        ====================================================
        */

        if (
            window.CAB13 &&
            typeof window.CAB13.mostrar ===
                "function"
        ) {

            window.CAB13.mostrar(
                bloque13
            );

        }


        /*
        ====================================================
        LLAMAR CAB14
        ====================================================
        */

        if (
            window.CAB14 &&
            typeof window.CAB14.mostrar ===
                "function"
        ) {

            window.CAB14.mostrar(
                bloque14
            );

        }


        console.log(
            "CAB11: Ecología cargada."
        );

    }

};

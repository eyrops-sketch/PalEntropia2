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
========================================================
*/

window.CAB11 = {

    mostrar: function() {

        console.log(
            "CAB11: Ecología iniciada."
        );

        /*
        ----------------------------------------
        CAB12 — MODO DE VIDA
        ----------------------------------------
        */

        if (
            window.CAB12 &&
            typeof window.CAB12.mostrar === "function"
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
            typeof window.CAB13.mostrar === "function"
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
            typeof window.CAB14.mostrar === "function"
        ) {

            window.CAB14.mostrar();

        }

    }

};

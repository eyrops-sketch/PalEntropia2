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

CAB11 NO crea el botón.
CAB11 NO crea el lightbox.
CAB11 solo coordina los módulos.
========================================================
*/

window.CAB11 = {

    mostrar: function() {

        const lightbox =
            document.getElementById(
                "lightboxEcologia"
            );


        if (!lightbox) {

            console.warn(
                "CAB11: lightboxEcologia no disponible."
            );

            return;

        }


        const ventana =
            lightbox.querySelector(
                "div"
            );


        if (!ventana) {

            return;

        }


        /*
        ----------------------------------------
        LIMPIAR CONTENIDO DE CAB10
        ----------------------------------------
        */

        ventana.innerHTML = "";


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


        ventana.appendChild(
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
            "contenidoCAB11";


        ventana.appendChild(
            contenido
        );


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

            window.CAB12.mostrar(
                contenido
            );

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

            window.CAB13.mostrar(
                contenido
            );

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

            window.CAB14.mostrar(
                contenido
            );

        }


        console.log(
            "CAB11 — Ecología preparada."
        );

    }

};

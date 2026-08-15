/*
========================================================
PalEntropía
CAB09.js
Información avanzada — Fase 2

FUNCIÓN:
- Crear botón de Información avanzada.
- Abrir lightbox.
- Cerrar lightbox.
- Preparado para recibir estadísticas posteriormente.

NO:
- No modifica CAB02.
- No modifica style_1_1.css.
- No calcula estadísticas.
- No lee CSV.
========================================================
*/

(function(){

"use strict";


const CAB09 = {

    version: "1.0",


    /* ==================================================
       INICIALIZAR
       ================================================== */

    inicializar(){

        this.crearBoton();

    },


    /* ==================================================
       CREAR BOTÓN
       ================================================== */

    crearBoton(){

        const ficha =
            document.getElementById("ficha");


        if(!ficha){

            return;

        }


        let boton =
            document.getElementById(
                "botonInfoAvanzada"
            );


        if(!boton){

            boton =
                document.createElement("button");


            boton.id =
                "botonInfoAvanzada";


            boton.type =
                "button";


            boton.title =
                "Información avanzada";


            boton.setAttribute(
                "aria-label",
                "Abrir información avanzada"
            );


            boton.textContent =
                "ⓘ";


            ficha.appendChild(
                boton
            );

        }


        if(
            boton.dataset.cab09Activo ===
            "true"
        ){

            return;

        }


        boton.addEventListener(
            "click",
            () => {

                this.abrir();

            }
        );


        boton.dataset.cab09Activo =
            "true";

    },


    /* ==================================================
       CREAR LIGHTBOX
       ================================================== */

    crearLightbox(){

        let visor =
            document.getElementById(
                "visorInfoAvanzada"
            );


        if(visor){

            return visor;

        }


        visor =
            document.createElement("div");


        visor.id =
            "visorInfoAvanzada";


        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        const ventana =
            document.createElement("div");


        ventana.id =
            "ventanaInfoAvanzada";


        const cerrar =
            document.createElement("button");


        cerrar.id =
            "cerrarInfoAvanzada";


        cerrar.type =
            "button";


        cerrar.textContent =
            "×";


        cerrar.title =
            "Cerrar";


        cerrar.setAttribute(
            "aria-label",
            "Cerrar información avanzada"
        );


        const titulo =
            document.createElement("h2");


        titulo.textContent =
            "Información estadística";


        ventana.appendChild(
            cerrar
        );


        ventana.appendChild(
            titulo
        );


        visor.appendChild(
            ventana
        );


        document.body.appendChild(
            visor
        );


        /* =============================================
           CERRAR CON BOTÓN
           ============================================= */

        cerrar.addEventListener(
            "click",
            () => {

                this.cerrar();

            }
        );


        /* =============================================
           CERRAR PULSANDO FUERA
           ============================================= */

        visor.addEventListener(
            "click",
            evento => {

                if(
                    evento.target === visor
                ){

                    this.cerrar();

                }

            }
        );


        return visor;

    },


    /* ==================================================
       ABRIR
       ================================================== */

    abrir(){

        const visor =
            this.crearLightbox();


        if(!visor){

            return;

        }


        visor.style.display =
            "flex";


        visor.setAttribute(
            "aria-hidden",
            "false"
        );

    },


    /* ==================================================
       CERRAR
       ================================================== */

    cerrar(){

        const visor =
            document.getElementById(
                "visorInfoAvanzada"
            );


        if(!visor){

            return;

        }


        visor.style.display =
            "none";


        visor.setAttribute(
            "aria-hidden",
            "true"
        );

    }

};


/* ======================================================
   EXPORTAR
   ====================================================== */

window.CAB09 =
    CAB09;


/* ======================================================
   ARRANQUE

   Importante:
   CAB09 se inicializa cuando existe el DOM.
   ====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        CAB09.inicializar();

    }
);


})();

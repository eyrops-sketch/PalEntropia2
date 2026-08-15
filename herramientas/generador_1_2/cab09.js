/*
========================================================
CAB09.js v1.2
PalEntropía
Información avanzada
========================================================

FUNCIÓN:
- Crea el botón dentro de #ficha.
- Lo mantiene dentro de la Paleoficha.
- Abre el lightbox al pulsarlo.
- Permite cerrar el lightbox.
- No lee datos.
- No modifica datos.
========================================================
*/

(function(){

"use strict";


const CAB09 = {

    version: "1.2",


    /*====================================================
      CREAR BOTÓN
    ====================================================*/

    crearBoton(){

        const ficha =
            document.getElementById("ficha");


        if(!ficha){

            return null;

        }


        let boton =
            document.getElementById(
                "botonInfoAvanzada"
            );


        /*
        Si ya existe, aseguramos que esté
        dentro de la Paleoficha.
        */

        if(boton){

            if(boton.parentElement !== ficha){

                ficha.appendChild(boton);

            }

            return boton;

        }


        boton =
            document.createElement("button");


        boton.id =
            "botonInfoAvanzada";

        boton.type =
            "button";

        boton.title =
            "Información estadística";

        boton.setAttribute(
            "aria-label",
            "Abrir información estadística"
        );


        /*
        Icono del botón.
        */

        boton.textContent =
            "ⓘ";


        /*
        IMPORTANTE:
        El botón queda directamente dentro
        de #ficha.
        */

        ficha.appendChild(
            boton
        );


        return boton;

    },


    /*====================================================
      CREAR LIGHTBOX
    ====================================================*/

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
            "Cerrar información estadística"
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


        cerrar.addEventListener(
            "click",
            () => {

                this.cerrarLightbox();

            }
        );


        visor.addEventListener(
            "click",
            evento => {

                if(
                    evento.target === visor
                ){

                    this.cerrarLightbox();

                }

            }
        );


        return visor;

    },


    /*====================================================
      ABRIR
    ====================================================*/

    abrirLightbox(){

        const visor =
            document.getElementById(
                "visorInfoAvanzada"
            );


        if(!visor){

            return;

        }


        visor.style.display =
            "flex";


        visor.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    },


    /*====================================================
      CERRAR
    ====================================================*/

    cerrarLightbox(){

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


        document.body.style.overflow =
            "";

    },


    /*====================================================
      ACTIVAR
    ====================================================*/

    activar(){

        const boton =
            this.crearBoton();


        if(!boton){

            return;

        }


        this.crearLightbox();


        if(
            boton.dataset.cab09Activo ===
            "true"
        ){

            return;

        }


        boton.addEventListener(
            "click",
            () => {

                this.abrirLightbox();

            }
        );


        boton.dataset.cab09Activo =
            "true";

    }

};


/*========================================================
EXPORTAR
========================================================*/

window.CAB09 =
    CAB09;


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        CAB09.activar();

    }
);


})();

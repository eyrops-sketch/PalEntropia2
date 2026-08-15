/*
========================================================
CAB09.js v1.1
PalEntropía
Información avanzada
========================================================

FUNCIÓN ACTUAL:
- Crea el botón dentro de #ficha.
- Abre el lightbox al pulsarlo.
- Permite cerrar el lightbox.
- No lee datos.
- No modifica datos.
========================================================
*/

(function(){

"use strict";


const CAB09 = {

    version: "1.1",


    /*====================================================
      CREAR BOTÓN DENTRO DE LA PALEOFICHA
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
        Si ya existe, comprobamos que esté
        dentro de la Paleoficha.
        */

        if(boton){

            if(boton.parentElement !== ficha){

                ficha.appendChild(boton);

            }

            return boton;

        }


        /*
        Crear botón.
        */

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

        boton.innerHTML =
            "ⓘ";


        /*
        Insertar dentro de #ficha.
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

        cerrar.innerHTML =
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
      ABRIR LIGHTBOX
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
      CERRAR LIGHTBOX
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
      ACTIVAR BOTÓN
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
========================================================

El botón se crea cuando el DOM ya existe.
También queda disponible mediante:

CAB09.activar();

para que otro módulo pueda volver a colocarlo
si la Paleoficha se reconstruye.
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        CAB09.activar();

    }
);


})();

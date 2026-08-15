/*
========================================================
CAB09.js v1.2
PalEntropía
Información estadística avanzada
========================================================

FUNCIÓN:
- Recibe e1-e11 desde CAB02.
- Crea el botón dentro de #ficha.
- Abre un lightbox.
- No modifica CAB02.
- No modifica style_1_1.css.
- No calcula estadísticas todavía.
========================================================
*/

(function(){

"use strict";


const CAB09 = {

    version: "1.2",

    datos: null,


    /*====================================================
      EJECUTAR
      CAB02 llama directamente a esta función
    ====================================================*/

    ejecutar(master){

        this.datos = master || null;

        const ficha =
            document.getElementById("ficha");

        if(!ficha){

            return;

        }


        const boton =
            this.crearBoton(ficha);


        if(!boton){

            return;

        }


        this.crearLightbox();


        if(
            boton.dataset.cab09Activo === "true"
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

    },


    /*====================================================
      CREAR BOTÓN
    ====================================================*/

    crearBoton(ficha){

        let boton =
            document.getElementById(
                "botonInfoAvanzada"
            );


        if(boton){

            /*
            Aseguramos que pertenece
            a la Paleoficha actual.
            */

            if(
                boton.parentElement !== ficha
            ){

                ficha.appendChild(
                    boton
                );

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


        boton.textContent =
            "ⓘ";


        /*
        IMPORTANTE:
        Se inserta directamente dentro
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

    }

};


/*========================================================
EXPORTAR
========================================================*/

window.CAB09 =
    CAB09;


/*
========================================================
IMPORTANTE

CAB09 NO se ejecuta automáticamente.

CAB02 lo llama mediante:

CAB09.ejecutar(master)

========================================================
*/

})();

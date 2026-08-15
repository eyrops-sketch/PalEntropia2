/*
========================================================
CAB09.js v1.0
PalEntropía
Información avanzada
========================================================

FUNCIÓN ACTUAL:
- Conecta con #botonInfoAvanzada
- Crea el lightbox
- Abre el lightbox al pulsar el botón
- Permite cerrar con ×
- Permite cerrar pulsando fuera de la ventana

NO LEE DATOS.
NO MODIFICA DATOS.
NO CALCULA ESTADÍSTICAS.
========================================================
*/

(function(){

"use strict";


/*========================================================
CONFIGURACIÓN
========================================================*/

const CAB09 = {

    version: "1.0",


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


        /*================================================
          VISOR
        =================================================*/

        visor =
            document.createElement("div");

        visor.id =
            "visorInfoAvanzada";


        /*================================================
          VENTANA
        =================================================*/

        const ventana =
            document.createElement("div");

        ventana.id =
            "ventanaInfoAvanzada";


        /*================================================
          BOTÓN CERRAR
        =================================================*/

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
            "Cerrar información avanzada"
        );


        /*================================================
          TÍTULO
        =================================================*/

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            "Información estadística";


        /*================================================
          CONTENIDO
        =================================================*/

        const contenido =
            document.createElement("div");

        contenido.id =
            "contenidoInfoAvanzada";


        /*================================================
          CONSTRUIR
        =================================================*/

        ventana.appendChild(
            cerrar
        );

        ventana.appendChild(
            titulo
        );

        ventana.appendChild(
            contenido
        );

        visor.appendChild(
            ventana
        );

        document.body.appendChild(
            visor
        );


        /*================================================
          CERRAR CON BOTÓN
        =================================================*/

        cerrar.addEventListener(
            "click",
            () => {

                this.cerrarLightbox();

            }
        );


        /*================================================
          CERRAR AL PULSAR FUERA
        =================================================*/

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
      INICIALIZAR
    ====================================================*/

    inicializar(){

        const boton =
            document.getElementById(
                "botonInfoAvanzada"
            );


        if(!boton){

            console.warn(
                "CAB09: no existe #botonInfoAvanzada."
            );

            return;

        }


        this.crearLightbox();


        /*===============================================
          EVITAR EVENTOS DUPLICADOS
        ===============================================*/

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

        CAB09.inicializar();

    }
);


})();

/*
========================================================
CAB09.js v1.2
PalEntropía
Información avanzada
========================================================

FUNCIÓN:
- Utiliza el botón #botonInfoAvanzada del HTML.
- Abre un lightbox.
- Permite cerrar el lightbox.
- NO lee datos.
- NO calcula estadísticas.
- NO modifica la Paleoficha.
- NO bloquea el scroll de la página.
========================================================
*/

(function(){

"use strict";


const CAB09 = {

    version: "1.2",


    /*====================================================
      INICIALIZAR
    ====================================================*/

    activar(){

        const boton =
            document.getElementById(
                "botonInfoAvanzada"
            );


        if(!boton){

            console.warn(
                "CAB09: no se encontró #botonInfoAvanzada."
            );

            return;

        }


        /*
        Crear el lightbox.
        */

        this.crearLightbox();


        /*
        Evitar registrar el evento
        más de una vez.
        */

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

    },


    /*====================================================
      CREAR LIGHTBOX
    ====================================================*/

    crearLightbox(){

        let visor =
            document.getElementById(
                "visorInfoAvanzada"
            );


        /*
        Si ya existe no lo duplicamos.
        */

        if(visor){

            return visor;

        }


        /*================================================
          VISOR
        =================================================*/

        visor =
            document.createElement(
                "div"
            );


        visor.id =
            "visorInfoAvanzada";


        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        /*================================================
          VENTANA
        =================================================*/

        const ventana =
            document.createElement(
                "div"
            );


        ventana.id =
            "ventanaInfoAvanzada";


        /*================================================
          BOTÓN CERRAR
        =================================================*/

        const cerrar =
            document.createElement(
                "button"
            );


        cerrar.id =
            "cerrarInfoAvanzada";


        cerrar.type =
            "button";


        cerrar.title =
            "Cerrar";


        cerrar.setAttribute(
            "aria-label",
            "Cerrar información avanzada"
        );


        cerrar.textContent =
            "×";


        /*================================================
          TÍTULO
        =================================================*/

        const titulo =
            document.createElement(
                "h2"
            );


        titulo.textContent =
            "Información estadística";


        /*================================================
          CONSTRUIR
        =================================================*/

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
          CERRAR PULSANDO FUERA
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


        /*================================================
          CERRAR CON ESC
        =================================================*/

        document.addEventListener(
            "keydown",
            evento => {

                if(
                    evento.key === "Escape"
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


        /*
        IMPORTANTE:

        CAB09 NO modifica:

        document.body.style.overflow

        Por tanto el scroll de la página
        no queda bloqueado.
        */

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

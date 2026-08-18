/*
========================================================
cab15.js v1.0
interfaz del buscador modular
PalEntropía — Generador

FUNCIONES
---------
- botón abrir buscador nuevo
- botón cerrar
- cierre con escape
- cierre al pulsar fuera
- conexión con palbuscadornuevo

NO MODIFICA
-----------
- cargacont
- palbuscador
- leepaljson
- palnavegador
========================================================
*/


window.cab15 = {


    /*====================================================
      ELEMENTOS
    ====================================================*/

    botonAbrir: null,
    botonCerrar: null,
    visor: null,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        this.botonAbrir =
            document.getElementById(
                "botonBuscarNuevo"
            );


        this.botonCerrar =
            document.getElementById(
                "cerrarBuscadorNuevo"
            );


        this.visor =
            document.getElementById(
                "visorBuscadorNuevo"
            );


        if(
            !this.botonAbrir ||
            !this.botonCerrar ||
            !this.visor
        ){

            console.warn(
                "cab15: elementos del buscador nuevo no encontrados."
            );

            return;

        }


        this.prepararEventos();


        console.log(
            "cab15 v1.0 inicializado."
        );

    },


    /*====================================================
      EVENTOS
    ====================================================*/

    prepararEventos: function(){

        const self = this;


        /*-----------------------------------------------
          ABRIR
        -----------------------------------------------*/

        this.botonAbrir.addEventListener(
            "click",
            function(){

                if(
                    window.palbuscadornuevo &&
                    typeof
                    window.palbuscadornuevo.abrir ===
                    "function"
                ){

                    window.palbuscadornuevo.abrir();

                }

            }
        );


        /*-----------------------------------------------
          CERRAR
        -----------------------------------------------*/

        this.botonCerrar.addEventListener(
            "click",
            function(){

                self.cerrar();

            }
        );


        /*-----------------------------------------------
          CLICK FUERA
        -----------------------------------------------*/

        this.visor.addEventListener(
            "click",
            function(event){

                if(
                    event.target ===
                    self.visor
                ){

                    self.cerrar();

                }

            }
        );


        /*-----------------------------------------------
          ESCAPE
        -----------------------------------------------*/

        document.addEventListener(
            "keydown",
            function(event){

                if(
                    event.key === "Escape" &&
                    self.estaAbierto()
                ){

                    self.cerrar();

                }

            }
        );

    },


    /*====================================================
      CERRAR
    ====================================================*/

    cerrar: function(){

        if(
            window.palbuscadornuevo &&
            typeof
            window.palbuscadornuevo.cerrar ===
            "function"
        ){

            window.palbuscadornuevo.cerrar();

            return;

        }


        if(this.visor){

            this.visor.style.display = "none";

            this.visor.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    },


    /*====================================================
      COMPROBAR ESTADO
    ====================================================*/

    estaAbierto: function(){

        if(!this.visor){

            return false;

        }


        return (
            this.visor.style.display === "flex"
        );

    }

};


/*========================================================
INICIALIZACIÓN AUTOMÁTICA
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        if(
            window.cab15
        ){

            window.cab15.inicializar();

        }

    }
);





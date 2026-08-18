/*
========================================================
palbuscadornuevo.js v1.0
Buscador Universal Modular
PalEntropía — Generador

FUNCIONES INICIALES
-------------------
- Buscador independiente
- Lightbox propio
- Autocompletado
- Código
- Nombre
- Tiempo geológico
- Preparación para taxonomía
- Preparación para rango geológico

NO MODIFICA:
- cargacont
- palbuscador
- leepaljson
========================================================
*/

window.palbuscadornuevo = {

    /*====================================================
      CONFIGURACIÓN
    ====================================================*/

    minimoCaracteres: 3,


    /*====================================================
      ELEMENTOS
    ====================================================*/

    visor: null,
    ventana: null,
    entrada: null,
    resultados: null,
    label: null,
    checkRango: null,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        this.visor =
            document.getElementById(
                "visorBuscadorNuevo"
            );

        this.ventana =
            document.getElementById(
                "ventanaBuscadorNuevo"
            );

        this.entrada =
            document.getElementById(
                "buscarNuevo"
            );

        this.resultados =
            document.getElementById(
                "resultadosNuevo"
            );

        this.label =
            document.getElementById(
                "labelResultadosNuevo"
            );

        this.checkRango =
            document.querySelector(
                "#checkRangoNuevo input"
            );


        if(
            !this.visor ||
            !this.entrada ||
            !this.resultados
        ){

            console.warn(
                "palbuscadornuevo: elementos HTML no encontrados."
            );

            return;

        }


        this.prepararEventos();


        console.log(
            "palbuscadornuevo v1.0 inicializado."
        );

    },


    /*====================================================
      EVENTOS
    ====================================================*/

    prepararEventos: function(){

        const self = this;


        /*-----------------------------------------------
          ESCRITURA
        -----------------------------------------------*/

        this.entrada.addEventListener(
            "input",
            function(){

                self.buscar(
                    this.value
                );

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
                    self.visor.style.display === "flex"
                ){

                    self.cerrar();

                }

            }
        );


        /*-----------------------------------------------
          CLICK FUERA
        -----------------------------------------------*/

        this.visor.addEventListener(
            "click",
            function(event){

                if(
                    event.target === self.visor
                ){

                    self.cerrar();

                }

            }
        );

    },


    /*====================================================
      ABRIR
    ====================================================*/

    abrir: function(){

        if(!this.visor){

            this.inicializar();

        }


        if(!this.visor){

            return;

        }


        this.visor.style.display = "flex";


        this.entrada.value = "";


        this.limpiar();


        this.entrada.focus();


        this.actualizarLabel(
            "Introduce al menos " +
            this.minimoCaracteres +
            " caracteres"
        );

    },


    /*====================================================
      CERRAR
    ====================================================*/

    cerrar: function(){

        if(!this.visor){

            return;

        }


        this.visor.style.display = "none";


        this.entrada.value = "";


        this.limpiar();

    },


    /*====================================================
      LIMPIAR RESULTADOS
    ====================================================*/

    limpiar: function(){

        if(this.resultados){

            this.resultados.innerHTML = "";

        }

    },


    /*====================================================
      LABEL
    ====================================================*/

    actualizarLabel: function(texto){

        if(this.label){

            this.label.textContent = texto;

        }

    },


    /*====================================================
      OBTENER DATOS
    ====================================================*/

    obtenerDatos: function(){

        if(
            !window.leepaljson ||
            typeof window.leepaljson.obtener !==
            "function"
        ){

            return [];

        }


        return (
            window.leepaljson.obtener() || []
        );

    },


    /*====================================================
      NORMALIZAR TEXTO
    ====================================================*/

    normalizar: function(texto){

        return String(
            texto || ""
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

    },


    /*====================================================
      BUSCAR
    ====================================================*/

    buscar: function(texto){

        texto =
            String(
                texto || ""
            ).trim();


        this.limpiar();


        if(
            texto.length <
            this.minimoCaracteres
        ){

            this.actualizarLabel(
                "Introduce al menos " +
                this.minimoCaracteres +
                " caracteres"
            );

            return;

        }


        const consulta =
            this.normalizar(
                texto
            );


        const datos =
            this.obtenerDatos();


        if(!datos.length){

            this.actualizarLabel(
                "No hay datos disponibles"
            );

            return;

        }


        const encontrados =
            datos.filter(
                ficha => {

                    const codigo =
                        this.normalizar(
                            ficha.codigo
                        );

                    const nombre =
                        this.normalizar(
                            ficha.nombre
                        );

                    const j3 =
                        this.normalizar(
                            ficha.j3
                        );


                    return (

                        codigo.includes(
                            consulta
                        ) ||

                        nombre.includes(
                            consulta
                        ) ||

                        j3.includes(
                            consulta
                        )

                    );

                }
            );


        this.mostrarResultados(
            encontrados
        );

    },

      /*====================================================
      MOSTRAR RESULTADOS
    ====================================================*/

    mostrarResultados: function(
        encontrados
    ){

        this.limpiar();


        if(
            !encontrados.length
        ){

            this.actualizarLabel(
                "Sin resultados"
            );

            return;

        }


        this.actualizarLabel(

            encontrados.length +
            (
                encontrados.length === 1
                ? " resultado"
                : " resultados"
            )

        );


        encontrados.forEach(
            ficha => {

                const boton =
                    document.createElement(
                        "button"
                    );


                boton.type = "button";


                boton.className =
                    "resultadoBuscadorNuevo";


                boton.innerHTML =

                    '<span class="resultadoCodigo">' +

                    this.escapeHTML(
                        ficha.codigo
                    ) +

                    '</span>' +

                    '<span class="resultadoNombre">' +

                    this.escapeHTML(
                        ficha.nombre
                    ) +

                    '</span>';


                boton.addEventListener(
                    "click",
                    () => {

                        this.seleccionar(
                            ficha
                        );

                    }
                );


                this.resultados.appendChild(
                    boton
                );

            }
        );

    },


    /*====================================================
      SELECCIONAR RESULTADO
    ====================================================*/

    seleccionar: function(
        ficha
    ){

        if(
            !ficha ||
            !ficha.codigo
        ){

            return;

        }


        /*
        -----------------------------------------------
        NO TOCAMOS CARGACONT.

        El nuevo buscador solamente genera
        la navegación hacia la Paleoficha.
        -----------------------------------------------
        */

        const codigo =
            encodeURIComponent(
                ficha.codigo
            );


        window.location.href =
            window.location.pathname +
            "?codigo=" +
            codigo;

    },


    /*====================================================
      ESCAPAR HTML
    ====================================================*/

    escapeHTML: function(
        texto
    ){

        return String(
            texto || ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    },


    /*====================================================
      CHECK RANGO
      PREPARACIÓN INICIAL
    ====================================================*/

    obtenerRangoActivo: function(){

        if(!this.checkRango){

            return false;

        }


        return this.checkRango.checked;

    },


    /*====================================================
      ESTADO DEL CHECK RANGO
    ====================================================*/

    prepararCheckRango: function(){

        if(!this.checkRango){

            return;

        }


        this.checkRango.addEventListener(
            "change",
            () => {

                console.log(
                    "palbuscadornuevo — rango:",
                    this.checkRango.checked
                );

            }
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
            window.palbuscadornuevo
        ){

            window.palbuscadornuevo.inicializar();

            window.palbuscadornuevo.prepararCheckRango();

        }

    }
);

/*
========================================================
cab15.js v1.2
motor de datos del buscador universal
palentropía — generador

objetivo:
- reutilizar los datos de leepaljson
- crear caché local
- no bloquear el arranque
- no realizar cargas adicionales
- esperar a que leepaljson tenga datos
- proporcionar datos al buscador nuevo
- limpiar filtros y restaurar todos los registros

no modifica:
- cargacont
- palbuscador
- leepaljson
========================================================
*/

window.cab15 = {

    /*====================================================
      ESTADO
    ====================================================*/

    datos: [],

    inicializado: false,

    esperando: false,

    intentos: 0,

    maximoIntentos: 40,

    intervalo: 50,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        if(this.inicializado){

            return this.datos;

        }


        const datos =
            this.obtenerDatosBase();


        if(
            Array.isArray(datos) &&
            datos.length
        ){

            this.datos =
                datos;

            this.inicializado =
                true;

            this.esperando =
                false;

            console.log(
                "cab15 v1.2:",
                this.datos.length,
                "registros en caché."
            );

            return this.datos;

        }


        this.esperarDatos();


        return [];

    },


    /*====================================================
      OBTENER DATOS BASE
    ====================================================*/

    obtenerDatosBase: function(){

        if(
            !window.leepaljson ||
            typeof window.leepaljson.obtener !==
            "function"
        ){

            return [];

        }


        const datos =
            window.leepaljson.obtener();


        if(
            !Array.isArray(datos)
        ){

            return [];

        }


        return datos;

    },


    /*====================================================
      ESPERAR DATOS
    ====================================================*/

    esperarDatos: function(){

        if(this.esperando){

            return;

        }


        this.esperando =
            true;

        this.intentos =
            0;


        const comprobar =
            () => {

                const datos =
                    this.obtenerDatosBase();


                if(
                    Array.isArray(datos) &&
                    datos.length
                ){

                    this.datos =
                        datos;

                    this.inicializado =
                        true;

                    this.esperando =
                        false;

                    console.log(
                        "cab15 v1.2:",
                        this.datos.length,
                        "registros preparados."
                    );

                    return;

                }


                this.intentos++;


                if(
                    this.intentos >=
                    this.maximoIntentos
                ){

                    this.esperando =
                        false;

                    console.warn(
                        "cab15: no se pudieron obtener los datos."
                    );

                    return;

                }


                setTimeout(
                    comprobar,
                    this.intervalo
                );

            };


        comprobar();

    },


    /*====================================================
      OBTENER DATOS
    ====================================================*/

    obtenerDatos: function(){

        if(
            this.inicializado &&
            Array.isArray(this.datos)
        ){

            return this.datos;

        }


        const datos =
            this.obtenerDatosBase();


        if(
            Array.isArray(datos) &&
            datos.length
        ){

            this.datos =
                datos;

            this.inicializado =
                true;

            return this.datos;

        }


        return [];

    },


    /*====================================================
      ACTUALIZAR
    ====================================================*/

    actualizar: function(){

        const datos =
            this.obtenerDatosBase();


        if(
            !Array.isArray(datos) ||
            !datos.length
        ){

            return [];

        }


        this.datos =
            datos;

        this.inicializado =
            true;

        return this.datos;

    },


    /*====================================================
      LIMPIAR FILTROS
      -----------------------------------------------
      Restaura todos los registros originales.
      
      No realiza ninguna carga.
      No modifica leepaljson.
      No modifica cargacont.
      ====================================================*/

    limpiarFiltros: function(){

        const datos =
            this.obtenerDatosBase();


        if(
            !Array.isArray(datos)
        ){

            return [];

        }


        this.datos =
            datos;

        this.inicializado =
            true;


        /*
        Si el buscador nuevo está abierto,
        limpiamos también su interfaz.
        */

        if(
            window.palbuscadornuevo
        ){

            if(
                typeof
                window.palbuscadornuevo.limpiar
                === "function"
            ){

                window.palbuscadornuevo.limpiar();

            }


            if(
                typeof
                window.palbuscadornuevo.actualizarLabel
                === "function"
            ){

                window.palbuscadornuevo.actualizarLabel(
                    "Búsqueda avanzada"
                );

            }


            const entrada =
                document.getElementById(
                    "buscarNuevo"
                );


            if(entrada){

                entrada.value = "";

            }


            const check =
                document.getElementById(
                    "checkRango"
                );


            if(check){

                check.checked =
                    false;

            }

        }


        console.log(
            "cab15: filtros limpiados.",
            this.datos.length,
            "registros disponibles."
        );


        return this.datos;

    },


    /*====================================================
      CANTIDAD
    ====================================================*/

    cantidad: function(){

        return this.obtenerDatos().length;

    }

};


/*========================================================
ARRANQUE NO BLOQUEANTE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        /*
        No hacemos ninguna carga.

        cab15 solamente intenta reutilizar
        los datos que leepaljson ya tenga.
        */

        window.cab15.inicializar();

    }
);

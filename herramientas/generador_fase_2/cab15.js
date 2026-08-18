/*
========================================================
cab15.js v1.1
motor de datos del buscador universal
palentropía — generador

objetivo:
- reutilizar los datos de leepaljson
- crear caché local
- no bloquear el arranque
- no realizar cargas adicionales
- esperar a que leepaljson tenga datos
- proporcionar datos al buscador nuevo

no modifica:
- cargacont
- palbuscador
- leepaljson
========================================================
*/

window.cab15 = {

    /*====================================================
      estado
    ====================================================*/

    datos: [],

    inicializado: false,

    esperando: false,

    intentos: 0,

    maximoIntentos: 40,

    intervalo: 50,


    /*====================================================
      inicializar
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
                "cab15 v1.1:",
                this.datos.length,
                "registros en caché."
            );

            return this.datos;

        }


        this.esperarDatos();


        return [];

    },


    /*====================================================
      obtener datos base
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
      esperar datos
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
                        "cab15 v1.1:",
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
      obtener datos
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
      actualizar
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
      limpiar
    ====================================================*/

    limpiar: function(){

        this.datos =
            [];

        this.inicializado =
            false;

        this.esperando =
            false;

        this.intentos =
            0;

    },


    /*====================================================
      cantidad
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
        no hacemos ninguna carga.

        cab15 solamente intenta reutilizar
        los datos que leepaljson ya tenga.
        */

        window.cab15.inicializar();

    }
);

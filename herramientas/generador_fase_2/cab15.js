/*
========================================================
cab15.js v1.2
controles del buscador universal
palentropía — generador

objetivo:
- reutilizar los datos de leepaljson
- crear caché local
- crear los controles visuales del buscador
- no bloquear el arranque
- no realizar cargas adicionales
- esperar a que leepaljson tenga datos

no modifica:
- cab12
- cab14
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

        /*
        crear controles primero.
        */

        this.crearControles();


        /*
        después intentamos obtener
        los datos de leepaljson.
        */

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
      CREAR CONTROLES
    ====================================================*/

    crearControles: function(){

        /*
        evitar duplicados.
        */

        if(
            document.getElementById(
                "controlesBusquedaUniversal"
            )
        ){

            return;

        }


        const controles =
            document.createElement("section");


        controles.id =
            "controlesBusquedaUniversal";


        controles.setAttribute(
            "aria-label",
            "Controles de búsqueda universal"
        );


        /*
        botón búsqueda.
        */

        const botonBuscar =
            document.createElement("button");


        botonBuscar.id =
            "botonBuscarUniversal";


        botonBuscar.type =
            "button";


        botonBuscar.className =
            "botonBusquedaUniversal";


        botonBuscar.title =
            "Búsqueda avanzada";


        botonBuscar.setAttribute(
            "aria-label",
            "Abrir búsqueda avanzada"
        );


        botonBuscar.textContent =
            "🔍";


        /*
        etiqueta central.
        */

        const etiqueta =
            document.createElement("span");


        etiqueta.id =
            "labelBusquedaUniversal";


        etiqueta.textContent =
            "búsqueda avanzada";


        /*
        botón limpiar.
        */

        const botonLimpiar =
            document.createElement("button");


        botonLimpiar.id =
            "botonLimpiarBusquedaUniversal";


        botonLimpiar.type =
            "button";


        botonLimpiar.className =
            "botonBusquedaUniversal";


        botonLimpiar.title =
            "Mostrar todos los registros";


        botonLimpiar.setAttribute(
            "aria-label",
            "Mostrar todos los registros"
        );


        botonLimpiar.textContent =
            "×";


        /*
        montar controles.
        */

        controles.appendChild(
            botonBuscar
        );


        controles.appendChild(
            etiqueta
        );


        controles.appendChild(
            botonLimpiar
        );


        /*
        colocar antes de la navegación.
        */

        const navegacion =
            document.getElementById(
                "controlesNavegacion"
            );


        if(navegacion){

            navegacion.parentNode.insertBefore(
                controles,
                navegacion
            );

        }
        else{

            const cabecera =
                document.getElementById(
                    "cabecera"
                );


            if(cabecera){

                cabecera.insertAdjacentElement(
                    "afterend",
                    controles
                );

            }
            else{

                document.body.prepend(
                    controles
                );

            }

        }


        console.log(
            "cab15 v1.2: controles creados."
        );

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
      LIMPIAR
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

        window.cab15.inicializar();

    }
);

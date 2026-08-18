/*
========================================================
cab15.js v1.2
motor de datos y controles del buscador universal
palentropía — generador

objetivo:
- reutilizar los datos de leepaljson
- crear caché local
- crear controles del buscador
- guardar la posición actual del puntero
- restaurar la posición si una búsqueda falla
- no bloquear el arranque
- no realizar cargas adicionales

no modifica:
- cab12
- cab14
- cargacont
- palbuscador
- palnavegador
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
      posición guardada
    ====================================================*/

    posicionGuardada: null,

    codigoGuardado: null,

    filtroGuardado: null,


    /*====================================================
      inicializar
    ====================================================*/

    inicializar: function(){

        /*
        crear controles.
        */

        this.crearControles();


        /*
        conectar controles.
        */

        this.conectarControles();


        /*
        evitar reinicialización.
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
      crear controles
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
            document.createElement(
                "section"
            );


        controles.id =
            "controlesBusquedaUniversal";


        controles.setAttribute(
            "aria-label",
            "Controles de búsqueda universal"
        );


        /*------------------------------------------------
          botón búsqueda
        ------------------------------------------------*/

        const botonBuscar =
            document.createElement(
                "button"
            );


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


        /*------------------------------------------------
          etiqueta
        ------------------------------------------------*/

        const etiqueta =
            document.createElement(
                "span"
            );


        etiqueta.id =
            "labelBusquedaUniversal";


        etiqueta.textContent =
            "búsqueda avanzada";


        /*------------------------------------------------
          botón limpiar
        ------------------------------------------------*/

        const botonLimpiar =
            document.createElement(
                "button"
            );


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


        /*------------------------------------------------
          montar
        ------------------------------------------------*/

        controles.appendChild(
            botonBuscar
        );


        controles.appendChild(
            etiqueta
        );


        controles.appendChild(
            botonLimpiar
        );


        /*------------------------------------------------
          insertar antes de navegación
        ------------------------------------------------*/

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
      conectar controles
    ====================================================*/

    conectarControles: function(){

        const botonBuscar =
            document.getElementById(
                "botonBuscarUniversal"
            );


        const botonLimpiar =
            document.getElementById(
                "botonLimpiarBusquedaUniversal"
            );


        /*------------------------------------------------
          botón búsqueda
        ------------------------------------------------*/

        if(botonBuscar){

            botonBuscar.onclick =
                () => {

                    /*
                    primero guardamos
                    la posición actual.
                    */

                    this.guardarPosicion();


                    /*
                    el motor de búsqueda se
                    conectará posteriormente.
                    */

                    if(
                        window.PALBUSCADORNUEVO &&
                        typeof
                        window.PALBUSCADORNUEVO.abrir
                        === "function"
                    ){

                        window.PALBUSCADORNUEVO.abrir();

                        return;

                    }


                    if(
                        window.palbuscador &&
                        typeof
                        window.palbuscador.abrir
                        === "function"
                    ){

                        window.palbuscador.abrir();

                        return;

                    }


                    console.warn(
                        "cab15: motor de búsqueda no disponible."
                    );

                };

        }


        /*------------------------------------------------
          botón limpiar
        ------------------------------------------------*/

        if(botonLimpiar){

            botonLimpiar.onclick =
                () => {

                    /*
                    Limpiar únicamente el campo
                    del buscador nuevo si existe.
                    */

                    const campo =
                        document.getElementById(
                            "buscarNuevo"
                        );


                    if(campo){

                        campo.value = "";

                        campo.dispatchEvent(
                            new Event(
                                "input",
                                {
                                    bubbles:true
                                }
                            )
                        );

                    }


                    /*
                    Restaurar posición.
                    */

                    this.restaurarPosicion();

                };

        }

    },


    /*====================================================
      guardar posición
    ====================================================*/

    guardarPosicion: function(){

        if(
            !window.PALNAVEGADOR
        ){

            this.posicionGuardada =
                null;

            this.codigoGuardado =
                null;

            this.filtroGuardado =
                null;

            return null;

        }


        /*
        guardar índice.
        */

        this.posicionGuardada =
            typeof
            window.PALNAVEGADOR.indice
            === "number"
                ? window.PALNAVEGADOR.indice
                : null;


        /*
        guardar código.
        */

        this.codigoGuardado =
            window.PALNAVEGADOR.codigoActual
            || null;


        /*
        guardar filtro.

        No copiamos ni modificamos
        el filtro original.
        */

        this.filtroGuardado =
            Array.isArray(
                window.PALNAVEGADOR.filtroActivo
            )
                ? window.PALNAVEGADOR.filtroActivo
                : null;


        console.log(
            "cab15: posición guardada.",
            {
                indice:
                    this.posicionGuardada,

                codigo:
                    this.codigoGuardado,

                filtrado:
                    !!this.filtroGuardado
            }
        );


        return {

            indice:
                this.posicionGuardada,

            codigo:
                this.codigoGuardado,

            filtro:
                this.filtroGuardado

        };

    },


    /*====================================================
      obtener posición guardada
    ====================================================*/

    obtenerPosicionGuardada: function(){

        return {

            indice:
                this.posicionGuardada,

            codigo:
                this.codigoGuardado,

            filtro:
                this.filtroGuardado

        };

    },


    /*====================================================
      restaurar posición
    ====================================================*/

    async restaurarPosicion(){

        /*
        No existe posición guardada.
        */

        if(
            !this.codigoGuardado &&
            this.posicionGuardada === null
        ){

            return false;

        }


        if(
            !window.PALNAVEGADOR
        ){

            return false;

        }


        /*
        Si tenemos código, es la referencia
        más segura para restaurar.
        */

        if(
            this.codigoGuardado &&
            typeof
            window.PALNAVEGADOR.cargarPorCodigo
            === "function"
        ){

            try{

                const resultado =
                    await
                    window.PALNAVEGADOR.cargarPorCodigo(
                        this.codigoGuardado
                    );


                if(resultado !== false){

                    return true;

                }

            }
            catch(error){

                console.warn(
                    "cab15: no se pudo restaurar por código.",
                    error
                );

            }

        }


        /*
        Como segunda opción usamos
        el índice guardado.
        */

        if(
            this.posicionGuardada !== null &&
            typeof
            window.PALNAVEGADOR.cargarIndice
            === "function"
        ){

            try{

                await
                window.PALNAVEGADOR.cargarIndice(
                    this.posicionGuardada
                );


                return true;

            }
            catch(error){

                console.warn(
                    "cab15: no se pudo restaurar por índice.",
                    error
                );

            }

        }


        return false;

    },


    /*====================================================
      borrar posición guardada
    ====================================================*/

    borrarPosicionGuardada: function(){

        this.posicionGuardada =
            null;

        this.codigoGuardado =
            null;

        this.filtroGuardado =
            null;

    },


    /*====================================================
      obtener datos base
    ====================================================*/

    obtenerDatosBase: function(){

        if(
            !window.leepaljson ||
            typeof
            window.leepaljson.obtener !==
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
      obtener datos
    ====================================================*/

    obtenerDatos: function(){

        if(
            this.inicializado &&
            Array.isArray(
                this.datos
            )
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
      limpiar caché
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

        window.cab15.inicializar();

    }
);


/*
========================================================
FIN cab15.js v1.2
========================================================
*/

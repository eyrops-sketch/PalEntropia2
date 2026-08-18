/*
========================================================
PalEntropía
cab15.js v1.3
Motor de datos y controles del buscador universal
PalEntropía — Generador

OBJETIVO:

- reutilizar los datos de LEEPALJSON
- crear caché local
- crear controles del buscador
- guardar la posición antes de cualquier búsqueda
- guardar la posición también al abrir el buscador antiguo
- restaurar la posición si se pulsa × después de una búsqueda
- no hacer nada con × si no existe una búsqueda activa
- conservar la posición aunque la búsqueda no encuentre resultados
- restaurar también el filtro anterior
- no bloquear el arranque
- no realizar cargas adicionales

NO MODIFICA:

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
      ESTADO
    ====================================================*/

    datos: [],

    inicializado: false,

    esperando: false,

    intentos: 0,

    maximoIntentos: 40,

    intervalo: 50,


    /*====================================================
      POSICIÓN GUARDADA
    ====================================================*/

    posicionGuardada: null,

    codigoGuardado: null,

    filtroGuardado: null,

    busquedaActiva: false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        /*
        Crear controles.
        */

        this.crearControles();


        /*
        Conectar controles.
        */

        this.conectarControles();


        /*
        Evitar reinicialización.
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
                "cab15 v1.3:",
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
        Evitar duplicados.
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
          BOTÓN BÚSQUEDA
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
          ETIQUETA
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
          BOTÓN LIMPIAR
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
          MONTAR
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
          INSERTAR ANTES DE NAVEGACIÓN
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
            "cab15 v1.3: controles creados."
        );

    },


    /*====================================================
      CONECTAR CONTROLES
    ====================================================*/

    conectarControles: function(){

        const botonBuscarUniversal =
            document.getElementById(
                "botonBuscarUniversal"
            );


        const botonLimpiar =
            document.getElementById(
                "botonLimpiarBusquedaUniversal"
            );


        const botonBuscarAntiguo =
            document.getElementById(
                "botonBuscar"
            );


        /*------------------------------------------------
          BUSCADOR NUEVO
        ------------------------------------------------*/

        if(botonBuscarUniversal){

            botonBuscarUniversal.onclick =
                () => {

                    /*
                    Guardar solamente si no existe
                    ya una búsqueda activa.

                    Así no sobrescribimos la posición
                    original mientras se está buscando.
                    */

                    if(
                        !this.busquedaActiva
                    ){

                        this.guardarPosicion();

                    }


                    /*
                    Marcar búsqueda activa.
                    */

                    this.busquedaActiva =
                        true;


                    /*
                    Abrir motor nuevo.
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


                    console.warn(
                        "cab15: motor de búsqueda nuevo no disponible."
                    );

                };

        }


        /*------------------------------------------------
          BUSCADOR ANTIGUO
        ------------------------------------------------*/

        if(botonBuscarAntiguo){

            botonBuscarAntiguo.addEventListener(
                "click",
                () => {

                    /*
                    Guardar la posición ANTES de que
                    PALBUSCADOR pueda cambiar el registro.

                    Si ya existe una búsqueda activa,
                    no sobrescribir la posición original.
                    */

                    if(
                        !this.busquedaActiva
                    ){

                        this.guardarPosicion();

                    }


                    /*
                    Marcar búsqueda activa.
                    */

                    this.busquedaActiva =
                        true;


                    /*
                    El label del buscador universal
                    vuelve a su estado por defecto.
                    */

                    const label =
                        document.getElementById(
                            "labelBusquedaUniversal"
                        );


                    if(label){

                        label.textContent =
                            "búsqueda avanzada";

                    }

                },
                true
            );

        }


        /*------------------------------------------------
          BOTÓN ×
        ------------------------------------------------*/

        if(botonLimpiar){

            botonLimpiar.onclick =
                async () => {

                    /*
                    Si no existe una búsqueda activa,
                    × NO HACE NADA.

                    Esto evita saltos accidentales
                    a posiciones antiguas.
                    */

                    if(
                        !this.busquedaActiva
                    ){

                        return;

                    }


                    /*
                    Restaurar posición original.
                    */

                    await this.restaurarPosicion();


                    /*
                    Finalizar búsqueda.

                    A partir de aquí una nueva pulsación
                    de × no hará nada hasta que se inicie
                    otra búsqueda.
                    */

                    this.borrarPosicionGuardada();

                };

        }

    },


    /*====================================================
      GUARDAR POSICIÓN
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
        Guardar índice.
        */

        this.posicionGuardada =
            typeof
            window.PALNAVEGADOR.indice
            === "number"
                ? window.PALNAVEGADOR.indice
                : null;


        /*
        Guardar código.
        */

        this.codigoGuardado =
            window.PALNAVEGADOR.codigoActual
            || null;


        /*
        Guardar filtro anterior.

        Conservamos exactamente el conjunto
        que estaba activo antes de iniciar
        la búsqueda.
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
      OBTENER POSICIÓN GUARDADA
    ====================================================*/

    obtenerPosicionGuardada: function(){

        return {

            indice:
                this.posicionGuardada,

            codigo:
                this.codigoGuardado,

            filtro:
                this.filtroGuardado,

            busquedaActiva:
                this.busquedaActiva

        };

    },


    /*====================================================
      RESTAURAR POSICIÓN
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
        Primero restauramos el conjunto
        que estaba activo antes de buscar.
        */

        if(
            "filtroActivo" in
            window.PALNAVEGADOR
        ){

            window.PALNAVEGADOR.filtroActivo =
                this.filtroGuardado;

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


                if(
                    resultado !== false
                ){

                    console.log(
                        "cab15: posición restaurada por código.",
                        this.codigoGuardado
                    );


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
        Segunda opción:
        utilizar el índice guardado.
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


                console.log(
                    "cab15: posición restaurada por índice.",
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
      BORRAR POSICIÓN GUARDADA
    ====================================================*/

    borrarPosicionGuardada: function(){

        this.posicionGuardada =
            null;

        this.codigoGuardado =
            null;

        this.filtroGuardado =
            null;

        this.busquedaActiva =
            false;

    },


    /*====================================================
      OBTENER DATOS BASE
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
                        "cab15 v1.3:",
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
      LIMPIAR CACHÉ
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


/*
========================================================
FIN cab15.js v1.3
========================================================
*/

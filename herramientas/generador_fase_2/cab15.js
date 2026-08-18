/*
========================================================
cab15.js v1.3
controles y visor del buscador universal
palentropía — generador

objetivo de esta versión:
- crear controles del buscador
- crear visor de búsqueda
- abrir y cerrar el visor
- guardar posición actual
- restaurar posición
- preparar la base para el buscador universal

no realiza todavía búsquedas.

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

    posicionGuardada: null,

    codigoGuardado: null,

    filtroGuardado: null,


    /*====================================================
      inicializar
    ====================================================*/

    inicializar: function() {

        if (this.inicializado) {

            return;

        }

        this.crearControles();

        this.crearVisor();

        this.conectarControles();

        this.obtenerDatos();

        this.inicializado = true;

        console.log(
            "cab15 v1.3: controles preparados."
        );

    },


    /*====================================================
      crear controles
    ====================================================*/

    crearControles: function() {

        if (
            document.getElementById(
                "controlesBusquedaUniversal"
            )
        ) {

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
            "controles de búsqueda universal"
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
            "búsqueda avanzada";


        botonBuscar.setAttribute(
            "aria-label",
            "abrir búsqueda avanzada"
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
            "mostrar todos los registros";


        botonLimpiar.setAttribute(
            "aria-label",
            "mostrar todos los registros"
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


        if (navegacion) {

            navegacion.parentNode.insertBefore(
                controles,
                navegacion
            );

        }
        else {

            const cabecera =
                document.getElementById(
                    "cabecera"
                );


            if (cabecera) {

                cabecera.insertAdjacentElement(
                    "afterend",
                    controles
                );

            }
            else {

                document.body.prepend(
                    controles
                );

            }

        }

    },


    /*====================================================
      crear visor
    ====================================================*/

    crearVisor: function() {

        if (
            document.getElementById(
                "visorBuscadorUniversal"
            )
        ) {

            return;

        }


        const visor =
            document.createElement(
                "div"
            );


        visor.id =
            "visorBuscadorUniversal";


        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        visor.style.display =
            "none";


        visor.style.position =
            "fixed";


        visor.style.inset =
            "0";


        visor.style.zIndex =
            "999997";


        visor.style.background =
            "rgba(0,0,0,.92)";


        visor.style.justifyContent =
            "center";


        visor.style.alignItems =
            "center";


        /*------------------------------------------------
          ventana
        ------------------------------------------------*/

        const ventana =
            document.createElement(
                "div"
            );


        ventana.id =
            "ventanaBuscadorUniversal";


        ventana.style.position =
            "relative";


        ventana.style.width =
            "90%";


        ventana.style.maxWidth =
            "700px";


        ventana.style.maxHeight =
            "80vh";


        ventana.style.overflow =
            "auto";


        ventana.style.padding =
            "25px";


        ventana.style.background =
            "#181a1c";


        ventana.style.border =
            "2px solid #62d6ff";


        ventana.style.borderRadius =
            "18px";


        ventana.style.boxShadow =
            "0 0 25px rgba(98,214,255,.35)";


        /*------------------------------------------------
          botón cerrar
        ------------------------------------------------*/

        const cerrar =
            document.createElement(
                "button"
            );


        cerrar.id =
            "cerrarBuscadorUniversal";


        cerrar.type =
            "button";


        cerrar.textContent =
            "×";


        cerrar.setAttribute(
            "aria-label",
            "cerrar búsqueda avanzada"
        );


        cerrar.style.position =
            "absolute";


        cerrar.style.top =
            "10px";


        cerrar.style.right =
            "12px";


        cerrar.style.fontSize =
            "28px";


        cerrar.style.background =
            "none";


        cerrar.style.border =
            "none";


        cerrar.style.color =
            "#fff";


        cerrar.style.cursor =
            "pointer";


        /*------------------------------------------------
          título
        ------------------------------------------------*/

        const titulo =
            document.createElement(
                "h2"
            );


        titulo.textContent =
            "búsqueda avanzada";


        titulo.style.marginTop =
            "0";


        /*------------------------------------------------
          campo
        ------------------------------------------------*/

        const campo =
            document.createElement(
                "input"
            );


        campo.id =
            "buscarUniversal";


        campo.type =
            "text";


        campo.placeholder =
            "código, nombre, tiempo geológico o taxón";


        campo.autocomplete =
            "off";


        campo.style.display =
            "block";


        campo.style.width =
            "90%";


        campo.style.margin =
            "20px auto";


        campo.style.padding =
            "10px";


        campo.style.fontSize =
            "18px";


        campo.style.textAlign =
            "center";


        campo.style.background =
            "#151719";


        campo.style.color =
            "#fff";


        campo.style.border =
            "2px solid #62d6ff";


        campo.style.borderRadius =
            "10px";


        /*------------------------------------------------
          resultados
        ------------------------------------------------*/

        const resultados =
            document.createElement(
                "div"
            );


        resultados.id =
            "resultadosBuscadorUniversal";


        /*------------------------------------------------
          montar ventana
        ------------------------------------------------*/

        ventana.appendChild(
            cerrar
        );

        ventana.appendChild(
            titulo
        );

        ventana.appendChild(
            campo
        );

        ventana.appendChild(
            resultados
        );


        visor.appendChild(
            ventana
        );


        document.body.appendChild(
            visor
        );

    },


    /*====================================================
      conectar controles
    ====================================================*/

    conectarControles: function() {

        const botonBuscar =
            document.getElementById(
                "botonBuscarUniversal"
            );


        const botonLimpiar =
            document.getElementById(
                "botonLimpiarBusquedaUniversal"
            );


        const cerrar =
            document.getElementById(
                "cerrarBuscadorUniversal"
            );


        /*------------------------------------------------
          abrir
        ------------------------------------------------*/

        if (botonBuscar) {

            botonBuscar.onclick =
                () => {

                    this.guardarPosicion();

                    this.abrir();

                };

        }


        /*------------------------------------------------
          cerrar
        ------------------------------------------------*/

        if (cerrar) {

            cerrar.onclick =
                () => {

                    this.cerrar();

                };

        }


        /*------------------------------------------------
          limpiar
        ------------------------------------------------*/

        if (botonLimpiar) {

            botonLimpiar.onclick =
                async () => {

                    const campo =
                        document.getElementById(
                            "buscarUniversal"
                        );


                    if (campo) {

                        campo.value = "";

                    }


                    await this.restaurarPosicion();

                };

        }

    },


    /*====================================================
      abrir
    ====================================================*/

    abrir: function() {

        const visor =
            document.getElementById(
                "visorBuscadorUniversal"
            );


        if (!visor) {

            return false;

        }


        visor.style.display =
            "flex";


        visor.setAttribute(
            "aria-hidden",
            "false"
        );


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if (campo) {

            setTimeout(
                () => {

                    campo.focus();

                },
                50
            );

        }


        console.log(
            "cab15: buscador universal abierto."
        );


        return true;

    },


    /*====================================================
      cerrar
    ====================================================*/

    cerrar: function() {

        const visor =
            document.getElementById(
                "visorBuscadorUniversal"
            );


        if (!visor) {

            return false;

        }


        visor.style.display =
            "none";


        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        console.log(
            "cab15: buscador universal cerrado."
        );


        return true;

    },


    /*====================================================
      guardar posición
    ====================================================*/

    guardarPosicion: function() {

        if (!window.PALNAVEGADOR) {

            this.posicionGuardada =
                null;

            this.codigoGuardado =
                null;

            this.filtroGuardado =
                null;

            return null;

        }


        this.posicionGuardada =
            typeof
            window.PALNAVEGADOR.indice
            === "number"
                ? window.PALNAVEGADOR.indice
                : null;


        this.codigoGuardado =
            window.PALNAVEGADOR.codigoActual
            || null;


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
                    this.codigoGuardado
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
      restaurar posición
    ====================================================*/

    async restaurarPosicion() {

        if (
            !this.codigoGuardado &&
            this.posicionGuardada === null
        ) {

            return false;

        }


        if (!window.PALNAVEGADOR) {

            return false;

        }


        if (
            this.codigoGuardado &&
            typeof
            window.PALNAVEGADOR.cargarPorCodigo
            === "function"
        ) {

            try {

                const resultado =
                    await
                    window.PALNAVEGADOR.cargarPorCodigo(
                        this.codigoGuardado
                    );


                if (resultado !== false) {

                    return true;

                }

            }
            catch (error) {

                console.warn(
                    "cab15: no se pudo restaurar por código.",
                    error
                );

            }

        }


        if (
            this.posicionGuardada !== null &&
            typeof
            window.PALNAVEGADOR.cargarIndice
            === "function"
        ) {

            try {

                await
                window.PALNAVEGADOR.cargarIndice(
                    this.posicionGuardada
                );


                return true;

            }
            catch (error) {

                console.warn(
                    "cab15: no se pudo restaurar por índice.",
                    error
                );

            }

        }


        return false;

    },


    /*====================================================
      obtener datos
    ====================================================*/

    obtenerDatos: function() {

        if (
            window.LEEPALJSON &&
            typeof
            window.LEEPALJSON.obtener
            === "function"
        ) {

            const datos =
                window.LEEPALJSON.obtener();


            if (Array.isArray(datos)) {

                this.datos =
                    datos;

            }

        }


        return this.datos;

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function() {

        window.cab15.inicializar();

    }
);


/*
========================================================
FIN cab15.js v1.3
========================================================
*/

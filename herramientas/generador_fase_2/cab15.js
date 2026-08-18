/*
========================================================
cab15.js v1.4
controles y visor del buscador universal
palentropía — generador

objetivo:
- crear controles del buscador
- crear visor de búsqueda
- abrir y cerrar el visor
- guardar posición actual
- guardar posición también al entrar en el buscador antiguo
- restaurar posición exacta después de una búsqueda
- devolver el label a "búsqueda avanzada"
- preparar la base para cab16

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

    codigoAntesBusquedaAntigua: null,

    observadorBusquedaAntigua: null,


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

        this.conectarBuscadorAntiguo();

        this.obtenerDatos();

        this.inicializado = true;

        console.log(
            "cab15 v1.4: controles preparados."
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


        const etiqueta =
            document.createElement(
                "span"
            );


        etiqueta.id =
            "labelBusquedaUniversal";


        etiqueta.textContent =
            "búsqueda avanzada";


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


        controles.appendChild(
            botonBuscar
        );


        controles.appendChild(
            etiqueta
        );


        controles.appendChild(
            botonLimpiar
        );


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


        const titulo =
            document.createElement(
                "h2"
            );


        titulo.textContent =
            "búsqueda avanzada";


        titulo.style.marginTop =
            "0";


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


        const labelResultados =
            document.createElement(
                "div"
            );


        labelResultados.id =
            "labelResultadosBuscadorUniversal";


        labelResultados.textContent =
            "introduce un criterio de búsqueda";


        labelResultados.style.textAlign =
            "center";


        labelResultados.style.color =
            "#aaa";


        labelResultados.style.fontSize =
            "14px";


        labelResultados.style.minHeight =
            "20px";


        labelResultados.style.margin =
            "0 auto 12px";


        const resultados =
            document.createElement(
                "div"
            );


        resultados.id =
            "resultadosBuscadorUniversal";


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
            labelResultados
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
      conectar buscador antiguo
    ====================================================*/

    conectarBuscadorAntiguo: function() {

        const botonAntiguo =
            document.getElementById(
                "botonBuscar"
            );


        if (!botonAntiguo) {

            return;

        }


        /*
        Guardamos la posición ANTES de que
        palbuscador pueda cambiar la ficha.
        */

        botonAntiguo.addEventListener(
            "click",
            () => {

                this.guardarPosicion();

                this.codigoAntesBusquedaAntigua =
                    this.codigoGuardado;

            },
            true
        );


        /*
        Vigilar el visor antiguo.
        */

        this.iniciarVigilanciaBuscadorAntiguo();

    },


    /*====================================================
      vigilar buscador antiguo
    ====================================================*/

    iniciarVigilanciaBuscadorAntiguo: function() {

        if (this.observadorBusquedaAntigua) {

            return;

        }


        let visorAbiertoAnterior =
            false;


        let codigoAnterior =
            this.codigoGuardado;


        this.observadorBusquedaAntigua =
            setInterval(
                () => {

                    const visor =
                        document.getElementById(
                            "visorBuscador"
                        );


                    if (!visor) {

                        return;

                    }


                    const estilo =
                        window.getComputedStyle(
                            visor
                        );


                    const abierto =
                        visor.getAttribute(
                            "aria-hidden"
                        ) === "false" ||
                        estilo.display !== "none";


                    const codigoActual =
                        window.PALNAVEGADOR
                            ? window.PALNAVEGADOR.codigoActual
                            : null;


                    /*
                    El visor acaba de cerrarse.
                    */

                    if (
                        visorAbiertoAnterior &&
                        !abierto &&
                        codigoActual &&
                        codigoActual !== codigoAnterior
                    ) {

                        this.restablecerLabel();

                    }


                    visorAbiertoAnterior =
                        abierto;


                    codigoAnterior =
                        codigoActual ||
                        codigoAnterior;

                },
                100
            );

    },


    /*====================================================
      restablecer label
    ====================================================*/

    restablecerLabel: function() {

        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if (label) {

            label.textContent =
                "búsqueda avanzada";

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
            this.posicionGuardada === null
        ) {

            return false;

        }


        if (!window.PALNAVEGADOR) {

            return false;

        }


        /*
        Primero restauramos por índice.

        Esto evita que cargarPorCodigo()
        pueda localizar la ficha dentro de
        otro conjunto y producir un desplazamiento.
        */

        if (
            typeof
            window.PALNAVEGADOR.cargarIndice
            === "function"
        ) {

            try {

                await
                window.PALNAVEGADOR.cargarIndice(
                    this.posicionGuardada
                );


                this.restablecerLabel();


                return true;

            }
            catch (error) {

                console.warn(
                    "cab15: no se pudo restaurar por índice.",
                    error
                );

            }

        }


        /*
        Segunda opción:
        restaurar por código.
        */

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

                    this.restablecerLabel();

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
FIN cab15.js v1.4
========================================================
*/

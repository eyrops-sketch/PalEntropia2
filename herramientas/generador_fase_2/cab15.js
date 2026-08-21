/*
========================================================
cab15.js v1.4
controles y memoria de posición
palentropía — visor de paleofichas

funciones:
- crear controles del buscador universal
- crear visor de búsqueda
- abrir y cerrar el visor
- memorizar la última paleoficha mostrada
- restaurar la posición
- preparar la base para el buscador universal

importante:
la posición se actualiza automáticamente cada vez que
cambia la paleoficha mostrada.

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

    observador: null,


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

        this.vigilarFicha();

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
            "Buscar por ...";


        botonBuscar.setAttribute(
            "aria-label",
            "Buscar por ..."
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
            "Buscar por ...";


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
            "cerrar buscador"
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
            "Buscar por ...";


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


        if (botonBuscar) {

            botonBuscar.onclick =
                () => {

                    /*
                    Guardamos únicamente como respaldo.
                    Si posteriormente se muestra otra ficha,
                    vigilarFicha() sustituirá esta posición.
                    */

                    this.guardarPosicion();

                    this.abrir();

                };

        }


        if (cerrar) {

            cerrar.onclick =
                () => {

                    this.cerrar();

                };

        }


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
      vigilar ficha actual
    ====================================================*/

    vigilarFicha: function() {

        const ficha =
            document.getElementById(
                "codigoFicha"
            );


        if (!ficha) {

            return;

        }


        /*
        Observamos solamente el contenido del código
        de la paleoficha.

        Cuando CAB01/CARGACONT/CAB02/etc. muestran
        otro registro, el código cambia y actualizamos
        automáticamente la posición memorizada.
        */

        this.observador =
            new MutationObserver(
                () => {

                    this.actualizarPosicionActual();

                }
            );


        this.observador.observe(
            ficha,
            {
                childList: true,
                characterData: true,
                subtree: true
            }
        );


        /*
        También comprobamos el estado inicial.
        */

        this.actualizarPosicionActual();

    },


    /*====================================================
      actualizar posición actual
    ====================================================*/

    actualizarPosicionActual: function() {

        if (!window.PALNAVEGADOR) {

            return false;

        }


        const codigo =
            window.PALNAVEGADOR.codigoActual;


        if (!codigo) {

            return false;

        }


        /*
        La ficha que acaba de mostrarse pasa a ser
        automáticamente la nueva posición guardada.
        */

        this.posicionGuardada =
            typeof
            window.PALNAVEGADOR.indice
            === "number"
                ? window.PALNAVEGADOR.indice
                : null;


        this.codigoGuardado =
            codigo;


        this.filtroGuardado =
            Array.isArray(
                window.PALNAVEGADOR.filtroActivo
            )
                ? window.PALNAVEGADOR.filtroActivo
                : null;


        return true;

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
            !this.codigoGuardado &&
            this.posicionGuardada === null
        ) {

            return false;

        }


        if (!window.PALNAVEGADOR) {

            return false;

        }


        /*
        Primero intentamos por código porque es la
        referencia más segura.
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


        /*
        Segunda opción: índice.
        */

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
FIN cab15.js v1.4
========================================================
*/

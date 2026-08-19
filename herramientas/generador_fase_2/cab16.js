/*
========================================================
cab16.js v1.2
sincronización del buscador avanzado
palentropía — generador

objetivo:
- esperar a que cab15 tenga los datos
- preparar la interfaz
- mantener diagnóstico temporal
- no modificar todavía la lógica de búsqueda

no modifica:
- cab15
- palbuscador
- palnavegador
- cab12
- cab14
========================================================
*/

window.cab16 = {

    /*====================================================
      estado
    ====================================================*/

    inicializado: false,

    datos: [],

    buscarTodos: false,

    esperando: false,

    intentos: 0,

    maximoIntentos: 100,

    intervalo: 100,


    /*====================================================
      inicializar
    ====================================================*/

    inicializar: function() {

        if (this.inicializado) {

            return;

        }


        this.crearInterfaz();

        this.esperarDatos();

    },


    /*====================================================
      esperar datos de cab15
    ====================================================*/

    esperarDatos: function() {

        if (this.esperando) {

            return;

        }


        this.esperando =
            true;

        this.intentos =
            0;


        const comprobar =
            () => {

                const datos =
                    this.obtenerDatos();


                if (
                    Array.isArray(datos) &&
                    datos.length
                ) {

                    this.esperando =
                        false;

                    this.inicializado =
                        true;

                    this.conectarCheck();

                    this.conectarBusqueda();

                    this.mostrarDiagnostico();


                    console.log(
                        "cab16 v1.2:",
                        datos.length,
                        "registros disponibles."
                    );


                    return;

                }


                this.intentos++;


                if (
                    this.intentos >=
                    this.maximoIntentos
                ) {

                    this.esperando =
                        false;


                    console.warn(
                        "cab16: cab15 no proporcionó datos."
                    );


                    const label =
                        document.getElementById(
                            "labelResultadosCab16"
                        );


                    if (label) {

                        label.textContent =
                            "Base de datos no disponible";

                    }


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

    obtenerDatos: function() {

        if (
            window.cab15 &&
            typeof
            window.cab15.obtenerDatos
            === "function"
        ) {

            const datos =
                window.cab15.obtenerDatos();


            if (
                Array.isArray(datos) &&
                datos.length
            ) {

                this.datos =
                    datos;

            }

        }


        return this.datos;

    },


    /*====================================================
      crear interfaz
    ====================================================*/

    crearInterfaz: function() {

        const ventana =
            document.getElementById(
                "ventanaBuscadorUniversal"
            );


        if (!ventana) {

            return;

        }


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if (!campo) {

            return;

        }


        if (
            document.getElementById(
                "labelResultadosCab16"
            )
        ) {

            return;

        }


        /*------------------------------------------------
          label
        ------------------------------------------------*/

        const label =
            document.createElement(
                "div"
            );


        label.id =
            "labelResultadosCab16";


        label.textContent =
            "Preparando búsqueda...";


        /*------------------------------------------------
          check
        ------------------------------------------------*/

        const etiquetaCheck =
            document.createElement(
                "label"
            );


        etiquetaCheck.id =
            "checkBusquedaCab16";


        const check =
            document.createElement(
                "input"
            );


        check.type =
            "checkbox";


        check.id =
            "buscarTodosCab16";


        const textoCheck =
            document.createElement(
                "span"
            );


        textoCheck.textContent =
            "Buscar en todos los registros";


        etiquetaCheck.appendChild(
            check
        );


        etiquetaCheck.appendChild(
            textoCheck
        );


        /*------------------------------------------------
          resultados
        ------------------------------------------------*/

        const resultados =
            document.createElement(
                "div"
            );


        resultados.id =
            "resultadosCab16";


        /*------------------------------------------------
          insertar
        ------------------------------------------------*/

        campo.insertAdjacentElement(
            "afterend",
            label
        );


        label.insertAdjacentElement(
            "afterend",
            etiquetaCheck
        );


        etiquetaCheck.insertAdjacentElement(
            "afterend",
            resultados
        );


        this.label =
            label;


        this.check =
            check;


        this.resultados =
            resultados;

    },


    /*====================================================
      conectar check
    ====================================================*/

    conectarCheck: function() {

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if (!check) {

            return;

        }


        check.addEventListener(
            "change",
            () => {

                this.buscarTodos =
                    check.checked;


                /*
                Todavía no ejecutamos búsqueda.
                */

                console.log(
                    "cab16: modo:",
                    this.buscarTodos
                        ? "todos"
                        : "activo"
                );

            }
        );

    },


    /*====================================================
      conectar búsqueda
    ====================================================*/

    conectarBusqueda: function() {

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if (!campo) {

            return;

        }


        campo.addEventListener(
            "input",
            () => {

                /*
                Todavía no ejecutamos
                la lógica de búsqueda.
                */

            }
        );

    },


    /*====================================================
      diagnóstico temporal
    ====================================================*/

    mostrarDiagnostico: function() {

        const datos =
            this.obtenerDatos();


        const registro =
            datos.length
                ? datos[0]
                : null;


        const visor =
            document.getElementById(
                "ventanaBuscadorUniversal"
            );


        if (!visor) {

            return;

        }


        const anterior =
            document.getElementById(
                "diagnosticoCab16"
            );


        if (anterior) {

            anterior.remove();

        }


        const diagnostico =
            document.createElement(
                "pre"
            );


        diagnostico.id =
            "diagnosticoCab16";


        diagnostico.style.whiteSpace =
            "pre-wrap";


        diagnostico.style.wordBreak =
            "break-word";


        diagnostico.style.marginTop =
            "20px";


        diagnostico.style.padding =
            "15px";


        diagnostico.style.background =
            "#000";


        diagnostico.style.color =
            "#fff";


        diagnostico.style.fontSize =
            "12px";


        diagnostico.style.maxHeight =
            "300px";


        diagnostico.style.overflow =
            "auto";


        diagnostico.textContent =
            registro
                ? JSON.stringify(
                    registro,
                    null,
                    2
                )
                : "No hay datos disponibles.";


        visor.appendChild(
            diagnostico
        );

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function() {

        window.cab16.inicializar();

    }
);


/*
========================================================
FIN cab16.js v1.2
========================================================
*/

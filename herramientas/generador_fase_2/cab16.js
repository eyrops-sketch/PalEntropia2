/*
========================================================
cab16.js v1.1
autocompletado del buscador avanzado
palentropía — generador

funciones:
- campo de búsqueda
- label de resultados
- selector registro activo / todos los registros
- autocompletado
- resultados coincidentes
- diagnóstico temporal de estructura de datos

todavía NO carga paleofichas.

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


    /*====================================================
      inicializar
    ====================================================*/

    inicializar: function() {

        if (this.inicializado) {

            return;

        }


        this.obtenerDatos();

        this.crearInterfaz();

        this.conectarCheck();

        this.conectarBusqueda();

        this.inicializado = true;


        /*
        DIAGNÓSTICO TEMPORAL
        */

        this.mostrarDiagnostico();


        console.log(
            "cab16 v1.1: autocompletado preparado."
        );

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


            if (Array.isArray(datos)) {

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

            console.warn(
                "cab16: ventana de cab15 no disponible."
            );

            return;

        }


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if (!campo) {

            console.warn(
                "cab16: campo de búsqueda no disponible."
            );

            return;

        }


        /*------------------------------------------------
          evitar duplicados
        ------------------------------------------------*/

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
            "Introduce al menos 3 caracteres";


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


                this.ejecutarBusqueda();

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

                this.ejecutarBusqueda();

            }
        );

    },


    /*====================================================
      ejecutar búsqueda
    ====================================================*/

    ejecutarBusqueda: function() {

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        const resultados =
            document.getElementById(
                "resultadosCab16"
            );


        const label =
            document.getElementById(
                "labelResultadosCab16"
            );


        if (
            !campo ||
            !resultados ||
            !label
        ) {

            return;

        }


        const texto =
            campo.value
                .trim()
                .toLowerCase();


        resultados.innerHTML =
            "";


        if (texto.length < 3) {

            label.textContent =
                "Introduce al menos 3 caracteres";

            return;

        }


        /*
        Obtener datos actualizados.
        */

        this.obtenerDatos();


        let conjunto =
            this.datos;


        /*
        Si no está marcado "todos",
        intentamos trabajar con el registro/conjunto activo.
        */

        if (!this.buscarTodos) {

            conjunto =
                this.obtenerConjuntoActivo();

        }


        const coincidencias =
            conjunto.filter(
                registro =>
                    this.coincide(
                        registro,
                        texto
                    )
            );


        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        this.mostrarResultados(
            coincidencias
        );

    },


    /*====================================================
      obtener conjunto activo
    ====================================================*/

    obtenerConjuntoActivo: function() {

        if (
            window.PALNAVEGADOR &&
            typeof
            window.PALNAVEGADOR.conjuntoActivo
            === "function"
        ) {

            const conjunto =
                window.PALNAVEGADOR.conjuntoActivo();


            if (Array.isArray(conjunto)) {

                return conjunto;

            }

        }


        return this.datos;

    },


    /*====================================================
      comprobar coincidencia
    ====================================================*/

    coincide: function(
        registro,
        texto
    ) {

        if (!registro) {

            return false;

        }


        const codigo =
            String(
                registro.codigo || ""
            ).toLowerCase();


        const nombre =
            String(
                registro.nombre || ""
            ).toLowerCase();


        const j3 =
            String(
                registro.j3 || ""
            ).toLowerCase();


        const taxon =
            String(
                registro.taxon || ""
            ).toLowerCase();


        return (
            codigo.includes(texto) ||
            nombre.includes(texto) ||
            j3.includes(texto) ||
            taxon.includes(texto)
        );

    },


    /*====================================================
      mostrar resultados
    ====================================================*/

    mostrarResultados: function(
        coincidencias
    ) {

        const contenedor =
            document.getElementById(
                "resultadosCab16"
            );


        if (!contenedor) {

            return;

        }


        coincidencias.forEach(
            registro => {

                const boton =
                    document.createElement(
                        "button"
                    );


                boton.type =
                    "button";


                boton.className =
                    "resultadoCab16";


                const codigo =
                    registro.codigo ||
                    "";


                const nombre =
                    registro.nombre ||
                    "";


                boton.textContent =
                    codigo +
                    " — " +
                    nombre;


                contenedor.appendChild(
                    boton
                );

            }
        );

    },


    /*====================================================
      DIAGNÓSTICO TEMPORAL
      Muestra el primer registro real recibido
      por cab16.
    ====================================================*/

    mostrarDiagnostico: function() {

        const datos =
            this.obtenerDatos();


        const registro =
            datos &&
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


        /*
        Evitar duplicados.
        */

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
FIN cab16.js v1.1
========================================================
*/

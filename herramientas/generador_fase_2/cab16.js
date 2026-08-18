/*
========================================================
cab16.js v1.0
base del buscador avanzado
palentropía — generador

funciones:
- preparar interfaz del buscador avanzado
- campo de búsqueda
- label de resultados
- selector registro activo / todos los registros
- contenedor de resultados
- lectura de datos desde cab15

todavía NO realiza búsquedas.

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

        this.inicializado = true;


        console.log(
            "cab16 v1.0: base del buscador preparada."
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
                "cab16: no existe la ventana de cab15."
            );

            return;

        }


        /*------------------------------------------------
          evitar duplicados
        ------------------------------------------------*/

        if (
            document.getElementById(
                "controlesBusquedaCab16"
            )
        ) {

            return;

        }


        const controles =
            document.createElement(
                "div"
            );


        controles.id =
            "controlesBusquedaCab16";


        /*------------------------------------------------
          label de resultados
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
          insertar después del campo
        ------------------------------------------------*/

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if (campo) {

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

        }
        else {

            ventana.appendChild(
                controles
            );

            controles.appendChild(
                label
            );

            controles.appendChild(
                etiquetaCheck
            );

            controles.appendChild(
                resultados
            );

            return;

        }


        /*
        Guardamos referencia lógica de los controles.
        */

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


                console.log(
                    "cab16: modo de búsqueda:",
                    this.buscarTodos
                        ? "todos los registros"
                        : "registro activo"
                );

            }
        );

    },


    /*====================================================
      modo actual
    ====================================================*/

    obtenerModo: function() {

        return this.buscarTodos
            ? "todos"
            : "activo";

    },


    /*====================================================
      cantidad
    ====================================================*/

    cantidad: function() {

        return this.datos.length;

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
FIN cab16.js v1.0
========================================================
*/

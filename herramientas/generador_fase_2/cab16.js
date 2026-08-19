/*
========================================================
cab16.js v1.2 LTS
autocompletado del buscador avanzado
PalEntropía — Generador

CAMBIO v1.2
-----------
- Lee directamente desde LEEPALJSON
- Espera a que master.csv esté cargado
- No depende de PALNAVEGADOR para buscar
- Evita el problema con 000
- El check no cambia el origen de datos
- Búsqueda por:
    código
    nombre
    j3 / tiempo geológico
    taxón

NO CARGA PALEOFICHAS TODAVÍA.
NO MODIFICA CAB15.
NO MODIFICA LEEPALJSON.
========================================================
*/

window.cab16 = {

    /* ==================================================
       ESTADO
    ================================================== */

    inicializado: false,

    datos: [],

    buscarTodos: true,

    campo: null,

    label: null,

    check: null,

    resultados: null,


    /* ==================================================
       INICIALIZAR
    ================================================== */

    inicializar: function() {

        if (this.inicializado) {

            return;

        }


        this.crearInterfaz();

        if (!this.campo) {

            console.warn(
                "cab16: campo de búsqueda no disponible."
            );

            return;

        }


        this.conectarCheck();

        this.conectarBusqueda();

        this.inicializado = true;


        /*
        Intentar obtener datos inmediatamente.
        */

        this.obtenerDatos();


        /*
        Si LEEPALJSON todavía no ha cargado
        master.csv, esperamos el evento.
        */

        document.addEventListener(
            "palentropia:datos-cargados",
            () => {

                this.obtenerDatos();

                this.ejecutarBusqueda();

            }
        );


        console.log(
            "cab16 v1.2 LTS: preparado."
        );

    },


    /* ==================================================
       OBTENER DATOS

       FUENTE ÚNICA:
       LEEPALJSON
    ================================================== */

    obtenerDatos: function() {

        if (
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ) {

            this.datos = [];

            return this.datos;

        }


        const datos =
            window.LEEPALJSON.obtener();


        if (
            Array.isArray(datos)
        ) {

            this.datos =
                datos;

        } else {

            this.datos = [];

        }


        return this.datos;

    },


    /* ==================================================
       CREAR INTERFAZ
    ================================================== */

    crearInterfaz: function() {

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if (!campo) {

            return;

        }


        this.campo =
            campo;


        /*
        Evitar duplicados.
        */

        const interfazExistente =
            document.getElementById(
                "cab16Interfaz"
            );


        if (interfazExistente) {

            this.label =
                document.getElementById(
                    "labelResultadosCab16"
                );

            this.check =
                document.getElementById(
                    "buscarTodosCab16"
                );

            this.resultados =
                document.getElementById(
                    "resultadosCab16"
                );

            return;

        }


        const interfaz =
            document.createElement(
                "div"
            );


        interfaz.id =
            "cab16Interfaz";


        /* --------------------------------------------
           LABEL
        -------------------------------------------- */

        const label =
            document.createElement(
                "div"
            );


        label.id =
            "labelResultadosCab16";


        label.textContent =
            "Introduce al menos 3 caracteres";


        /* --------------------------------------------
           CHECK
        -------------------------------------------- */

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


        /*
        Siempre empieza buscando en todos
        los registros.
        */

        check.checked =
            true;


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


        /* --------------------------------------------
           RESULTADOS
        -------------------------------------------- */

        const resultados =
            document.createElement(
                "div"
            );


        resultados.id =
            "resultadosCab16";


        /* --------------------------------------------
           CONSTRUIR
        -------------------------------------------- */

        interfaz.appendChild(
            label
        );

        interfaz.appendChild(
            etiquetaCheck
        );

        interfaz.appendChild(
            resultados
        );


        campo.insertAdjacentElement(
            "afterend",
            interfaz
        );


        this.label =
            label;

        this.check =
            check;

        this.resultados =
            resultados;

    },


    /* ==================================================
       CONECTAR CHECK
    ================================================== */

    conectarCheck: function() {

        if (!this.check) {

            return;

        }


        this.check.addEventListener(
            "change",
            () => {

                /*
                El check NO modifica el conjunto de datos.

                Lo mantenemos por compatibilidad visual
                mientras construimos la siguiente fase.
                */

                this.buscarTodos =
                    this.check.checked;


                this.ejecutarBusqueda();

            }
        );

    },


    /* ==================================================
       CONECTAR CAMPO DE BÚSQUEDA
    ================================================== */

    conectarBusqueda: function() {

        if (!this.campo) {

            return;

        }


        this.campo.addEventListener(
            "input",
            () => {

                this.ejecutarBusqueda();

            }
        );

    },


    /* ==================================================
       EJECUTAR BÚSQUEDA
    ================================================== */

    ejecutarBusqueda: function() {

        if (
            !this.campo ||
            !this.label ||
            !this.resultados
        ) {

            return;

        }


        const texto =
            String(
                this.campo.value || ""
            )
            .trim()
            .toLowerCase();


        /*
        Limpiar resultados anteriores.
        */

        this.resultados.innerHTML =
            "";


        /*
        Menos de 3 caracteres:
        no buscar.
        */

        if (
            texto.length < 3
        ) {

            this.label.textContent =
                "Introduce al menos 3 caracteres";

            return;

        }


        /*
        OBTENER DATOS DIRECTAMENTE
        */

        const datos =
            this.obtenerDatos();


        /*
        Si todavía no hay datos,
        no damos falsos resultados.
        */

        if (
            !Array.isArray(datos) ||
            !datos.length
        ) {

            this.label.textContent =
                "Preparando búsqueda...";

            return;

        }


        /*
        IMPORTANTE:

        CAB16 trabaja directamente sobre
        todos los registros de LEEPALJSON.

        No usamos:
        PALNAVEGADOR
        cab15.obtenerDatos()
        conjuntoActivo()
        */

        const coincidencias =
            datos.filter(
                registro => {

                    return this.coincide(
                        registro,
                        texto
                    );

                }
            );


        /*
        CONTADOR
        */

        this.label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        MOSTRAR
        */

        this.mostrarResultados(
            coincidencias
        );

    },


    /* ==================================================
       COMPROBAR COINCIDENCIA
    ================================================== */

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
            )
            .toLowerCase();


        const nombre =
            String(
                registro.nombre || ""
            )
            .toLowerCase();


        const j3 =
            String(
                registro.j3 || ""
            )
            .toLowerCase();


        const taxon =
            String(
                registro.taxon || ""
            )
            .toLowerCase();


        return (
            codigo.includes(texto) ||
            nombre.includes(texto) ||
            j3.includes(texto) ||
            taxon.includes(texto)
        );

    },


    /* ==================================================
       MOSTRAR RESULTADOS
    ================================================== */

    mostrarResultados: function(
        coincidencias
    ) {

        if (!this.resultados) {

            return;

        }


        /*
        Sin coincidencias.
        */

        if (
            !coincidencias.length
        ) {

            const vacio =
                document.createElement(
                    "div"
                );


            vacio.className =
                "sinResultadosCab16";


            vacio.textContent =
                "No se encontraron resultados.";


            this.resultados.appendChild(
                vacio
            );


            return;

        }


        /*
        Crear resultados.
        */

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
                    String(
                        registro.codigo || ""
                    );


                const nombre =
                    String(
                        registro.nombre || ""
                    );


                boton.textContent =
                    codigo +
                    " — " +
                    nombre;


                /*
                De momento SOLO mostramos
                el resultado.

                La carga de paleoficha vendrá
                en la siguiente fase.
                */


                this.resultados.appendChild(
                    boton
                );

            }
        );

    }

};


/* ========================================================
   ARRANQUE
======================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        window.cab16.inicializar();

    }
);


/* ========================================================
   FIN cab16.js v1.2 LTS
======================================================== */

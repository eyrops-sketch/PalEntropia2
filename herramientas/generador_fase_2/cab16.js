/*
========================================================
cab16.js v1.2
autocompletado del buscador avanzado
palentropía — generador

CORRECCIÓN v1.2
---------------
- evita falsos resultados con búsquedas como "000"
- no utiliza j3 para búsquedas numéricas de código
- normaliza los datos antes de buscar
- recupera datos cuando LEEPALJSON termina de cargar
- mantiene el check "Buscar en todos los registros"
- evita estados antiguos de resultados
- todavía NO carga paleofichas

NO MODIFICA:
- cab15
- palbuscador
- palnavegador
- cab12
- cab14
========================================================
*/

window.cab16 = {

    /*====================================================
      ESTADO
    ====================================================*/

    inicializado: false,

    datos: [],

    buscarTodos: false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function() {

        if (this.inicializado) {

            return;

        }


        this.obtenerDatos();

        this.crearInterfaz();

        this.conectarCheck();

        this.conectarBusqueda();

        this.conectarDatos();


        this.inicializado = true;


        console.log(
            "cab16 v1.2: autocompletado preparado."
        );

    },


    /*====================================================
      OBTENER DATOS
    ====================================================*/

    obtenerDatos: function() {

        let datos = [];


        /*------------------------------------------------
          primera fuente: cab15
        ------------------------------------------------*/

        if (
            window.cab15 &&
            typeof window.cab15.obtenerDatos ===
            "function"
        ) {

            try {

                datos =
                    window.cab15.obtenerDatos();

            }
            catch (error) {

                console.warn(
                    "cab16: error obteniendo datos desde cab15.",
                    error
                );

            }

        }


        /*------------------------------------------------
          segunda fuente: LEEPALJSON
        ------------------------------------------------*/

        if (
            !Array.isArray(datos) ||
            !datos.length
        ) {

            if (
                window.LEEPALJSON &&
                typeof window.LEEPALJSON.obtener ===
                "function"
            ) {

                try {

                    datos =
                        window.LEEPALJSON.obtener();

                }
                catch (error) {

                    console.warn(
                        "cab16: error obteniendo datos desde LEEPALJSON.",
                        error
                    );

                }

            }

        }


        /*------------------------------------------------
          guardar solamente arrays válidos
        ------------------------------------------------*/

        if (
            Array.isArray(datos)
        ) {

            this.datos =
                datos;

        }
        else {

            this.datos =
                [];

        }


        return this.datos;

    },


    /*====================================================
      ESCUCHAR CARGA DE DATOS
    ====================================================*/

    conectarDatos: function() {

        document.addEventListener(
            "palentropia:datos-cargados",
            () => {

                this.obtenerDatos();


                const campo =
                    document.getElementById(
                        "buscarUniversal"
                    );


                if (
                    campo &&
                    campo.value.trim().length >= 3
                ) {

                    this.ejecutarBusqueda();

                }

            }
        );

    },


    /*====================================================
      CREAR INTERFAZ
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
          LABEL
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
          CHECK
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
          RESULTADOS
        ------------------------------------------------*/

        const resultados =
            document.createElement(
                "div"
            );


        resultados.id =
            "resultadosCab16";


        /*------------------------------------------------
          INSERTAR
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
      CONECTAR CHECK
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
      CONECTAR BÚSQUEDA
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
      NORMALIZAR TEXTO
    ====================================================*/

    normalizarTexto: function(valor) {

        if (
            valor === undefined ||
            valor === null
        ) {

            return "";

        }


        return String(valor)
            .trim()
            .toLowerCase();

    },


    /*====================================================
      EJECUTAR BÚSQUEDA
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
            this.normalizarTexto(
                campo.value
            );


        /*------------------------------------------------
          LIMPIAR RESULTADOS ANTERIORES
        ------------------------------------------------*/

        resultados.innerHTML =
            "";


        /*------------------------------------------------
          MENOS DE 3 CARACTERES
        ------------------------------------------------*/

        if (
            texto.length < 3
        ) {

            label.textContent =
                "Introduce al menos 3 caracteres";

            return;

        }


        /*------------------------------------------------
          RECARGAR DATOS
        ------------------------------------------------*/

        this.obtenerDatos();


        if (
            !Array.isArray(this.datos) ||
            !this.datos.length
        ) {

            label.textContent =
                "No hay datos disponibles.";

            return;

        }


        /*------------------------------------------------
          CONJUNTO DE BÚSQUEDA
        ------------------------------------------------*/

        let conjunto =
            this.datos;


        if (
            !this.buscarTodos
        ) {

            const activo =
                this.obtenerConjuntoActivo();


            if (
                Array.isArray(activo) &&
                activo.length
            ) {

                conjunto =
                    activo;

            }

        }


        /*------------------------------------------------
          FILTRAR
        ------------------------------------------------*/

        const coincidencias =
            conjunto.filter(
                registro =>
                    this.coincide(
                        registro,
                        texto
                    )
            );


        /*------------------------------------------------
          CONTADOR
        ------------------------------------------------*/

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*------------------------------------------------
          MOSTRAR
        ------------------------------------------------*/

        this.mostrarResultados(
            coincidencias
        );

    },


    /*====================================================
      OBTENER CONJUNTO ACTIVO
    ====================================================*/

    obtenerConjuntoActivo: function() {

        if (
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.conjuntoActivo ===
            "function"
        ) {

            try {

                const conjunto =
                    window.PALNAVEGADOR.conjuntoActivo();


                if (
                    Array.isArray(conjunto) &&
                    conjunto.length
                ) {

                    return conjunto;

                }

            }
            catch (error) {

                console.warn(
                    "cab16: error obteniendo conjunto activo.",
                    error
                );

            }

        }


        return this.datos;

    },


    /*====================================================
      COMPROBAR COINCIDENCIA
    ====================================================*/

    coincide: function(
        registro,
        texto
    ) {

        if (!registro) {

            return false;

        }


        const codigo =
            this.normalizarTexto(
                registro.codigo ||
                registro.j1
            );


        const nombre =
            this.normalizarTexto(
                registro.nombre ||
                registro.j2
            );


        const j3 =
            this.normalizarTexto(
                registro.j3
            );


        const taxon =
            this.normalizarTexto(
                registro.taxon
            );


        /*================================================
          REGLA ESPECIAL PARA CÓDIGOS
        =================================================*/

        /*
        Si la búsqueda está formada únicamente
        por números, primero comprobamos si puede
        ser un código.

        Esto evita que "000" provoque una búsqueda
        masiva dentro de las cronologías j3.
        */

        const solamenteNumeros =
            /^\d+$/.test(
                texto
            );


        if (
            solamenteNumeros
        ) {

            /*
            Código de volumen:
            001
            002
            003
            etc.
            */

            if (
                texto.length === 3
            ) {

                return codigo.startsWith(
                    texto + "_"
                );

            }


            /*
            Código completo parcial:
            001_
            001_0
            001_01
            */

            if (
                texto.includes("_")
            ) {

                return codigo.startsWith(
                    texto
                );

            }


            /*
            Otros números no se buscan
            contra j3.
            */

            return false;

        }


        /*================================================
          BÚSQUEDA TEXTUAL
        =================================================*/

        return (
            codigo.includes(texto) ||
            nombre.includes(texto) ||
            j3.includes(texto) ||
            taxon.includes(texto)
        );

    },


    /*====================================================
      MOSTRAR RESULTADOS
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
                    registro.j1 ||
                    "";


                const nombre =
                    registro.nombre ||
                    registro.j2 ||
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

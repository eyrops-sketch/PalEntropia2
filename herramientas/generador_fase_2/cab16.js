/*
========================================================
cab16.js v1.2
autocompletado del buscador avanzado
palentropía — generador

CORRECCIONES v1.2
-----------------
- Espera a palentropia:datos-cargados
- No trabaja con datos vacíos durante el arranque
- Corrección del problema con 000
- Normalización segura de códigos
- Búsqueda estable por:
    codigo
    nombre
    j3
    taxon
- El check no modifica los datos
- No carga paleofichas todavía

NO MODIFICA:
- cab15
- palbuscador
- palnavegador
- cab12
- cab14
- leepaljson
- cargacont
========================================================
*/

window.cab16 = {

    /*====================================================
      ESTADO
    ====================================================*/

    inicializado: false,

    datos: [],

    buscarTodos: false,

    esperandoDatos: true,

    listenerDatos: null,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function() {

        if (this.inicializado) {

            return;

        }


        this.crearInterfaz();

        this.conectarCheck();

        this.conectarBusqueda();

        this.conectarCargaDatos();


        /*
        Intentamos obtener datos inmediatamente.
        Si todavía no existen, esperamos al evento.
        */

        this.obtenerDatos();


        if (this.datos.length) {

            this.esperandoDatos = false;

            this.mostrarEstadoPreparado();

        }
        else {

            this.mostrarPreparando();

        }


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


        if (
            window.LEEPALJSON &&
            typeof window.LEEPALJSON.obtener ===
            "function"
        ) {

            datos =
                window.LEEPALJSON.obtener();

        }


        if (Array.isArray(datos)) {

            this.datos =
                datos;

        }
        else {

            this.datos = [];

        }


        return this.datos;

    },


    /*====================================================
      ESCUCHAR CARGA DE MASTER.CSV
    ====================================================*/

    conectarCargaDatos: function() {

        if (this.listenerDatos) {

            return;

        }


        this.listenerDatos =
            () => {

                console.log(
                    "cab16: datos de master.csv recibidos."
                );


                this.obtenerDatos();


                this.esperandoDatos =
                    false;


                this.mostrarEstadoPreparado();


                /*
                Si ya existe texto en el campo,
                repetimos la búsqueda automáticamente.
                */

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

            };


        document.addEventListener(
            "palentropia:datos-cargados",
            this.listenerDatos
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


        /*
        Evitar duplicados
        */

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
            "Preparando búsqueda...";


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

                /*
                Solo cambiamos el modo de búsqueda.
                NO modificamos PALNAVEGADOR.
                NO modificamos cab15.
                */

                this.buscarTodos =
                    check.checked;


                this.ejecutarBusqueda();

            }
        );

    },


    /*====================================================
      CONECTAR CAMPO DE BÚSQUEDA
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
      ESTADO PREPARANDO
    ====================================================*/

    mostrarPreparando: function() {

        const label =
            document.getElementById(
                "labelResultadosCab16"
            );


        if (!label) {

            return;

        }


        label.textContent =
            "Preparando búsqueda...";


    },


    /*====================================================
      ESTADO PREPARADO
    ====================================================*/

    mostrarEstadoPreparado: function() {

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        const label =
            document.getElementById(
                "labelResultadosCab16"
            );


        if (!campo || !label) {

            return;

        }


        const texto =
            campo.value
                .trim();


        if (texto.length < 3) {

            label.textContent =
                "Introduce al menos 3 caracteres";

        }

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


        const textoOriginal =
            campo.value
                .trim();


        const texto =
            textoOriginal
                .toLowerCase();


        resultados.innerHTML =
            "";


        /*
        Menos de 3 caracteres
        */

        if (texto.length < 3) {

            if (this.datos.length) {

                label.textContent =
                    "Introduce al menos 3 caracteres";

            }
            else {

                label.textContent =
                    "Preparando búsqueda...";

            }


            return;

        }


        /*
        Todavía no tenemos master.csv
        */

        if (!this.datos.length) {

            label.textContent =
                "Preparando búsqueda...";

            return;

        }


        /*
        Actualizamos los datos antes de buscar.
        */

        this.obtenerDatos();


        if (!this.datos.length) {

            label.textContent =
                "No hay datos disponibles.";

            return;

        }


        /*
        CONJUNTO DE BÚSQUEDA

        Por ahora, si "todos" está marcado,
        usamos todos los registros.

        Si no está marcado, usamos el conjunto
        activo si PALNAVEGADOR lo proporciona.
        */

        let conjunto =
            this.datos;


        if (!this.buscarTodos) {

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


        /*
        Seguridad:
        siempre trabajamos con un array.
        */

        if (!Array.isArray(conjunto)) {

            conjunto =
                [];

        }


        /*
        BUSCAR
        */

        const coincidencias =
            conjunto.filter(
                registro =>

                    this.coincide(
                        registro,
                        texto
                    )

            );


        /*
        RESULTADOS
        */

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
      OBTENER CONJUNTO ACTIVO
    ====================================================*/

    obtenerConjuntoActivo: function() {

        /*
        Si PALNAVEGADOR tiene conjuntoActivo,
        lo utilizamos.

        Si no existe, volvemos a todos los datos.
        */

        if (
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.conjuntoActivo ===
            "function"
        ) {

            try {

                const conjunto =
                    window.PALNAVEGADOR.conjuntoActivo();


                if (Array.isArray(conjunto)) {

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
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();

    },


    /*====================================================
      NORMALIZAR CÓDIGO
    ====================================================*/

    normalizarCodigo: function(valor) {

        if (
            valor === undefined ||
            valor === null
        ) {

            return "";

        }


        return String(valor)
            .trim()
            .toUpperCase();

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


        /*
        -----------------------------------------------
        CÓDIGO
        -----------------------------------------------
        */

        const codigo =
            this.normalizarCodigo(
                registro.codigo ||
                registro.j1
            );


        /*
        -----------------------------------------------
        NOMBRE
        -----------------------------------------------
        */

        const nombre =
            this.normalizarTexto(
                registro.nombre ||
                registro.j2
            );


        /*
        -----------------------------------------------
        CRONOLOGÍA
        -----------------------------------------------
        */

        const j3 =
            this.normalizarTexto(
                registro.j3
            );


        /*
        -----------------------------------------------
        TAXÓN
        -----------------------------------------------
        */

        const taxon =
            this.normalizarTexto(
                registro.taxon
            );


        /*
        -----------------------------------------------
        TEXTO BUSCADO
        -----------------------------------------------
        */

        const consulta =
            this.normalizarTexto(
                texto
            );


        /*
        -----------------------------------------------
        CÓDIGO

        Para evitar comportamientos extraños con
        consultas numéricas como 000, primero
        comprobamos el código directamente.

        -----------------------------------------------
        */

        if (
            codigo &&
            codigo.toLowerCase().includes(
                consulta
            )
        ) {

            return true;

        }


        /*
        -----------------------------------------------
        NOMBRE
        -----------------------------------------------
        */

        if (
            nombre &&
            nombre.includes(
                consulta
            )
        ) {

            return true;

        }


        /*
        -----------------------------------------------
        J3
        -----------------------------------------------
        */

        if (
            j3 &&
            j3.includes(
                consulta
            )
        ) {

            return true;

        }


        /*
        -----------------------------------------------
        TAXÓN
        -----------------------------------------------
        */

        if (
            taxon &&
            taxon.includes(
                consulta
            )
        ) {

            return true;

        }


        return false;

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


        if (!coincidencias.length) {

            const vacio =
                document.createElement(
                    "div"
                );


            vacio.className =
                "sinResultadosCab16";


            vacio.textContent =
                "No se encontraron coincidencias.";


            contenedor.appendChild(
                vacio
            );


            return;

        }


        coincidencias.forEach(
            registro => {

                if (!registro) {

                    return;

                }


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


                /*
                Por ahora el resultado solo se muestra.
                La carga mediante CARGACONT se hará
                en el siguiente paso.
                */


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

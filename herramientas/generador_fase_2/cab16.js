/*
========================================================
cab16.js v1.7
autocompletado del buscador avanzado
palentropía — generador

FUNCIÓN
-------
CAB16 BUSCADOR EXCLUSIVO POR CÓDIGO

CIRCUITO MATRIX
---------------
CHECK ACTIVADO
      ↓
CAB16
      ↓
MATRIXFILTRO
      ↓
MATRIXNAVEGADOR
      ↓
PALNAVEGADOR.aplicarFiltro()
      ↓
NAVEGACIÓN EXCLUSIVA POR EL SUBCONJUNTO

CHECK DESACTIVADO
      ↓
PALNAVEGADOR.limpiarFiltro()
      ↓
NAVEGACIÓN POR TODOS LOS REGISTROS

IMPORTANTE
----------
- La selección de una paleoficha conserva su posición.
- Con check activo, ◀ ▶ recorren solamente el subconjunto.
- Sin check, ◀ ▶ recorren todos los registros.
========================================================
*/


window.cab16 = {


    /*====================================================
      ESTADO
    ====================================================*/

    inicializado: false,

    datos: [],

    buscarTodos: false,

    ultimaConsulta: "",

    ultimaSeleccion: "",


    /*====================================================
      MATRIX
    ====================================================*/

    matrizJ1: [],

    matrizRegistros: [],


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        if(this.inicializado){

            return;

        }


        this.obtenerDatos();

        this.crearInterfaz();

        this.conectarCheck();

        this.conectarBusqueda();

        this.conectarCierre();


        this.inicializado = true;


        console.log(
            "cab16 v1.7: buscador por código preparado."
        );

    },


    /*====================================================
      OBTENER DATOS
    ====================================================*/

    obtenerDatos: function(){

        if(
            window.LEEPALJSON &&
            typeof window.LEEPALJSON.obtener ===
            "function"
        ){

            const datos =
                window.LEEPALJSON.obtener();


            if(Array.isArray(datos)){

                this.datos =
                    datos;

            }

        }


        if(
            (
                !Array.isArray(
                    this.datos
                ) ||
                !this.datos.length
            ) &&
            Array.isArray(
                window.PALEOFICHAS
            )
        ){

            this.datos =
                window.PALEOFICHAS;

        }


        return this.datos;

    },


    /*====================================================
      CREAR INTERFAZ
    ====================================================*/

    crearInterfaz: function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(!campo){

            return;

        }


        if(
            document.getElementById(
                "labelResultadosCab16"
            )
        ){

            return;

        }


        const label =
            document.createElement(
                "div"
            );


        label.id =
            "labelResultadosCab16";


        label.textContent =
            "Introduce al menos 3 caracteres";


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


        const resultados =
            document.createElement(
                "div"
            );


        resultados.id =
            "resultadosCab16";


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

    conectarCheck: function(){

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(!check){

            return;

        }


        check.addEventListener(
            "change",
            async () => {

                this.buscarTodos =
                    check.checked;


                if(
                    !this.buscarTodos
                ){

                    this.limpiarMatriz();

                    this.limpiarFiltroNavegador();

                    await this.ejecutarBusqueda();

                    return;

                }


                await this.ejecutarBusqueda();

            }
        );

    },


    /*====================================================
      CONECTAR BÚSQUEDA
    ====================================================*/

    conectarBusqueda: function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(!campo){

            return;

        }


        campo.addEventListener(
            "input",
            async () => {

                const texto =
                    campo.value
                        .trim();


                this.ultimaConsulta =
                    texto;


                await this.ejecutarBusqueda();

            }
        );

    },


    /*====================================================
      CONECTAR CIERRE
    ====================================================*/

    conectarCierre: function(){

        const botonCerrar =
            document.getElementById(
                "cerrarBuscadorUniversal"
            );


        if(!botonCerrar){

            return;

        }


        botonCerrar.addEventListener(
            "click",
            () => {

                const campo =
                    document.getElementById(
                        "buscarUniversal"
                    );


                if(!campo){

                    return;

                }


                const consulta =
                    campo.value
                        .trim();


                if(!consulta){

                    return;

                }


                this.ultimaConsulta =
                    consulta;


                const labelPrincipal =
                    document.getElementById(
                        "labelBusquedaUniversal"
                    );


                if(labelPrincipal){

                    labelPrincipal.textContent =
                        consulta;

                }

            }
        );

    },


    /*====================================================
      EJECUTAR BÚSQUEDA
    ====================================================*/

    ejecutarBusqueda: async function(){

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


        if(
            !campo ||
            !resultados ||
            !label
        ){

            return;

        }


        const texto =
            campo.value
                .trim()
                .toLowerCase();


        resultados.innerHTML =
            "";


        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";


            if(
                this.buscarTodos
            ){

                this.limpiarMatriz();

                this.limpiarFiltroNavegador();

            }


            return;

        }


        this.obtenerDatos();


        if(
            !Array.isArray(
                this.datos
            ) ||
            !this.datos.length
        ){

            label.textContent =
                "No hay datos disponibles.";

            return;

        }


        let conjunto =
            this.datos;


        if(
            !this.buscarTodos
        ){

            const activo =
                this.obtenerConjuntoActivo();


            if(
                Array.isArray(
                    activo
                ) &&
                activo.length
            ){

                conjunto =
                    activo;

            }

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


        if(
            this.buscarTodos
        ){

            await this.actualizarCircuitoMatrix(
                coincidencias
            );

        }

    },


    /*====================================================
      OBTENER CONJUNTO ACTIVO
    ====================================================*/

    obtenerConjuntoActivo: function(){

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.conjuntoActivo ===
            "function"
        ){

            const conjunto =
                window.PALNAVEGADOR.conjuntoActivo();


            if(
                Array.isArray(
                    conjunto
                )
            ){

                return conjunto;

            }

        }


        return this.datos;

    },


    /*====================================================
      COINCIDENCIA
    ====================================================*/

    coincide: function(
        registro,
        texto
    ){

        if(!registro){

            return false;

        }


        const codigo =
            String(
                registro.codigo || ""
            )
            .trim()
            .toLowerCase();


        if(!codigo){

            return false;

        }


        return codigo.includes(
            texto
        );

    },


    /*====================================================
      ACTUALIZAR CIRCUITO MATRIX
    ====================================================*/

    actualizarCircuitoMatrix: async function(
        coincidencias
    ){

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            console.warn(
                "cab16: MATRIXFILTRO no está disponible."
            );

            return;

        }


        let matrizJ1;


        try{

            matrizJ1 =
                window.MATRIXFILTRO.actualizar(
                    coincidencias
                );

        }
        catch(error){

            console.error(
                "cab16: error en MATRIXFILTRO.",
                error
            );

            return;

        }


        if(
            !Array.isArray(
                matrizJ1
            )
        ){

            console.warn(
                "cab16: MATRIXFILTRO no devolvió una matriz válida."
            );

            return;

        }


        this.matrizJ1 =
            matrizJ1.slice();


        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener !==
            "function"
        ){

            console.warn(
                "cab16: MatrixNavegador no está disponible."
            );

            return;

        }


        let registros;


        try{

            registros =
                await window.MatrixNavegador.obtener(
                    this.matrizJ1
                );

        }
        catch(error){

            console.error(
                "cab16: error en MatrixNavegador.",
                error
            );

            this.matrizRegistros =
                [];

            return;

        }


        this.matrizRegistros =
            Array.isArray(
                registros
            )
                ? registros
                : [];


        /*
        La parte 2 continúa aquí.
        */
elemento.style.display =
                    "none";

                elemento.classList.remove(
                    "activo"
                );

                elemento.classList.remove(
                    "visible"
                );

            }

        }

    },


    /*====================================================
      CARGAR PALEOFICHA
    ====================================================*/

    cargarPaleoficha: async function(
        codigo
    ){

        /*
        PALNAVEGADOR es el sistema responsable
        de la navegación de las Paleofichas.
        */

        if(
            window.PALNAVEGADOR
        ){

            /*------------------------------------------
              MÉTODO 1
            ------------------------------------------*/

            if(
                typeof window.PALNAVEGADOR.cargar ===
                "function"
            ){

                try{

                    await window.PALNAVEGADOR.cargar(
                        codigo
                    );

                    return;

                }
                catch(error){

                    console.warn(
                        "cab16: PALNAVEGADOR.cargar falló.",
                        error
                    );

                }

            }


            /*------------------------------------------
              MÉTODO 2
            ------------------------------------------*/

            if(
                typeof window.PALNAVEGADOR.irA ===
                "function"
            ){

                try{

                    await window.PALNAVEGADOR.irA(
                        codigo
                    );

                    return;

                }
                catch(error){

                    console.warn(
                        "cab16: PALNAVEGADOR.irA falló.",
                        error
                    );

                }

            }


            /*------------------------------------------
              MÉTODO 3
            ------------------------------------------*/

            if(
                typeof window.PALNAVEGADOR.cargarPorCodigo ===
                "function"
            ){

                try{

                    await window.PALNAVEGADOR.cargarPorCodigo(
                        codigo
                    );

                    return;

                }
                catch(error){

                    console.warn(
                        "cab16: PALNAVEGADOR.cargarPorCodigo falló.",
                        error
                    );

                }

            }

        }


        /*
        Si no existe un método compatible,
        no inventamos una ruta ni modificamos
        otros módulos.
        */

        console.warn(
            "cab16: no se encontró un método de carga compatible para",
            codigo
        );

    },


    /*====================================================
      LIMPIAR MATRIZ
    ====================================================*/

    limpiarMatriz: function(){

        this.matrizJ1 =
            [];

        this.matrizRegistros =
            [];


        /*
        Limpiamos también MATRIXNAVEGADOR
        si está disponible.
        */

        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar ===
            "function"
        ){

            window.MatrixNavegador.limpiar();

        }


        console.log(
            "cab16: circuito Matrix limpiado."
        );

    },


    /*====================================================
      OBTENER MATRIZ J1 ACTUAL
    ====================================================*/

    obtenerMatrizJ1: function(){

        return this.matrizJ1;

    },


    /*====================================================
      OBTENER MATRIZ DE REGISTROS ACTUAL
    ====================================================*/

    obtenerMatrizRegistros: function(){

        return this.matrizRegistros;

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        window.cab16.inicializar();

    }
);


/*
========================================================
FIN cab16.js v1.6
========================================================
*/

    

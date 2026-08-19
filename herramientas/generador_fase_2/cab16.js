/*
========================================================
cab16.js v1.6
autocompletado del buscador avanzado
palentropía — generador

FUNCIÓN
------------
CAB16 BUSCADOR EXCLUSIVO POR CÓDIGO

CAMBIOS v1.6
------------
- Búsqueda únicamente por código.
- Resultados mostrados en lista vertical.
- Cada resultado ocupa una fila completa.
- La fila completa es seleccionable.
- Al seleccionar un código:
    1. se cierra el buscador;
    2. se carga inmediatamente la paleoficha;
    3. se actualiza el label principal.

NUEVO — MATRIX
--------------
- Cuando está activo "Buscar en todos los registros":
    1. CAB16 obtiene los resultados.
    2. Extrae exclusivamente sus códigos J1.
    3. Envía esos J1 a MATRIXFILTRO.
    4. MATRIXFILTRO los entrega a MATRIXNAVEGADOR.
    5. MATRIXNAVEGADOR recupera los registros completos
       de master.csv.
- La matriz paralela queda almacenada para el siguiente paso.
- PALNAVEGADOR todavía NO se modifica.

IMPORTANTE
----------
La consulta NO modifica el label mientras se escribe.

El label principal solo cambia:
- al seleccionar un resultado;
- al cerrar el buscador después de introducir
  una consulta sin seleccionar resultado.

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

    ultimaConsulta: "",

    ultimaSeleccion: "",


    /*
    ====================================================
    MATRIX
    ====================================================
    */

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
            "cab16 v1.6: buscador por código preparado."
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
            () => {

                this.buscarTodos =
                    check.checked;


                /*
                Si se desactiva el check,
                eliminamos el circuito paralelo.
                */

                if(
                    !this.buscarTodos
                ){

                    this.limpiarMatriz();

                }


                this.ejecutarBusqueda();

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
            () => {

                const texto =
                    campo.value
                        .trim();


                this.ultimaConsulta =
                    texto;


                this.ejecutarBusqueda();

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

    ejecutarBusqueda: function(){

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


        /*------------------------------------------------
          MÍNIMO 3 CARACTERES
        ------------------------------------------------*/

        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";


            if(
                this.buscarTodos
            ){

                this.limpiarMatriz();

            }


            return;

        }


        /*------------------------------------------------
          ACTUALIZAR DATOS
        ------------------------------------------------*/

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


        /*------------------------------------------------
          CONJUNTO DE BÚSQUEDA
        ------------------------------------------------*/

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


        /*------------------------------------------------
          BUSCAR SOLO POR CÓDIGO
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
          MOSTRAR RESULTADOS
        ------------------------------------------------*/

        this.mostrarResultados(
            coincidencias
        );


        /*------------------------------------------------
          MATRIXFILTRO → MATRIXNAVEGADOR
        ------------------------------------------------*/

        if(
            this.buscarTodos
        ){

            this.actualizarCircuitoMatrix(
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
      SOLO CÓDIGO
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

        /*
        MATRIXFILTRO recibe únicamente los J1
        de los resultados que CAB16 está mostrando.
        */

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


        const matrizJ1 =
            window.MATRIXFILTRO.actualizar(
                coincidencias
            );


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


        /*
        Guardamos la matriz de J1.
        */

        this.matrizJ1 =
            matrizJ1.slice();


        console.log(
            "cab16 → MATRIXFILTRO:",
            this.matrizJ1
        );


        /*
        MATRIXNAVEGADOR recibe los J1
        y devuelve los registros completos.
        */

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


        try{

            const registros =
                await window.MatrixNavegador.obtener(
                    this.matrizJ1
                );


            this.matrizRegistros =
                Array.isArray(
                    registros
                )
                    ? registros
                    : [];


            console.log(
                "cab16 → MATRIXNAVEGADOR:",
                this.matrizRegistros
            );


        }
        catch(error){

            console.error(
                "cab16: error al obtener MatrixNavegador.",
                error
            );


            this.matrizRegistros =
                [];

        }

    },


    /*====================================================
      MOSTRAR RESULTADOS
    ====================================================*/

    mostrarResultados: function(
        coincidencias
    ){

        const contenedor =
            document.getElementById(
                "resultadosCab16"
            );


        if(!contenedor){

            return;

        }


        coincidencias.forEach(
            registro => {

                const codigo =
                    String(
                        registro.codigo || ""
                    )
                    .trim();


                if(!codigo){

                    return;

                }


                /*----------------------------------------
                  FILA COMPLETA
                ----------------------------------------*/

                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    codigo;


                fila.textContent =
                    codigo;


                /*----------------------------------------
                  SELECCIÓN
                ----------------------------------------*/

                fila.addEventListener(
                    "click",
                    () => {

                        this.seleccionarCodigo(
                            codigo
                        );

                    }
                );


                contenedor.appendChild(
                    fila
                );

            }
        );

    },


    /*====================================================
      SELECCIONAR CÓDIGO
    ====================================================*/

    seleccionarCodigo: function(
        codigo
    ){

        codigo =
            String(
                codigo || ""
            )
            .trim()
            .toUpperCase();


        if(!codigo){

            return;

        }


        console.log(
            "cab16: código seleccionado:",
            codigo
        );


        /*
        Registramos selección real.
        */

        this.ultimaSeleccion =
            codigo;


        this.ultimaConsulta =
            codigo;


        /*----------------------------------------------
          ESCRIBIR CÓDIGO EN EL CAMPO
        ----------------------------------------------*/

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(campo){

            campo.value =
                codigo;

        }


        /*----------------------------------------------
          ACTUALIZAR LABEL PRINCIPAL
        ----------------------------------------------*/

        const labelPrincipal =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(labelPrincipal){

            labelPrincipal.textContent =
                codigo;

        }


        /*----------------------------------------------
          CERRAR BUSCADOR
        ----------------------------------------------*/

        this.cerrarBuscador();


        /*----------------------------------------------
          CARGAR PALEOFICHA
        ----------------------------------------------*/

        this.cargarPaleoficha(
            codigo
        );

    },


    /*====================================================
      CERRAR BUSCADOR
    ====================================================*/

    cerrarBuscador: function(){

        /*
        Buscamos primero las funciones conocidas
        del sistema actual.
        */

        if(
            window.PALBUSCADOR
        ){

            if(
                typeof window.PALBUSCADOR.cerrar ===
                "function"
            ){

                window.PALBUSCADOR.cerrar();

                return;

            }


            if(
                typeof window.PALBUSCADOR.cerrarBusqueda ===
                "function"
            ){

                window.PALBUSCADOR.cerrarBusqueda();

                return;

            }

        }


        /*
        Respaldo visual.
        */

        const posibles = [

            "lightboxBuscador",

            "buscadorLightbox",

            "lightboxBusqueda",

            "modalBuscador"

        ];


        for(
            const id of posibles
        ){

            const elemento =
                document.getElementById(
                    id
                );


            if(elemento){

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
        PALNAVEGADOR sigue siendo el responsable
        de cargar la paleoficha.
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

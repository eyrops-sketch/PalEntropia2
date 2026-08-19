/*
========================================================
cab16.js v1.5.1
autocompletado del buscador avanzado
PalEntropía — generador

BASE
----
Esta versión parte directamente de CAB16 v1.5.

NUEVO
-----
Cuando "Buscar en todos los registros" está activado:

CAB16
  ↓
MATRIXFILTRO
  ↓
MATRIXNAVEGADOR

La búsqueda normal permanece intacta.

NO MODIFICA:
- palnavegador
- palbuscador
- cab15
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
            "cab16 v1.5.1: buscador por código preparado."
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
                Al desactivar el check
                limpiamos solamente la matriz.
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


                /*
                Mantenemos exactamente
                el comportamiento de v1.5.
                */

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


        /*
        IMPORTANTE:

        El circuito Matrix se ejecuta DESPUÉS
        de que la búsqueda normal ya haya funcionado.

        No modifica la interfaz.
        */

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
        Si MATRIXFILTRO todavía no está disponible,
        NO rompemos CAB16.
        */

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

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

            console.warn(
                "cab16: MATRIXFILTRO no disponible:",
                error
            );

            return;

        }


        if(
            !Array.isArray(
                matrizJ1
            )
        ){

            return;

        }


        this.matrizJ1 =
            matrizJ1.slice();


        /*
        MATRIXNAVEGADOR
        */

        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener !==
            "function"
        ){

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

        }
        catch(error){

            console.warn(
                "cab16: MatrixNavegador no disponible:",
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


        this.ultimaSeleccion =
            codigo;


        this.ultimaConsulta =
            codigo;


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(campo){

            campo.value =
                codigo;

        }


        const labelPrincipal =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(labelPrincipal){

            labelPrincipal.textContent =
                codigo;

        }


        this.cerrarBuscador();


        this.cargarPaleoficha(
            codigo
        );

    },


    /*====================================================
      CERRAR BUSCADOR
    ====================================================*/

    cerrarBuscador: function(){

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


        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar ===
            "function"
        ){

            window.MatrixNavegador.limpiar();

        }

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
FIN cab16.js v1.5.1
========================================================
*/
    

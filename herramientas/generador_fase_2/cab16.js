/*
========================================================
PalEntropía
cab16.js v2.1

BUSCADOR AVANZADO POR CÓDIGO

LÓGICA DEL CHECK
----------------
☐ Check desactivado
    → todos los registros.

☑ Check activado
    → la consulta crea un rango de navegación.

PRIORIDAD DE SELECCIÓN
----------------------
1. Si existe una ficha seleccionada y pertenece
   al nuevo filtro → SE CONSERVA.

2. Si no existe selección válida dentro del filtro
   → se selecciona el PRIMER registro del filtro.

3. La selección manual del usuario siempre tiene
   prioridad.

========================================================
*/


window.cab16 = {

    inicializado: false,

    datos: [],

    buscarTodos: false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        if(this.inicializado){

            return;

        }


        this.obtenerDatos();

        this.crearInterfaz();

        this.conectar();


        this.inicializado = true;

    },


    /*====================================================
      DATOS
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


        return this.datos;

    },


    /*====================================================
      INTERFAZ
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


        const checkLabel =
            document.createElement(
                "label"
            );


        checkLabel.id =
            "checkBusquedaCab16";


        const check =
            document.createElement(
                "input"
            );


        check.type =
            "checkbox";


        check.id =
            "buscarTodosCab16";


        const texto =
            document.createElement(
                "span"
            );


        texto.textContent =
            "Mostrar seleccionado/Consulta completa";


        checkLabel.appendChild(
            check
        );


        checkLabel.appendChild(
            texto
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
            checkLabel
        );


        checkLabel.insertAdjacentElement(
            "afterend",
            resultados
        );

    },


    /*====================================================
      EVENTOS
    ====================================================*/

    conectar: function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        const cerrar =
            document.getElementById(
                "cerrarBuscadorUniversal"
            );


        /*------------------------------------------------
          CONSULTA
        ------------------------------------------------*/

        if(campo){

            campo.addEventListener(
                "input",
                () => {

                    this.buscar();

                }
            );

        }


        /*------------------------------------------------
          CHECK
        ------------------------------------------------*/

        if(check){

            check.addEventListener(
                "change",
                async () => {

                    this.buscarTodos =
                        check.checked;


                    /*
                    DESACTIVADO
                    */

                    if(
                        !this.buscarTodos
                    ){

                        this.limpiarFiltro();

                        await this.buscar();

                        return;

                    }


                    /*
                    ACTIVADO
                    */

                    await this.buscar();

                }
            );

        }


        /*------------------------------------------------
          CERRAR
        ------------------------------------------------*/

        if(cerrar){

            cerrar.addEventListener(
                "click",
                () => {

                    const texto =
                        campo
                            ? campo.value.trim()
                            : "";


                    if(!texto){

                        return;

                    }


                    const label =
                        document.getElementById(
                            "labelBusquedaUniversal"
                        );


                    if(label){

                        label.textContent =
                            texto;

                    }

                }
            );

        }

    },


    /*====================================================
      BUSCAR
    ====================================================*/

    buscar: async function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        const label =
            document.getElementById(
                "labelResultadosCab16"
            );


        const resultados =
            document.getElementById(
                "resultadosCab16"
            );


        if(
            !campo ||
            !label ||
            !resultados
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
          MÍNIMO
        ------------------------------------------------*/

        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";


            if(
                this.buscarTodos
            ){

                this.limpiarFiltro();

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


        /*
        LA BÚSQUEDA SIEMPRE SE HACE
        SOBRE TODOS LOS REGISTROS.
        */

        const coincidencias =
            this.datos.filter(
                registro => {

                    if(!registro){

                        return false;

                    }


                    const codigo =
                        String(
                            registro.codigo || ""
                        )
                        .trim()
                        .toLowerCase();


                    return codigo.includes(
                        texto
                    );

                }
            );


        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        this.mostrar(
            coincidencias
        );


        /*
        SOLO EL CHECK ACTIVADO CREA
        EL RANGO DE NAVEGACIÓN.
        */

        if(
            this.buscarTodos
        ){

            await this.aplicarMatrix(
                coincidencias
            );

        }

    },


    /*====================================================
      APLICAR MATRIX
    ====================================================*/

    aplicarMatrix: async function(
        coincidencias
    ){

        if(
            !Array.isArray(
                coincidencias
            ) ||
            !coincidencias.length
        ){

            this.limpiarFiltro();

            return;

        }


        /*------------------------------------------------
          GUARDAR SELECCIÓN ACTUAL
          ANTES DE CAMBIAR EL FILTRO
        ------------------------------------------------*/

        let codigoSeleccionado =
            null;


        if(
            window.PALNAVEGADOR
        ){

            codigoSeleccionado =
                window.PALNAVEGADOR.codigoActual;

        }


        /*------------------------------------------------
          MATRIXFILTRO
        ------------------------------------------------*/

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            return;

        }


        const matrizJ1 =
            window.MATRIXFILTRO.actualizar(
                coincidencias
            );


        if(
            !Array.isArray(
                matrizJ1
            ) ||
            !matrizJ1.length
        ){

            return;

        }


        /*------------------------------------------------
          MATRIXNAVEGADOR
        ------------------------------------------------*/

        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener !==
            "function"
        ){

            return;

        }


        let registros;


        try{

            registros =
                await window.MatrixNavegador.obtener(
                    matrizJ1
                );

        }
        catch(error){

            console.warn(
                "cab16: error en MatrixNavegador.",
                error
            );

            return;

        }


        if(
            !Array.isArray(
                registros
            ) ||
            !registros.length
        ){

            return;

        }


        /*------------------------------------------------
          APLICAR FILTRO
        ------------------------------------------------*/

        if(
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.aplicarFiltro !==
            "function"
        ){

            return;

        }


        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        /*
        A partir de aquí decidimos qué ficha
        debe quedar activa.
        */

        await this.resolverSeleccion(
            codigoSeleccionado,
            registros
        );

    },

   /*====================================================
      RESOLVER SELECCIÓN
    ====================================================*/

    resolverSeleccion: async function(
        codigoSeleccionado,
        registros
    ){

        /*
        Comprobamos si la selección anterior
        sigue perteneciendo al nuevo filtro.
        */

        let seleccionValida =
            false;


        if(
            codigoSeleccionado &&
            Array.isArray(registros)
        ){

            const codigo =
                String(
                    codigoSeleccionado
                )
                .trim()
                .toUpperCase();


            seleccionValida =
                registros.some(
                    registro =>
                        String(
                            registro.codigo || ""
                        )
                        .trim()
                        .toUpperCase() ===
                        codigo
                );

        }


        /*
        ==================================================
        CASO 1
        ==================================================

        La selección anterior sigue dentro
        del filtro.

        → SE CONSERVA.
        */

        if(
            seleccionValida
        ){

            if(
                window.PALNAVEGADOR &&
                typeof window.PALNAVEGADOR.cargarPorCodigo ===
                "function"
            ){

                await window.PALNAVEGADOR.cargarPorCodigo(
                    codigoSeleccionado
                );

            }


            return;

        }


        /*
        ==================================================
        CASO 2
        ==================================================

        No existe selección válida.

        → PRIMER REGISTRO DEL FILTRO.
        */

        await this.cargarPrimerFiltrado(
            registros
        );

    },


    /*====================================================
      CARGAR PRIMER FILTRADO
    ====================================================*/

    cargarPrimerFiltrado: async function(
        registros
    ){

        if(
            !Array.isArray(
                registros
            ) ||
            !registros.length
        ){

            return;

        }


        const primero =
            registros[0];


        if(
            !primero ||
            !primero.codigo
        ){

            return;

        }


        const codigo =
            String(
                primero.codigo
            )
            .trim()
            .toUpperCase();


        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.posicionar ===
            "function"
        ){

            await window.PALNAVEGADOR.posicionar(
                codigo
            );

        }


        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.cargarIndice ===
            "function"
        ){

            await window.PALNAVEGADOR.cargarIndice(
                0
            );

        }

    },


    /*====================================================
      MOSTRAR
    ====================================================*/

    mostrar: function(
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

                if(!registro){

                    return;

                }


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

                        this.seleccionar(
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
      SELECCIONAR
    ====================================================*/

    seleccionar: async function(
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


        /*
        La selección del usuario siempre
        tiene prioridad.
        */

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.posicionar ===
            "function"
        ){

            const situado =
                await window.PALNAVEGADOR.posicionar(
                    codigo
                );


            if(!situado){

                return;

            }

        }


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(campo){

            campo.value =
                codigo;

        }


        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(label){

            label.textContent =
                codigo;

        }


        this.cerrar();


        /*
        Cargamos exactamente la selección.
        */

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.cargarIndice ===
            "function"
        ){

            await window.PALNAVEGADOR.cargarIndice(
                window.PALNAVEGADOR.indice
            );

        }

    },


    /*====================================================
      CERRAR
    ====================================================*/

    cerrar: function(){

        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.cerrar ===
            "function"
        ){

            window.PALBUSCADOR.cerrar();

            return;

        }


        const ids = [

            "lightboxBuscador",
            "buscadorLightbox",
            "lightboxBusqueda",
            "modalBuscador"

        ];


        ids.forEach(
            id => {

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
        );

    },


    /*====================================================
      LIMPIAR FILTRO
    ====================================================*/

    limpiarFiltro: function(){

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.limpiarFiltro ===
            "function"
        ){

            window.PALNAVEGADOR.limpiarFiltro();

        }


        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar ===
            "function"
        ){

            window.MatrixNavegador.limpiar();

        }

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
FIN cab16.js v2.1
========================================================
*/ 

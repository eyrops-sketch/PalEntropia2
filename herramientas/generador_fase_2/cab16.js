/*
========================================================
PalEntropía
cab16.js v2.2

BUSCADOR AVANZADO POR CÓDIGO

LÓGICA
------
☐ Check desactivado
    → TODOS los registros.

☑ Check activado
    → la consulta crea el rango activo.

SELECCIÓN
---------
La selección actual es independiente del rango.

- Si la selección sigue dentro del nuevo rango:
      se conserva.

- Si no hay selección válida:
      se carga el primer registro del rango.

CONTROL DE CONSULTAS
--------------------
Cada búsqueda recibe un número de operación.

Una respuesta antigua de MATRIXNAVEGADOR
NO puede sobrescribir una consulta posterior.
========================================================
*/


window.cab16 = {

    inicializado: false,

    datos: [],

    buscarTodos: false,

    /*
    Código actualmente seleccionado.
    */

    codigoSeleccionado: null,

    /*
    Número de operación de búsqueda.
    */

    operacionBusqueda: 0,


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


        console.log(
            "cab16 v2.2: buscador avanzado preparado."
        );

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
                    Nueva operación.
                    */

                    this.operacionBusqueda++;


                    /*
                    DESACTIVADO
                    → TODOS LOS REGISTROS.
                    */

                    if(
                        !this.buscarTodos
                    ){

                        this.limpiarFiltro();

                    }


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
      OBTENER SELECCIÓN ACTUAL
    ====================================================*/

    obtenerCodigoSeleccionado: function(){

        /*
        Primero utilizamos nuestro estado.
        */

        if(
            this.codigoSeleccionado
        ){

            return String(
                this.codigoSeleccionado
            )
            .trim()
            .toUpperCase();

        }


        /*
        Si todavía no existe,
        intentamos recuperar PALNAVEGADOR.
        */

        if(
            window.PALNAVEGADOR &&
            window.PALNAVEGADOR.codigoActual
        ){

            return String(
                window.PALNAVEGADOR.codigoActual
            )
            .trim()
            .toUpperCase();

        }


        return null;

    },


    /*====================================================
      BUSCAR
    ====================================================*/

    buscar: async function(){

        const operacion =
            ++this.operacionBusqueda;


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
        La búsqueda se hace SIEMPRE
        sobre todos los registros.
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


        /*
        Si mientras calculábamos la búsqueda
        comenzó otra operación, abandonamos.
        */

        if(
            operacion !==
            this.operacionBusqueda
        ){

            return;

        }


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
        CHECK ACTIVADO
        → crear rango.
        */

        if(
            this.buscarTodos
        ){

            await this.aplicarMatrix(
                coincidencias,
                operacion
            );

        }

    },


    /*====================================================
      APLICAR MATRIX
    ====================================================*/

    aplicarMatrix: async function(
        coincidencias,
        operacion
    ){

        if(
            operacion !==
            this.operacionBusqueda
        ){

            return;

        }


        if(
            !Array.isArray(
                coincidencias
            ) ||
            !coincidencias.length
        ){

            this.limpiarFiltro();

            return;

        }


        /*
        Guardamos la selección ANTES
        de modificar el filtro.
        */

        const codigoSeleccionado =
            this.obtenerCodigoSeleccionado();


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
            operacion !==
            this.operacionBusqueda
        ){

            return;

        }


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


        /*
        MUY IMPORTANTE:

        Puede haber terminado una consulta
        posterior mientras esperábamos.

        En ese caso esta respuesta es vieja.
        */

        if(
            operacion !==
            this.operacionBusqueda
        ){

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


        /*
        Solo ahora aplicamos el filtro.
        */

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
        Resolvemos la selección DESPUÉS
        de aplicar el filtro.
        */

        await this.resolverSeleccion(
            codigoSeleccionado,
            registros,
            operacion
        );

    },

    /*====================================================
      RESOLVER SELECCIÓN
    ====================================================*/

    resolverSeleccion: async function(
        codigoSeleccionado,
        registros,
        operacion
    ){

        if(
            operacion !==
            this.operacionBusqueda
        ){

            return;

        }


        let seleccionValida =
            false;


        /*
        Comprobar si la selección actual
        sigue dentro del filtro.
        */

        if(
            codigoSeleccionado &&
            Array.isArray(
                registros
            )
        ){

            const codigo =
                String(
                    codigoSeleccionado
                )
                .trim()
                .toUpperCase();


            seleccionValida =
                registros.some(
                    registro => {

                        const actual =
                            String(
                                registro.codigo || ""
                            )
                            .trim()
                            .toUpperCase();


                        return actual ===
                            codigo;

                    }
                );

        }


        /*
        ==================================================
        SELECCIÓN VÁLIDA
        ==================================================

        Se conserva exactamente.
        */

        if(
            seleccionValida
        ){

            this.codigoSeleccionado =
                String(
                    codigoSeleccionado
                )
                .trim()
                .toUpperCase();


            await this.cargarCodigo(
                this.codigoSeleccionado
            );


            return;

        }


        /*
        ==================================================
        SIN SELECCIÓN VÁLIDA
        ==================================================

        → primer registro del filtro.
        */

        await this.cargarPrimerFiltrado(
            registros,
            operacion
        );

    },


    /*====================================================
      CARGAR PRIMER FILTRADO
    ====================================================*/

    cargarPrimerFiltrado: async function(
        registros,
        operacion
    ){

        if(
            operacion !==
            this.operacionBusqueda
        ){

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


        this.codigoSeleccionado =
            codigo;


        await this.cargarCodigo(
            codigo
        );

    },


    /*====================================================
      CARGAR CÓDIGO
    ====================================================*/

    cargarCodigo: async function(
        codigo
    ){

        if(
            !codigo ||
            !window.PALNAVEGADOR
        ){

            return;

        }


        /*
        Posicionamos primero.
        */

        if(
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


        /*
        Cargamos exactamente esa ficha.
        */

        if(
            typeof window.PALNAVEGADOR.cargarIndice ===
            "function"
        ){

            await window.PALNAVEGADOR.cargarIndice(
                window.PALNAVEGADOR.indice
            );

        }

    },


    /*====================================================
      MOSTRAR RESULTADOS
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
        La selección manual tiene
        máxima prioridad.
        */

        this.codigoSeleccionado =
            codigo;


        /*
        Invalidamos cualquier consulta
        pendiente anterior.
        */

        this.operacionBusqueda++;


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


        /*
        Cerrar.
        */

        this.cerrar();


        /*
        Cargar selección exacta.
        */

        await this.cargarCodigo(
            codigo
        );

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
FIN cab16.js v2.2
========================================================
*/

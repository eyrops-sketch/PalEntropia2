/*
========================================================
PalEntropía
cab17.js v1.5 COMPACTA

FILTRO AVANZADO POR NOMBRE — J2

J1 → CAB16
J2 → CAB17

LEEPALJSON:
    codigo
    nombre
    j3
    dieta
    anatomia

REGLA:
- Consultas numéricas → CAB16
- Consultas de nombre → CAB17
- Mínimo 3 caracteres para J2

INTERFAZ:
- misma interfaz de CAB16
- mismo check
- misma X

NO MODIFICA:
- CAB16
- MATRIXFILTRO
- MatrixNavegador
- PALNAVEGADOR
========================================================
*/

window.cab17 = {

    inicializado:false,

    datos:[],

    buscarTodos:false,

    seleccionRealizada:false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar:function(){

        if(this.inicializado){

            return;

        }


        this.obtenerDatos();

        this.esperarInterfaz();

    },


    /*====================================================
      ESPERAR INTERFAZ
    ====================================================*/

    esperarInterfaz:function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );

        const resultados =
            document.getElementById(
                "resultadosCab16"
            );

        const cerrar =
            document.getElementById(
                "cerrarBuscadorUniversal"
            );


        if(
            !campo ||
            !check ||
            !resultados ||
            !cerrar
        ){

            setTimeout(
                () => this.esperarInterfaz(),
                100
            );

            return;

        }


        this.conectar();

        this.inicializado =
            true;


        console.log(
            "cab17 v1.5: filtro J2 preparado."
        );

    },


    /*====================================================
      DATOS
    ====================================================*/

    obtenerDatos:function(){

        if(
            window.LEEPALJSON &&
            typeof window.LEEPALJSON.obtener ===
            "function"
        ){

            const datos =
                window.LEEPALJSON.obtener();


            if(
                Array.isArray(datos)
            ){

                this.datos =
                    datos;

            }

        }


        return this.datos;

    },


    /*====================================================
      NORMALIZAR
    ====================================================*/

    normalizar:function(texto){

        return String(
            texto || ""
        )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

    },


    /*====================================================
      DETECTAR CONSULTA J1
    ====================================================*/

    esJ1:function(texto){

        return /^\d{3}(?:_\d{0,2})?$/i.test(
            String(
                texto || ""
            ).trim()
        );

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar:function(){

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
          INPUT
        ------------------------------------------------*/

        campo.addEventListener(
            "input",
            () => {

                const texto =
                    campo.value.trim();


                /*
                Si es J1, CAB17 no interviene.
                */

                if(
                    this.esJ1(texto)
                ){

                    return;

                }


                const consulta =
                    this.normalizar(
                        texto
                    );


                if(
                    consulta.length < 3
                ){

                    this.seleccionRealizada =
                        false;

                    return;

                }


                this.seleccionRealizada =
                    false;


                this.buscar();

            }
        );


        /*------------------------------------------------
          CHECK
        ------------------------------------------------*/

        check.addEventListener(
            "change",
            async () => {

                this.buscarTodos =
                    check.checked;


                const texto =
                    campo.value.trim();


                /*
                J1 pertenece exclusivamente
                a CAB16.
                */

                if(
                    this.esJ1(texto)
                ){

                    return;

                }


                if(
                    !this.buscarTodos
                ){

                    this.limpiarFiltro();

                }


                const consulta =
                    this.normalizar(
                        texto
                    );


                if(
                    consulta.length >= 3
                ){

                    this.seleccionRealizada =
                        false;

                    await this.buscar();

                }

            }
        );


        /*------------------------------------------------
          CERRAR
        ------------------------------------------------*/

        cerrar.addEventListener(
            "click",
            async () => {

                const texto =
                    campo.value.trim();


                /*
                J1 pertenece a CAB16.
                */

                if(
                    this.esJ1(texto)
                ){

                    return;

                }


                const consulta =
                    this.normalizar(
                        texto
                    );


                /*
                J2 + check +
                sin selección:
                cargar primer resultado.
                */

                if(
                    this.buscarTodos &&
                    !this.seleccionRealizada &&
                    consulta.length >= 3
                ){

                    await this.cargarPrimero();

                }

            }
        );

    },


    /*====================================================
      BUSCAR J2
    ====================================================*/

    buscar:async function(){

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
            this.normalizar(
                campo.value
            );


        /*
        Nunca procesar J1.
        */

        if(
            this.esJ1(texto)
        ){

            return;

        }


        if(
            texto.length < 3
        ){

            return;

        }


        this.obtenerDatos();


        resultados.innerHTML =
            "";


        const coincidencias =
            this.datos.filter(
                registro => {

                    if(!registro){

                        return false;

                    }


                    const nombre =
                        this.normalizar(
                            registro.nombre
                        );


                    return nombre.includes(
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


        if(
            this.buscarTodos
        ){

            await this.aplicarMatrix(
                coincidencias
            );

        }

    },

    /*====================================================
  MOSTRAR RESULTADOS
====================================================*/

    mostrar:function(coincidencias){

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
                    ).trim();


                const nombre =
                    String(
                        registro.nombre || ""
                    ).trim();


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
                    nombre
                        ? nombre +
                          " — " +
                          codigo
                        : codigo;


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

    seleccionar:async function(codigo){

        codigo =
            String(
                codigo || ""
            )
            .trim()
            .toUpperCase();


        if(!codigo){

            return;

        }


        this.seleccionRealizada =
            true;


        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(label){

            label.textContent =
                codigo;

        }


        this.cerrar();


        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.cargarPorCodigo ===
            "function"
        ){

            await window.PALNAVEGADOR.cargarPorCodigo(
                codigo
            );

        }

    },


/*====================================================
  APLICAR MATRIX
====================================================*/

    aplicarMatrix:async function(
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


        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            console.warn(
                "cab17: MATRIXFILTRO no disponible."
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
            ) ||
            !matrizJ1.length
        ){

            return;

        }


        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener !==
            "function"
        ){

            console.warn(
                "cab17: MatrixNavegador no disponible."
            );

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

            console.error(
                "cab17: error MatrixNavegador:",
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


        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.aplicarFiltro ===
            "function"
        ){

            window.PALNAVEGADOR.aplicarFiltro(
                registros
            );

        }

    },


/*====================================================
  CARGAR PRIMERO
====================================================*/

    cargarPrimero:async function(){

        if(
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.conjuntoActivo !==
            "function"
        ){

            return;

        }


        const conjunto =
            window.PALNAVEGADOR.conjuntoActivo();


        if(
            !Array.isArray(
                conjunto
            ) ||
            !conjunto.length
        ){

            return;

        }


        const primero =
            conjunto[0];


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


        await window.PALNAVEGADOR.cargarPorCodigo(
            codigo
        );

    },


/*====================================================
  CERRAR
====================================================*/

    cerrar:function(){

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

    limpiarFiltro:function(){

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

        window.cab17.inicializar();

    }
);


/*
========================================================
FIN cab17.js v1.5 COMPACTA
========================================================
*/

/*
========================================================
PalEntropía
cab17.js v1.6 COMPACTA

FILTRO AVANZADO POR NOMBRE — J2

J1 → CAB16
J2 → CAB17

CARACTERÍSTICAS
---------------
- Mínimo 3 caracteres.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Ignora espacios exteriores.
- Consulta parcial por nombre.
- Usa la interfaz existente de CAB16.
- Usa el mismo check.
- Usa MATRIXFILTRO.
- Usa MatrixNavegador.
- Usa PALNAVEGADOR.

NO MODIFICA CAB16.
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


        this.buscarTodos =
            check.checked;


        this.conectar();


        this.inicializado =
            true;


        console.log(
            "cab17 v1.6: filtro J2 preparado."
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
      DETECTAR J1
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

          CAPTURE = true

          Permite que CAB17 tome el control de
          las consultas J2 antes de CAB16.
        ------------------------------------------------*/

        campo.addEventListener(
            "input",
            async (evento) => {

                const texto =
                    campo.value.trim();


                /*
                J1:
                CAB16 es el responsable.
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
                Menos de 3 caracteres:
                todavía no es búsqueda J2.
                */

                if(
                    consulta.length < 3
                ){

                    return;

                }


                /*
                J2:
                CAB17 toma el control.
                */

                evento.stopImmediatePropagation();


                this.seleccionRealizada =
                    false;


                await this.buscar();

            },
            true
        );


        /*------------------------------------------------
          CHECK

          También se captura antes de CAB16
          cuando existe una consulta J2.
        ------------------------------------------------*/

        check.addEventListener(
            "change",
            async (evento) => {

                const texto =
                    campo.value.trim();


                /*
                J1:
                CAB16 controla el check.
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
                Sin consulta J2:
                CAB16 controla el comportamiento.
                */

                if(
                    consulta.length < 3
                ){

                    return;

                }


                /*
                J2:
                CAB17 controla el check.
                */

                evento.stopImmediatePropagation();


                this.buscarTodos =
                    check.checked;


                this.seleccionRealizada =
                    false;


                if(
                    !this.buscarTodos
                ){

                    this.limpiarFiltro();

                }


                await this.buscar();

            },
            true
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
                J1:
                CAB16.
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
                J2 + check activo +
                sin selección manual:
                cargar primer registro del filtro.
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


        /*
        Check activo:
        la consulta J2 se convierte
        en rango de navegación.
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
                    )
                    .trim();


                const nombre =
                    String(
                        registro.nombre || ""
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


                /*
                Mostramos:

                Nombre — Código
                */

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


        /*
        Existe selección manual.
        */

        this.seleccionRealizada =
            true;


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
        Cargar exactamente el registro
        seleccionado.
        */

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
FIN cab17.js v1.6
========================================================
*/

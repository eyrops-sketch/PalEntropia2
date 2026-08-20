/*
========================================================
PalEntropía
cab17.js v1.7 LTS

FILTRO AVANZADO POR NOMBRE — J2

FUNCIÓN
-------
- Busca exclusivamente por J2 / nombre.
- Utiliza LEEPALJSON.obtener().
- No modifica CAB16.
- No crea una segunda interfaz.
- Reutiliza la interfaz existente del buscador.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Mínimo 3 caracteres.

CIRCUITO
--------
BUSCADOR
   ↓
CAB17
   ↓
LEEPALJSON
   ↓
MATRIXFILTRO
   ↓
MatrixNavegador
   ↓
PALNAVEGADOR

J1 continúa siendo responsabilidad de CAB16.

========================================================
*/

window.cab17 = {

    version:"1.7 LTS",

    inicializado:false,

    datos:[],

    buscarTodos:false,

    seleccionRealizada:false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar:function(){

        if(
            this.inicializado
        ){

            return;

        }


        this.obtenerDatos();


        /*
        CAB16 crea la interfaz.
        CAB17 espera hasta que exista.
        */

        this.esperarBuscador();

    },


    /*====================================================
      ESPERAR BUSCADOR
    ====================================================*/

    esperarBuscador:function(){

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


        if(
            !campo ||
            !check ||
            !resultados
        ){

            setTimeout(
                () => {

                    this.esperarBuscador();

                },
                100
            );

            return;

        }


        this.conectar();

        this.inicializado =
            true;


        console.log(
            "cab17 v1.7 LTS preparado."
        );

    },


    /*====================================================
      OBTENER DATOS
    ====================================================*/

    obtenerDatos:function(){

        if(
            !window.LEEPALJSON
        ){

            return [];

        }


        if(
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            return [];

        }


        const datos =
            window.LEEPALJSON.obtener();


        if(
            Array.isArray(
                datos
            )
        ){

            this.datos =
                datos;

        }


        return this.datos;

    },


    /*====================================================
      NORMALIZAR TEXTO
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
      ES CONSULTA J1
    ====================================================*/

    esJ1:function(texto){

        const valor =
            String(
                texto || ""
            )
            .trim();


        /*
        Ejemplos reconocidos:

        004
        004_
        004_1
        004_13
        */

        return /^\d{3}(?:_\d{0,2})?$/.test(
            valor
        );

    },


    /*====================================================
      ES CONSULTA J2
    ====================================================*/

    esJ2:function(texto){

        const valor =
            this.normalizar(
                texto
            );


        if(
            valor.length < 3
        ){

            return false;

        }


        return !this.esJ1(
            texto
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


        if(
            !campo ||
            !check
        ){

            return;

        }


        /*
        IMPORTANTE:

        CAB17 utiliza captura para saber
        qué tipo de consulta existe.

        J1 → no interviene.

        J2 → CAB17 realiza su búsqueda.
        */

        campo.addEventListener(
            "input",
            (evento) => {

                const texto =
                    campo.value.trim();


                if(
                    !this.esJ2(
                        texto
                    )
                ){

                    return;

                }


                /*
                Evitamos que CAB16 procese
                simultáneamente una consulta J2.
                */

                evento.stopImmediatePropagation();


                this.seleccionRealizada =
                    false;


                this.buscarJ2();

            },
            true
        );


        /*
        CHECK

        Solo intervenimos cuando existe
        una consulta J2.
        */

        check.addEventListener(
            "change",
            (evento) => {

                const texto =
                    campo.value.trim();


                if(
                    !this.esJ2(
                        texto
                    )
                ){

                    return;

                }


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


                this.buscarJ2();

            },
            true
        );

    },


    /*====================================================
      BUSCAR J2
    ====================================================*/

    buscarJ2:function(){

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


        const consulta =
            this.normalizar(
                campo.value
            );


        if(
            !this.esJ2(
                consulta
            )
        ){

            return;

        }


        this.obtenerDatos();


        resultados.innerHTML =
            "";


        const coincidencias =
            this.datos.filter(
                registro => {

                    if(
                        !registro
                    ){

                        return false;

                    }


                    const nombre =
                        this.normalizar(
                            registro.nombre
                        );


                    return nombre.includes(
                        consulta
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
        CHECK ACTIVADO:

        resultados →
        MATRIXFILTRO →
        MatrixNavegador →
        PALNAVEGADOR
        */

        if(
            this.buscarTodos
        ){

            this.aplicarMatrix(
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


        if(
            !contenedor
        ){

            return;

        }


        coincidencias.forEach(
            registro => {

                if(
                    !registro
                ){

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


                if(
                    !codigo
                ){

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
                PRESENTACIÓN:

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

    seleccionar:async function(
        codigo
    ){

        codigo =
            String(
                codigo || ""
            )
            .trim()
            .toUpperCase();


        if(
            !codigo
        ){

            return;

        }


        /*
        Existe selección manual.
        */

        this.seleccionRealizada =
            true;


        /*
        Actualizamos el campo
        con el código seleccionado.
        */

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(
            campo
        ){

            campo.value =
                codigo;

        }


        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(
            label
        ){

            label.textContent =
                codigo;

        }


        /*
        Cerramos el buscador.
        */

        this.cerrar();


        /*
        Cargamos exactamente
        el registro seleccionado.
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
        catch(
            error
        ){

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


                if(
                    elemento
                ){

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
FIN cab17.js v1.7 LTS
========================================================
*/

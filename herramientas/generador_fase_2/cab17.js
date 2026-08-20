/*
========================================================
PalEntropía
cab17.js v4.0

BUSCADOR AVANZADO POR NOMBRE

CIRCUITO
--------
Consulta por nombre
↓
PALBUSCADOR.buscarPorNombre()
↓
J1 / código
↓
MATRIXFILTRO
↓
MatrixNavegador
↓
PALNAVEGADOR.aplicarFiltro()
↓
PALNAVEGADOR.aleatorio()

COMPORTAMIENTO
--------------
Consulta por nombre:

    Gas

    Gastornis
    Gasosaurus

Los J1 correspondientes pasan a MATRIXFILTRO.

SIN CHECK
---------
La consulta YA constituye un rango activo.

Se aplica:
MATRIXFILTRO
↓
MatrixNavegador
↓
PALNAVEGADOR.aplicarFiltro()
↓
aleatorio dentro del rango

CON CHECK
---------
Mismo circuito.

El check solamente conserva el comportamiento
de "consulta completa" de CAB16.

SELECCIÓN MANUAL
----------------
Si el usuario pulsa un resultado:

    → se carga ese J1
    → no se sustituye por aleatorio

NO MODIFICA CAB16.
NO CREA NUEVAS MATRICES.
NO CREA NUEVOS MOTORES DE BÚSQUEDA.

========================================================
*/

window.cab17 = {

    inicializado: false,

    buscarTodos: false,

    seleccionRealizada: false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        if(
            this.inicializado
        ){

            return;

        }


        this.conectar();


        this.inicializado =
            true;

    },


    /*====================================================
      COMPROBAR CÓDIGO
    ====================================================*/

    esCodigo: function(
        texto
    ){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(
                texto || ""
            ).trim()
        );

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar: function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(
            !campo
        ){

            return;

        }


        /*------------------------------------------------
          INPUT
        ------------------------------------------------*/

        campo.addEventListener(
            "input",
            () => {

                this.seleccionRealizada =
                    false;


                const texto =
                    campo.value.trim();


                /*
                Los códigos pertenecen
                exclusivamente a CAB16.
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                this.buscar();

            }
        );


        /*------------------------------------------------
          CHECK
        ------------------------------------------------*/

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(
            check
        ){

            check.addEventListener(
                "change",
                async () => {

                    this.buscarTodos =
                        check.checked;


                    this.seleccionRealizada =
                        false;


                    await this.buscar();

                }
            );

        }

    },


    /*====================================================
      BUSCAR POR NOMBRE
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

            return [];

        }


        const texto =
            campo.value.trim();


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


            this.limpiarFiltro();


            return [];

        }


        /*------------------------------------------------
          EVITAR CÓDIGOS
        ------------------------------------------------*/

        if(
            this.esCodigo(
                texto
            )
        ){

            return [];

        }


        /*------------------------------------------------
          PALBUSCADOR
        ------------------------------------------------*/

        if(
            !window.PALBUSCADOR ||
            typeof window.PALBUSCADOR.buscarPorNombre !==
            "function"
        ){

            label.textContent =
                "Buscador no disponible.";

            return [];

        }


        let coincidencias;


        try{

            coincidencias =
                await window.PALBUSCADOR.buscarPorNombre(
                    texto
                );

        }
        catch(error){

            console.warn(
                "cab17: error buscando por nombre.",
                error
            );


            label.textContent =
                "Error de búsqueda.";


            return [];

        }


        if(
            !Array.isArray(
                coincidencias
            )
        ){

            coincidencias =
                [];

        }


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

        this.mostrar(
            coincidencias
        );


        /*------------------------------------------------
          IMPORTANTE

          La consulta por nombre SIEMPRE
          genera el rango.

          El check NO es necesario.

          Esto hace que CAB17 se comporte
          igual que CAB16 respecto al
          posicionamiento aleatorio.
        ------------------------------------------------*/

        if(
            coincidencias.length
        ){

            await this.aplicarMatrix(
                coincidencias
            );

        }
        else{

            this.limpiarFiltro();

        }


        return coincidencias;

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


        if(
            !contenedor
        ){

            return;

        }


        coincidencias.forEach(
            resultado => {

                if(
                    !resultado ||
                    !resultado.codigo
                ){

                    return;

                }


                const codigo =
                    String(
                        resultado.codigo
                    )
                    .trim()
                    .toUpperCase();


                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    codigo;


                fila.textContent =
                    resultado.nombre ||
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
          MATRIXFILTRO
        ------------------------------------------------*/

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


        /*
        PALBUSCADOR ya devuelve:

        {
            codigo: J1,
            nombre: J2
        }

        Por tanto MATRIXFILTRO recibe
        directamente esos registros.
        */

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

            console.warn(
                "cab17: MATRIXFILTRO no devolvió J1."
            );

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

            console.warn(
                "cab17: error MatrixNavegador.",
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

            console.warn(
                "cab17: MatrixNavegador no devolvió registros."
            );

            return;

        }


        /*------------------------------------------------
          PALNAVEGADOR
        ------------------------------------------------*/

        if(
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.aplicarFiltro !==
            "function"
        ){

            console.warn(
                "cab17: PALNAVEGADOR.aplicarFiltro no disponible."
            );

            return;

        }


        /*
        PRIMERO:

        Aplicamos el rango.

        */

        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        /*
        DESPUÉS:

        Aleatorio dentro del rango.

        */

        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();

            }
            catch(error){

                console.warn(
                    "cab17: error en aleatorio.",
                    error
                );

            }

        }

    },


    /*====================================================
      SELECCIONAR RESULTADO
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


        if(
            !codigo
        ){

            return;

        }


        /*
        Desde aquí existe selección
        manual real.

        El aleatorio ya no debe
        sustituirla.
        */

        this.seleccionRealizada =
            true;


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


        /*------------------------------------------------
          CERRAR
        ------------------------------------------------*/

        this.cerrar();


        /*------------------------------------------------
          CARGAR J1
        ------------------------------------------------*/

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.cargarPorCodigo ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.cargarPorCodigo(
                    codigo
                );

            }
            catch(error){

                console.warn(
                    "cab17: error cargando selección.",
                    error
                );

            }

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

        window.cab17.inicializar();

    }
);


/*
========================================================
FIN cab17.js v4.0
========================================================
*/

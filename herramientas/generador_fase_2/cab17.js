/*
========================================================
PalEntropía
cab17.js v3.0

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
☐ Consulta sin check:
   permite seleccionar un resultado.

☑ Consulta con check:
   convierte todos los resultados
   en rango activo de navegación.

Si no existe selección manual:
   → aleatorio dentro del filtro.

Si existe selección manual:
   → se respeta la selección.

NO MODIFICA CAB16.
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


        console.log(
            "cab17 v3.0: buscador por nombre preparado."
        );

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

            console.warn(
                "cab17: campo buscarUniversal no encontrado."
            );

            return;

        }


        /*
        ------------------------------------------------
        INPUT
        ------------------------------------------------
        */

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


        /*
        ------------------------------------------------
        CHECK
        ------------------------------------------------
        */

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


                    /*
                    Al quitar el check:
                    volvemos al conjunto completo.
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


        /*
        ------------------------------------------------
        MÍNIMO 3 CARACTERES
        ------------------------------------------------
        */

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


            return [];

        }


        /*
        ------------------------------------------------
        PALBUSCADOR
        ------------------------------------------------
        */

        if(
            !window.PALBUSCADOR ||
            typeof window.PALBUSCADOR.buscarPorNombre !==
            "function"
        ){

            label.textContent =
                "Buscador no disponible.";


            console.warn(
                "cab17: PALBUSCADOR.buscarPorNombre no disponible."
            );


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


        /*
        ------------------------------------------------
        CONTADOR
        ------------------------------------------------
        */

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        ------------------------------------------------
        MOSTRAR
        ------------------------------------------------
        */

        this.mostrar(
            coincidencias
        );


        /*
        ------------------------------------------------
        CHECK ACTIVADO
        ------------------------------------------------
        */

        if(
            this.buscarTodos
        ){

            await this.aplicarMatrix(
                coincidencias
            );

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

        /*
        ------------------------------------------------
        SIN RESULTADOS
        ------------------------------------------------
        */

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
        ------------------------------------------------
        MATRIXFILTRO
        ------------------------------------------------
        */

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
        PALBUSCADOR ya nos entrega
        resultados con codigo = J1.

        MATRIXFILTRO recibe exactamente
        esos registros, igual que CAB16.
        */

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
                "cab17: MATRIXFILTRO no devolvió una matriz."
            );

            return;

        }


        /*
        ------------------------------------------------
        MATRIXNAVEGADOR
        ------------------------------------------------
        */

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
                "cab17: error en MatrixNavegador.",
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


        /*
        ------------------------------------------------
        PALNAVEGADOR
        ------------------------------------------------
        */

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
        aplicar el rango.
        */

        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        console.log(
            "cab17: rango aplicado:",
            registros.length,
            "registros."
        );


        /*
        ------------------------------------------------
        ALEATORIO
        ------------------------------------------------

        Exactamente el mismo principio
        que CAB16.
        */

        if(
            !this.seleccionRealizada &&
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();


                console.log(
                    "cab17: aleatorio automático dentro del filtro."
                );

            }
            catch(error){

                console.warn(
                    "cab17: error en aleatorio automático.",
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
        Selección manual.
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


        /*
        CERRAR
        */

        this.cerrar();


        /*
        CARGAR SELECCIÓN
        */

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


        console.log(
            "cab17: filtro y matriz limpiados."
        );

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
FIN cab17.js v3.0
========================================================
*/

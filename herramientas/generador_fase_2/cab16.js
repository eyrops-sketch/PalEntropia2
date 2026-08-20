/*
========================================================
PalEntropía
cab16.js v2.0

BUSCADOR AVANZADO POR CÓDIGO

FUNCIÓN
-------
- Busca exclusivamente por J1 / código.

CHECK
-----
☐ Mostrar seleccionado/Consulta completa
    → todos los registros.

☑ Mostrar seleccionado/Consulta completa
    → resultados de la consulta como rango
      activo de navegación.

COMPORTAMIENTO
--------------
- Si NO se selecciona manualmente un registro:
    → se fuerza un aleatorio dentro del filtro.

- Si se selecciona manualmente un registro:
    → se respeta siempre esa selección.

CIRCUITO
--------
CAB16
  ↓
MATRIXFILTRO
  ↓
MATRIXNAVEGADOR
  ↓
PALNAVEGADOR.aplicarFiltro()
  ↓
PALNAVEGADOR.aleatorio()

========================================================
*/


window.cab16 = {

    inicializado: false,

    datos: [],

    buscarTodos: false,

    /*
    true solamente cuando el usuario
    ha seleccionado realmente un resultado.
    */

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


        this.obtenerDatos();

        this.crearInterfaz();

        this.conectar();


        this.inicializado = true;


        console.log(
            "cab16 v2.0: buscador avanzado preparado."
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


            if(
                Array.isArray(
                    datos
                )
            ){

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


        if(
            !campo
        ){

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
          LABEL RESULTADOS
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
          CAMPO DE BÚSQUEDA
        ------------------------------------------------*/

        if(
            campo
        ){

            campo.addEventListener(
                "input",
                () => {

                    /*
                    Nueva consulta:
                    todavía no existe una selección
                    manual para esta consulta.
                    */

                    this.seleccionRealizada =
                        false;


                    this.buscar();

                }
            );

        }


        /*------------------------------------------------
          CHECK
        ------------------------------------------------*/

        if(
            check
        ){

            check.addEventListener(
                "change",
                async () => {

                    /*
                    Guardamos exactamente
                    el estado visual del check.
                    */

                    this.buscarTodos =
                        check.checked;


                    /*
                    Cada cambio de check
                    invalida una selección anterior.
                    */

                    this.seleccionRealizada =
                        false;


                    /*
                    CHECK DESACTIVADO
                    -----------------
                    Volvemos inmediatamente
                    al conjunto completo.
                    */

                    if(
                        !this.buscarTodos
                    ){

                        this.limpiarFiltro();

                    }


                    /*
                    Rehacemos la consulta
                    con el nuevo estado.
                    */

                    await this.buscar();

                }
            );

        }


        /*------------------------------------------------
          CERRAR BUSCADOR
        ------------------------------------------------*/

        if(
            cerrar
        ){

            cerrar.addEventListener(
                "click",
                () => {

                    const texto =
                        campo
                            ? campo.value.trim()
                            : "";


                    if(
                        texto
                    ){

                        const label =
                            document.getElementById(
                                "labelBusquedaUniversal"
                            );


                        if(
                            label
                        ){

                            label.textContent =
                                texto;

                        }

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


        /*
        Limpiamos resultados visuales.
        */

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


            /*
            Si estamos en modo filtro,
            eliminamos cualquier rango antiguo.
            */

            if(
                this.buscarTodos
            ){

                this.limpiarFiltro();

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

        /*
        La consulta siempre se hace sobre
        TODOS los registros.

        El check NO determina dónde buscar.

        El check determina si los resultados
        se convierten o no en rango de navegación.
        */

        const conjunto =
            this.datos;


        /*------------------------------------------------
          COINCIDENCIAS POR CÓDIGO
        ------------------------------------------------*/

        const coincidencias =
            conjunto.filter(
                registro => {

                    if(
                        !registro
                    ){

                        return false;

                    }


                    const codigo =
                        String(
                            registro.codigo || ""
                        )
                        .trim()
                        .toLowerCase();


                    if(
                        !codigo
                    ){

                        return false;

                    }


                    return codigo.includes(
                        texto
                    );

                }
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

        this.mostrar(
            coincidencias
        );


        /*------------------------------------------------
          CHECK ACTIVADO
          → CREAR RANGO
        ------------------------------------------------*/

        if(
            this.buscarTodos
        ){

            await this.aplicarMatrix(
                coincidencias
            );

        }

    },


    /*====================================================
      MATRIX
    ====================================================*/

    aplicarMatrix: async function(
        coincidencias
    ){

        /*
        Si no hay coincidencias,
        no puede existir rango.
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


        /*------------------------------------------------
          MATRIXFILTRO
        ------------------------------------------------*/

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            console.warn(
                "cab16: MATRIXFILTRO no disponible."
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
                "cab16: MATRIXFILTRO no devolvió una matriz."
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
                "cab16: MatrixNavegador no disponible."
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

            console.warn(
                "cab16: MatrixNavegador no devolvió registros."
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
                "cab16: PALNAVEGADOR.aplicarFiltro no disponible."
            );

            return;

        }


        /*
        PRIMERO aplicamos el rango.

        Esto es fundamental.

        El aleatorio se ejecuta DESPUÉS,
        por lo que nunca puede salir fuera
        del rango de la consulta.
        */

        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        console.log(
            "cab16: rango aplicado:",
            registros.length,
            "registros."
        );


        /*------------------------------------------------
          ALEATORIO AUTOMÁTICO
        ------------------------------------------------*/

        /*
        Solo hacemos el aleatorio si el usuario
        todavía NO ha seleccionado manualmente
        un resultado.

        Si ya seleccionó uno:
        NO tocamos su selección.
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
                    "cab16: aleatorio automático dentro del filtro."
                );

            }
            catch(error){

                console.warn(
                    "cab16: error en aleatorio automático.",
                    error
                );

            }

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


        if(
            !codigo
        ){

            return;

        }


        /*
        MUY IMPORTANTE:

        Desde este momento existe una
        selección manual real.

        Por tanto, ningún aleatorio
        automático posterior debe sustituirla.
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
          CERRAR BUSCADOR
        ------------------------------------------------*/

        this.cerrar();


        /*------------------------------------------------
          CARGAR SELECCIÓN
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
                    "cab16: error cargando selección.",
                    error
                );

            }

        }

    },

        /*====================================================
      CERRAR
    ====================================================*/

    cerrar: function(){

        /*
        Utilizamos primero el cierre oficial
        de PALBUSCADOR.
        */

        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.cerrar ===
            "function"
        ){

            window.PALBUSCADOR.cerrar();

            return;

        }


        /*
        Respaldo visual.
        */

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

        /*
        PALNAVEGADOR vuelve al conjunto
        completo de registros.
        */

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.limpiarFiltro ===
            "function"
        ){

            window.PALNAVEGADOR.limpiarFiltro();

        }


        /*
        MATRIXNAVEGADOR también se limpia.
        */

        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar ===
            "function"
        ){

            window.MatrixNavegador.limpiar();

        }


        console.log(
            "cab16: filtro y matriz limpiados."
        );

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
FIN cab16.js v2.0
========================================================
*/

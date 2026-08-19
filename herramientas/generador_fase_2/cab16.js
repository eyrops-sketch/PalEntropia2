/*
========================================================
PalEntropía
cab16.js v1.9

BUSCADOR AVANZADO POR CÓDIGO

FUNCIÓN
-------
- Busca exclusivamente por J1 / código.
- Check DESACTIVADO:
    todos los registros.
- Check ACTIVADO:
    los resultados de la consulta forman
    el rango activo de navegación.

CIRCUITO
--------
CAB16
  ↓
MATRIXFILTRO
  ↓
MATRIXNAVEGADOR
  ↓
PALNAVEGADOR.aplicarFiltro()

COMPORTAMIENTO DEL CHECK
------------------------
☐ Mostrar seleccionado/Consulta completa
    → todos los registros.

☑ Mostrar seleccionado/Consulta completa
    → rango de resultados de la consulta.

AL CERRAR SIN SELECCIONAR
-------------------------
Si el check está activado y no se seleccionó
ningún resultado:

    → se carga el primer registro real
      del rango filtrado.

Si se seleccionó un resultado:

    → se carga exactamente ese registro.

========================================================
*/


window.cab16 = {

    inicializado: false,

    datos: [],

    buscarTodos: false,

    /*
    Indica si durante la apertura actual
    se ha seleccionado realmente un resultado.
    */

    seleccionRealizada: false,


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
            "cab16 v1.9: buscador avanzado preparado."
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


        /*
        Texto definitivo del check.
        */

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
          ESCRIBIR CONSULTA
        ------------------------------------------------*/

        if(campo){

            campo.addEventListener(
                "input",
                () => {

                    /*
                    Una nueva consulta significa
                    que todavía no se ha seleccionado
                    ningún resultado.
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

        if(check){

            check.addEventListener(
                "change",
                async () => {

                    this.buscarTodos =
                        check.checked;


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
                    Nueva situación de búsqueda:
                    todavía no hay selección.
                    */

                    this.seleccionRealizada =
                        false;


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
                async () => {

                    const texto =
                        campo
                            ? campo.value.trim()
                            : "";


                    /*
                    Actualizar label principal
                    con la consulta.
                    */

                    if(texto){

                        const label =
                            document.getElementById(
                                "labelBusquedaUniversal"
                            );


                        if(label){

                            label.textContent =
                                texto;

                        }

                    }


                    /*
                    Si el check está ACTIVADO
                    y NO se ha seleccionado ningún
                    resultado:

                    cargar el primer registro real
                    del filtro.
                    */

                    if(
                        this.buscarTodos &&
                        !this.seleccionRealizada
                    ){

                        await this.cargarPrimerFiltrado();

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


            /*
            Si estamos en modo consulta,
            no debe quedar un filtro antiguo.
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

        let conjunto;


        /*
        CHECK ACTIVADO
        ---------------
        La consulta SIEMPRE se hace sobre
        todos los registros.

        Después los resultados pasan a ser
        el rango de navegación.
        */

        if(
            this.buscarTodos
        ){

            conjunto =
                this.datos;

        }


        /*
        CHECK DESACTIVADO
        -----------------
        Se buscan coincidencias dentro
        del conjunto completo.

        Importante:
        aquí NO utilizamos un filtro anterior.
        */

        else{

            conjunto =
                this.datos;

        }


        /*------------------------------------------------
          COINCIDENCIAS POR CÓDIGO
        ------------------------------------------------*/

        const coincidencias =
            conjunto.filter(
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
          MOSTRAR
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


        /*
        CHECK DESACTIVADO
        -----------------
        No existe rango especial.
        */

    },


    /*====================================================
      MATRIX
    ====================================================*/

    aplicarMatrix: async function(
        coincidencias
    ){

        /*
        Si no hay coincidencias,
        limpiamos el rango.
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
          PALNAVEGADOR
        ------------------------------------------------*/

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
      CARGAR PRIMER FILTRADO
    ====================================================*/

    cargarPrimerFiltrado: async function(){

        if(
            !window.PALNAVEGADOR
        ){

            return;

        }


        /*
        El filtro ya debería existir porque
        aplicarMatrix() lo creó mientras se
        escribía la consulta.
        */

        if(
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


        /*
        Obtenemos el PRIMER registro REAL
        del filtro.
        */

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


        /*
        Posicionamos el navegador
        en ese primer registro.
        */

        if(
            typeof window.PALNAVEGADOR.posicionar ===
            "function"
        ){

            await window.PALNAVEGADOR.posicionar(
                codigo
            );

        }


        /*
        Y lo cargamos realmente.
        */

        if(
            typeof window.PALNAVEGADOR.cargarIndice ===
            "function"
        ){

            await window.PALNAVEGADOR.cargarIndice(
                0
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
        MUY IMPORTANTE:

        Registramos que existe una selección
        REAL.

        Esto impide que cerrar() cargue
        posteriormente el primer registro
        del filtro.
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


        /*------------------------------------------------
          CERRAR
        ------------------------------------------------*/

        this.cerrar();


        /*------------------------------------------------
          CARGAR CÓDIGO SELECCIONADO
        ------------------------------------------------*/

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

        /*
        PALNAVEGADOR vuelve al conjunto completo.
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
FIN cab16.js v1.9
========================================================
*/

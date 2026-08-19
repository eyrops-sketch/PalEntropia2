/*
========================================================
PalEntropía
cab16.js v1.8 COMPACTA

BUSCADOR AVANZADO POR CÓDIGO

LÓGICA DEFINITIVA DEL CHECK
---------------------------
☐ CHECK DESMARCADO
    → TODOS LOS REGISTROS

☑ CHECK MARCADO
    → RANGO DEL FILTRO

CIRCUITO
--------
CAB16
  ↓
MATRIXFILTRO
  ↓
MATRIXNAVEGADOR
  ↓
PALNAVEGADOR.aplicarFiltro()

AL DESMARCAR
------------
CAB16
  ↓
PALNAVEGADOR.limpiarFiltro()
  ↓
TODOS LOS REGISTROS

IMPORTANTE
----------
El label NO controla el rango.

El estado real del rango depende
exclusivamente del check.
========================================================
*/


window.cab16 = {


    inicializado: false,

    datos: [],

    buscarTodos: false,

    /*
    Control de búsquedas asíncronas.
    Evita que una búsqueda anterior
    vuelva a aplicar un filtro después
    de cambiar el check.
    */

    busquedaID: 0,


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


        /*
        Estado inicial:

        ☐ = TODOS LOS REGISTROS
        */

        this.buscarTodos = false;


        this.inicializado = true;


        console.log(
            "cab16 v1.8: buscador preparado."
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


        /*
        LABEL
        */

        const label =
            document.createElement(
                "div"
            );


        label.id =
            "labelResultadosCab16";


        label.textContent =
            "Introduce al menos 3 caracteres";


        /*
        CHECK
        */

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
        IMPORTANTE:

        El texto puede mantenerse como
        "Buscar en todos los registros"
        porque:

        ☐ → todos
        ☑ → filtro

        Pero el comportamiento real
        lo controla exclusivamente
        la lógica de arriba.
        */

        const texto =
            document.createElement(
                "span"
            );


        texto.textContent =
            "Buscar en todos los registros";


        checkLabel.appendChild(
            check
        );


        checkLabel.appendChild(
            texto
        );


        /*
        RESULTADOS
        */

        const resultados =
            document.createElement(
                "div"
            );


        resultados.id =
            "resultadosCab16";


        /*
        INSERTAR
        */

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


        /*
        -----------------------------------------------
        CAMPO DE BÚSQUEDA
        -----------------------------------------------
        */

        if(campo){

            campo.addEventListener(
                "input",
                () => {

                    this.buscar();

                }
            );

        }


        /*
        -----------------------------------------------
        CHECK
        -----------------------------------------------
        */

        if(check){

            check.checked =
                false;


            check.addEventListener(
                "change",
                () => {

                    /*
                    Guardamos exactamente
                    el estado físico del check.
                    */

                    this.buscarTodos =
                        check.checked;


                    /*
                    =====================================
                    DESMARCADO
                    =====================================

                    ☐ = TODOS

                    Limpiamos inmediatamente
                    cualquier filtro activo.
                    */

                    if(!check.checked){

                        this.busquedaID++;


                        this.limpiarFiltro();


                        /*
                        Volvemos a ejecutar la búsqueda
                        pero SIN volver a crear filtro.
                        */

                        this.buscar();


                        return;

                    }


                    /*
                    =====================================
                    MARCADO
                    =====================================

                    ☑ = FILTRO

                    Ejecutamos búsqueda para construir
                    la nueva matriz.
                    */

                    this.buscar();

                }
            );

        }


        /*
        -----------------------------------------------
        CIERRE
        -----------------------------------------------
        */

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


        /*
        Cada búsqueda recibe un ID.
        */

        const id =
            ++this.busquedaID;


        const texto =
            campo.value
                .trim()
                .toLowerCase();


        resultados.innerHTML =
            "";


        /*
        -----------------------------------------------
        MÍNIMO 3 CARACTERES
        -----------------------------------------------
        */

        if(texto.length < 3){

            label.textContent =
                "Introduce al menos 3 caracteres";


            /*
            Si estamos desmarcados,
            garantizamos TODOS.
            */

            if(!this.buscarTodos){

                this.limpiarFiltro();

            }


            return;

        }


        /*
        -----------------------------------------------
        DATOS
        -----------------------------------------------
        */

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
        ===============================================
        IMPORTANTE
        ===============================================

        LA BÚSQUEDA SIEMPRE SE HACE SOBRE
        LOS DATOS GENERALES.

        No usamos conjuntoActivo() aquí.

        Así evitamos que un filtro anterior
        contamine una búsqueda nueva.
        */

        const conjunto =
            this.datos;


        /*
        -----------------------------------------------
        BUSCAR SOLO POR CÓDIGO
        -----------------------------------------------
        */

        const coincidencias =
            conjunto.filter(
                registro => {

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
        -----------------------------------------------
        CONTADOR
        -----------------------------------------------
        */

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        -----------------------------------------------
        MOSTRAR
        -----------------------------------------------
        */

        this.mostrar(
            coincidencias
        );


        /*
        ===============================================
        CHECK MARCADO
        ===============================================

        ☑ = FILTRO

        Construimos el rango.
        */

        if(this.buscarTodos){

            await this.aplicarMatrix(
                coincidencias,
                id
            );


            return;

        }


        /*
        ===============================================
        CHECK DESMARCADO
        ===============================================

        ☐ = TODOS

        No se aplica ninguna matriz.

        Nos aseguramos de que PALNAVEGADOR
        permanezca en el conjunto completo.
        */

        this.limpiarFiltro();

    },


    /*====================================================
      APLICAR MATRIX
    ====================================================*/

    aplicarMatrix: async function(
        coincidencias,
        id
    ){

        /*
        Si durante la operación cambió el check
        o comenzó otra búsqueda, abortamos.
        */

        if(
            id !== this.busquedaID ||
            !this.buscarTodos
        ){

            return;

        }


        /*
        -----------------------------------------------
        MATRIXFILTRO
        -----------------------------------------------
        */

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
                "cab16: MATRIXFILTRO no devolvió J1."
            );


            return;

        }


        /*
        -----------------------------------------------
        MATRIXNAVEGADOR
        -----------------------------------------------
        */

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


        const registros =
            await window.MatrixNavegador.obtener(
                matrizJ1
            );


        /*
        Comprobamos nuevamente el estado.

        Es importante porque la operación
        anterior es asíncrona.
        */

        if(
            id !== this.busquedaID ||
            !this.buscarTodos
        ){

            return;

        }


        if(
            !Array.isArray(
                registros
            )
        ){

            return;

        }


        /*
        -----------------------------------------------
        PALNAVEGADOR
        -----------------------------------------------

        ☑ = aplicar rango filtrado.
        */

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
        Cerramos buscador.
        */

        this.cerrar();


        /*
        Cargamos la ficha.

        Si el check está marcado,
        PALNAVEGADOR permanece dentro
        del filtro.

        Si está desmarcado,
        PALNAVEGADOR está en TODOS.
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
        Primero PALNAVEGADOR.

        Esto es lo que realmente devuelve
        la navegación a TODOS.
        */

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.limpiarFiltro ===
            "function"
        ){

            window.PALNAVEGADOR.limpiarFiltro();

        }


        /*
        Después limpiamos MatrixNavegador.

        No es el que controla la navegación,
        pero eliminamos su matriz almacenada.
        */

        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar ===
            "function"
        ){

            window.MatrixNavegador.limpiar();

        }


        /*
        MATRIXFILTRO también puede conservar
        su última matriz. Si dispone de método
        limpiar, lo vaciamos.
        */

        if(
            window.MATRIXFILTRO &&
            typeof window.MATRIXFILTRO.limpiar ===
            "function"
        ){

            window.MATRIXFILTRO.limpiar();

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
FIN cab16.js v1.8 COMPACTA
========================================================
*/

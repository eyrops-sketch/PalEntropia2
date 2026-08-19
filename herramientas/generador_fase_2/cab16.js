/*
========================================================
cab16.js v1.5
autocompletado del buscador avanzado
palentropía — generador

FUNCIÓN v1.5
------------
CAB16 BUSCADOR EXCLUSIVO POR CÓDIGO

CAMBIOS v1.5
------------
- Búsqueda únicamente por código.
- Resultados mostrados en lista vertical.
- Cada resultado ocupa una fila completa.
- La fila completa es seleccionable.
- Al seleccionar un código:
    1. se cierra el buscador;
    2. se carga inmediatamente la paleoficha;
    3. se actualiza el label principal.
- Si se cierra el buscador sin seleccionar resultado:
    el label principal conserva la última consulta escrita.

NO MODIFICA:
- cab15
- palbuscador
- palnavegador
- cab12
- cab14
- cargacont
========================================================
*/


window.cab16 = {

    /*====================================================
      ESTADO
    ====================================================*/

    inicializado: false,

    datos: [],

    buscarTodos: false,

    consultaActual: "",

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

        this.conectarCheck();

        this.conectarBusqueda();

        this.inicializado = true;

        console.log(
            "cab16 v1.5: buscador por código preparado."
        );

    },


    /*====================================================
      OBTENER DATOS
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

        if(
            (
                !Array.isArray(
                    this.datos
                ) ||
                !this.datos.length
            ) &&
            Array.isArray(
                window.PALEOFICHAS
            )
        ){

            this.datos =
                window.PALEOFICHAS;

        }

        return this.datos;

    },


    /*====================================================
      CREAR INTERFAZ
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


        const etiquetaCheck =
            document.createElement(
                "label"
            );

        etiquetaCheck.id =
            "checkBusquedaCab16";


        const check =
            document.createElement(
                "input"
            );

        check.type =
            "checkbox";

        check.id =
            "buscarTodosCab16";


        const textoCheck =
            document.createElement(
                "span"
            );

        textoCheck.textContent =
            "Buscar en todos los registros";


        etiquetaCheck.appendChild(
            check
        );

        etiquetaCheck.appendChild(
            textoCheck
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
            etiquetaCheck
        );

        etiquetaCheck.insertAdjacentElement(
            "afterend",
            resultados
        );


        this.label =
            label;

        this.check =
            check;

        this.resultados =
            resultados;

    },


    /*====================================================
      CONECTAR CHECK
    ====================================================*/

    conectarCheck: function(){

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );

        if(!check){

            return;

        }

        check.addEventListener(
            "change",
            () => {

                this.buscarTodos =
                    check.checked;

                this.ejecutarBusqueda();

            }
        );

    },


    /*====================================================
      CONECTAR BÚSQUEDA
    ====================================================*/

    conectarBusqueda: function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        if(!campo){

            return;

        }

        campo.addEventListener(
            "input",
            () => {

                this.consultaActual =
                    campo.value.trim();

                this.seleccionRealizada =
                    false;

                this.ejecutarBusqueda();

            }
        );

    },


    /*====================================================
      EJECUTAR BÚSQUEDA
    ====================================================*/

    ejecutarBusqueda: function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        const resultados =
            document.getElementById(
                "resultadosCab16"
            );

        const label =
            document.getElementById(
                "labelResultadosCab16"
            );

        if(
            !campo ||
            !resultados ||
            !label
        ){

            return;

        }


        const texto =
            campo.value
                .trim()
                .toLowerCase();


        resultados.innerHTML =
            "";


        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";

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


        let conjunto =
            this.datos;


        if(
            !this.buscarTodos
        ){

            const activo =
                this.obtenerConjuntoActivo();

            if(
                Array.isArray(
                    activo
                ) &&
                activo.length
            ){

                conjunto =
                    activo;

            }

        }


        const coincidencias =
            conjunto.filter(
                registro =>
                    this.coincide(
                        registro,
                        texto
                    )
            );


        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        this.mostrarResultados(
            coincidencias
        );

    },


    /*====================================================
      OBTENER CONJUNTO ACTIVO
    ====================================================*/

    obtenerConjuntoActivo: function(){

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.conjuntoActivo ===
            "function"
        ){

            const conjunto =
                window.PALNAVEGADOR.conjuntoActivo();

            if(
                Array.isArray(
                    conjunto
                )
            ){

                return conjunto;

            }

        }

        return this.datos;

    },


    /*====================================================
      COINCIDENCIA
    ====================================================*/

    coincide: function(
        registro,
        texto
    ){

        if(!registro){

            return false;

        }

        const codigo =
            String(
                registro.codigo || ""
            )
            .trim()
            .toLowerCase();

        if(!codigo){

            return false;

        }

        return codigo.includes(
            texto
        );

    },


    /*====================================================
      MOSTRAR RESULTADOS
    ====================================================*/

    mostrarResultados: function(
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

                        this.seleccionarCodigo(
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
      SELECCIONAR CÓDIGO
    ====================================================*/

    seleccionarCodigo: function(
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


        console.log(
            "cab16: código seleccionado:",
            codigo
        );


        this.seleccionRealizada =
            true;

        this.consultaActual =
            codigo;


        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        if(campo){

            campo.value =
                codigo;

        }


        const labelPrincipal =
            document.getElementById(
                "labelBusquedaUniversal"
            );

        if(labelPrincipal){

            labelPrincipal.textContent =
                codigo;

        }


        this.cerrarBuscador();

        this.cargarPaleoficha(
            codigo
        );

    },
    /*====================================================
      OBTENER CONJUNTO ACTIVO
====================================================*/

obtenerConjuntoActivo: function(){

    if(
        window.PALNAVEGADOR &&
        typeof window.PALNAVEGADOR.conjuntoActivo ===
        "function"
    ){

        const conjunto =
            window.PALNAVEGADOR.conjuntoActivo();


        if(
            Array.isArray(
                conjunto
            )
        ){

            return conjunto;

        }

    }


    return this.datos;

},


/*====================================================
      COINCIDENCIA
      SOLO POR CÓDIGO
====================================================*/

coincide: function(
    registro,
    texto
){

    if(!registro){

        return false;

    }


    const codigo =
        String(
            registro.codigo || ""
        )
        .trim()
        .toLowerCase();


    if(!codigo){

        return false;

    }


    return codigo.includes(
        texto
    );

},


/*====================================================
      MOSTRAR RESULTADOS
====================================================*/

mostrarResultados: function(
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


            /*----------------------------------------
              FILA COMPLETA
            ----------------------------------------*/

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


            /*----------------------------------------
              SELECCIÓN
            ----------------------------------------*/

            fila.addEventListener(
                "click",
                () => {

                    this.seleccionarCodigo(
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
      SELECCIONAR CÓDIGO
====================================================*/

seleccionarCodigo: function(
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


    console.log(
        "cab16: código seleccionado:",
        codigo
    );


    /*----------------------------------------------
      ESCRIBIR CÓDIGO EN EL CAMPO
    ----------------------------------------------*/

    const campo =
        document.getElementById(
            "buscarUniversal"
        );


    if(campo){

        campo.value =
            codigo;

    }


    /*----------------------------------------------
      ACTUALIZAR LABEL PRINCIPAL
    ----------------------------------------------

      SOLO cambia cuando se selecciona
      realmente un resultado de CAB16.

      El label conserva el último
      código seleccionado.
    ----------------------------------------------*/

    const labelPrincipal =
        document.getElementById(
            "labelBusquedaUniversal"
        );


    if(labelPrincipal){

        labelPrincipal.textContent =
            codigo;

    }


    /*----------------------------------------------
      CERRAR BUSCADOR
    ----------------------------------------------*/

    this.cerrarBuscador();


    /*----------------------------------------------
      CARGAR PALEOFICHA
    ----------------------------------------------*/

    this.cargarPaleoficha(
        codigo
    );

},


/*====================================================
      CERRAR BUSCADOR
====================================================*/

cerrarBuscador: function(){

    /*
    Buscamos primero las funciones conocidas
    del sistema actual.
    */

    if(
        window.PALBUSCADOR
    ){

        if(
            typeof window.PALBUSCADOR.cerrar ===
            "function"
        ){

            window.PALBUSCADOR.cerrar();

            return;

        }


        if(
            typeof window.PALBUSCADOR.cerrarBusqueda ===
            "function"
        ){

            window.PALBUSCADOR.cerrarBusqueda();

            return;

        }

    }


    /*
    Respaldo visual:
    buscar elementos habituales del lightbox.
    */

    const posibles = [

        "lightboxBuscador",

        "buscadorLightbox",

        "lightboxBusqueda",

        "modalBuscador"

    ];


    for(
        const id of posibles
    ){

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

},


/*====================================================
      CARGAR PALEOFICHA
====================================================*/

cargarPaleoficha: async function(
    codigo
){

    /*
    PALNAVEGADOR es el sistema responsable
    de la navegación de las paleofichas.
    */

    if(
        window.PALNAVEGADOR
    ){

        /*------------------------------------------
          MÉTODO 1
        ------------------------------------------*/

        if(
            typeof window.PALNAVEGADOR.cargar ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.cargar(
                    codigo
                );

                return;

            }
            catch(error){

                console.warn(
                    "cab16: PALNAVEGADOR.cargar falló.",
                    error
                );

            }

        }


        /*------------------------------------------
          MÉTODO 2
        ------------------------------------------*/

        if(
            typeof window.PALNAVEGADOR.irA ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.irA(
                    codigo
                );

                return;

            }
            catch(error){

                console.warn(
                    "cab16: PALNAVEGADOR.irA falló.",
                    error
                );

            }

        }


        /*------------------------------------------
          MÉTODO 3
        ------------------------------------------*/

        if(
            typeof window.PALNAVEGADOR.cargarPorCodigo ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.cargarPorCodigo(
                    codigo
                );

                return;

            }
            catch(error){

                console.warn(
                    "cab16: PALNAVEGADOR.cargarPorCodigo falló.",
                    error
                );

            }

        }

    }


    /*
    Si no existe un método compatible,
    no inventamos una ruta ni modificamos
    otros módulos.
    */

    console.warn(
        "cab16: no se encontró un método de carga compatible para",
        codigo
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
FIN cab16.js v1.4
========================================================
*/

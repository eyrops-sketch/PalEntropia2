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
    1. se escribe en la caja;
    2. se guarda como última consulta;
    3. se actualiza el label principal;
    4. se cierra el buscador;
    5. se carga inmediatamente la paleoficha.
- Si se cierra sin seleccionar resultado:
    se conserva la última consulta escrita.
- La última consulta permanece hasta una nueva consulta.
- CAB15 permanece independiente.

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

    /*
    Última consulta realizada en CAB16.

    Puede ser:
    - texto escrito en la caja
    - código seleccionado
    */

    ultimaConsulta: "",


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


        /*------------------------------------------------
          LABEL
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

                /*
                Guardamos únicamente el texto
                introducido por el usuario.

                Todavía no modificamos el label
                principal.

                El label cambiará al cerrar CAB16
                o al seleccionar un resultado.
                */

                const texto =
                    campo.value
                        .trim();


                if(texto){

                    this.ultimaConsulta =
                        texto;

                }


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


        /*------------------------------------------------
          MÍNIMO 3 CARACTERES
        ------------------------------------------------*/

        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";

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

        let conjunto =
            this.datos;


        /*
        Check desactivado:
        se utiliza el conjunto activo.

        Check activado:
        se utilizan todos los registros.
        */

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


        /*------------------------------------------------
          BUSCAR SOLO POR CÓDIGO
        ------------------------------------------------*/

        const coincidencias =
            conjunto.filter(
                registro =>
                    this.coincide(
                        registro,
                        texto
                    )
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
      SOLO CÓDIGO
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
          GUARDAR ÚLTIMA CONSULTA
        ----------------------------------------------*/

        this.ultimaConsulta =
            codigo;


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
    ----------------------------------------------------
    GUARDAR LA ÚLTIMA CONSULTA
    ----------------------------------------------------

    Si el usuario escribió una consulta y no seleccionó
    ningún resultado, también la conservamos.

    No modificamos CAB15.
    No modificamos PALNAVEGADOR.
    */

    const campo =
        document.getElementById(
            "buscarUniversal"
        );


    if(campo){

        const consulta =
            campo.value
                .trim();


        if(consulta){

            this.ultimaConsulta =
                consulta;

        }

    }


    /*
    ----------------------------------------------------
    ACTUALIZAR LABEL PRINCIPAL
    ----------------------------------------------------
    */

    const labelPrincipal =
        document.getElementById(
            "labelBusquedaUniversal"
        );


    if(
        labelPrincipal &&
        this.ultimaConsulta
    ){

        labelPrincipal.textContent =
            this.ultimaConsulta;

    }


    /*
    ----------------------------------------------------
    CERRAR VISOR
    ----------------------------------------------------
    */

    const visor =
        document.getElementById(
            "visorBuscadorUniversal"
        );


    if(visor){

        visor.style.display =
            "none";


        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        return true;

    }


    /*
    ----------------------------------------------------
    RESPALDO PARA EL BUSCADOR ANTIGUO
    ----------------------------------------------------
    */

    if(
        window.PALBUSCADOR
    ){

        if(
            typeof window.PALBUSCADOR.cerrar ===
            "function"
        ){

            window.PALBUSCADOR.cerrar();

            return true;

        }


        if(
            typeof window.PALBUSCADOR.cerrarBusqueda ===
            "function"
        ){

            window.PALBUSCADOR.cerrarBusqueda();

            return true;

        }

    }


    /*
    ----------------------------------------------------
    RESPALDO VISUAL
    ----------------------------------------------------
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


    return true;

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
    ----------------------------------------------------
    SIN MÉTODO COMPATIBLE
    ----------------------------------------------------
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
FIN cab16.js v1.5
========================================================
*/

/*
========================================================
cab16.js v1.3
autocompletado del buscador avanzado
palentropía — generador

FUNCIÓN v1.3
------------
CAB16 BUSCADOR EXCLUSIVO POR CÓDIGO

- Fuente: window.PALEOFICHAS / LEEPALJSON
- Busca ÚNICAMENTE en codigo
- No busca en nombre
- No busca en j3
- No busca en taxon
- 000 no produce falsos resultados
- El check cambia el conjunto de búsqueda
- No carga paleofichas todavía

EJEMPLOS:
---------
001     → códigos 001_xx
006     → 006_01, 006_02
003_10  → 003_10
000     → 0 resultados

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
            "cab16 v1.3: buscador exclusivo por código preparado."
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


        /*
        Respaldo directo.
        */

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


        /*
        Limpiar resultados anteriores.
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
        conjunto activo.

        Check activado:
        todos los registros.
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


        /*
        ÚNICO CAMPO CONSULTADO:
        codigo
        */

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

                const boton =
                    document.createElement(
                        "button"
                    );


                boton.type =
                    "button";


                boton.className =
                    "resultadoCab16";


                const codigo =
                    registro.codigo ||
                    "";


                /*
                CAB16 solo necesita
                mostrar el código.

                El nombre pertenece
                a la futura búsqueda
                de CAB17.
                */

                boton.textContent =
                    codigo;


                /*
                Guardar código para
                el siguiente módulo.
                */

                boton.dataset.codigo =
                    codigo;


                contenedor.appendChild(
                    boton
                );

            }
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
FIN cab16.js v1.3
========================================================
*/

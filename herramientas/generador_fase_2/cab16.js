/*
========================================================
cab16.js v1.2
autocompletado del buscador avanzado
palentropía — generador

CAMBIO v1.2
-----------
- Fuente principal: window.PALEOFICHAS
- No depende de cab15.obtenerDatos()
- 000 no produce falsos resultados
- Búsqueda estable por:
    codigo
    nombre
    j3
    taxon
- El check solo cambia el conjunto de búsqueda
- No carga paleofichas todavía

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
            "cab16 v1.2: autocompletado preparado."
        );

    },


    /*====================================================
      OBTENER DATOS
      Fuente estable: LEEPALJSON
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

                this.datos = datos;

            }

        }

        /*
        Respaldo directo.
        */

        if(
            (!Array.isArray(this.datos) ||
            !this.datos.length) &&
            Array.isArray(window.PALEOFICHAS)
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
            document.createElement("div");

        label.id =
            "labelResultadosCab16";

        label.textContent =
            "Introduce al menos 3 caracteres";


        const etiquetaCheck =
            document.createElement("label");

        etiquetaCheck.id =
            "checkBusquedaCab16";


        const check =
            document.createElement("input");

        check.type =
            "checkbox";

        check.id =
            "buscarTodosCab16";


        const textoCheck =
            document.createElement("span");

        textoCheck.textContent =
            "Buscar en todos los registros";


        etiquetaCheck.appendChild(check);

        etiquetaCheck.appendChild(
            textoCheck
        );


        const resultados =
            document.createElement("div");

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
      CHECK
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
      CAMPO DE BÚSQUEDA
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


        resultados.innerHTML = "";


        if(texto.length < 3){

            label.textContent =
                "Introduce al menos 3 caracteres";

            return;

        }


        /*
        Refrescar datos.
        */

        this.obtenerDatos();


        if(
            !Array.isArray(this.datos) ||
            !this.datos.length
        ){

            label.textContent =
                "No hay datos disponibles.";

            return;

        }


        let conjunto =
            this.datos;


        /*
        Si el check está desactivado,
        se mantiene el comportamiento
        de búsqueda sobre el conjunto activo
        cuando existe.

        Si no existe, se usa todo el conjunto.
        */

        if(!this.buscarTodos){

            const activo =
                this.obtenerConjuntoActivo();

            if(
                Array.isArray(activo) &&
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
      CONJUNTO ACTIVO
    ====================================================*/

    obtenerConjuntoActivo: function(){

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.conjuntoActivo ===
            "function"
        ){

            const conjunto =
                window.PALNAVEGADOR.conjuntoActivo();

            if(Array.isArray(conjunto)){
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
            .toLowerCase();


        const nombre =
            String(
                registro.nombre || ""
            )
            .toLowerCase();


        const j3 =
            String(
                registro.j3 || ""
            )
            .toLowerCase();


        const taxon =
            String(
                registro.taxon || ""
            )
            .toLowerCase();


        return (
            codigo.includes(texto) ||
            nombre.includes(texto) ||
            j3.includes(texto) ||
            taxon.includes(texto)
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
                    registro.codigo || "";


                const nombre =
                    registro.nombre || "";


                boton.textContent =
                    codigo +
                    " — " +
                    nombre;


                /*
                Guardamos el código para
                el siguiente paso.
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
FIN cab16.js v1.2
========================================================
*/

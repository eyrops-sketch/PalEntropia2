/*
========================================================
PalEntropía
cab16.js v1.7 COMPACTA

BUSCADOR AVANZADO POR CÓDIGO

FUNCIÓN
-------
- Busca exclusivamente por J1 / código.
- Check desactivado:
  búsqueda sobre todos los registros.
- Check activado:
  los resultados forman el filtro activo.
- Circuito:
  CAB16
    ↓
  MATRIXFILTRO
    ↓
  MATRIXNAVEGADOR
    ↓
  PALNAVEGADOR.aplicarFiltro()

PALNAVEGADOR controla:
- rango activo
- índice
- anterior
- siguiente
- primero
- último
- aleatorio
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
        this.conectar();

        this.inicializado = true;

    },


    /*====================================================
      DATOS
    ====================================================*/

    obtenerDatos: function(){

        if(
            window.LEEPALJSON &&
            typeof window.LEEPALJSON.obtener === "function"
        ){

            const datos =
                window.LEEPALJSON.obtener();

            if(Array.isArray(datos)){

                this.datos = datos;

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


        const label =
            document.createElement("div");

        label.id =
            "labelResultadosCab16";

        label.textContent =
            "Introduce al menos 3 caracteres";


        const checkLabel =
            document.createElement("label");

        checkLabel.id =
            "checkBusquedaCab16";


        const check =
            document.createElement("input");

        check.type =
            "checkbox";

        check.id =
            "buscarTodosCab16";


        const texto =
            document.createElement("span");

        texto.textContent =
            "Buscar en todos los registros";


        checkLabel.appendChild(check);
        checkLabel.appendChild(texto);


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


        if(campo){

            campo.addEventListener(
                "input",
                () => {

                    this.buscar();

                }
            );

        }


        if(check){

            check.addEventListener(
                "change",
                () => {

                    this.buscarTodos =
                        check.checked;

                    this.buscar();

                }
            );

        }


        if(cerrar){

            cerrar.addEventListener(
                "click",
                () => {

                    const texto =
                        campo
                            ? campo.value.trim()
                            : "";

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


        if(texto.length < 3){

            label.textContent =
                "Introduce al menos 3 caracteres";

            if(this.buscarTodos){

                this.limpiarFiltro();

            }

            return;

        }


        this.obtenerDatos();


        if(!this.datos.length){

            label.textContent =
                "No hay datos disponibles.";

            return;

        }


        /*
        Check activado:
        todos los registros.

        Check desactivado:
        conjunto actualmente activo.
        */

        let conjunto =
            this.datos;


        if(!this.buscarTodos){

            if(
                window.PALNAVEGADOR &&
                typeof window.PALNAVEGADOR.conjuntoActivo ===
                "function"
            ){

                const activo =
                    window.PALNAVEGADOR.conjuntoActivo();

                if(
                    Array.isArray(activo)
                ){

                    conjunto =
                        activo;

                }

            }

        }


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
        SOLO con el check activado
        construimos el nuevo rango.
        */

        if(this.buscarTodos){

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

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            return;

        }


        /*
        MATRIXFILTRO recibe los resultados
        y devuelve los J1.
        */

        const matrizJ1 =
            window.MATRIXFILTRO.actualizar(
                coincidencias
            );


        if(!Array.isArray(matrizJ1)){

            return;

        }


        /*
        MATRIXNAVEGADOR recupera
        los registros completos.
        */

        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener !==
            "function"
        ){

            return;

        }


        const registros =
            await window.MatrixNavegador.obtener(
                matrizJ1
            );


        if(!Array.isArray(registros)){

            return;

        }


        /*
        AQUÍ está la parte importante:

        La matriz completa pasa a PALNAVEGADOR
        como filtro activo.

        Desde este momento:
        anterior / siguiente / aleatorio
        trabajan únicamente dentro de este rango.
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

                const codigo =
                    String(
                        registro.codigo || ""
                    )
                    .trim();


                if(!codigo){

                    return;

                }


                const fila =
                    document.createElement("div");


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
        Cerrar buscador.
        */

        this.cerrar();


        /*
        Cargar mediante PALNAVEGADOR.
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
                    document.getElementById(id);


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

        window.cab16.inicializar();

    }
);


/*
========================================================
FIN cab16.js v1.7 COMPACTA
========================================================
*/

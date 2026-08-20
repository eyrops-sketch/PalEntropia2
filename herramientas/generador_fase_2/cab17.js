/*
========================================================
PalEntropía
cab17.js v1.3 COMPACTA

FILTRO AVANZADO J2 / NOMBRE

- Mínimo 3 caracteres.
- CAB16 conserva J1 / código.
- Usa la interfaz existente de CAB16.
- Check compartido.
- MATRIXFILTRO
- MatrixNavegador
- PALNAVEGADOR
========================================================
*/

window.cab17 = {

    inicializado:false,

    datos:[],

    buscarTodos:false,

    seleccionRealizada:false,

    procesando:false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar:function(){

        if(this.inicializado){

            return;

        }

        this.obtenerDatos();

        this.esperarInterfaz();

    },


    /*====================================================
      ESPERAR INTERFAZ CAB16
    ====================================================*/

    esperarInterfaz:function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        const resultados =
            document.getElementById(
                "resultadosCab16"
            );

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );

        const cerrar =
            document.getElementById(
                "cerrarBuscadorUniversal"
            );


        if(
            !campo ||
            !resultados ||
            !check ||
            !cerrar
        ){

            setTimeout(
                () => this.esperarInterfaz(),
                100
            );

            return;

        }


        this.conectar();

        this.inicializado = true;

        console.log(
            "cab17 v1.3: J2 preparado."
        );

    },


    /*====================================================
      DATOS
    ====================================================*/

    obtenerDatos:function(){

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
      CONEXIÓN
    ====================================================*/

    conectar:function(){

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


        /*----------------------------------------------
          CONSULTA
        ----------------------------------------------*/

        if(campo){

            campo.addEventListener(
                "input",
                () => {

                    if(this.procesando){

                        return;

                    }

                    const texto =
                        campo.value.trim();


                    /*
                    J1 pertenece a CAB16.
                    */

                    if(
                        this.esCodigo(texto)
                    ){

                        return;

                    }


                    this.seleccionRealizada =
                        false;

                    this.buscar();

                }
            );

        }


        /*----------------------------------------------
          CHECK
        ----------------------------------------------*/

        if(check){

            check.addEventListener(
                "change",
                async () => {

                    if(this.procesando){

                        return;

                    }

                    this.buscarTodos =
                        check.checked;

                    this.seleccionRealizada =
                        false;


                    const texto =
                        campo
                            ? campo.value.trim()
                            : "";


                    if(
                        this.esCodigo(texto)
                    ){

                        return;

                    }


                    if(
                        !this.buscarTodos
                    ){

                        this.limpiarFiltro();

                    }


                    await this.buscar();

                }
            );

        }


        /*----------------------------------------------
          CERRAR
        ----------------------------------------------*/

        if(cerrar){

            cerrar.addEventListener(
                "click",
                async () => {

                    if(
                        this.procesando
                    ){

                        return;

                    }


                    const texto =
                        campo
                            ? campo.value.trim()
                            : "";


                    if(
                        this.esCodigo(texto)
                    ){

                        return;

                    }


                    const consulta =
                        this.normalizar(texto);


                    /*
                    Check activo +
                    ninguna selección:
                    cargar primer registro.
                    */

                    if(
                        consulta.length >= 3 &&
                        this.buscarTodos &&
                        !this.seleccionRealizada
                    ){

                        await this.cargarPrimero();

                    }

                }
            );

        }

    },


    /*====================================================
      UTILIDADES
    ====================================================*/

    esCodigo:function(texto){

        return /^\d{3}_\d{2}$/i.test(
            String(texto || "").trim()
        );

    },


    normalizar:function(texto){

        return String(texto || "")
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();

    },


    obtenerJ2:function(registro){

        if(!registro){

            return "";

        }

        if(
            registro.nombre !== undefined
        ){

            return registro.nombre;

        }

        if(
            registro.j2 !== undefined
        ){

            return registro.j2;

        }

        if(
            registro.name !== undefined
        ){

            return registro.name;

        }

        return "";

    },


    /*====================================================
      BUSCAR
    ====================================================*/

    buscar:async function(){

        if(this.procesando){

            return;

        }


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
            this.normalizar(
                campo.value
            );


        resultados.innerHTML = "";


        /*
        MENOS DE 3 CARACTERES
        */

        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";

            this.limpiarFiltro();

            return;

        }


        this.obtenerDatos();


        if(!this.datos.length){

            label.textContent =
                "No hay datos disponibles.";

            return;

        }


        const coincidencias =
            this.datos.filter(
                registro => {

                    const nombre =
                        this.normalizar(
                            this.obtenerJ2(
                                registro
                            )
                        );

                    return nombre.includes(
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


        if(this.buscarTodos){

            await this.aplicarMatrix(
                coincidencias
            );

        }

    },

      /*====================================================
      MOSTRAR RESULTADOS
    ====================================================*/

    mostrar:function(coincidencias){

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
                    ).trim();


                if(!codigo){

                    return;

                }


                const nombre =
                    String(
                        this.obtenerJ2(
                            registro
                        )
                    ).trim();


                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    codigo;


                fila.textContent =
                    nombre
                        ? nombre + " — " + codigo
                        : codigo;


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

    seleccionar:async function(codigo){

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
        Existe selección real.
        */

        this.seleccionRealizada =
            true;


        this.procesando =
            true;


        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(label){

            label.textContent =
                codigo;

        }


        this.cerrar();


        /*
        Cargar exactamente
        la ficha seleccionada.
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


        this.procesando =
            false;

    },


    /*====================================================
      APLICAR MATRIX
    ====================================================*/

    aplicarMatrix:async function(
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

            return;

        }


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

            console.error(
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

            return;

        }


        /*
        El resultado pasa a ser
        el rango de navegación.
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
      CARGAR PRIMERO
    ====================================================*/

    cargarPrimero:async function(){

        if(
            !window.PALNAVEGADOR ||
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
        Posicionar primero.
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
        Cargar primero realmente.
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
      CERRAR
    ====================================================*/

    cerrar:function(){

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

    limpiarFiltro:function(){

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
FIN cab17.js v1.3 COMPACTA
========================================================
*/

/*
========================================================
PalEntropía
cab19.js v1.0

BUSCADOR AVANZADO POR TAXÓN

CIRCUITO
--------
Consulta
↓
PALTAXON
↓
J1 / código
↓
LEEPALJSON → J2 decodificado
↓
MATRIXFILTRO
↓
MatrixNavegador
↓
PALNAVEGADOR.aplicarFiltro()
↓
PALNAVEGADOR.aleatorio()

CAB19 NO MODIFICA:
CAB16
CAB17
CAB18
PALTAXON
LEEPALJSON
========================================================
*/

window.cab19 = {

    inicializado: false,
    seleccionRealizada: false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        if(this.inicializado){
            return;
        }

        this.conectar();
        this.inicializado = true;

    },


    /*====================================================
      NORMALIZAR
    ====================================================*/

    normalizar: function(texto){

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    },


    /*====================================================
      COMPROBAR CÓDIGO
    ====================================================*/

    esCodigo: function(texto){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(texto || "").trim()
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

        if(!campo){
            return;
        }


        campo.addEventListener(
            "input",
            () => {

                this.seleccionRealizada = false;

                const texto =
                    campo.value.trim();

                /*
                Los códigos siguen perteneciendo
                a CAB16.
                */

                if(this.esCodigo(texto)){
                    return;
                }

                this.buscar();

            }
        );


        const check =
            document.getElementById(
                "buscarTodosCab16"
            );

        if(check){

            check.addEventListener(
                "change",
                () => {

                    this.seleccionRealizada = false;

                    this.buscar();

                }
            );

        }

    },


    /*====================================================
      BUSCAR POR TAXÓN
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


        if(!campo || !label || !resultados){
            return [];
        }


        const texto =
            campo.value.trim();


        resultados.innerHTML = "";


        /*
        CÓDIGOS → CAB16
        */

        if(this.esCodigo(texto)){
            return [];
        }


        /*
        MÍNIMO 5 CARACTERES
        */

        if(texto.length < 5){

            label.textContent =
                "Introduce al menos 5 caracteres";

            this.limpiarFiltro();

            return [];

        }


        /*
        PALTAXON
        */

        if(!window.PALTAXON){

            label.textContent =
                "Base taxonómica no disponible.";

            return [];

        }


        const consulta =
            this.normalizar(texto);


        /*
        LEEPALJSON
        */

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            label.textContent =
                "Datos de paleofichas no disponibles.";

            return [];

        }


        const fichas =
            window.LEEPALJSON.obtener();


        if(!Array.isArray(fichas)){

            label.textContent =
                "0 resultados";

            return [];

        }


        /*
        MAPA J1 → J2

        LEEPALJSON contiene el nombre
        decodificado de cada ficha.
        */

        const mapaNombres =
            new Map();

        fichas.forEach(
            ficha => {

                if(
                    !ficha ||
                    !ficha.codigo
                ){
                    return;
                }

                const codigo =
                    String(
                        ficha.codigo
                    )
                    .trim()
                    .toUpperCase();

                mapaNombres.set(
                    codigo,
                    String(
                        ficha.nombre || ""
                    ).trim()
                );

            }
        );


        /*
        COINCIDENCIAS TAXONÓMICAS
        */

        const coincidencias = [];


        Object.keys(
            window.PALTAXON
        ).forEach(
            codigo => {

                const taxon =
                    window.PALTAXON[codigo];


                if(!taxon){
                    return;
                }


                const ta1 =
                    this.normalizar(
                        taxon.ta1
                    );

                const ta2 =
                    this.normalizar(
                        taxon.ta2
                    );


                /*
                BÚSQUEDA PARCIAL

                Ejemplo:

                tyran
                ↓
                tyrannosauridae

                dromeo
                ↓
                dromeosaurido
                */

                if(
                    !ta1.includes(consulta) &&
                    !ta2.includes(consulta)
                ){

                    return;

                }


                const j1 =
                    String(
                        codigo
                    )
                    .trim()
                    .toUpperCase();


                /*
                J2 REAL DESDE LEEPALJSON
                */

                const nombre =
                    mapaNombres.get(j1);


                /*
                Si el J1 taxonómico existe
                pero no existe en los datos cargados,
                no se inventa ningún nombre.
                */

                if(!nombre){
                    return;
                }


                coincidencias.push({

                    codigo:
                        j1,

                    nombre:
                        nombre,

                    tipo:
                        "taxon",

                    relevancia:
                        100

                });

            }
        );


        /*
        ÚNICOS
        */

        const unicas =
            Array.from(
                new Map(
                    coincidencias.map(
                        ficha => [
                            ficha.codigo,
                            ficha
                        ]
                    )
                ).values()
            );


        /*
        CONTADOR
        */

        label.textContent =
            unicas.length +
            (
                unicas.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        MOSTRAR
        */

        this.mostrar(
            unicas
        );


        /*
        GENERAR RANGO
        */

        if(unicas.length){

            await this.aplicarMatrix(
                unicas
            );

        }
        else{

            this.limpiarFiltro();

        }


        return unicas;

    },


    /*====================================================
      MOSTRAR RESULTADOS
    ====================================================*/

    mostrar: function(coincidencias){

        const contenedor =
            document.getElementById(
                "resultadosCab16"
            );


        if(!contenedor){
            return;
        }


        coincidencias.forEach(
            ficha => {

                if(
                    !ficha ||
                    !ficha.codigo
                ){
                    return;
                }


                const codigo =
                    String(
                        ficha.codigo
                    )
                    .trim()
                    .toUpperCase();


                const nombre =
                    String(
                        ficha.nombre ||
                        "Sin nombre"
                    )
                    .trim();


                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    codigo;


                /*
                PRESENTACIÓN FINAL

                J1 + J2 decodificado
                */

                fila.textContent =
                    codigo +
                    "   " +
                    nombre;


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

        if(
            !Array.isArray(coincidencias) ||
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

            return;

        }


        /*
        J1 → MATRIXFILTRO
        */

        const matrizJ1 =
            window.MATRIXFILTRO.actualizar(
                coincidencias
            );


        if(
            !Array.isArray(matrizJ1) ||
            !matrizJ1.length
        ){

            return;

        }


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
                "cab19: error MatrixNavegador.",
                error
            );

            return;

        }


        if(
            !Array.isArray(registros) ||
            !registros.length
        ){

            return;

        }


        if(
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.aplicarFiltro !==
            "function"
        ){

            return;

        }


        /*
        APLICAR RANGO
        */

        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        /*
        ALEATORIO DENTRO DEL RANGO
        */

        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();

            }
            catch(error){

                console.warn(
                    "cab19: error en aleatorio.",
                    error
                );

            }

        }

    },


    /*====================================================
      SELECCIONAR RESULTADO
    ====================================================*/

    seleccionar: async function(codigo){

        codigo =
            String(
                codigo || ""
            )
            .trim()
            .toUpperCase();


        if(!codigo){
            return;
        }


        this.seleccionRealizada = true;


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(campo){
            campo.value = codigo;
        }


        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(label){
            label.textContent = codigo;
        }


        this.cerrar();


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
                    "cab19: error cargando selección.",
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


        [
            "lightboxBuscador",
            "buscadorLightbox",
            "lightboxBusqueda",
            "modalBuscador"
        ].forEach(
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

        window.cab19.inicializar();

    }
);


/*
========================================================
FIN cab19.js v1.0
========================================================
*/

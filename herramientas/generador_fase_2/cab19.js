/*
========================================================
PalEntropía
cab19.js v1.1 LTS

BUSCADOR AVANZADO POR TAXÓN

3 caracteres  → CAB17 NOMBRE
4 caracteres  → CAB18 GEOLOGÍA
5+ caracteres → CAB19 TAXÓN

CAB19 NO INTERFIERE CON CAB16/CAB17/CAB18
========================================================
*/

window.cab19 = {

    inicializado:false,
    seleccionRealizada:false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar:function(){

        if(this.inicializado) return;

        this.conectar();

        this.inicializado=true;

    },


    /*====================================================
      NORMALIZAR
    ====================================================*/

    normalizar:function(texto){

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .trim();

    },


    /*====================================================
      CÓDIGO
    ====================================================*/

    esCodigo:function(texto){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(texto || "").trim()
        );

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar:function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        if(!campo) return;


        campo.addEventListener(
            "input",
            ()=>{

                this.seleccionRealizada=false;

                const texto =
                    campo.value.trim();


                /*
                CAB16
                */

                if(this.esCodigo(texto)){
                    return;
                }


                /*
                MUY IMPORTANTE:

                CAB19 SOLO ACTÚA A PARTIR
                DE 5 CARACTERES.

                No toca las consultas de
                CAB17 ni CAB18.
                */

                if(texto.length < 5){
                    return;
                }


                this.buscar();

            }
        );

    },


    /*====================================================
      BUSCAR TAXÓN
    ====================================================*/

    buscar:async function(){

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


        /*
        CAB19 NO TOCA CONSULTAS CORTAS
        */

        if(
            texto.length < 5 ||
            this.esCodigo(texto)
        ){

            return [];

        }


        resultados.innerHTML="";


        if(!window.PALTAXON){

            label.textContent =
                "Base taxonómica no disponible.";

            return [];

        }


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


        const consulta =
            this.normalizar(texto);


        /*
        ==================================================
        MAPA J1 → J2
        ==================================================

        Aquí está la corrección importante.

        No asumimos que el resultado de la consulta
        contiene "nombre".

        LEEPALJSON es la fuente de J2 decodificado.

        */

        const mapaJ2 =
            new Map();


        fichas.forEach(
            ficha=>{

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


                /*
                LEEPALJSON v1.1 prepara:

                codigo
                nombre
                j3
                dieta
                anatomia

                */

                const nombre =
                    String(
                        ficha.nombre ||
                        ficha.j2 ||
                        ""
                    )
                    .trim();


                if(nombre){

                    mapaJ2.set(
                        codigo,
                        nombre
                    );

                }

            }
        );


        /*
        ==================================================
        BUSCAR EN PALTAXON
        ==================================================
        */

        const coincidencias=[];


        Object.keys(
            window.PALTAXON
        ).forEach(
            codigo=>{

                const taxon =
                    window.PALTAXON[codigo];


                if(!taxon) return;


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

                diaps
                ↓
                diápsido

                tyran
                ↓
                tyrannosauridae

                drome
                ↓
                dromaeosauridae
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
                J2 DECODIFICADO
                */

                const j2 =
                    mapaJ2.get(j1);


                /*
                Si no existe J2 real,
                NO INVENTAMOS NADA.
                */

                if(!j2){
                    return;
                }


                coincidencias.push({

                    codigo:j1,

                    nombre:j2,

                    tipo:"taxon",

                    relevancia:100

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
                        ficha=>[
                            ficha.codigo,
                            ficha
                        ]
                    )
                ).values()
            );


        label.textContent =
            unicas.length +
            (
                unicas.length===1
                    ? " resultado"
                    : " resultados"
            );


        this.mostrar(
            unicas
        );


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
      MOSTRAR
    ====================================================*/

    mostrar:function(coincidencias){

        const contenedor =
            document.getElementById(
                "resultadosCab16"
            );

        if(!contenedor) return;


        coincidencias.forEach(
            ficha=>{

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
                PRESENTACIÓN FINAL:

                J1 + J2
                */

                fila.textContent =
                    codigo +
                    "   " +
                    nombre;


                fila.addEventListener(
                    "click",
                    ()=>{
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

    aplicarMatrix:async function(
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
        RANGO TAXONÓMICO
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
      SELECCIONAR
    ====================================================*/

    seleccionar:async function(codigo){

        codigo =
            String(
                codigo || ""
            )
            .trim()
            .toUpperCase();


        if(!codigo) return;


        this.seleccionRealizada=true;


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

    cerrar:function(){

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
            id=>{

                const elemento =
                    document.getElementById(id);


                if(elemento){

                    elemento.style.display="none";

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
      LIMPIAR
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

        window.cab19.inicializar();

    }
);


/*
========================================================
FIN cab19.js v1.1 LTS
========================================================
*/

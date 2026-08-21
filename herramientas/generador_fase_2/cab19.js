/*
========================================================
PalEntropía
cab19.js v1.2 LTS

BUSCADOR AVANZADO — TAXÓN

CAB16 → CÓDIGO
CAB17 → NOMBRE
CAB18 → TIEMPO GEOLÓGICO
CAB19 → TAXÓN

PRIORIDAD:
1. Código
2. Nombre
3. Tiempo geológico
4. Taxón

CAB19 ACTÚA DESDE 5 CARACTERES.

NO INTERFIERE CON CAB17 NI CAB18.
========================================================
*/

window.cab19 = {

    inicializado:false,
    seleccionRealizada:false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar:function(){

        if(this.inicializado){
            return;
        }

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

        if(!campo){
            return;
        }


        campo.addEventListener(
            "input",
            ()=>{

                this.seleccionRealizada=false;

                const texto =
                    campo.value.trim();


                /*
                CÓDIGO → CAB16
                */

                if(this.esCodigo(texto)){
                    return;
                }


                /*
                CAB17 Y CAB18
                */

                if(texto.length<5){
                    return;
                }


                this.buscar();

            }
        );

    },


    /*====================================================
      BUSCAR
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


        if(
            !campo ||
            !label ||
            !resultados
        ){

            return [];

        }


        const texto =
            campo.value.trim();


        /*
        CAB19 SOLO DESDE 5
        */

        if(
            texto.length<5 ||
            this.esCodigo(texto)
        ){

            return [];

        }


        /*
        ==================================================
        PRIORIDAD NOMBRE
        ==================================================
        */

        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.buscarPorNombre===
            "function"
        ){

            try{

                const nombres =
                    await window.PALBUSCADOR.buscarPorNombre(
                        texto
                    );


                /*
                Si CAB17 encuentra algo,
                CAB19 NO TOCA NADA.
                */

                if(
                    Array.isArray(nombres) &&
                    nombres.length
                ){

                    return nombres;

                }

            }
            catch(error){}

        }


        /*
        ==================================================
        PRIORIDAD GEOLOGÍA
        ==================================================
        */

        if(
            Array.isArray(window.PALGEO)
        ){

            const consulta =
                this.normalizar(texto);


            const geo =
                window.PALGEO.some(
                    intervalo=>{

                        if(!intervalo){
                            return false;
                        }


                        return [

                            intervalo.eon,
                            intervalo.era,
                            intervalo.periodo,
                            intervalo.edad

                        ].some(
                            valor=>
                                this.normalizar(
                                    valor
                                ).includes(
                                    consulta
                                )
                        );

                    }
                );


            /*
            Si CAB18 reconoce la consulta,
            CAB19 NO TOCA NADA.

            Permi → Pérmico
            Cretác → Cretácico
            */

            if(geo){

                return [];

            }

        }


        /*
        ==================================================
        LIMPIAR SOLO AHORA
        ==================================================
        */

        resultados.innerHTML="";


        /*
        ==================================================
        PALTAXON
        ==================================================
        */

        if(!window.PALTAXON){

            label.textContent =
                "Base taxonómica no disponible.";

            return [];

        }


        /*
        ==================================================
        LEEPALJSON
        ==================================================
        */

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener!==
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
        ==================================================
        MAPA J1 → J2 REAL
        ==================================================

        EXACTAMENTE COMO CAB18.

        */

        let mapaNombres =
            new Map();


        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.obtenerMapaNombres===
            "function"
        ){

            try{

                mapaNombres =
                    await window.PALBUSCADOR.obtenerMapaNombres();

            }
            catch(error){

                mapaNombres =
                    new Map();

            }

        }


        /*
        ==================================================
        CONSULTA TAXONÓMICA
        ==================================================
        */

        const consulta =
            this.normalizar(texto);


        const coincidencias=[];


        Object.keys(
            window.PALTAXON
        ).forEach(
            codigo=>{

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

                Diaps
                → Diápsido

                Tyran
                → Tyrannosauridae

                Drome
                → Dromeosáurido
                */

                if(
                    !ta1.includes(consulta) &&
                    !ta2.includes(consulta)
                ){

                    return;

                }


                const j1 =
                    String(codigo)
                    .trim()
                    .toUpperCase();


                /*
                J2 REAL

                NO usamos ficha.nombre
                porque puede contener j2.

                */

                const nombre =
                    mapaNombres.get(j1);


                /*
                NO INVENTAR J2
                */

                if(!nombre){
                    return;
                }


                coincidencias.push({

                    codigo:j1,
                    nombre:nombre,
                    tipo:"taxon",
                    relevancia:100

                });

            }
        );


        /*
        ==================================================
        ÚNICOS
        ==================================================
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


        /*
        ==================================================
        CONTADOR
        ==================================================
        */

        label.textContent =
            unicas.length +
            (
                unicas.length===1
                    ? " resultado"
                    : " resultados"
            );


        /*
        ==================================================
        MOSTRAR
        ==================================================
        */

        this.mostrar(
            unicas
        );


        /*
        ==================================================
        MATRIX
        ==================================================
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
      MOSTRAR
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
                        ""
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

            return;

        }


        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar!==
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
            typeof window.MatrixNavegador.obtener!==
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
            typeof window.PALNAVEGADOR.aplicarFiltro!==
            "function"
        ){

            return;

        }


        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();

            }
            catch(error){}

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


        if(!codigo){
            return;
        }


        this.seleccionRealizada=true;


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(campo){
            campo.value=codigo;
        }


        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(label){
            label.textContent=codigo;
        }


        this.cerrar();


        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.cargarPorCodigo===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.cargarPorCodigo(
                    codigo
                );

            }
            catch(error){}

        }

    },


    /*====================================================
      CERRAR
    ====================================================*/

    cerrar:function(){

        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.cerrar===
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
            typeof window.PALNAVEGADOR.limpiarFiltro===
            "function"
        ){

            window.PALNAVEGADOR.limpiarFiltro();

        }


        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar===
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
FIN cab19.js v1.2 LTS
========================================================
*/

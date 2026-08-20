/*
========================================================
PalEntropía
cab18.js v1.5 LTS

BUSCADOR AVANZADO — TIEMPO GEOLÓGICO

CAB16 → CÓDIGO
CAB17 → NOMBRE
CAB18 → TIEMPO GEOLÓGICO

REGLAS
------
Código:
sin restricción.

Nombre:
mínimo 3 caracteres.

Tiempo geológico:
mínimo 4 caracteres.

CAB18 busca únicamente:

- eón
- era
- período
- edad

NO interpreta Ma.

RESULTADOS:
código + nombre real.

CHECK:
consulta completa
→ aplica rango
→ sin selección manual = aleatorio.
========================================================
*/

window.cab18 = {

    inicializado:false,
    buscarTodos:false,
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

    normalizarTexto:function(texto){

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"");

    },


    /*====================================================
      COMPROBAR CÓDIGO
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
            async ()=>{

                this.seleccionRealizada=false;

                const texto=
                    campo.value.trim();


                /*
                --------------------------------------------
                CÓDIGO → CAB16
                --------------------------------------------
                */

                if(this.esCodigo(texto)){
                    return;
                }


                /*
                --------------------------------------------
                MENOS DE 4 → CAB18 NO INTERVIENE

                CAB17 puede trabajar con 3 caracteres.
                --------------------------------------------
                */

                if(texto.length < 4){
                    return;
                }


                await this.buscar();

            }
        );


        /*
        --------------------------------------------
        CHECK
        --------------------------------------------
        */

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );

        if(check){

            check.addEventListener(
                "change",
                async ()=>{

                    this.buscarTodos=
                        check.checked;

                    this.seleccionRealizada=false;

                    const texto=
                        campo.value.trim();

                    if(
                        texto.length < 4 ||
                        this.esCodigo(texto)
                    ){
                        return;
                    }

                    await this.buscar();

                }
            );

        }

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


        const texto=
            campo.value.trim();


        /*
        --------------------------------------------
        CAB16
        --------------------------------------------
        */

        if(this.esCodigo(texto)){
            return [];
        }


        /*
        --------------------------------------------
        CAB17
        --------------------------------------------

        Con 3 caracteres CAB18 no interviene.
        --------------------------------------------
        */

        if(texto.length < 4){
            return [];
        }


        resultados.innerHTML="";


        /*
        --------------------------------------------
        PALGEO
        --------------------------------------------
        */

        if(
            !window.PALGEO ||
            !Array.isArray(window.PALGEO)
        ){

            label.textContent=
                "Base geológica no disponible.";

            return [];

        }


        const consulta=
            this.normalizarTexto(texto);


        /*
        --------------------------------------------
        BUSCAR INTERVALOS
        --------------------------------------------
        */

        const intervalos=
            window.PALGEO.filter(
                intervalo=>{

                    if(!intervalo){
                        return false;
                    }

                    const eon=
                        this.normalizarTexto(
                            intervalo.eon
                        );

                    const era=
                        this.normalizarTexto(
                            intervalo.era
                        );

                    const periodo=
                        this.normalizarTexto(
                            intervalo.periodo
                        );

                    const edad=
                        this.normalizarTexto(
                            intervalo.edad
                        );

                    return(
                        eon.includes(consulta) ||
                        era.includes(consulta) ||
                        periodo.includes(consulta) ||
                        edad.includes(consulta)
                    );

                }
            );


        /*
        --------------------------------------------
        SIN INTERVALOS
        --------------------------------------------
        */

        if(!intervalos.length){

            label.textContent=
                "0 resultados";

            return [];

        }


        /*
        --------------------------------------------
        LEEPALJSON
        --------------------------------------------
        */

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            label.textContent=
                "Datos de paleofichas no disponibles.";

            return [];

        }


        const fichas=
            window.LEEPALJSON.obtener();


        if(!Array.isArray(fichas)){

            label.textContent=
                "0 resultados";

            return [];

        }


        /*
        --------------------------------------------
        COINCIDENCIAS TEMPORALES
        --------------------------------------------
        */

        const coincidencias=
            fichas.filter(
                ficha=>{

                    if(
                        !ficha ||
                        !ficha.j3
                    ){
                        return false;
                    }


                    const partes=
                        String(ficha.j3)
                            .split("-");


                    if(partes.length!==2){
                        return false;
                    }


                    const inicio=
                        Number(partes[0]);

                    const fin=
                        Number(partes[1]);


                    if(
                        !Number.isFinite(inicio) ||
                        !Number.isFinite(fin)
                    ){
                        return false;
                    }


                    /*
                    --------------------------------
                    SOLAPAMIENTO REAL

                    Los extremos solamente iguales
                    NO cuentan como coincidencia.
                    --------------------------------
                    */

                    return intervalos.some(
                        intervalo=>{

                            const geoInicio=
                                Number(
                                    intervalo.inicio_ma
                                );

                            const geoFin=
                                Number(
                                    intervalo.fin_ma
                                );

                            if(
                                !Number.isFinite(
                                    geoInicio
                                ) ||
                                !Number.isFinite(
                                    geoFin
                                )
                            ){
                                return false;
                            }


                            return(
                                Math.min(
                                    inicio,
                                    geoInicio
                                )
                                >
                                Math.max(
                                    fin,
                                    geoFin
                                )
                            );

                        }
                    );

                }
            );


        /*
        --------------------------------------------
        CONTADOR
        --------------------------------------------
        */

        label.textContent=
            coincidencias.length +
            (
                coincidencias.length===1
                    ? " resultado"
                    : " resultados"
            );


        /*
        --------------------------------------------
        MOSTRAR
        --------------------------------------------
        */

        this.mostrar(
            coincidencias
        );


        /*
        --------------------------------------------
        CHECK
        --------------------------------------------
        */

        if(this.buscarTodos){

            await this.aplicarFiltro(
                coincidencias
            );

        }


        return coincidencias;

    },


    /*====================================================
      MOSTRAR RESULTADOS
    ====================================================*/

    mostrar:function(coincidencias){

        const contenedor=
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


                const codigo=
                    String(
                        ficha.codigo
                    )
                    .trim()
                    .toUpperCase();


                /*
                ----------------------------------------
                NOMBRE REAL

                Primero nombre.
                j2 queda como respaldo.
                ----------------------------------------
                */

                const nombre=
                    String(
                        ficha.nombre ||
                        ficha.j2 ||
                        "Sin nombre"
                    )
                    .trim();


                const fila=
                    document.createElement(
                        "div"
                    );


                fila.className=
                    "resultadoCab16";


                fila.dataset.codigo=
                    codigo;


                /*
                ----------------------------------------
                CÓDIGO + NOMBRE
                ----------------------------------------
                */

                fila.textContent=
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
      APLICAR FILTRO
    ====================================================*/

    aplicarFiltro:async function(
        coincidencias
    ){

        if(
            !Array.isArray(coincidencias) ||
            !coincidencias.length
        ){
            return;
        }


        /*
        --------------------------------------------
        MATRIXFILTRO
        --------------------------------------------
        */

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){
            return;
        }


        const matrizJ1=
            window.MATRIXFILTRO.actualizar(
                coincidencias
            );


        if(!Array.isArray(matrizJ1)){
            return;
        }


        /*
        --------------------------------------------
        MATRIXNAVEGADOR
        --------------------------------------------
        */

        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener !==
            "function"
        ){
            return;
        }


        let registros;


        try{

            registros=
                await window.MatrixNavegador.obtener(
                    matrizJ1
                );

        }
        catch(error){

            console.warn(
                "cab18: error MatrixNavegador",
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


        /*
        --------------------------------------------
        PALNAVEGADOR
        --------------------------------------------
        */

        if(
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.aplicarFiltro !==
            "function"
        ){
            return;
        }


        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        /*
        --------------------------------------------
        ALEATORIO AUTOMÁTICO

        CHECK ACTIVADO
        +
        NO HAY SELECCIÓN MANUAL
        --------------------------------------------
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
                    "cab18: error aleatorio",
                    error
                );

            }

        }

    },


    /*====================================================
      SELECCIONAR
    ====================================================*/

    seleccionar:async function(
        codigo
    ){

        codigo=
            String(codigo || "")
                .trim()
                .toUpperCase();


        if(!codigo){
            return;
        }


        /*
        --------------------------------------------
        SELECCIÓN MANUAL
        --------------------------------------------
        */

        this.seleccionRealizada=true;


        const campo=
            document.getElementById(
                "buscarUniversal"
            );


        if(campo){
            campo.value=codigo;
        }


        const label=
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(label){
            label.textContent=codigo;
        }


        /*
        --------------------------------------------
        CERRAR BUSCADOR
        --------------------------------------------
        */

        this.cerrar();


        /*
        --------------------------------------------
        CARGAR FICHA
        --------------------------------------------
        */

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
                    "cab18: error cargando ficha",
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


        const ids=[
            "lightboxBuscador",
            "buscadorLightbox",
            "lightboxBusqueda",
            "modalBuscador"
        ];


        ids.forEach(
            id=>{

                const elemento=
                    document.getElementById(id);

                if(elemento){

                    elemento.style.display=
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

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    ()=>{
        window.cab18.inicializar();
    }
);


/*
========================================================
FIN cab18.js v1.5 LTS
========================================================
*/

/*
========================================================
PalEntropía
cab18.js v1.2

BUSCADOR AVANZADO — TIEMPO GEOLÓGICO

BUSCA POR:
- Eón
- Era
- Período
- Edad

CAB16 → CÓDIGO
CAB17 → NOMBRE
CAB18 → TIEMPO GEOLÓGICO

REGLA:
La búsqueda geológica se realiza contra PALGEO.

RESULTADO:
codigo + nombre real de PALEOFICHAS.

CHECK:
☐ Consulta → permite seleccionar.
☑ Consulta completa → activa el rango.

Si no existe selección manual:
→ aleatorio dentro del rango.
========================================================
*/

window.cab18 = {

    inicializado: false,

    buscarTodos: false,

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

        console.log(
            "cab18 v1.2: búsqueda geológica preparada."
        );

    },


    /*====================================================
      NORMALIZAR TEXTO
    ====================================================*/

    normalizarTexto: function(
        texto
    ){

        return String(
            texto || ""
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

    },


    /*====================================================
      COMPROBAR CÓDIGO
    ====================================================*/

    esCodigo: function(
        texto
    ){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(
                texto || ""
            ).trim()
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

            console.warn(
                "cab18: campo buscarUniversal no encontrado."
            );

            return;

        }


        /*
        ------------------------------------------------
        INPUT
        ------------------------------------------------
        */

        campo.addEventListener(
            "input",
            async () => {

                this.seleccionRealizada =
                    false;


                const texto =
                    campo.value.trim();


                /*
                CÓDIGO → CAB16
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                await this.buscar();

            }
        );


        /*
        ------------------------------------------------
        CHECK
        ------------------------------------------------
        */

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(check){

            check.addEventListener(
                "change",
                async () => {

                    this.buscarTodos =
                        check.checked;


                    this.seleccionRealizada =
                        false;


                    await this.buscar();

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

            return [];

        }


        const texto =
            campo.value.trim();


        resultados.innerHTML =
            "";


        /*
        ------------------------------------------------
        CÓDIGO
        ------------------------------------------------

        CAB18 no procesa códigos.
        ------------------------------------------------
        */

        if(
            this.esCodigo(
                texto
            )
        ){

            return [];

        }


        /*
        ------------------------------------------------
        CONSULTA VACÍA
        ------------------------------------------------
        */

        if(
            texto === ""
        ){

            label.textContent =
                "";

            return [];

        }


        /*
        ------------------------------------------------
        PALGEO
        ------------------------------------------------
        */

        if(
            !window.PALGEO ||
            !Array.isArray(
                window.PALGEO
            )
        ){

            label.textContent =
                "Base geológica no disponible.";

            return [];

        }


        /*
        ------------------------------------------------
        NORMALIZAR CONSULTA
        ------------------------------------------------
        */

        const consulta =
            this.normalizarTexto(
                texto
            );


        /*
        ------------------------------------------------
        BUSCAR EN PALGEO
        ------------------------------------------------

        Se compara contra:

        eón
        era
        período
        edad

        Los acentos se ignoran.
        ------------------------------------------------
        */

        const encontrados =
            window.PALGEO.filter(
                intervalo => {

                    const eon =
                        this.normalizarTexto(
                            intervalo.eon
                        );


                    const era =
                        this.normalizarTexto(
                            intervalo.era
                        );


                    const periodo =
                        this.normalizarTexto(
                            intervalo.periodo
                        );


                    const edad =
                        this.normalizarTexto(
                            intervalo.edad
                        );


                    return (

                        eon.includes(
                            consulta
                        )

                        ||

                        era.includes(
                            consulta
                        )

                        ||

                        periodo.includes(
                            consulta
                        )

                        ||

                        edad.includes(
                            consulta
                        )

                    );

                }
            );


        /*
        ------------------------------------------------
        SIN RESULTADOS GEOLOGICOS
        ------------------------------------------------
        */

        if(
            !encontrados.length
        ){

            label.textContent =
                "0 resultados";

            return [];

        }


        /*
        ------------------------------------------------
        LEEPALJSON
        ------------------------------------------------
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


        if(
            !Array.isArray(
                fichas
            )
        ){

            label.textContent =
                "0 resultados";

            return [];

        }


        /*
        ------------------------------------------------
        BUSCAR FICHAS POR SOLAPAMIENTO TEMPORAL REAL
        ------------------------------------------------
        */

        const coincidencias =
            fichas.filter(
                ficha => {

                    if(
                        !ficha ||
                        !ficha.j3
                    ){

                        return false;

                    }


                    const partes =
                        String(
                            ficha.j3
                        )
                        .split("-");


                    if(
                        partes.length !== 2
                    ){

                        return false;

                    }


                    const inicio =
                        Number(
                            partes[0]
                        );


                    const fin =
                        Number(
                            partes[1]
                        );


                    if(
                        !Number.isFinite(
                            inicio
                        ) ||
                        !Number.isFinite(
                            fin
                        )
                    ){

                        return false;

                    }


                    /*
                    ------------------------------------
                    SOLAPAMIENTO TEMPORAL REAL
                    ------------------------------------
                    */

                    return encontrados.some(
                        intervalo => {

                            const geoInicio =
                                Number(
                                    intervalo.inicio_ma
                                );


                            const geoFin =
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


                            return (

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
        ------------------------------------------------
        RESULTADOS
        ------------------------------------------------
        */

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
        ------------------------------------------------
        CHECK ACTIVADO
        ------------------------------------------------
        */

        if(
            this.buscarTodos
        ){

            await this.aplicarFiltro(
                coincidencias
            );

        }


        return coincidencias;

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


        if(
            !contenedor
        ){

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
      APLICAR FILTRO
    ====================================================*/

    aplicarFiltro: async function(
        coincidencias
    ){

        if(
            !Array.isArray(
                coincidencias
            ) ||
            !coincidencias.length
        ){

            return;

        }


        /*
        ------------------------------------------------
        MATRIXFILTRO
        ------------------------------------------------
        */

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            console.warn(
                "cab18: MATRIXFILTRO no disponible."
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
            )
        ){

            return;

        }


        /*
        ------------------------------------------------
        MATRIXNAVEGADOR
        ------------------------------------------------
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

            registros =
                await window.MatrixNavegador.obtener(
                    matrizJ1
                );

        }
        catch(error){

            console.warn(
                "cab18: error en MatrixNavegador.",
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
        ------------------------------------------------
        PALNAVEGADOR
        ------------------------------------------------
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
        ------------------------------------------------
        ALEATORIO
        ------------------------------------------------

        Si el check está activo y no existe
        selección manual:

        → aleatorio dentro del rango.
        ------------------------------------------------
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
                    "cab18: error en aleatorio.",
                    error
                );

            }

        }

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


        if(
            !codigo
        ){

            return;

        }


        this.seleccionRealizada =
            true;


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(
            campo
        ){

            campo.value =
                codigo;

        }


        const label =
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(
            label
        ){

            label.textContent =
                codigo;

        }


        this.cerrar();


        /*
        ------------------------------------------------
        CARGAR FICHA
        ------------------------------------------------
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
                    "cab18: error cargando selección.",
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


                if(
                    elemento
                ){

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

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        window.cab18.inicializar();

    }
);


/*
========================================================
FIN cab18.js v1.2
========================================================
*/

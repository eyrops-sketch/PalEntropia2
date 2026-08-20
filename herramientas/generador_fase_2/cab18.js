/*
========================================================
PalEntropía
cab18.js v1.4

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

CAB18 busca exclusivamente por:

- eón
- era
- período
- edad

NO interpreta Ma.

RESULTADOS:
código + nombre.

CHECK:
☑ consulta completa
→ rango activo + aleatorio.

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

        if(
            this.inicializado
        ){

            return;

        }


        this.conectar();


        this.inicializado =
            true;


        console.log(
            "cab18 v1.4: búsqueda geológica preparada."
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
        .normalize(
            "NFD"
        )
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


        if(
            !campo
        ){

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
                ----------------------------------------
                CÓDIGO → CAB16
                ----------------------------------------
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                /*
                ----------------------------------------
                MENOS DE 4 CARACTERES

                CAB18 NO INTERVIENE.

                Esto permite que CAB17
                trabaje desde 3 caracteres.
                ----------------------------------------
                */

                if(
                    texto.length < 4
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


        if(
            check
        ){

            check.addEventListener(
                "change",
                async () => {

                    this.buscarTodos =
                        check.checked;


                    this.seleccionRealizada =
                        false;


                    const texto =
                        campo.value.trim();


                    /*
                    ------------------------------------
                    SOLO PROCESAR CONSULTAS GEOLOGICAS
                    ------------------------------------
                    */

                    if(
                        texto.length < 4 ||
                        this.esCodigo(
                            texto
                        )
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


        /*
        ------------------------------------------------
        CÓDIGO → CAB16
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
        MÍNIMO 4 CARACTERES
        ------------------------------------------------
        */

        if(
            texto.length < 4
        ){

            return [];

        }


        resultados.innerHTML =
            "";


        /*
        ------------------------------------------------
        PALGEO DISPONIBLE
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

        SOLO:

        eón
        era
        período
        edad

        No se consulta:

        - código
        - cronología
        - Ma
        - j3
        ------------------------------------------------
        */

        const intervalos =
            window.PALGEO.filter(
                intervalo => {

                    if(
                        !intervalo
                    ){

                        return false;

                    }


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
        SIN COINCIDENCIAS GEOLOGICAS
        ------------------------------------------------
        */

        if(
            !intervalos.length
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
        BUSCAR FICHAS
        ------------------------------------------------

        Una ficha pertenece al resultado si su
        intervalo temporal tiene SOLAPAMIENTO REAL
        con al menos uno de los intervalos encontrados.
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
                    SOLAPAMIENTO REAL
                    ------------------------------------
                    */

                    return intervalos.some(
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


                            /*
                            --------------------------------
                            Los extremos deben compartir
                            tiempo real.

                            Si solamente coinciden en
                            un límite → FALSE.
                            --------------------------------
                            */

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
        CONTADOR
        ------------------------------------------------
        */

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        ------------------------------------------------
        MOSTRAR RESULTADOS
        ------------------------------------------------
        */

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
      MOSTRAR
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


                /*
                ----------------------------------------
                CÓDIGO + NOMBRE
                ----------------------------------------
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
      APLICAR FILTRO
    ====================================================*/

    aplicarFiltro: async function(
        coincidencias
    ){

        /*
        ------------------------------------------------
        SIN RESULTADOS
        ------------------------------------------------
        */

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

            console.warn(
                "cab18: MATRIXFILTRO no devolvió matriz."
            );

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

            console.warn(
                "cab18: MatrixNavegador no disponible."
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

            console.warn(
                "cab18: no hay registros para el filtro."
            );

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

            console.warn(
                "cab18: PALNAVEGADOR.aplicarFiltro no disponible."
            );

            return;

        }


        /*
        ------------------------------------------------
        APLICAR RANGO
        ------------------------------------------------
        */

        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        console.log(
            "cab18: rango aplicado:",
            registros.length,
            "registros."
        );


        /*
        ------------------------------------------------
        ALEATORIO
        ------------------------------------------------

        CHECK ACTIVADO
        +
        SIN SELECCIÓN MANUAL

        → ficha aleatoria dentro del rango.
        ------------------------------------------------
        */

        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();


                console.log(
                    "cab18: aleatorio automático dentro del rango."
                );

            }
            catch(error){

                console.warn(
                    "cab18: error en aleatorio automático.",
                    error
                );

            }

        }

    },


    /*====================================================
      SELECCIONAR RESULTADO
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


        /*
        ------------------------------------------------
        SELECCIÓN MANUAL
        ------------------------------------------------
        */

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


        /*
        ------------------------------------------------
        CERRAR
        ------------------------------------------------
        */

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

        /*
        ------------------------------------------------
        CIERRE OFICIAL
        ------------------------------------------------
        */

        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.cerrar ===
            "function"
        ){

            window.PALBUSCADOR.cerrar();

            return;

        }


        /*
        ------------------------------------------------
        RESPALDO VISUAL
        ------------------------------------------------
        */

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
FIN cab18.js v1.4
========================================================
*/

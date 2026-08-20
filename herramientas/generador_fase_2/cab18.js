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
mínimo 3 caracteres → CAB17.

Tiempo geológico:
mínimo 4 caracteres → CAB18.

CAB18 busca exclusivamente por:

- eón
- era
- período
- edad

NO interpreta Ma.

RESULTADOS:
código + nombre real.

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

        this.inicializado = true;

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
      OBTENER NOMBRE REAL
    ====================================================*/

    obtenerNombre: function(
        ficha
    ){

        if(
            !ficha
        ){

            return "Sin nombre";

        }


        /*
        -----------------------------------------------
        1. nombre
        -----------------------------------------------
        */

        let nombre =
            String(
                ficha.nombre ||
                ""
            ).trim();


        if(
            nombre
        ){

            return nombre;

        }


        /*
        -----------------------------------------------
        2. j2
        -----------------------------------------------
        */

        nombre =
            String(
                ficha.j2 ||
                ""
            ).trim();


        if(
            nombre
        ){

            return nombre;

        }


        /*
        -----------------------------------------------
        3. BUSCAR POR CÓDIGO
        -----------------------------------------------
        */

        const codigo =
            String(
                ficha.codigo ||
                ficha.j1 ||
                ""
            )
            .trim()
            .toUpperCase();


        if(
            codigo &&
            Array.isArray(
                window.PALEOFICHAS
            )
        ){

            const registro =
                window.PALEOFICHAS.find(
                    item => {

                        if(
                            !item
                        ){

                            return false;

                        }


                        const c =
                            String(
                                item.codigo ||
                                item.j1 ||
                                ""
                            )
                            .trim()
                            .toUpperCase();


                        return c === codigo;

                    }
                );


            if(
                registro
            ){

                nombre =
                    String(
                        registro.nombre ||
                        registro.j2 ||
                        ""
                    ).trim();


                if(
                    nombre
                ){

                    return nombre;

                }

            }

        }


        return "Sin nombre";

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
                MENOS DE 4

                CAB18 NO INTERVIENE.
                CAB17 puede trabajar desde 3.
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
        -----------------------------------------------
        CÓDIGO → CAB16
        -----------------------------------------------
        */

        if(
            this.esCodigo(
                texto
            )
        ){

            return [];

        }


        /*
        -----------------------------------------------
        TIEMPO → MÍNIMO 4
        -----------------------------------------------
        */

        if(
            texto.length < 4
        ){

            return [];

        }


        resultados.innerHTML = "";


        /*
        -----------------------------------------------
        PALGEO
        -----------------------------------------------
        */

        if(
            !Array.isArray(
                window.PALGEO
            )
        ){

            label.textContent =
                "Base geológica no disponible.";

            return [];

        }


        const consulta =
            this.normalizarTexto(
                texto
            );


        /*
        -----------------------------------------------
        BUSCAR EÓN / ERA / PERÍODO / EDAD
        -----------------------------------------------
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
        -----------------------------------------------
        SIN RESULTADOS
        -----------------------------------------------
        */

        if(
            !intervalos.length
        ){

            label.textContent =
                "0 resultados";

            return [];

        }


        /*
        -----------------------------------------------
        LEEPALJSON
        -----------------------------------------------
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
        -----------------------------------------------
        FILTRAR POR SOLAPAMIENTO TEMPORAL REAL
        -----------------------------------------------
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
                        .trim()
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
        -----------------------------------------------
        CONTADOR
        -----------------------------------------------
        */

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        -----------------------------------------------
        MOSTRAR
        -----------------------------------------------
        */

        this.mostrar(
            coincidencias
        );


        /*
        -----------------------------------------------
        CHECK
        -----------------------------------------------
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


        contenedor.innerHTML = "";


        coincidencias.forEach(
            ficha => {

                if(
                    !ficha
                ){

                    return;

                }


                const codigo =
                    String(
                        ficha.codigo ||
                        ficha.j1 ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                if(
                    !codigo
                ){

                    return;

                }


                const nombre =
                    this.obtenerNombre(
                        ficha
                    );


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
                CÓDIGO + NOMBRE REAL
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

        if(
            !Array.isArray(
                coincidencias
            ) ||
            !coincidencias.length
        ){

            return;

        }


        /*
        -----------------------------------------------
        MATRIXFILTRO
        -----------------------------------------------
        */

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
            !Array.isArray(
                matrizJ1
            )
        ){

            return;

        }


        /*
        -----------------------------------------------
        MATRIXNAVEGADOR
        -----------------------------------------------
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
        catch(
            error
        ){

            console.warn(
                "cab18: error MatrixNavegador.",
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
        -----------------------------------------------
        PALNAVEGADOR
        -----------------------------------------------
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
        -----------------------------------------------
        ALEATORIO AUTOMÁTICO
        -----------------------------------------------

        CHECK ACTIVADO
        +
        SIN SELECCIÓN MANUAL

        → aleatorio dentro del rango.
        -----------------------------------------------
        */

        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();

            }
            catch(
                error
            ){

                console.warn(
                    "cab18: error aleatorio.",
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
        -----------------------------------------------
        SELECCIÓN MANUAL
        -----------------------------------------------
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
        -----------------------------------------------
        CERRAR
        -----------------------------------------------
        */

        this.cerrar();


        /*
        -----------------------------------------------
        CARGAR FICHA
        -----------------------------------------------
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
            catch(
                error
            ){

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
FIN cab18.js v1.5 LTS
========================================================
*/


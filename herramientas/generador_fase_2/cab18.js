/*
========================================================
PalEntropía
cab18.js v2.0 LTS

BUSCADOR AVANZADO — TIEMPO GEOLÓGICO

CAB16 → CÓDIGO
CAB17 → NOMBRE
CAB18 → TIEMPO GEOLÓGICO

TIEMPO:
- mínimo 4 caracteres
- eón
- era
- período
- edad
- NO interpreta Ma

CIRCUITO:

PALGEO
↓
J1
↓
nombre
↓
MATRIXFILTRO
↓
MatrixNavegador
↓
PALNAVEGADOR
↓
aleatorio dentro del rango

RESULTADOS:
J1 + nombre real
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
      NORMALIZAR
    ====================================================*/

    normalizar: function(texto){

        return String(
            texto || ""
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

    },


    /*====================================================
      CÓDIGO
    ====================================================*/

    esCodigo: function(texto){

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

            return;

        }


        /*-----------------------------------------------
          INPUT
        -----------------------------------------------*/

        campo.addEventListener(
            "input",
            () => {

                this.seleccionRealizada = false;

                const texto =
                    campo.value.trim();


                /*
                Códigos → CAB16
                */

                if(
                    this.esCodigo(texto)
                ){

                    return;

                }


                /*
                CAB17 trabaja desde 3 caracteres.

                CAB18 solamente entra desde 4.
                */

                if(
                    texto.length < 4
                ){

                    return;

                }


                this.buscar();

            }
        );


        /*-----------------------------------------------
          CHECK
        -----------------------------------------------*/

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );

        if(
            check
        ){

            check.addEventListener(
                "change",
                () => {

                    this.buscarTodos =
                        check.checked;

                    this.seleccionRealizada =
                        false;

                    const texto =
                        campo.value.trim();

                    if(
                        texto.length >= 4 &&
                        !this.esCodigo(texto)
                    ){

                        this.buscar();

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

            return [];

        }


        const texto =
            campo.value.trim();


        if(
            texto.length < 4 ||
            this.esCodigo(texto)
        ){

            return [];

        }


        resultados.innerHTML = "";


        /*-----------------------------------------------
          PALGEO
        -----------------------------------------------*/

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
            this.normalizar(
                texto
            );


        /*-----------------------------------------------
          BUSCAR INTERVALOS
        -----------------------------------------------*/

        const intervalos =
            window.PALGEO.filter(
                intervalo => {

                    if(
                        !intervalo
                    ){

                        return false;

                    }


                    return [

                        intervalo.eon,

                        intervalo.era,

                        intervalo.periodo,

                        intervalo.edad

                    ].some(
                        valor =>
                            this.normalizar(
                                valor
                            ).includes(
                                consulta
                            )
                    );

                }
            );


        if(
            !intervalos.length
        ){

            label.textContent =
                "0 resultados";

            return [];

        }


        /*-----------------------------------------------
          DATOS DE PALEOFICHAS
        -----------------------------------------------*/

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            return [];

        }


        const fichas =
            window.LEEPALJSON.obtener();


        if(
            !Array.isArray(fichas)
        ){

            return [];

        }


        /*-----------------------------------------------
          MAPA DE NOMBRES

          Igual que CAB17:
          PALBUSCADOR proporciona el nombre real.
        -----------------------------------------------*/

        let mapaNombres =
            new Map();


        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.obtenerMapaNombres ===
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


        /*-----------------------------------------------
          BUSCAR FICHAS POR SOLAPAMIENTO TEMPORAL
        -----------------------------------------------*/

        const coincidencias = [];


        fichas.forEach(
            ficha => {

                if(
                    !ficha ||
                    !ficha.codigo ||
                    !ficha.j3
                ){

                    return;

                }


                const partes =
                    String(
                        ficha.j3
                    ).split("-");


                if(
                    partes.length !== 2
                ){

                    return;

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
                    !Number.isFinite(inicio) ||
                    !Number.isFinite(fin)
                ){

                    return;

                }


                const coincide =
                    intervalos.some(
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
                            Solapamiento real.

                            No basta con tocar
                            exactamente el límite.
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


                if(
                    !coincide
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
                    mapaNombres.get(
                        codigo
                    )
                    ||
                    String(
                        ficha.nombre ||
                        "Sin nombre"
                    ).trim();


                coincidencias.push({

                    codigo:
                        codigo,

                    nombre:
                        nombre,

                    tipo:
                        "geologia",

                    relevancia:
                        100

                });

            }
        );


        /*-----------------------------------------------
          ELIMINAR DUPLICADOS
        -----------------------------------------------*/

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


        label.textContent =
            unicas.length +
            (
                unicas.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*-----------------------------------------------
          MOSTRAR
        -----------------------------------------------*/

        this.mostrar(
            unicas
        );


        /*-----------------------------------------------
          APLICAR RANGO
        -----------------------------------------------*/

        if(
            unicas.length
        ){

            await this.aplicarMatrix(
                unicas
            );

        }


        return unicas;

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

                const codigo =
                    String(
                        ficha.codigo ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                const nombre =
                    String(
                        ficha.nombre ||
                        "Sin nombre"
                    ).trim();


                if(
                    !codigo
                ){

                    return;

                }


                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    codigo;


                /*
                CÓDIGO + NOMBRE REAL
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
            !Array.isArray(
                coincidencias
            ) ||
            !coincidencias.length
        ){

            return;

        }


        /*-----------------------------------------------
          MATRIXFILTRO
        -----------------------------------------------*/

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
            ) ||
            !matrizJ1.length
        ){

            return;

        }


        /*-----------------------------------------------
          MATRIXNAVEGADOR
        -----------------------------------------------*/

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


        /*-----------------------------------------------
          PALNAVEGADOR
        -----------------------------------------------*/

        if(
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.aplicarFiltro !==
            "function"
        ){

            return;

        }


        PALNAVEGADOR.aplicarFiltro(
            registros
        );


        /*-----------------------------------------------
          ALEATORIO
        -----------------------------------------------*/

        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();

            }
            catch(error){

                return;

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


                if(
                    elemento
                ){

                    elemento.style.display =
                        "none";

                    elemento.classList.remove(
                        "activo",
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
FIN cab18.js v2.0 LTS
========================================================
*/

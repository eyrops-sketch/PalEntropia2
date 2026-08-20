/*
========================================================
PalEntropía
cab18.js v1.0

BUSCADOR AVANZADO POR TIEMPO GEOLÓGICO

FUNCIÓN
-------
Busca paleofichas mediante una consulta temporal
humana de 4 caracteres.

Ejemplos:
    521
    521-
    521 Ma
    521 Ma - 509 Ma

El tratamiento cronológico se realiza mediante:

PALGEOSIMPLIFICADO
        ↓
cronología interna
        ↓
PALGEO
        ↓
códigos / períodos / edades

CIRCUITO
--------
Consulta temporal
↓
PALGEOSIMPLIFICADO
↓
comparación temporal
↓
J1 / código
↓
MATRIXFILTRO
↓
MatrixNavegador
↓
PALNAVEGADOR.aplicarFiltro()
↓
PALNAVEGADOR.aleatorio()

COMPORTAMIENTO
--------------
☐ Consulta sin check:
   muestra código + nombre de cada resultado
   y permite selección manual.

☑ Consulta con check:
   convierte todos los resultados
   en rango activo de navegación.

Si no existe selección manual:
   → aleatorio dentro del filtro.

Si existe selección manual:
   → se respeta la selección.

IMPORTANTE
----------
CAB18 NO modifica CAB16.

CAB18 utiliza el mismo campo:
    buscarUniversal

y el mismo sistema visual de resultados:
    labelResultadosCab16
    resultadosCab16
    resultadoCab16

Por tanto:

CAB16 → código
CAB17 → nombre
CAB18 → tiempo geológico

Los tres módulos pueden convivir.

========================================================
*/


window.cab18 = {

    /*====================================================
      ESTADO
    ====================================================*/

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
            "cab18 v1.0: buscador por tiempo geológico preparado."
        );

    },


    /*====================================================
      COMPROBAR SI ES CÓDIGO
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
      COMPROBAR CONSULTA TEMPORAL
    ====================================================*/

    esConsultaTemporal: function(
        texto
    ){

        const valor =
            String(
                texto || ""
            )
            .trim();


        /*
        ------------------------------------------------
        UNA CONSULTA TEMPORAL NECESITA
        AL MENOS 4 CARACTERES.
        ------------------------------------------------

        Ejemplos:

        521.
        5210
        521-
        521 M

        ------------------------------------------------
        */

        if(
            valor.length < 4
        ){

            return false;

        }


        /*
        ------------------------------------------------
        BUSCAMOS AL MENOS UNA CIFRA
        Y PERMITIMOS:

        números
        punto
        coma
        guion
        espacios
        Ma
        a
        ------------------------------------------------
        */

        return /^[0-9.,\-\sMaA]+$/i.test(
            valor
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


        /*------------------------------------------------
          INPUT
        ------------------------------------------------*/

        campo.addEventListener(
            "input",
            () => {

                /*
                Nueva consulta.
                */

                this.seleccionRealizada =
                    false;


                const texto =
                    campo.value.trim();


                /*
                ------------------------------------------------
                CÓDIGOS → CAB16
                ------------------------------------------------
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                /*
                ------------------------------------------------
                NOMBRES → CAB17
                ------------------------------------------------

                Si contiene letras normales,
                CAB17 se encargará de la consulta.

                CAB18 solamente actúa cuando la
                consulta tiene estructura temporal.
                */

                if(
                    !this.esConsultaTemporal(
                        texto
                    )
                ){

                    return;

                }


                this.buscar();

            }
        );


        /*------------------------------------------------
          CHECK
        ------------------------------------------------*/

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


                    /*
                    ------------------------------------------------
                    CHECK DESACTIVADO
                    ------------------------------------------------
                    */

                    if(
                        !this.buscarTodos
                    ){

                        this.limpiarFiltro();

                    }


                    /*
                    Repetimos la consulta temporal.
                    */

                    await this.buscar();

                }
            );

        }

    },


    /*====================================================
      OBTENER DATOS
    ====================================================*/

    obtenerDatos: function(){

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            return [];

        }


        const datos =
            window.LEEPALJSON.obtener();


        if(
            !Array.isArray(
                datos
            )
        ){

            return [];

        }


        return datos;

    },


    /*====================================================
      OBTENER CRONOLOGÍA DE UN REGISTRO
    ====================================================*/

    obtenerCronologia: function(
        registro
    ){

        if(
            !registro
        ){

            return null;

        }


        /*
        j3 es la cronología interna.

        Se contemplan también nombres
        alternativos para mayor robustez.
        */

        const cronologia =
            registro.j3 ||
            registro.cronologia ||
            registro.geologia ||
            "";


        if(
            !cronologia
        ){

            return null;

        }


        const texto =
            String(
                cronologia
            )
            .trim();


        /*
        ------------------------------------------------
        VALIDAR CON PALGEOSIMPLIFICADO
        ------------------------------------------------
        */

        if(
            window.PALGEOSIMPLIFICADO &&
            typeof window.PALGEOSIMPLIFICADO.validarCronologia ===
            "function"
        ){

            if(
                !window.PALGEOSIMPLIFICADO.validarCronologia(
                    texto
                )
            ){

                return null;

            }

        }


        return texto;

    },


    /*====================================================
      DECODIFICAR CRONOLOGÍA
    ====================================================*/

    decodificar: function(
        cronologia
    ){

        if(
            !cronologia
        ){

            return null;

        }


        if(
            !window.PALGEOSIMPLIFICADO ||
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ){

            return null;

        }


        return window.PALGEOSIMPLIFICADO.analizar(
            cronologia
        );

    },


    /*====================================================
      PARSEAR CONSULTA TEMPORAL
    ====================================================*/

    parsearConsulta: function(
        texto
    ){

        if(
            !window.PALGEOSIMPLIFICADO
        ){

            return null;

        }


        /*
        ------------------------------------------------
        NORMALIZAR
        ------------------------------------------------
        */

        let consulta =
            String(
                texto || ""
            )
            .trim();


        if(
            !consulta
        ){

            return null;

        }


        /*
        ------------------------------------------------
        SI YA ES UNA CRONOLOGÍA INTERNA
        ------------------------------------------------
        */

        if(
            window.PALGEOSIMPLIFICADO.validarCronologia &&
            window.PALGEOSIMPLIFICADO.validarCronologia(
                consulta
            )
        ){

            const partes =
                consulta.split("-");


            return {

                cronologia:
                    consulta,

                inicio:
                    Number(
                        partes[0]
                    ),

                fin:
                    Number(
                        partes[1]
                    )

            };

        }


        /*
        ------------------------------------------------
        CONSULTA HUMANA
        ------------------------------------------------

        Ejemplo:

        521 Ma - 509 Ma

        Se delega la conversión a
        PALGEOSIMPLIFICADO.
        ------------------------------------------------
        */

        if(
            typeof window.PALGEOSIMPLIFICADO.codificarRango !==
            "function"
        ){

            return null;

        }


        /*
        Una consulta de un único valor
        no representa todavía un rango.

        En esta primera fase CAB18
        exige dos extremos.
        */

        if(
            !consulta.includes("-")
        ){

            return null;

        }


        const cronologia =
            window.PALGEOSIMPLIFICADO.codificarRango(
                consulta
            );


        if(
            !cronologia
        ){

            return null;

        }


        const partes =
            cronologia.split("-");


        return {

            cronologia:
                cronologia,

            inicio:
                Number(
                    partes[0]
                ),

            fin:
                Number(
                    partes[1]
                )

        };

    },


    /*====================================================
      COMPROBAR SOLAPAMIENTO
    ====================================================*/

    intervaloCompatible: function(
        consultaInicio,
        consultaFin,
        fichaInicio,
        fichaFin
    ){

        /*
        ------------------------------------------------
        La consulta y la ficha deben compartir
        TIEMPO REAL.

        Un único límite no cuenta.
        ------------------------------------------------
        */

        const extremoAntiguo =
            Math.min(
                consultaInicio,
                fichaInicio
            );


        const extremoReciente =
            Math.max(
                consultaFin,
                fichaFin
            );


        return (
            extremoAntiguo >
            extremoReciente
        );

    },


    /*====================================================
      OBTENER COINCIDENCIAS
    ====================================================*/

    obtenerCoincidencias: function(
        consulta
    ){

        const datos =
            this.obtenerDatos();


        if(
            !datos.length
        ){

            return [];

        }


        const resultados =
            [];


        for(
            const registro of datos
        ){

            if(
                !registro
            ){

                continue;

            }


            const cronologia =
                this.obtenerCronologia(
                    registro
                );


            if(
                !cronologia
            ){

                continue;

            }


            const partes =
                cronologia.split("-");


            const fichaInicio =
                Number(
                    partes[0]
                );


            const fichaFin =
                Number(
                    partes[1]
                );


            if(
                !Number.isFinite(
                    fichaInicio
                ) ||
                !Number.isFinite(
                    fichaFin
                )
            ){

                continue;

            }


            if(
                !this.intervaloCompatible(
                    consulta.inicio,
                    consulta.fin,
                    fichaInicio,
                    fichaFin
                )
            ){

                continue;

            }


            const codigo =
                String(
                    registro.codigo ||
                    registro.j1 ||
                    ""
                )
                .trim()
                .toUpperCase();


            if(
                !codigo
            ){

                continue;

            }


            const nombre =
                String(
                    registro.nombre ||
                    registro.j2 ||
                    ""
                )
                .trim();


            resultados.push({

                codigo:
                    codigo,

                nombre:
                    nombre ||
                    "Sin nombre",

                j3:
                    cronologia,

                rango:
                    (
                        window.PALGEOSIMPLIFICADO &&
                        typeof window.PALGEOSIMPLIFICADO.decodificarRango ===
                        "function"
                    )
                    ?
                    window.PALGEOSIMPLIFICADO.decodificarRango(
                        cronologia
                    )
                    :
                    cronologia

            });

        }


        return resultados;

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
        MÍNIMO 4 CARACTERES
        ------------------------------------------------
        */

        if(
            texto.length < 4
        ){

            label.textContent =
                "Introduce al menos 4 caracteres";


            if(
                this.buscarTodos
            ){

                this.limpiarFiltro();

            }


            return [];

        }


        /*
        ------------------------------------------------
        PARSEAR
        ------------------------------------------------
        */

        const consulta =
            this.parsearConsulta(
                texto
            );


        if(
            !consulta
        ){

            label.textContent =
                "Consulta temporal no válida";


            if(
                this.buscarTodos
            ){

                this.limpiarFiltro();

            }


            return [];

        }


        /*
        ------------------------------------------------
        BUSCAR
        ------------------------------------------------
        */

        const coincidencias =
            this.obtenerCoincidencias(
                consulta
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
        MOSTRAR
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

            await this.aplicarMatrix(
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
            resultado => {

                if(
                    !resultado ||
                    !resultado.codigo
                ){

                    return;

                }


                const codigo =
                    String(
                        resultado.codigo
                    )
                    .trim()
                    .toUpperCase();


                const nombre =
                    String(
                        resultado.nombre ||
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


                /*
                ------------------------------------------------
                CAB18 SIEMPRE MUESTRA:

                CÓDIGO
                +
                NOMBRE

                Igual que el principio establecido
                para el buscador avanzado.
                ------------------------------------------------
                */

                fila.innerHTML =

                    '<span class="resultadoCodigo">' +

                    this.escapeHTML(
                        codigo
                    ) +

                    '</span>' +

                    '<span class="resultadoNombre">' +

                    this.escapeHTML(
                        nombre
                    ) +

                    '</span>';


                /*
                ------------------------------------------------
                SELECCIÓN MANUAL
                ------------------------------------------------
                */

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
      ESCAPAR HTML
    ====================================================*/

    escapeHTML: function(
        texto
    ){

        return String(
            texto || ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    },


    /*====================================================
      APLICAR MATRIX
    ====================================================*/

    aplicarMatrix: async function(
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

            this.limpiarFiltro();

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
                "cab18: MATRIXFILTRO no devolvió una matriz."
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
                "cab18: MatrixNavegador no devolvió registros."
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

        PRIMERO se aplica el filtro.

        DESPUÉS se ejecuta el aleatorio.

        Así el aleatorio solo puede escoger
        dentro del resultado de la consulta.
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
        ALEATORIO AUTOMÁTICO
        ------------------------------------------------

        Igual que CAB16 y CAB17.

        Si el usuario NO ha seleccionado
        manualmente un resultado:

            → aleatorio dentro del filtro.

        Si ya seleccionó uno:

            → no se modifica.
        ------------------------------------------------
        */

        if(
            !this.seleccionRealizada &&
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();


                console.log(
                    "cab18: aleatorio automático dentro del filtro."
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
        SELECCIÓN MANUAL REAL
        ------------------------------------------------

        Desde este momento el aleatorio automático
        no debe sustituir la selección.
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
        CERRAR BUSCADOR
        ------------------------------------------------
        */

        this.cerrar();


        /*
        ------------------------------------------------
        CARGAR SELECCIÓN
        ------------------------------------------------

        Siempre pasa por PALNAVEGADOR.
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

    },


    /*====================================================
      LIMPIAR FILTRO
    ====================================================*/

    limpiarFiltro: function(){

        /*
        ------------------------------------------------
        PALNAVEGADOR
        ------------------------------------------------
        */

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.limpiarFiltro ===
            "function"
        ){

            window.PALNAVEGADOR.limpiarFiltro();

        }


        /*
        ------------------------------------------------
        MATRIXNAVEGADOR
        ------------------------------------------------
        */

        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar ===
            "function"
        ){

            window.MatrixNavegador.limpiar();

        }


        console.log(
            "cab18: filtro y matriz limpiados."
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
FIN cab18.js v1.0
========================================================
*/

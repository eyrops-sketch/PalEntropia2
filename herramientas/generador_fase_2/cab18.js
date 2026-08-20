cab18.js corregido

/*
========================================================
PalEntropía
cab18.js v1.1

BUSCADOR AVANZADO — TIEMPO GEOLÓGICO

BUSCA POR:
- Eón
- Era
- Período
- Edad

NO INTERFIERE CON:
- CAB16 → códigos
- CAB17 → nombres

REGLAS:
- No impone mínimo de 4 caracteres.
- "001" queda para CAB16.
- CAB18 trabaja únicamente con PALGEO.
- Los resultados conservan codigo + nombre real
  procedentes de LEEPALJSON.

CHECK:
☐ muestra resultados para seleccionar
☑ convierte resultados en rango de navegación

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
            "cab18 v1.1: búsqueda geológica preparada."
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


        campo.addEventListener(
            "input",
            async () => {

                this.seleccionRealizada = false;

                const texto =
                    campo.value.trim();


                /*
                ------------------------------------------------
                CÓDIGOS
                ------------------------------------------------

                CAB16 se ocupa de ellos.
                CAB18 no los bloquea ni muestra mensajes.
                ------------------------------------------------
                */

                if(
                    /^\d{3}(?:_\d{0,2})?$/.test(
                        texto
                    )
                ){

                    return;

                }


                await this.buscar();

            }
        );


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
            campo.value
            .trim()
            .toLowerCase();


        /*
        ------------------------------------------------
        NO TOCAR CONSULTAS DE CÓDIGO
        ------------------------------------------------
        */

        if(
            /^\d{3}(?:_\d{0,2})?$/.test(
                texto
            )
        ){

            return [];

        }


        /*
        ------------------------------------------------
        LIMPIAR RESULTADOS
        ------------------------------------------------
        */

        resultados.innerHTML = "";


        /*
        ------------------------------------------------
        MÍNIMO GEOLÓGICO
        ------------------------------------------------

        CAB18 acepta desde 1 carácter.

        No se fuerza una regla de 4 caracteres.
        ------------------------------------------------
        */

        if(!texto){

            label.textContent = "";

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
        BUSCAR INTERVALOS GEOLÓGICOS
        ------------------------------------------------
        */

        const encontrados =
            window.PALGEO.filter(
                intervalo => {

                    const eon =
                        String(
                            intervalo.eon || ""
                        ).toLowerCase();

                    const era =
                        String(
                            intervalo.era || ""
                        ).toLowerCase();

                    const periodo =
                        String(
                            intervalo.periodo || ""
                        ).toLowerCase();

                    const edad =
                        String(
                            intervalo.edad || ""
                        ).toLowerCase();


                    return (

                        eon.includes(texto) ||

                        era.includes(texto) ||

                        periodo.includes(texto) ||

                        edad.includes(texto)

                    );

                }
            );


        /*
        ------------------------------------------------
        SIN RESULTADOS
        ------------------------------------------------
        */

        if(!encontrados.length){

            label.textContent =
                "Sin resultados";

            return [];

        }


        /*
        ------------------------------------------------
        OBTENER PALEOFICHAS
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
            !Array.isArray(fichas)
        ){

            return [];

        }


        /*
        ------------------------------------------------
        CREAR RANGO TEMPORAL
        ------------------------------------------------
        */

        let codigosTemporales = [];


        encontrados.forEach(
            intervalo => {

                if(
                    intervalo.codigo &&
                    !codigosTemporales.includes(
                        intervalo.codigo
                    )
                ){

                    codigosTemporales.push(
                        intervalo.codigo
                    );

                }

            }
        );


        /*
        ------------------------------------------------
        BUSCAR FICHAS COMPATIBLES
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
                        ).split("-");


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
                        !Number.isFinite(inicio) ||
                        !Number.isFinite(fin)
                    ){

                        return false;

                    }


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


                            /*
                            SOLAPAMIENTO REAL.

                            Si solo comparten un límite:
                            NO entra.
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

        if(this.buscarTodos){

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


                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    ficha.codigo;


                fila.textContent =
                    ficha.codigo +
                    "   " +
                    (
                        ficha.nombre ||
                        "Sin nombre"
                    );


                fila.addEventListener(
                    "click",
                    () => {

                        this.seleccionar(
                            ficha.codigo
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
        ALEATORIO AUTOMÁTICO
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


        if(!codigo){

            return;

        }


        this.seleccionRealizada =
            true;


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
FIN cab18.js v1.1
========================================================

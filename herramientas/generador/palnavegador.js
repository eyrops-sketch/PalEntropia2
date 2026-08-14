 /*
========================================================
PalEntropía
PALNAVEGADOR.js v1.1 LTS

Sistema de navegación de Paleofichas.

Funciones:
- Carga registros desde LEEPALJSON
- Navega por los registros
- Gestiona filtros
- Localiza un j1 por índice
- Carga una Paleoficha mediante CAB07 + CARGACONT
- Actualiza la presentación de CAB07 después de CARGACONT
- Permite búsqueda directa mediante cargarPorCodigo()
========================================================
*/


const PALNAVEGADOR = {

    version: "1.1 LTS",

    registros: [],

    filtroActivo: null,

    indice: -1,

    codigoActual: null,


    /* =====================================================
       INICIALIZAR
       ===================================================== */

    async inicializar() {

        if (
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.cargar !== "function"
        ) {

            throw new Error(
                "PALNAVEGADOR: LEEPALJSON no está disponible."
            );

        }


        await window.LEEPALJSON.cargar();


        const contenedor =
            window.LEEPALJSON.obtener();


        if (
            !Array.isArray(contenedor) ||
            !contenedor.length
        ) {

            throw new Error(
                "PALNAVEGADOR: no hay registros en master.csv."
            );

        }


        this.registros =
            contenedor.filter(
                registro =>
                    registro &&
                    registro.codigo
            );


        return this.registros;

    },


    /* =====================================================
       NORMALIZAR CÓDIGO
       ===================================================== */

    normalizarCodigo(codigo) {

        if (
            codigo === undefined ||
            codigo === null
        ) {

            return "";

        }


        return String(codigo)
            .trim()
            .toUpperCase();

    },


    /* =====================================================
       CONJUNTO ACTIVO
       ===================================================== */

    conjuntoActivo() {

        return this.filtroActivo
            ? this.filtroActivo
            : this.registros;

    },


    /* =====================================================
       BUSCAR ÍNDICE
       ===================================================== */

    buscarIndice(codigo) {

        const j1 =
            this.normalizarCodigo(
                codigo
            );


        const conjunto =
            this.conjuntoActivo();


        return conjunto.findIndex(
            registro =>
                this.normalizarCodigo(
                    registro.codigo
                ) === j1
        );

    },


    /* =====================================================
       POSICIONAR
       ===================================================== */

    async posicionar(codigo) {

        const j1 =
            this.normalizarCodigo(
                codigo
            );


        if (!j1) {

            throw new Error(
                "PALNAVEGADOR: código vacío."
            );

        }


        const indice =
            this.buscarIndice(
                j1
            );


        if (indice === -1) {

            return false;

        }


        this.indice =
            indice;


        this.codigoActual =
            j1;


        return true;

    },


    /* =====================================================
       CARGAR POR CÓDIGO
       ===================================================== */

    async cargarPorCodigo(codigo) {

        const j1 =
            this.normalizarCodigo(
                codigo
            );


        if (!j1) {

            throw new Error(
                "PALNAVEGADOR: código vacío."
            );

        }


        const situado =
            await this.posicionar(
                j1
            );


        if (!situado) {

            return false;

        }


        return await this.cargarIndice(
            this.indice
        );

    },


    /* =====================================================
       CARGAR ÍNDICE
       
       FLUJO:

       PALNAVEGADOR
            ↓
          CAB07
            ↓
         CONT07
            ↓
        CARGACONT
            ↓
         CAB01-CAB06
            ↓
       actualizarPresentacion()
       
       IMPORTANTE:

       La presentación de CAB07 se actualiza DESPUÉS
       de CARGACONT para evitar conservar la geología
       de la Paleoficha anterior.
       ===================================================== */

    async cargarIndice(indice) {

        const conjunto =
            this.conjuntoActivo();


        if (!conjunto.length) {

            throw new Error(
                "PALNAVEGADOR: el conjunto activo está vacío."
            );

        }


        if (indice < 0) {

            indice = 0;

        }


        if (indice >= conjunto.length) {

            indice =
                conjunto.length - 1;

        }


        const registro =
            conjunto[indice];


        if (
            !registro ||
            !registro.codigo
        ) {

            throw new Error(
                "PALNAVEGADOR: registro inválido."
            );

        }


        this.indice =
            indice;


        this.codigoActual =
            this.normalizarCodigo(
                registro.codigo
            );



     


     




     
        /* =================================================
           CARGACONT
           ================================================= */

        if (
            !window.CARGACONT ||
            typeof window.CARGACONT.cargar !== "function"
        ) {

            throw new Error(
                "PALNAVEGADOR: CARGACONT no está disponible."
            );

        }


        const resultado =
            await window.CARGACONT.cargar(
                this.codigoActual
            );


        /* =================================================
           ACTUALIZAR PRESENTACIÓN CAB07

           Se ejecuta después de CARGACONT.

           Así CAB07 vuelve a leer CONT07 y muestra
           la geología correspondiente a la nueva ficha.
           ================================================= */

        if (
            window.CAB07 &&
            typeof window.CAB07.actualizarPresentacion ===
            "function"
        ) {

            window.CAB07.actualizarPresentacion();

        }


        return resultado;

    },


    /* =====================================================
       PRIMERO
       ===================================================== */

    async primero() {

        return await this.cargarIndice(
            0
        );

    },


    /* =====================================================
       ANTERIOR
       ===================================================== */

    async anterior() {

        const conjunto =
            this.conjuntoActivo();


        if (!conjunto.length) {

            return null;

        }


        if (this.indice <= 0) {

            return await this.cargarIndice(
                0
            );

        }


        return await this.cargarIndice(
            this.indice - 1
        );

    },


    /* =====================================================
       SIGUIENTE
       ===================================================== */

    async siguiente() {

        const conjunto =
            this.conjuntoActivo();


        if (!conjunto.length) {

            return null;

        }


        if (
            this.indice >=
            conjunto.length - 1
        ) {

            return await this.cargarIndice(
                conjunto.length - 1
            );

        }


        return await this.cargarIndice(
            this.indice + 1
        );

    },


    /* =====================================================
       ÚLTIMO
       ===================================================== */

    async ultimo() {

        const conjunto =
            this.conjuntoActivo();


        return await this.cargarIndice(
            conjunto.length - 1
        );

    },


    /* =====================================================
       ALEATORIO
       ===================================================== */

    async aleatorio() {

        const conjunto =
            this.conjuntoActivo();


        if (!conjunto.length) {

            throw new Error(
                "PALNAVEGADOR: no hay registros disponibles."
            );

        }


        const indice =
            Math.floor(
                Math.random() *
                conjunto.length
            );


        return await this.cargarIndice(
            indice
        );

    },


    /* =====================================================
       APLICAR FILTRO
       ===================================================== */

    aplicarFiltro(registros) {

        if (!Array.isArray(registros)) {

            throw new Error(
                "PALNAVEGADOR: el filtro debe ser un array."
            );

        }


        this.filtroActivo =
            registros;


        if (!this.filtroActivo.length) {

            this.indice = -1;

            return;

        }


        if (this.codigoActual) {

            const indice =
                this.filtroActivo.findIndex(
                    registro =>
                        this.normalizarCodigo(
                            registro.codigo
                        ) ===
                        this.codigoActual
                );


            if (indice !== -1) {

                this.indice =
                    indice;

                return;

            }

        }


        this.indice = 0;

    },


    /* =====================================================
       LIMPIAR FILTRO
       ===================================================== */

    limpiarFiltro() {

        const codigoActual =
            this.codigoActual;


        this.filtroActivo =
            null;


        if (!codigoActual) {

            this.indice = -1;

            return;

        }


        const indice =
            this.buscarIndice(
                codigoActual
            );


        this.indice =
            indice;

    },


    /* =====================================================
       ESTÁ FILTRADO
       ===================================================== */

    estaFiltrado() {

        return Array.isArray(
            this.filtroActivo
        );

    },


    /* =====================================================
       OBTENER ACTUAL
       ===================================================== */

    obtenerActual() {

        const conjunto =
            this.conjuntoActivo();


        if (
            this.indice < 0 ||
            this.indice >= conjunto.length
        ) {

            return null;

        }


        return conjunto[
            this.indice
        ];

    },


    /* =====================================================
       OBTENER CONT07
       ===================================================== */

    obtenerCont07() {

        if (
            !window.CONT07 ||
            typeof window.CONT07.obtener !== "function"
        ) {

            return null;

        }


        return window.CONT07.obtener();

    },


    /* =====================================================
       ESTADO
       ===================================================== */

    estado() {

        const conjunto =
            this.conjuntoActivo();


        return {

            version:
                this.version,

            total:
                conjunto.length,

            indice:
                this.indice,

            posicion:
                this.indice >= 0
                    ? this.indice + 1
                    : 0,

            codigo:
                this.codigoActual,

            filtrado:
                this.estaFiltrado()

        };

    }

};


/* =========================================================
   DISPONIBILIDAD GLOBAL
   ========================================================= */

window.PALNAVEGADOR =
    PALNAVEGADOR;


/*
========================================================
FIN PALNAVEGADOR.js v1.1 LTS
========================================================
*/

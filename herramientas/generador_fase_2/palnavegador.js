/*
========================================================
PalEntropía
PALNAVEGADOR.js v1.3 LTS

Sistema de navegación de Paleofichas.

CORRECCIÓN v1.3
---------------
- Acepta registros con "codigo".
- Acepta registros con "j1".
- MATRIXNAVEGADOR entrega j1.
- PALNAVEGADOR utiliza j1 como código cuando no existe
  codigo.
- Mantiene separado el conjunto general del rango filtrado.
- aplicarMatriz() activa el rango recibido.
- limpiarFiltro() devuelve al conjunto general.
- La navegación permanece limitada al rango cuando existe.
- No modifica CAB16.
- No modifica MATRIXFILTRO.
- No modifica MATRIXNAVEGADOR.
========================================================
*/


const PALNAVEGADOR = {

    version: "1.3 LTS",

    registros: [],

    filtroActivo: null,

    indice: -1,

    codigoActual: null,

    matrizActiva: false,


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


        /*
        El conjunto general procede de LEEPALJSON.

        Aquí mantenemos únicamente registros que
        dispongan de codigo o j1.
        */

        this.registros =
            contenedor.filter(
                registro =>
                    registro &&
                    this.obtenerCodigoRegistro(
                        registro
                    )
            );


        this.filtroActivo = null;

        this.matrizActiva = false;

        this.indice = -1;

        this.codigoActual = null;


        return this.registros;

    },


    /* =====================================================
       OBTENER CÓDIGO DEL REGISTRO
       
       Acepta:
       - registro.codigo
       - registro.j1
       ===================================================== */

    obtenerCodigoRegistro(registro) {

        if (!registro) {

            return "";

        }


        /*
        Prioridad:
        1. codigo
        2. j1
        */

        const codigo =
            registro.codigo !== undefined &&
            registro.codigo !== null
                ? registro.codigo
                : registro.j1;


        return this.normalizarCodigo(
            codigo
        );

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

        if (
            Array.isArray(
                this.filtroActivo
            )
        ) {

            return this.filtroActivo;

        }


        return this.registros;

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


        /*
        Aceptamos tanto registros normales
        como registros procedentes de MATRIXNAVEGADOR.
        */

        this.filtroActivo =
            registros.filter(
                registro =>
                    this.obtenerCodigoRegistro(
                        registro
                    ) !== ""
            );


        this.matrizActiva = true;


        /*
        Si el filtro está vacío,
        no existe rango navegable.
        */

        if (
            !this.filtroActivo.length
        ) {

            this.indice = -1;

            return [];

        }


        /*
        Intentamos conservar la ficha actual
        dentro del nuevo rango.
        */

        if (
            this.codigoActual
        ) {

            const indice =
                this.filtroActivo.findIndex(
                    registro =>
                        this.obtenerCodigoRegistro(
                            registro
                        ) ===
                        this.codigoActual
                );


            if (
                indice !== -1
            ) {

                this.indice =
                    indice;

                return this.filtroActivo;

            }

        }


        /*
        Si la ficha actual no pertenece
        al filtro, comenzamos por la primera.
        */

        this.indice = 0;


        return this.filtroActivo;

    },


    /* =====================================================
       APLICAR MATRIZ
       ===================================================== */

    aplicarMatriz(registros) {

        return this.aplicarFiltro(
            registros
        );

    },


    /* =====================================================
       LIMPIAR FILTRO
       ===================================================== */

    limpiarFiltro() {

        this.filtroActivo = null;

        this.matrizActiva = false;


        if (
            !this.registros.length
        ) {

            this.indice = -1;

            return;

        }


        /*
        Al volver al conjunto general,
        intentamos conservar la ficha actual.
        */

        if (
            this.codigoActual
        ) {

            const indice =
                this.registros.findIndex(
                    registro =>
                        this.obtenerCodigoRegistro(
                            registro
                        ) ===
                        this.codigoActual
                );


            this.indice =
                indice;

            return;

        }


        this.indice = -1;

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
                this.obtenerCodigoRegistro(
                    registro
                ) ===
                j1
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


        if (
            indice === -1
        ) {

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
       ===================================================== */

    async cargarIndice(indice) {

        const conjunto =
            this.conjuntoActivo();


        if (
            !conjunto.length
        ) {

            throw new Error(
                "PALNAVEGADOR: el conjunto activo está vacío."
            );

        }


        /*
        Límites del rango.
        */

        if (
            indice < 0
        ) {

            indice = 0;

        }


        if (
            indice >= conjunto.length
        ) {

            indice =
                conjunto.length - 1;

        }


        const registro =
            conjunto[indice];


        if (!registro) {

            throw new Error(
                "PALNAVEGADOR: registro inválido."
            );

        }


        const codigo =
            this.obtenerCodigoRegistro(
                registro
            );


        if (!codigo) {

            throw new Error(
                "PALNAVEGADOR: registro sin código."
            );

        }


        this.indice =
            indice;


        this.codigoActual =
            codigo;


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


        if (
            !conjunto.length
        ) {

            return null;

        }


        if (
            this.indice <= 0
        ) {

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


        if (
            !conjunto.length
        ) {

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


        if (
            !conjunto.length
        ) {

            return null;

        }


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


        if (
            !conjunto.length
        ) {

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
       ESTÁ FILTRADO
       ===================================================== */

    estaFiltrado() {

        return Array.isArray(
            this.filtroActivo
        );

    },


    /* =====================================================
       MATRIZ ACTIVA
       ===================================================== */

    estaEnMatriz() {

        return this.matrizActiva === true;

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

            totalGeneral:
                this.registros.length,

            indice:
                this.indice,

            posicion:
                this.indice >= 0
                    ? this.indice + 1
                    : 0,

            codigo:
                this.codigoActual,

            filtrado:
                this.estaFiltrado(),

            matrizActiva:
                this.estaEnMatriz()

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
FIN PALNAVEGADOR.js v1.3 LTS
========================================================
*/

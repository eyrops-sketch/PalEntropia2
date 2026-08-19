/*
========================================================
PalEntropía
PALNAVEGADOR.js v1.2

Sistema de navegación de Paleofichas.

v1.2 — CIRCUITO MATRIX
----------------------

Añadido:

- Compatibilidad con MatrixFiltro.
- Compatibilidad con MatrixNavegador.
- Navegación sobre un conjunto filtrado.
- Conservación del código actualmente seleccionado.
- Cambio limpio entre:
      TODOS LOS REGISTROS
      y
      MATRIZ FILTRADA.

NO MODIFICA:

- CARGACONT
- CAB07
- CAB01-CAB06
- LEEPALJSON
- MatrixFiltro
- MatrixNavegador

El navegador continúa funcionando normalmente
cuando no existe ningún filtro activo.
========================================================
*/


const PALNAVEGADOR = {

    version: "1.2",

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


        if (!conjunto.length) {

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


        /*
        Guardamos exactamente los registros
        proporcionados por MatrixNavegador.

        No modificamos sus datos.
        */

        this.filtroActivo =
            registros.slice();


        /*
        Si la matriz está vacía,
        no existe navegación filtrada.
        */

        if (!this.filtroActivo.length) {

            this.indice = -1;

            return;

        }


        /*
        Intentamos conservar la paleoficha
        actualmente cargada.

        Esto es lo importante para el circuito:

        si estamos en 004_07 y el filtro contiene
        004_03, 004_07, 004_11 y 005_02,

        el índice pasa a ser el correspondiente
        a 004_07 dentro de esa nueva matriz.
        */

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


        /*
        Si la paleoficha actual no pertenece
        al nuevo filtro, situamos el puntero
        en el primer registro disponible.
        */

        this.indice = 0;


        this.codigoActual =
            this.normalizarCodigo(
                this.filtroActivo[0].codigo
            );

    },


    /* =====================================================
       APLICAR MATRIZ DE MATRIXNAVEGADOR
       ===================================================== */

    aplicarMatriz(matriz) {

        if (!Array.isArray(matriz)) {

            throw new Error(
                "PALNAVEGADOR: la matriz debe ser un array."
            );

        }


        this.aplicarFiltro(
            matriz
        );


        return this.filtroActivo;

    },


    /* =====================================================
       ACTIVAR CIRCUITO MATRIX
       ===================================================== */

    async activarMatriz(matriz) {

        this.aplicarMatriz(
            matriz
        );


        /*
        Si la matriz contiene la paleoficha actual,
        simplemente mantenemos su posición.

        No recargamos la ficha innecesariamente.
        */

        if (
            this.codigoActual &&
            this.buscarIndice(
                this.codigoActual
            ) !== -1
        ) {

            return this.obtenerActual();

        }


        /*
        Si no existe una paleoficha actual,
        cargamos el primer registro disponible.
        */

        if (
            this.filtroActivo &&
            this.filtroActivo.length
        ) {

            return await this.cargarIndice(
                this.indice
            );

        }


        return null;

    },


    /* =====================================================
       LIMPIAR FILTRO
       ===================================================== */

    limpiarFiltro() {

        const codigoActual =
            this.codigoActual;


        this.filtroActivo =
            null;


        /*
        Recuperamos la posición equivalente
        dentro de TODOS los registros.

        El código actual permanece.
        */

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
FIN PALNAVEGADOR.js v1.2
========================================================
*/

/*
========================================================
PalEntropía
PALNAVEGADOR.js v1.2 LTS

SISTEMA DE NAVEGACIÓN DE PALEOFICHAS

FUNCIONES:

- Carga registros desde LEEPALJSON
- Mantiene un índice global
- Navega primero / anterior / siguiente / último
- Navega aleatoriamente
- Gestiona filtros
- Localiza correctamente un j1
- Permite al buscador cargar directamente un j1
- Entrega j1 a CAB07
- Carga la ficha mediante CARGACONT
- Consulta CONT07
- Muestra temporalmente la geología

FLUJO DE BÚSQUEDA:

PALBUSCADOR
     ↓
    j1
     ↓
PALNAVEGADOR.cargarPorCodigo(j1)
     ↓
ÍNDICE GLOBAL
     ↓
CAB07
     ↓
CARGACONT
     ↓
CAB01–CAB06

IMPORTANTE:

La posición real siempre se determina por el j1.

========================================================
*/


const PALNAVEGADOR = {

    version: "1.2 LTS",

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

        this.indice = -1;

        this.codigoActual = null;

        this.filtroActivo = null;

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
            Array.isArray(this.filtroActivo)
        ) {

            return this.filtroActivo;

        }

        return this.registros;

    },


    /* =====================================================
       BUSCAR ÍNDICE GLOBAL

       IMPORTANTE:

       Esta función NO mira el filtro.

       Sirve para localizar la posición real
       del registro dentro de master.csv.
       ===================================================== */

    buscarIndiceGlobal(codigo) {

        const j1 =
            this.normalizarCodigo(codigo);

        if (!j1) {

            return -1;

        }

        return this.registros.findIndex(
            registro =>
                this.normalizarCodigo(
                    registro.codigo
                ) === j1
        );

    },


    /* =====================================================
       BUSCAR ÍNDICE ACTIVO

       Si existe filtro busca dentro del filtro.

       Si no existe filtro utiliza el índice global.
       ===================================================== */

    buscarIndice(codigo) {

        const j1 =
            this.normalizarCodigo(codigo);

        if (!j1) {

            return -1;

        }

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

       Localiza el j1 y actualiza la posición.

       NO carga la ficha.
       ===================================================== */

    posicionar(codigo) {

        const j1 =
            this.normalizarCodigo(codigo);

        if (!j1) {

            return false;

        }

        let indice;

        /*
        -----------------------------------------------------
        SIN FILTRO

        Utilizamos SIEMPRE el índice global.
        -----------------------------------------------------
        */

        if (!this.estaFiltrado()) {

            indice =
                this.buscarIndiceGlobal(j1);

        }

        /*
        -----------------------------------------------------
        CON FILTRO

        Buscamos dentro del conjunto filtrado.
        -----------------------------------------------------
        */

        else {

            indice =
                this.buscarIndice(j1);

        }

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

       FUNCIÓN PRINCIPAL PARA PALBUSCADOR.

       Recibe solamente j1.

       Localiza primero la posición correcta
       y después carga ese registro.
       ===================================================== */

    async cargarPorCodigo(codigo) {

        const j1 =
            this.normalizarCodigo(codigo);

        if (!j1) {

            throw new Error(
                "PALNAVEGADOR: código vacío."
            );

        }

        const situado =
            this.posicionar(j1);

        if (!situado) {

            throw new Error(
                "PALNAVEGADOR: código no encontrado: " +
                j1
            );

        }

        return await this.cargarIndice(
            this.indice
        );

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA
       ===================================================== */

    mostrarGeologia() {

        let geologia = null;

        if (
            window.CONT07 &&
            typeof window.CONT07.obtenerGeologia ===
            "function"
        ) {

            geologia =
                window.CONT07.obtenerGeologia();

        }

        let contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );

        if (!contenedor) {

            contenedor =
                document.createElement("div");

            contenedor.id =
                "resultadoGeologiaCAB07";

            contenedor.style.margin =
                "12px auto";

            contenedor.style.padding =
                "10px";

            contenedor.style.maxWidth =
                "700px";

            contenedor.style.borderRadius =
                "10px";

            contenedor.style.fontSize =
                "13px";

            const ficha =
                document.getElementById("ficha");

            if (ficha) {

                ficha.appendChild(
                    contenedor
                );

            } else {

                document.body.appendChild(
                    contenedor
                );

            }

        }

        if (!geologia) {

            contenedor.innerHTML =
                `
                <strong>Geología</strong>
                <br>
                Sin datos geológicos.
                `;

            return;

        }

        const codes =
            Array.isArray(geologia.codes)
                ? geologia.codes
                : [];

        const periodo =
            Array.isArray(geologia.periodo)
                ? geologia.periodo
                : [];

        const edad =
            Array.isArray(geologia.edad)
                ? geologia.edad
                : [];

        contenedor.innerHTML =
            `
            <strong>Geología</strong>

            <br><br>

            <strong>Códigos:</strong>
            ${
                codes.length
                    ? codes.join(", ")
                    : "—"
            }

            <br><br>

            <strong>Períodos:</strong>
            ${
                periodo.length
                    ? periodo.join(", ")
                    : "—"
            }

            <br><br>

            <strong>Edades:</strong>
            ${
                edad.length
                    ? edad.join(", ")
                    : "—"
            }
            `;

    },


    /* =====================================================
       CARGAR ÍNDICE
       ===================================================== */

    async cargarIndice(indice) {

        const conjunto =
            this.conjuntoActivo();

        if (!conjunto.length) {

            throw new Error(
                "PALNAVEGADOR: no hay registros."
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
           CAB07
           ================================================= */

        if (
            window.CAB07 &&
            typeof window.CAB07.procesar === "function"
        ) {

            await window.CAB07.procesar(
                this.codigoActual
            );

        }


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
           GEOLOGÍA
           ================================================= */

        this.mostrarGeologia();


        return resultado;

    },


    /* =====================================================
       PRIMERO
       ===================================================== */

    async primero() {

        return await this.cargarIndice(0);

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

            return await this.cargarIndice(0);

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

        this.filtroActivo =
            registros;

        if (!registros.length) {

            this.indice = -1;

            return;

        }

        /*
        -----------------------------------------------------
        INTENTAR CONSERVAR EL REGISTRO ACTUAL
        -----------------------------------------------------
        */

        if (this.codigoActual) {

            const indice =
                registros.findIndex(
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

        this.codigoActual =
            this.normalizarCodigo(
                registros[0].codigo
            );

    },


    /* =====================================================
       LIMPIAR FILTRO
       ===================================================== */

    limpiarFiltro() {

        const codigo =
            this.codigoActual;

        this.filtroActivo =
            null;

        if (!codigo) {

            this.indice = -1;

            return;

        }

        const indice =
            this.buscarIndiceGlobal(codigo);

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
            typeof window.CONT07.obtener !==
            "function"
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
FIN PALNAVEGADOR.js v1.2 LTS
========================================================
*/

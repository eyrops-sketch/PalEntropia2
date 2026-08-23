/*
========================================================
PALARENA
palarenadatos.js v1.0
PalEntropía

Función:
- Cargar master.csv
- Obtener una Paleoficha por j1
- Decodificar j5
- Decodificar j6
- Decodificar j9
- Decodificar j10
- Consultar PALHAB
- Consultar PALMODO
- Consultar PALMEDIO

No modifica las bases originales.
No aplica bonificaciones.
No realiza combate.
========================================================
*/

window.PALARENA_DATOS = {

    rutaMaster: "../generador_fase_2/master.csv",

    datos: [],
    mapa: {},
    cargado: false,


    /* ==================================================
       CARGAR MASTER.CSV
    ================================================== */

    async cargar() {

        try {

            const respuesta = await fetch(this.rutaMaster);

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo cargar master.csv: HTTP " +
                    respuesta.status
                );
            }

            const texto = await respuesta.text();

            this.procesarCSV(texto);

            this.cargado = true;

            console.log(
                "PALARENA_DATOS: master.csv cargado correctamente.",
                this.datos.length,
                "registros"
            );

            return true;

        } catch (error) {

            console.error(
                "PALARENA_DATOS: error cargando master.csv",
                error
            );

            this.cargado = false;

            return false;
        }
    },


    /* ==================================================
       PROCESAR CSV
    ================================================== */

    procesarCSV(texto) {

        const lineas = texto
            .replace(/\r/g, "")
            .split("\n")
            .filter(linea => linea.trim() !== "");

        if (lineas.length < 2) {
            throw new Error("master.csv no contiene registros.");
        }

        const cabecera = this.parsearLinea(lineas[0]);

        this.datos = [];
        this.mapa = {};

        for (let i = 1; i < lineas.length; i++) {

            const valores = this.parsearLinea(lineas[i]);

            if (valores.length === 0) {
                continue;
            }

            const registro = {};

            cabecera.forEach((campo, indice) => {
                registro[campo] =
                    valores[indice] !== undefined
                        ? valores[indice]
                        : "";
            });

            this.datos.push(registro);

            if (registro.j1) {
                this.mapa[registro.j1] = registro;
            }
        }
    },


    /* ==================================================
       PARSER CSV SIMPLE
    ================================================== */

    parsearLinea(linea) {

        const resultado = [];
        let actual = "";
        let comillas = false;

        for (let i = 0; i < linea.length; i++) {

            const caracter = linea[i];

            if (caracter === '"') {

                comillas = !comillas;

            } else if (caracter === "," && !comillas) {

                resultado.push(actual);
                actual = "";

            } else {

                actual += caracter;
            }
        }

        resultado.push(actual);

        return resultado.map(valor => valor.trim());
    },


    /* ==================================================
       OBTENER PALEOFICHA
    ================================================== */

    obtener(j1) {

        if (!this.cargado) {
            console.warn(
                "PALARENA_DATOS: master.csv todavía no está cargado."
            );

            return null;
        }

        return this.mapa[j1] || null;
    },


    /* ==================================================
       DECODIFICAR J5 / J6
       
       15 caracteres
       5 slots × 3 cifras

       Ejemplo:
       100097147000000

       ↓

       H100
       H097
       H147
       H000
       H000
    ================================================== */

    decodificarHabitats(cadena) {

        if (!cadena) {
            return [];
        }

        cadena = String(cadena).replace(/\D/g, "");

        const habitats = [];

        for (let i = 0; i < 15; i += 3) {

            const bloque = cadena.substring(i, i + 3);

            if (bloque.length !== 3) {
                continue;
            }

            habitats.push("H" + bloque);
        }

        return habitats;
    },


    /* ==================================================
       DECODIFICAR J9
       
       3 cifras

       Ejemplo:
       002

       ↓

       MV002
    ================================================== */

    decodificarModo(cadena) {

        if (!cadena) {
            return "MV000";
        }

        cadena = String(cadena)
            .replace(/\D/g, "")
            .padStart(3, "0")
            .slice(-3);

        return "MV" + cadena;
    },


    /* ==================================================
       DECODIFICAR J10
       
       12 caracteres
       4 slots × 3 cifras

       SM | L | ES | C

       Ejemplo:
       002001001003

       ↓

       SM002
       L001
       ES001
       C003
    ================================================== */

    decodificarMedio(cadena) {

        if (!cadena) {
            return {
                codigo: "000000000000",
                SM: "SM000",
                L: "L000",
                ES: "ES000",
                C: "C000"
            };
        }

        cadena = String(cadena).replace(/\D/g, "");

        cadena = cadena.padEnd(12, "0").slice(0, 12);

        const bloqueSM = cadena.substring(0, 3);
        const bloqueL  = cadena.substring(3, 6);
        const bloqueES = cadena.substring(6, 9);
        const bloqueC  = cadena.substring(9, 12);

        return {

            codigo: cadena,

            SM: "SM" + bloqueSM,
            L: "L" + bloqueL,
            ES: "ES" + bloqueES,
            C: "C" + bloqueC
        };
    },


    /* ==================================================
       CONSTRUIR DATOS DE ARENA
    ================================================== */

    preparar(j1) {

        const ficha = this.obtener(j1);

        if (!ficha) {
            console.warn(
                "PALARENA_DATOS: no existe la ficha:",
                j1
            );

            return null;
        }

        const habitatsJ5 =
            this.decodificarHabitats(ficha.j5);

        const habitatsJ6 =
            this.decodificarHabitats(ficha.j6);

        const habitats = [
            ...habitatsJ5,
            ...habitatsJ6
        ];

        const habitatsUnicos =
            [...new Set(habitats)];

        const modo =
            this.decodificarModo(ficha.j9);

        const medio =
            this.decodificarMedio(ficha.j10);

        return {

            j1: ficha.j1,
            j2: ficha.j2,
            j3: ficha.j3,

            j5: ficha.j5,
            j6: ficha.j6,
            j9: ficha.j9,
            j10: ficha.j10,

            habitatsJ5,
            habitatsJ6,
            habitats: habitatsUnicos,

            modo,

            medio,

            estadisticas: {

                e1: Number(ficha.e1),
                e2: Number(ficha.e2),
                e3: Number(ficha.e3),
                e4: Number(ficha.e4),
                e5: Number(ficha.e5),
                e6: Number(ficha.e6),
                e7: Number(ficha.e7),
                e8: Number(ficha.e8),
                e9: Number(ficha.e9),
                e10: Number(ficha.e10),
                e11: Number(ficha.e11)

            }
        };
    },


    /* ==================================================
       CONSULTAR PALHAB
    ================================================== */

    obtenerHabitat(codigo) {

        if (
            !window.PALHAB ||
            !window.PALHAB[codigo]
        ) {
            return null;
        }

        return window.PALHAB[codigo];
    },


    /* ==================================================
       CONSULTAR PALMODO
    ================================================== */

    obtenerModo(codigo) {

        if (
            !window.PALMODO ||
            !window.PALMODO[codigo]
        ) {
            return null;
        }

        return window.PALMODO[codigo];
    },


    /* ==================================================
       CONSULTAR PALMEDIO
    ================================================== */

    obtenerMedio(codigo) {

        if (
            !window.PALMEDIO ||
            !window.PALMEDIO[codigo]
        ) {
            return null;
        }

        return window.PALMEDIO[codigo];
    },


    /* ==================================================
       INFORMACIÓN COMPLETA
    ================================================== */

    obtenerInformacionCompleta(j1) {

        const datos = this.preparar(j1);

        if (!datos) {
            return null;
        }

        return {

            ficha: datos,

            habitats:
                datos.habitats.map(codigo => ({
                    codigo,
                    datos: this.obtenerHabitat(codigo)
                })),

            modo: {
                codigo: datos.modo,
                datos: this.obtenerModo(datos.modo)
            },

            medio: {

                codigo: datos.medio.codigo,

                SM: this.obtenerMedio(datos.medio.SM),
                L: this.obtenerMedio(datos.medio.L),
                ES: this.obtenerMedio(datos.medio.ES),
                C: this.obtenerMedio(datos.medio.C)

            }
        };
    }
};


/*
========================================================
FIN PALARENA_DATOS
========================================================
*/

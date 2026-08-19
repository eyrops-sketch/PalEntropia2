/*
========================================================
matrixnavegador.js v1.0
PalEntropía

FUNCIÓN
-------
Recibe una matriz de códigos j1 y devuelve una matriz
con todos los campos correspondientes de master.csv.

ENTRADA
-------
[
    "004_03",
    "004_04",
    "006_01"
]

SALIDA
------
[
    {
        j1: "004_03",
        j2: "...",
        j3: "...",
        j4: "...",
        j5: "...",
        j6: "...",
        j7: "...",
        j8: "...",
        j9: "...",
        j10: "...",
        e1: "...",
        ...
        e11: "..."
    },
    ...
]

IMPORTANTE
----------
- No depende de ningún CAB.
- No depende de PALNAVEGADOR.
- No modifica ninguna navegación.
- No interpreta ni decodifica los campos.
- No transforma valores.
- Trabaja exclusivamente con j1.
- Devuelve los datos brutos completos del master.csv.
========================================================
*/


window.MatrixNavegador = {


    /*====================================================
      ESTADO
    ====================================================*/

    datos: [],

    codigos: [],


    /*====================================================
      OBTENER MASTER
    ====================================================*/

    cargarMaster: async function() {

        const respuesta =
            await fetch("master.csv");


        if (!respuesta.ok) {

            throw new Error(
                "MatrixNavegador: no se pudo cargar master.csv."
            );

        }


        const texto =
            await respuesta.text();


        const lineas =
            texto.split(/\r?\n/);


        const registros = [];


        /*
        Saltamos la cabecera.
        */

        for (
            let i = 1;
            i < lineas.length;
            i++
        ) {

            const linea =
                lineas[i].trim();


            if (!linea) {

                continue;

            }


            const columnas =
                linea.split(",");


            if (
                columnas.length < 21
            ) {

                continue;

            }


            registros.push({

                j1:
                    columnas[0]?.trim() || "",

                j2:
                    columnas[1]?.trim() || "",

                j3:
                    columnas[2]?.trim() || "",

                j4:
                    columnas[3]?.trim() || "",

                j5:
                    columnas[4]?.trim() || "",

                j6:
                    columnas[5]?.trim() || "",

                j7:
                    columnas[6]?.trim() || "",

                j8:
                    columnas[7]?.trim() || "",

                j9:
                    columnas[8]?.trim() || "",

                j10:
                    columnas[9]?.trim() || "",

                e1:
                    columnas[10]?.trim() || "",

                e2:
                    columnas[11]?.trim() || "",

                e3:
                    columnas[12]?.trim() || "",

                e4:
                    columnas[13]?.trim() || "",

                e5:
                    columnas[14]?.trim() || "",

                e6:
                    columnas[15]?.trim() || "",

                e7:
                    columnas[16]?.trim() || "",

                e8:
                    columnas[17]?.trim() || "",

                e9:
                    columnas[18]?.trim() || "",

                e10:
                    columnas[19]?.trim() || "",

                e11:
                    columnas[20]?.trim() || ""

            });

        }


        this.datos =
            registros;


        return registros;

    },


    /*====================================================
      CREAR MATRIZ NAVEGADOR
    ====================================================*/

    crear: async function(codigos) {


        /*
        Validamos entrada.
        */

        if (
            !Array.isArray(codigos)
        ) {

            this.codigos = [];

            return [];

        }


        /*
        Normalizamos únicamente los códigos.
        */

        this.codigos =
            codigos
                .map(
                    codigo =>
                        String(
                            codigo || ""
                        )
                        .trim()
                        .toUpperCase()
                )
                .filter(
                    codigo =>
                        codigo !== ""
                );


        /*
        Si no hay códigos,
        devolvemos matriz vacía.
        */

        if (
            !this.codigos.length
        ) {

            return [];

        }


        /*
        Cargamos master.csv.
        */

        const master =
            await this.cargarMaster();


        /*
        Creamos un mapa por j1.
        Esto permite localizar rápidamente
        cada registro.
        */

        const mapa =
            new Map();


        master.forEach(
            registro => {

                mapa.set(
                    registro.j1
                        .trim()
                        .toUpperCase(),

                    registro
                );

            }
        );


        /*
        Construimos la matriz final
        respetando exactamente el orden
        de los códigos recibidos.
        */

        const matriz =
            [];


        this.codigos.forEach(
            codigo => {

                const registro =
                    mapa.get(
                        codigo
                    );


                if (
                    registro
                ) {

                    matriz.push(
                        registro
                    );

                }

            }
        );


        return matriz;

    },


    /*====================================================
      ALIAS
      ----------------------------------------------------
      Permite llamar a la función simplemente como
      obtener().
    ====================================================*/

    obtener: async function(codigos) {

        return await this.crear(
            codigos
        );

    },


    /*====================================================
      OBTENER ÚLTIMA MATRIZ
    ====================================================*/

    obtenerActual: function() {

        /*
        Esta función devuelve los datos que fueron
        generados en la última llamada a crear().
        */

        return this.codigos.map(
            codigo => {

                return this.datos.find(
                    registro =>
                        registro.j1
                            .trim()
                            .toUpperCase()
                        === codigo
                );

            }
        )
        .filter(
            registro =>
                registro
        );

    }

};


/*
========================================================
FIN matrixnavegador.js v1.0
========================================================
*/





/*
========================================================
matrixnavegador.js v1.0
PalEntropía

FUNCIÓN
-------
Recibe una matriz de códigos J1 y devuelve los registros
completos correspondientes de master.csv.

ENTRADA
-------
[
    "004_03",
    "004_07",
    "004_11",
    "005_02"
]

SALIDA
------
[
    {
        j1: "...",
        j2: "...",
        j3: "...",
        ...
        j10: "...",
        e1: "...",
        ...
        e11: "..."
    }
]

IMPORTANTE
----------
- No depende de ningún CAB.
- No depende de PALNAVEGADOR.
- No depende de CAB16.
- No decodifica ningún campo.
- No transforma ningún valor.
- Trabaja exclusivamente con J1 y master.csv.
- Mantiene el orden recibido.
========================================================
*/

window.MatrixNavegador = {

    /*====================================================
      ESTADO
    ====================================================*/

    matriz: [],

    inicializado: false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar: function(){

        if(this.inicializado){

            return;

        }

        this.inicializado = true;

        console.log(
            "matrixnavegador v1.0: preparado."
        );

    },


    /*====================================================
      OBTENER REGISTROS POR J1
    ====================================================*/

    obtener: async function(
        matrizJ1
    ){

        if(
            !Array.isArray(
                matrizJ1
            )
        ){

            this.matriz = [];

            return [];

        }


        /*
        Limpiamos los códigos recibidos.
        */

        const codigos =
            matrizJ1
                .map(
                    codigo =>
                        String(
                            codigo || ""
                        ).trim()
                )
                .filter(
                    codigo =>
                        codigo !== ""
                );


        if(
            !codigos.length
        ){

            this.matriz = [];

            return [];

        }


        /*----------------------------------------------
          CARGAR MASTER
        ----------------------------------------------*/

        const respuesta =
            await fetch(
                "master.csv"
            );


        if(!respuesta.ok){

            throw new Error(
                "matrixnavegador: no se pudo cargar master.csv."
            );

        }


        const texto =
            await respuesta.text();


        const lineas =
            texto.split(
                /\r?\n/
            );


        /*----------------------------------------------
          MAPA DEL MASTER
        ----------------------------------------------*/

        const registros =
            new Map();


        for(
            const linea of lineas
        ){

            if(
                !linea.trim()
            ){

                continue;

            }


            const columnas =
                linea.split(",");


            /*
            Necesitamos:

            j1-j10 = 10 campos
            e1-e11 = 11 campos

            TOTAL = 21
            */

            if(
                columnas.length < 21
            ){

                continue;

            }


            const registro = {

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

            };


            /*
            Guardamos por J1.
            */

            registros.set(
                registro.j1,
                registro
            );

        }


        /*----------------------------------------------
          CONSTRUIR MATRIZ FINAL
          EN EL MISMO ORDEN DE LOS J1 RECIBIDOS
        ----------------------------------------------*/

        const resultado = [];


        for(
            const codigo of codigos
        ){

            const registro =
                registros.get(
                    codigo
                );


            if(
                registro
            ){

                resultado.push(
                    registro
                );

            }

        }


        /*----------------------------------------------
          GUARDAR RESULTADO
        ----------------------------------------------*/

        this.matriz =
            resultado;


        console.log(
            "matrixnavegador: registros recuperados:",
            resultado
        );


        return resultado;

    },


    /*====================================================
      OBTENER ÚLTIMA MATRIZ
    ====================================================*/

    obtenerMatriz: function(){

        return this.matriz;

    },


    /*====================================================
      LIMPIAR
    ====================================================*/

    limpiar: function(){

        this.matriz = [];

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        window.MatrixNavegador.inicializar();

    }
);


/*
========================================================
FIN matrixnavegador.js v1.0
========================================================
*/

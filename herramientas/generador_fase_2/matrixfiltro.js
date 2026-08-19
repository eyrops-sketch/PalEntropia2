/*
========================================================
matrixfiltro.js v1.0
MATRIZ DE CÓDIGOS FILTRADOS
PalEntropía

FUNCIÓN
-------
Recoge exclusivamente los códigos j1 que aparecen
en los resultados de búsqueda de CAB16 cuando está
activado el check "Buscar en todos los registros".

NO DECODIFICA.
NO NAVEGA.
NO MODIFICA CAB16.
NO MODIFICA PALNAVEGADOR.

SALIDA
------
window.MATRIXFILTRO

Ejemplo:

[
    "001_01",
    "001_02",
    "001_03"
]

La matriz queda disponible para cualquier módulo
externo de PalEntropía.

========================================================
*/


window.MATRIXFILTRO = {

    /*====================================================
      MATRIZ ACTUAL
    ====================================================*/

    datos: [],


    /*====================================================
      OBTENER CÓDIGOS DE LOS RESULTADOS
    ====================================================*/

    actualizar: function(){

        this.datos = [];


        /*------------------------------------------------
          Comprobar que CAB16 está activo
        ------------------------------------------------*/

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(
            !check ||
            !check.checked
        ){

            return this.datos;

        }


        /*------------------------------------------------
          Contenedor de resultados de CAB16
        ------------------------------------------------*/

        const resultados =
            document.getElementById(
                "resultadosCab16"
            );


        if(!resultados){

            return this.datos;

        }


        /*------------------------------------------------
          Buscar todas las filas de resultados
        ------------------------------------------------*/

        const filas =
            resultados.querySelectorAll(
                ".resultadoCab16"
            );


        filas.forEach(
            fila => {

                const codigo =
                    String(
                        fila.dataset.codigo ||
                        fila.textContent ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                if(!codigo){

                    return;

                }


                /*
                Evitamos duplicados.
                */

                if(
                    !this.datos.includes(
                        codigo
                    )
                ){

                    this.datos.push(
                        codigo
                    );

                }

            }
        );


        return this.datos;

    },


    /*====================================================
      OBTENER MATRIZ
    ====================================================*/

    obtener: function(){

        return this.datos;

    },


    /*====================================================
      LIMPIAR MATRIZ
    ====================================================*/

    limpiar: function(){

        this.datos = [];

        return this.datos;

    },


    /*====================================================
      CANTIDAD DE RESULTADOS
    ====================================================*/

    cantidad: function(){

        return this.datos.length;

    }

};


/*
========================================================
FIN matrixfiltro.js v1.0
========================================================
*/

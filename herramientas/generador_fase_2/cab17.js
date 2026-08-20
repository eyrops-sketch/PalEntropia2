/*
========================================================
PalEntropía
cab17.js v1.1

BUSCADOR POR NOMBRE — J2

FUNCIÓN
-------
- Busca por nombre.
- Mínimo 3 caracteres.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Utiliza LEEPALJSON.
- Al activar el check:
    resultados → MATRIXFILTRO
- CAB16 NO SE MODIFICA.

CIRCUITO
--------
NOMBRE
  ↓
CAB17
  ↓
J1 asociados
  ↓
MATRIXFILTRO
========================================================
*/

window.cab17 = {

    datos: [],


    /*====================================================
      DATOS
    ====================================================*/

    obtenerDatos: function(){

        if(
            window.LEEPALJSON &&
            typeof window.LEEPALJSON.obtener ===
            "function"
        ){

            const datos =
                window.LEEPALJSON.obtener();

            if(
                Array.isArray(datos)
            ){

                this.datos =
                    datos;

            }

        }

        return this.datos;

    },


    /*====================================================
      NORMALIZAR
    ====================================================*/

    normalizar: function(texto){

        return String(
            texto || ""
        )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

    },


    /*====================================================
      ES CÓDIGO J1
    ====================================================*/

    esCodigo: function(texto){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(
                texto || ""
            ).trim()
        );

    },


    /*====================================================
      BUSCAR POR NOMBRE
    ====================================================*/

    buscarJ2: function(){

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

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(
            !campo ||
            !label ||
            !resultados
        ){

            return [];

        }


        const texto =
            this.normalizar(
                campo.value
            );


        resultados.innerHTML =
            "";


        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";

            return [];

        }


        this.obtenerDatos();


        const coincidencias =
            this.datos.filter(
                registro => {

                    if(
                        !registro
                    ){

                        return false;

                    }


                    const nombre =
                        this.normalizar(
                            registro.nombre
                        );


                    return nombre.includes(
                        texto
                    );

                }
            );


        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*------------------------------------------------
          MOSTRAR RESULTADOS
        ------------------------------------------------*/

        coincidencias.forEach(
            registro => {

                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    registro.codigo;


                fila.textContent =
                    registro.nombre;


                fila.addEventListener(
                    "click",
                    () => {

                        if(
                            window.PALNAVEGADOR &&
                            typeof window.PALNAVEGADOR.cargarPorCodigo ===
                            "function"
                        ){

                            window.PALNAVEGADOR.cargarPorCodigo(
                                registro.codigo
                            );

                        }

                    }
                );


                resultados.appendChild(
                    fila
                );

            }
        );


        /*------------------------------------------------
          CHECK ACTIVADO
          → MATRIXFILTRO
        ------------------------------------------------*/

        if(
            check &&
            check.checked
        ){

            this.enviarMatrix(
                coincidencias
            );

        }


        return coincidencias;

    },


    /*====================================================
      ENVIAR RESULTADOS A MATRIXFILTRO
    ====================================================*/

    enviarMatrix: function(
        registros
    ){

        if(
            !Array.isArray(
                registros
            ) ||
            !registros.length
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


        /*
        Se entrega a MATRIXFILTRO
        exactamente el mismo conjunto
        de registros encontrado.

        MATRIXFILTRO obtiene los J1.
        */

        window.MATRIXFILTRO.actualizar(
            registros
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

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(
            !campo ||
            !check
        ){

            return;

        }


        /*------------------------------------------------
          INPUT

          CAPTURA:

          CAB17 recibe primero las consultas
          que NO son J1.

          Así CAB16 no pisa los resultados.
        ------------------------------------------------*/

        campo.addEventListener(
            "input",
            (evento) => {

                const texto =
                    campo.value.trim();


                /*
                Si es J1, CAB16 trabaja normalmente.
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                /*
                Consulta J2.
                CAB17 se hace cargo.
                */

                evento.stopImmediatePropagation();


                this.buscarJ2();

            },
            true
        );


        /*------------------------------------------------
          CHECK
        ------------------------------------------------*/

        check.addEventListener(
            "change",
            (evento) => {

                const texto =
                    campo.value.trim();


                /*
                El check para una consulta J1
                pertenece a CAB16.
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                if(
                    texto.length < 3
                ){

                    return;

                }


                evento.stopImmediatePropagation();


                this.buscarJ2();

            },
            true
        );

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        window.cab17.conectar();

    }
);


/*
========================================================
FIN cab17.js v1.1
========================================================
*/

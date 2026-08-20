/*
========================================================
PalEntropía
cab17.js v1.4

BUSCADOR AVANZADO POR NOMBRE — J2

FUNCIÓN
-------
- Busca por nombre.
- Mínimo 3 caracteres.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Lee LEEPALJSON.
- Obtiene J1 asociado a cada coincidencia.
- Con check activado → MATRIXFILTRO.
- No modifica CAB16.

PRUEBA VISUAL
-------------
Muestra:

CAB17 ACTIVO
Registros cargados: XX
Ejemplo nombre: XXXXX

========================================================
*/

window.cab17 = {

    datos: [],


    /*====================================================
      OBTENER DATOS
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
      NORMALIZAR TEXTO
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
      OBTENER NOMBRE REAL DEL REGISTRO
    ====================================================*/

    obtenerNombre: function(
        registro
    ){

        if(
            !registro
        ){

            return "";

        }


        /*
        LEEPALJSON utiliza "nombre".

        j2 se mantiene como respaldo por
        compatibilidad con posibles registros
        que conserven el nombre original del CSV.
        */

        const nombre =
            registro.nombre !== undefined
                ? registro.nombre
                : registro.j2;


        return String(
            nombre || ""
        ).trim();

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


        /*
        ====================================================
        CARGAR DATOS
        ====================================================
        */

        this.obtenerDatos();


        /*
        ====================================================
        INDICADOR VISUAL
        ====================================================
        */

        resultados.innerHTML =
            "<div style='color:#62d6ff;padding:6px;'>" +

            "<strong>CAB17 ACTIVO</strong>" +

            "<br>" +

            "Registros cargados: " +
            this.datos.length +

            "<br>" +

            "Ejemplo nombre: " +
            (
                this.datos.length
                    ? this.obtenerNombre(
                        this.datos[0]
                    )
                    : "SIN DATOS"
            ) +

            "</div>";


        /*
        ====================================================
        MÍNIMO 3 CARACTERES
        ====================================================
        */

        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";


            return [];

        }


        /*
        ====================================================
        SIN DATOS
        ====================================================
        */

        if(
            !this.datos.length
        ){

            label.textContent =
                "0 resultados";


            return [];

        }


        /*
        ====================================================
        BUSCAR EN NOMBRE
        ====================================================
        */

        const coincidencias =
            this.datos.filter(
                registro => {

                    const nombre =
                        this.obtenerNombre(
                            registro
                        );


                    return this.normalizar(
                        nombre
                    ).includes(
                        texto
                    );

                }
            );


        /*
        ====================================================
        CONTADOR
        ====================================================
        */

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        ====================================================
        MOSTRAR RESULTADOS
        ====================================================
        */

        coincidencias.forEach(
            registro => {

                const codigo =
                    String(
                        registro.codigo ||
                        registro.j1 ||
                        ""
                    ).trim();


                const nombre =
                    this.obtenerNombre(
                        registro
                    );


                if(
                    !codigo ||
                    !nombre
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
                    codigo;


                fila.textContent =
                    nombre;


                /*
                Selección manual del resultado.
                */

                fila.addEventListener(
                    "click",
                    function(){

                        if(
                            window.PALNAVEGADOR &&
                            typeof window.PALNAVEGADOR.cargarPorCodigo ===
                            "function"
                        ){

                            window.PALNAVEGADOR.cargarPorCodigo(
                                codigo
                            );

                        }

                    }
                );


                resultados.appendChild(
                    fila
                );

            }
        );


        /*
        ====================================================
        CHECK ACTIVADO
        ====================================================
        */

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
      ENVIAR A MATRIXFILTRO
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
        Convertimos los resultados encontrados
        en sus J1.

        MATRIXFILTRO recibe únicamente esos J1.
        */

        const j1 =
            registros
            .map(
                registro => {

                    return String(
                        registro.codigo ||
                        registro.j1 ||
                        ""
                    ).trim();

                }
            )
            .filter(
                codigo =>
                    codigo !== ""
            );


        if(
            !j1.length
        ){

            return;

        }


        window.MATRIXFILTRO.actualizar(
            j1
        );

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar: function(){

        /*
        ----------------------------------------------------
        CONSULTA
        ----------------------------------------------------
        */

        document.addEventListener(
            "input",
            (evento) => {

                const campo =
                    evento.target;


                if(
                    !campo ||
                    campo.id !==
                    "buscarUniversal"
                ){

                    return;

                }


                const texto =
                    campo.value.trim();


                /*
                Si es código J1,
                CAB16 trabaja normalmente.
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                /*
                Si no es código,
                CAB17 procesa la búsqueda por nombre.
                */

                evento.stopImmediatePropagation();


                this.buscarJ2();

            },
            true
        );


        /*
        ----------------------------------------------------
        CHECK
        ----------------------------------------------------
        */

        document.addEventListener(
            "change",
            (evento) => {

                const elemento =
                    evento.target;


                if(
                    !elemento ||
                    elemento.id !==
                    "buscarTodosCab16"
                ){

                    return;

                }


                const campo =
                    document.getElementById(
                        "buscarUniversal"
                    );


                if(
                    !campo
                ){

                    return;

                }


                const texto =
                    campo.value.trim();


                /*
                Si es código J1,
                CAB16 trabaja normalmente.
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                if(
                    texto.length >= 3
                ){

                    evento.stopImmediatePropagation();


                    this.buscarJ2();

                }

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
FIN cab17.js v1.4
========================================================
*/

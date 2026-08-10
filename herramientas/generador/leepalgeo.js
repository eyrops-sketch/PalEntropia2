/*
========================================================
PalEntropía
leepalgeo.js v1.0 LTS

LECTOR CRONOLÓGICO DEL CONTENEDOR INTERMEDIO

Función:
- Lee j3 del registro CSV.
- j3 contiene la cronología interna.
- Utiliza PALGEOSIMPLIFICADO.
- PALGEOSIMPLIFICADO consulta PALGEO.
- Utiliza el SISTEMA B de intersección temporal.
- Prepara los datos exclusivamente para el Generador.

ENTRADA CSV:

j3
↓
0521.0000-0201.3000

SALIDA PARA GENERADOR:

intervalo
periodo
subperiodo

Ejemplo:

521 Ma - 201,3 Ma

Período:
Cámbrico · Ordovícico · ...

Subperíodo:
Terreneuviense - Serie 2 - ...

IMPORTANTE:

La cronología interna NO se muestra.

j3 es únicamente una referencia interna.

NO duplica ninguna función de:

- PALGEO
- PALGEOSIMPLIFICADO

PALGEOSIMPLIFICADO es quien interpreta
y formatea la cronología.

========================================================
*/

window.LEEPALGEO_VERSION = "1.0 LTS";


window.LEEPALGEO = {


/* ======================================================
   LEER J3

   Entrada:
   registro CSV / contenedor

   Busca exclusivamente:

   j3

   Ejemplo:

   {
       j1: "005_15",
       j2: "Longisquama",
       j3: "0237.0000-0227.0000"
   }

====================================================== */

leerJ3(registro){

    if(
        !registro ||
        typeof registro !== "object"
    ){

        return null;

    }


    /*
    J3 ES LA ÚNICA ENTRADA
    CRONOLÓGICA DE ESTE MÓDULO
    */

    let cronologia =
        registro.j3;


    if(
        cronologia === undefined ||
        cronologia === null
    ){

        return null;

    }


    cronologia =
        String(cronologia)
        .trim();


    if(
        cronologia === ""
    ){

        return null;

    }


    return cronologia;

},


/* ======================================================
   PREPARAR CRONOLOGÍA

   Entrega j3 a PALGEOSIMPLIFICADO.

   NO interpreta directamente.

====================================================== */

preparar(registro){

    /*
    Comprobar que existe
    PALGEOSIMPLIFICADO.
    */

    if(
        !window.PALGEOSIMPLIFICADO ||
        typeof
        window.PALGEOSIMPLIFICADO.analizar
        !== "function"
    ){

        return null;

    }


    /*
    LEER J3
    */

    let cronologia =
        this.leerJ3(
            registro
        );


    if(!cronologia){

        return null;

    }


    /*
    =====================================================
    DELEGAR TODA LA INTERPRETACIÓN
    A PALGEOSIMPLIFICADO
    =====================================================
    */

    let datos =
        window.PALGEOSIMPLIFICADO.analizar(
            cronologia
        );


    if(!datos){

        return null;

    }


    /*
    =====================================================
    PREPARAR SALIDA DEL GENERADOR
    =====================================================

    IMPORTANTE:

    NO se devuelve:

    - cronologia
    - inicio_ma
    - fin_ma
    - codes

    Esos datos son internos.

    El generador solo necesita
    los datos de presentación.
    */


    return {

        /*
        RANGO HUMANO

        Ejemplo:

        521 Ma - 201,3 Ma
        */

        intervalo:
            datos.rango,


        /*
        PERÍODOS

        Ejemplo:

        [
            "Cámbrico",
            "Ordovícico",
            ...
        ]
        */

        periodo:
            datos.periodo || [],


        /*
        SUBPERÍODOS

        PALGEOSIMPLIFICADO
        los obtiene del campo
        "edad" de PALGEO.

        Aquí se renombran únicamente
        para presentación del Generador.
        */

        subperiodo:
            datos.edad || []

    };

},


/* ======================================================
   FORMATO PARA GENERADOR

   Convierte los arrays en texto de presentación.

   NO modifica los datos originales.

====================================================== */

formatearParaGenerador(datos){

    if(
        !datos ||
        typeof datos !== "object"
    ){

        return null;

    }


    /*
    INTERVALO
    */

    let intervalo =
        datos.intervalo || "";


    /*
    PERÍODOS

    Separador visual:

    ·
    */

    let periodo =
        Array.isArray(
            datos.periodo
        )

        ?

        datos.periodo.join(
            " · "
        )

        :

        "";


    /*
    SUBPERÍODOS

    Separador visual:

    -
    */

    let subperiodo =
        Array.isArray(
            datos.subperiodo
        )

        ?

        datos.subperiodo.join(
            " - "
        )

        :

        "";


    /*
    =====================================================
    SALIDA FINAL
    =====================================================
    */

    return {

        intervalo:
            intervalo,

        periodo:
            periodo,

        subperiodo:
            subperiodo

    };

},


/* ======================================================
   FUNCIÓN PRINCIPAL

   Entrada:

   registro CSV

   Salida:

   Datos preparados para Generador.

====================================================== */

leer(registro){

    /*
    PREPARAR DATOS
    */

    let datos =
        this.preparar(
            registro
        );


    if(!datos){

        return null;

    }


    /*
    FORMATEAR PARA GENERADOR
    */

    return this.formatearParaGenerador(
        datos
    );

}


};


/*
========================================================
FIN LEEPALGEO v1.0 LTS
========================================================
*/







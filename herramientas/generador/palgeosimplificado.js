/*
========================================================
PalEntropía
palgeosimplificado.js v1.3 LTS

Módulo simplificado de tratamiento cronológico

FUNCIONES:

1. Conversión:
   texto humano
   ↓
   cronologia interna

2. Conversión inversa:
   cronologia interna
   ↓
   texto humano

3. Extracción desde PALGEO:
   cronologia
   ↓
   códigos
   períodos
   edades

--------------------------------------------------------

FORMATO INTERNO:

MMMM.DDDD-MMMM.DDDD

Ejemplo:

0521.0000-0509.0000

--------------------------------------------------------

REGLA TEMPORAL:

MÁS ANTIGUO → MÁS RECIENTE

--------------------------------------------------------

CRITERIO DE ASIGNACIÓN v1.3

Se incluyen los intervalos de PALGEO
que contienen temporalmente el rango
de la ficha.

Los límites compartidos entre dos
unidades geológicas reciben un tratamiento
especial:

1. Si la ficha ATRAVIESA el límite:
   → se incluyen ambas unidades.

2. Si la ficha TERMINA exactamente
   en el límite:
   → NO se incluye la unidad posterior.

3. Si la ficha COMIENZA exactamente
   en el límite:
   → se incluye la unidad posterior.

Esto evita que una especie cuyo rango
termina exactamente en un límite geológico
aparezca artificialmente dentro de la
unidad siguiente.

--------------------------------------------------------

EJEMPLO:

Cretácico
145 → 66 Ma

Paleógeno
66 → 23.03 Ma

Ficha:

70 → 66 Ma

Resultado:

Cretácico

NO:

Cretácico + Paleógeno

--------------------------------------------------------

Ficha:

70 → 65 Ma

Resultado:

Cretácico + Paleógeno

--------------------------------------------------------

Ficha:

66 → 65 Ma

Resultado:

Paleógeno

--------------------------------------------------------

PALGEO es la única fuente de datos geológicos.

NO:

- interpreta
- deduce
- completa
- corrige
- inventa
- rellena huecos

========================================================
*/

window.PALGEOSIMPLIFICADO = {


/* ======================================================
   FORMATEAR UN VALOR
   ====================================================== */

formatearValor(valor){

    if(
        typeof valor !== "number" ||
        !Number.isFinite(valor) ||
        valor < 0
    ){

        return null;

    }


    /*
    ACTUALIDAD
    */

    if(valor === 0){

        return "Actualidad";

    }


    /*
    MENOS DE 0,001 Ma
    → años enteros
    */

    if(valor < 0.001){

        return (

            Math.round(
                valor * 1000000
            ).toLocaleString(
                "es-ES"
            )

        ) + " a";

    }


    /*
    MENOS DE 1 Ma
    → años
    */

    if(valor < 1){

        return (

            Math.round(
                valor * 1000000
            ).toLocaleString(
                "es-ES"
            )

        ) + " a";

    }


    /*
    MILLONES DE AÑOS
    */

    let texto =
        valor.toFixed(4);


    /*
    Eliminar ceros finales
    */

    texto =
        texto.replace(
            /\.?0+$/,
            ""
        );


    /*
    Punto decimal → coma española
    */

    texto =
        texto.replace(
            ".",
            ","
        );


    return texto + " Ma";

},


/* ======================================================
   DECODIFICAR RANGO INTERNO
   ====================================================== */

decodificarRango(cronologia){

    if(!cronologia){

        return null;

    }


    let partes =
        String(cronologia)
        .split("-");


    if(partes.length !== 2){

        return null;

    }


    let inicio =
        Number(
            partes[0].trim()
        );


    let fin =
        Number(
            partes[1].trim()
        );


    if(
        !Number.isFinite(inicio) ||
        !Number.isFinite(fin) ||
        inicio < 0 ||
        fin < 0 ||
        inicio < fin
    ){

        return null;

    }


    return (

        this.formatearValor(inicio)

        +

        " - "

        +

        this.formatearValor(fin)

    );

},


/* ======================================================
   PARSEAR VALOR HUMANO
   ====================================================== */

parsearValor(texto){

    if(
        texto === undefined ||
        texto === null
    ){

        return null;

    }


    texto =
        String(texto)
        .trim();


    if(texto === ""){

        return null;

    }


    /*
    ACTUALIDAD
    */

    if(
        texto.toLowerCase() ===
        "actualidad"
    ){

        return 0;

    }


    /* ==================================================
       AÑOS
       ================================================== */

    if(
        /\s*a$/i.test(texto)
    ){

        let numero =
            texto
            .replace(
                /\s*a$/i,
                ""
            )
            .trim();


        if(numero === ""){

            return null;

        }


        /*
        Punto = separador de miles
        */

        numero =
            numero.replace(
                /\./g,
                ""
            );


        /*
        Coma = decimal
        */

        numero =
            numero.replace(
                ",",
                "."
            );


        if(
            !/^\d+(\.\d+)?$/.test(numero)
        ){

            return null;

        }


        let anos =
            Number(numero);


        if(
            !Number.isFinite(anos) ||
            anos < 0
        ){

            return null;

        }


        return anos / 1000000;

    }


    /* ==================================================
       MILLONES DE AÑOS
       ================================================== */

    if(
        /\s*Ma$/i.test(texto)
    ){

        let numero =
            texto
            .replace(
                /\s*Ma$/i,
                ""
            )
            .trim();


        if(numero === ""){

            return null;

        }


        numero =
            numero.replace(
                ",",
                "."
            );


        if(
            !/^\d+(\.\d+)?$/.test(numero)
        ){

            return null;

        }


        let ma =
            Number(numero);


        if(
            !Number.isFinite(ma) ||
            ma < 0
        ){

            return null;

        }


        return ma;

    }


    /*
    SIN UNIDAD

    No se interpreta.
    */

    return null;

},


/* ======================================================
   NORMALIZAR VALOR
   ====================================================== */

normalizarValor(valor){

    if(
        typeof valor !== "number" ||
        !Number.isFinite(valor) ||
        valor < 0
    ){

        return null;

    }


    let texto =
        valor.toFixed(4);


    let partes =
        texto.split(".");


    let entero =
        partes[0].padStart(
            4,
            "0"
        );


    let decimal =
        partes[1] || "0000";


    decimal =
        decimal.padEnd(
            4,
            "0"
        );


    return (

        entero

        +

        "."

        +

        decimal

    );

},


/* ======================================================
   CODIFICAR RANGO
   ====================================================== */

codificarRango(texto){

    if(!texto){

        return null;

    }


    texto =
        String(texto)
        .trim();


    let partes =
        texto.split("-");


    if(partes.length !== 2){

        return null;

    }


    let inicioTexto =
        partes[0].trim();


    let finTexto =
        partes[1].trim();


    if(
        !inicioTexto ||
        !finTexto
    ){

        return null;

    }


    let inicio =
        this.parsearValor(
            inicioTexto
        );


    let fin =
        this.parsearValor(
            finTexto
        );


    if(
        inicio === null ||
        fin === null
    ){

        return null;

    }


    /*
    MÁS ANTIGUO → MÁS RECIENTE
    */

    if(inicio < fin){

        return null;

    }


    let inicioNormalizado =
        this.normalizarValor(
            inicio
        );


    let finNormalizado =
        this.normalizarValor(
            fin
        );


    if(
        inicioNormalizado === null ||
        finNormalizado === null
    ){

        return null;

    }


    return (

        inicioNormalizado

        +

        "-"

        +

        finNormalizado

    );

},


/* ======================================================
   VALIDAR CRONOLOGÍA INTERNA
   ====================================================== */

validarCronologia(cronologia){

    if(!cronologia){

        return false;

    }


    let texto =
        String(cronologia)
        .trim();


    if(
        !/^\d{4}\.\d{4}-\d{4}\.\d{4}$/.test(
            texto
        )
    ){

        return false;

    }


    let partes =
        texto.split("-");


    let inicio =
        Number(partes[0]);


    let fin =
        Number(partes[1]);


    if(
        !Number.isFinite(inicio) ||
        !Number.isFinite(fin)
    ){

        return false;

    }


    /*
    MÁS ANTIGUO → MÁS RECIENTE
    */

    if(inicio < fin){

        return false;

    }


    return true;

},


/* ======================================================
   COMPROBAR INTERSECCIÓN GEOLÓGICA

   NUEVO CRITERIO v1.3

   Devuelve true si el intervalo PALGEO
   debe asignarse a la ficha.

   La comparación utiliza:

   inicio = límite antiguo de la ficha
   fin    = límite reciente de la ficha

   PALGEO:

   inicio_ma = límite antiguo
   fin_ma    = límite reciente

   ------------------------------------------------------

   CASOS:

   Ficha 70 → 66
   Unidad 145 → 66

   TRUE

   Ficha 70 → 65
   Unidad 145 → 66

   TRUE

   Ficha 66 → 65
   Unidad 145 → 66

   FALSE

   ======================================================
   */

intervaloCompatible(
    inicio,
    fin,
    intervalo
){

    if(
        !intervalo ||
        typeof intervalo.inicio_ma !==
        "number" ||
        typeof intervalo.fin_ma !==
        "number"
    ){

        return false;

    }


    const geoInicio =
        intervalo.inicio_ma;


    const geoFin =
        intervalo.fin_ma;


    /*
    ------------------------------------------------------
    VALIDACIÓN BÁSICA
    ------------------------------------------------------
    */

    if(
        geoInicio < geoFin
    ){

        return false;

    }


    /*
    ------------------------------------------------------
    EL INTERVALO DE PALGEO DEBE CONTENER
    ALGUNA PARTE DEL RANGO DE LA FICHA.

    Condición básica de intersección:

        inicio >= geoFin
        &&
        fin <= geoInicio
    ------------------------------------------------------
    */

    if(
        inicio < geoFin ||
        fin > geoInicio
    ){

        return false;

    }


    /*
    ------------------------------------------------------
    CASO ESPECIAL:

    LA FICHA TERMINA EXACTAMENTE
    EN EL LÍMITE RECIENTE DE LA UNIDAD.

    Ejemplo:

    Ficha:
    70 → 66

    PALGEO:
    145 → 66

    Aquí la ficha ha vivido dentro
    de la unidad, por lo que se conserva.

    ------------------------------------------------------
    */

    if(
        fin === geoFin
    ){

        return true;

    }


    /*
    ------------------------------------------------------
    SI EL INICIO DE LA FICHA COINCIDE
    CON EL LÍMITE RECIENTE DE LA UNIDAD
    Y LA FICHA CONTINÚA HACIA EL PRESENTE,
    ESTE INTERVALO NO SE CONSIDERA
    COMO PARTE DE LA UNIDAD ANTERIOR.

    Ejemplo:

    Ficha:
    66 → 65

    Unidad:
    145 → 66

    NO pertenece a esta unidad.
    ------------------------------------------------------
    */

    if(
        inicio === geoFin &&
        fin < geoFin
    ){

        return false;

    }


    /*
    ------------------------------------------------------
    CASO GENERAL

    El rango atraviesa o está contenido
    dentro de la unidad.

    ------------------------------------------------------
    */

    return true;

},


/* ======================================================
   EXTRAER DATOS DE PALGEO

   SISTEMA B MODIFICADO

   v1.3

   Los límites compartidos se tratan
   de forma explícita.

   No se eliminan datos internos.
   ====================================================== */

extraerPALGEO(cronologia){

    if(
        !cronologia ||
        !window.PALGEO ||
        !Array.isArray(
            window.PALGEO
        )
    ){

        return null;

    }


    /*
    La extracción solo trabaja
    con cronología interna válida.
    */

    if(
        !this.validarCronologia(
            cronologia
        )
    ){

        return null;

    }


    let partes =
        String(cronologia)
        .split("-");


    let inicio =
        Number(partes[0]);


    let fin =
        Number(partes[1]);


    let resultado = {

        codes: [],

        periodo: [],

        edad: []

    };


    /*
    =====================================================
    RECORRER PALGEO
    =====================================================
    */

    window.PALGEO.forEach(

        intervalo => {


            /*
            ------------------------------------------------
            COMPROBAR COMPATIBILIDAD
            ------------------------------------------------
            */

            if(
                !this.intervaloCompatible(
                    inicio,
                    fin,
                    intervalo
                )
            ){

                return;

            }


            /*
            =================================================
            CÓDIGO
            =================================================
            */

            if(
                intervalo.codigo &&
                !resultado.codes.includes(
                    intervalo.codigo
                )
            ){

                resultado.codes.push(
                    intervalo.codigo
                );

            }


            /*
            =================================================
            PERÍODO
            =================================================
            */

            if(
                intervalo.periodo &&
                !resultado.periodo.includes(
                    intervalo.periodo
                )
            ){

                resultado.periodo.push(
                    intervalo.periodo
                );

            }


            /*
            =================================================
            EDAD
            =================================================
            */

            if(
                intervalo.edad &&
                !resultado.edad.includes(
                    intervalo.edad
                )
            ){

                resultado.edad.push(
                    intervalo.edad
                );

            }

        }

    );


    return resultado;

},


/* ======================================================
   ANALIZAR

   FUNCIÓN PRINCIPAL
   ====================================================== */

analizar(cronologia){

    if(!cronologia){

        return null;

    }


    /*
    Solo se acepta aquí
    cronología interna.
    */

    if(
        !this.validarCronologia(
            cronologia
        )
    ){

        return null;

    }


    let partes =
        String(cronologia)
        .split("-");


    let inicio =
        Number(partes[0]);


    let fin =
        Number(partes[1]);


    if(
        !Number.isFinite(inicio) ||
        !Number.isFinite(fin)
    ){

        return null;

    }


    /*
    EXTRAER PALGEO
    */

    let datos =
        this.extraerPALGEO(
            cronologia
        );


    if(!datos){

        return null;

    }


    /*
    RESULTADO FINAL
    */

    return {

        cronologia:
            cronologia,

        inicio_ma:
            inicio,

        fin_ma:
            fin,

        rango:
            this.decodificarRango(
                cronologia
            ),

        codes:
            datos.codes,

        periodo:
            datos.periodo,

        edad:
            datos.edad

    };

}


};


/*
========================================================
FIN PALGEOSIMPLIFICADO v1.3 LTS
========================================================
*/

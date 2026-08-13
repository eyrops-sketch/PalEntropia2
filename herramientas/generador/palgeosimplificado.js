/*
========================================================
PalEntropía
palgeosimplificado.js v1.4 LTS

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

CRITERIO DE ASIGNACIÓN v1.4

Se incluyen únicamente los intervalos de PALGEO
que tengan SOLAPAMIENTO TEMPORAL REAL con el
rango de la ficha.

IMPORTANTE:

Que dos intervalos compartan únicamente un límite
NO significa que exista solapamiento.

Ejemplo:

Cretácico:
145 → 66 Ma

Paleógeno:
66 → 23.03 Ma

Ficha:
70 → 66 Ma

Resultado:

Cretácico

NO:

Cretácico + Paleógeno


--------------------------------------------------------

Si la ficha atraviesa el límite:

Ficha:
70 → 65 Ma

Resultado:

Cretácico + Paleógeno


--------------------------------------------------------

Si la ficha comienza exactamente en el límite:

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
    ------------------------------------------------------
    ACTUALIDAD
    ------------------------------------------------------
    */

    if(valor === 0){

        return "Actualidad";

    }


    /*
    ------------------------------------------------------
    MENOS DE 0,001 Ma
    → AÑOS ENTEROS
    ------------------------------------------------------
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
    ------------------------------------------------------
    MENOS DE 1 Ma
    → AÑOS
    ------------------------------------------------------
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
    ------------------------------------------------------
    MILLONES DE AÑOS
    ------------------------------------------------------
    */

    let texto =
        valor.toFixed(4);


    /*
    ELIMINAR CEROS FINALES
    */

    texto =
        texto.replace(
            /\.?0+$/,
            ""
        );


    /*
    PUNTO DECIMAL → COMA ESPAÑOLA
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


    if(
        partes.length !== 2
    ){

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

        this.formatearValor(
            inicio
        )

        +

        " - "

        +

        this.formatearValor(
            fin
        )

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


    if(
        texto === ""
    ){

        return null;

    }


    /*
    ------------------------------------------------------
    ACTUALIDAD
    ------------------------------------------------------
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


        if(
            numero === ""
        ){

            return null;

        }


        /*
        PUNTO = SEPARADOR DE MILES

        21.700
        ↓
        21700
        */

        numero =
            numero.replace(
                /\./g,
                ""
            );


        /*
        COMA = DECIMAL

        21,7
        ↓
        21.7
        */

        numero =
            numero.replace(
                ",",
                "."
            );


        if(
            !/^\d+(\.\d+)?$/.test(
                numero
            )
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


        /*
        AÑOS → Ma
        */

        return (
            anos /
            1000000
        );

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


        if(
            numero === ""
        ){

            return null;

        }


        /*
        COMA → PUNTO DECIMAL
        */

        numero =
            numero.replace(
                ",",
                "."
            );


        if(
            !/^\d+(\.\d+)?$/.test(
                numero
            )
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
    ------------------------------------------------------
    SIN UNIDAD

    NO SE INTERPRETA.
    ------------------------------------------------------
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
        partes[1] ||
        "0000";


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

    if(
        !texto
    ){

        return null;

    }


    texto =
        String(texto)
        .trim();


    /*
    ------------------------------------------------------
    SEPARAR LOS DOS EXTREMOS
    ------------------------------------------------------
    */

    let partes =
        texto.split("-");


    if(
        partes.length !== 2
    ){

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


    /*
    ------------------------------------------------------
    PARSEAR EXTREMOS
    ------------------------------------------------------
    */

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
    ------------------------------------------------------
    MÁS ANTIGUO → MÁS RECIENTE
    ------------------------------------------------------
    */

    if(
        inicio < fin
    ){

        return null;

    }


    /*
    ------------------------------------------------------
    NORMALIZAR
    ------------------------------------------------------
    */

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

    if(
        !cronologia
    ){

        return false;

    }


    let texto =
        String(cronologia)
        .trim();


    /*
    ------------------------------------------------------
    FORMATO EXACTO

    MMMM.DDDD-MMMM.DDDD
    ------------------------------------------------------
    */

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
        Number(
            partes[0]
        );


    let fin =
        Number(
            partes[1]
        );


    if(
        !Number.isFinite(inicio) ||
        !Number.isFinite(fin)
    ){

        return false;

    }


    /*
    ------------------------------------------------------
    MÁS ANTIGUO → MÁS RECIENTE
    ------------------------------------------------------
    */

    if(
        inicio < fin
    ){

        return false;

    }


    return true;

},


/* ======================================================
   COMPROBAR SOLAPAMIENTO TEMPORAL REAL
   ======================================================

   ESTA ES LA PARTE IMPORTANTE DE v1.4.

   NO se considera suficiente que dos intervalos
   compartan únicamente un límite.

   ------------------------------------------------------

   FICHA:

   inicio = límite antiguo
   fin    = límite reciente


   PALGEO:

   inicio_ma = límite antiguo
   fin_ma    = límite reciente


   ------------------------------------------------------

   EJEMPLO 1:

   Ficha:
   70 → 66

   Cretácico:
   145 → 66

   Hay tiempo compartido:

   70 → 66

   RESULTADO:
   TRUE


   ------------------------------------------------------

   Ejemplo 2:

   Ficha:
   70 → 66

   Paleógeno:
   66 → 23

   Solo comparten:

   66

   RESULTADO:
   FALSE


   ------------------------------------------------------

   Ejemplo 3:

   Ficha:
   70 → 65

   Paleógeno:
   66 → 23

   Comparten:

   66 → 65

   RESULTADO:
   TRUE


   ------------------------------------------------------

   Ejemplo 4:

   Ficha:
   66 → 65

   Cretácico:
   145 → 66

   Solo comparten:

   66

   RESULTADO:
   FALSE


   ------------------------------------------------------

   Ejemplo 5:

   Ficha:
   66 → 65

   Paleógeno:
   66 → 23

   Comparten:

   66 → 65

   RESULTADO:
   TRUE

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
    VALIDAR INTERVALO PALGEO
    ------------------------------------------------------
    */

    if(
        geoInicio < geoFin
    ){

        return false;

    }


    /*
    ------------------------------------------------------
    CALCULAR LOS EXTREMOS DEL SOLAPAMIENTO
    ------------------------------------------------------

    El extremo antiguo común será
    el menor de los dos extremos antiguos.

    El extremo reciente común será
    el mayor de los dos extremos recientes.
    ------------------------------------------------------
    */

    const extremoAntiguo =
        Math.min(
            inicio,
            geoInicio
        );


    const extremoReciente =
        Math.max(
            fin,
            geoFin
        );


    /*
    ------------------------------------------------------
    SOLAPAMIENTO REAL

    Tiene que existir una distancia temporal
    mayor que cero entre ambos extremos.

    Si son iguales:

        extremoAntiguo === extremoReciente

    solo existe un punto de contacto.

    Por tanto:

        FALSE
    ------------------------------------------------------
    */

    return (
        extremoAntiguo >
        extremoReciente
    );

},


/* ======================================================
   EXTRAER DATOS DE PALGEO
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
    ------------------------------------------------------
    VALIDAR CRONOLOGÍA
    ------------------------------------------------------
    */

    if(
        !this.validarCronologia(
            cronologia
        )
    ){

        return null;

    }


    /*
    ------------------------------------------------------
    OBTENER EXTREMOS
    ------------------------------------------------------
    */

    let partes =
        String(cronologia)
        .split("-");


    let inicio =
        Number(
            partes[0]
        );


    let fin =
        Number(
            partes[1]
        );


    /*
    ------------------------------------------------------
    RESULTADO
    ------------------------------------------------------
    */

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
            SOLO CONTINÚA SI EXISTE
            SOLAPAMIENTO REAL
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
            CÓDIGOS INTERNOS
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
            PERÍODOS
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
            EDADES
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
   ====================================================== */

analizar(cronologia){

    if(
        !cronologia
    ){

        return null;

    }


    /*
    ------------------------------------------------------
    VALIDAR CRONOLOGÍA
    ------------------------------------------------------
    */

    if(
        !this.validarCronologia(
            cronologia
        )
    ){

        return null;

    }


    /*
    ------------------------------------------------------
    EXTREMOS
    ------------------------------------------------------
    */

    let partes =
        String(cronologia)
        .split("-");


    let inicio =
        Number(
            partes[0]
        );


    let fin =
        Number(
            partes[1]
        );


    if(
        !Number.isFinite(inicio) ||
        !Number.isFinite(fin)
    ){

        return null;

    }


    /*
    ------------------------------------------------------
    EXTRAER PALGEO
    ------------------------------------------------------
    */

    let datos =
        this.extraerPALGEO(
            cronologia
        );


    if(
        !datos
    ){

        return null;

    }


    /*
    ------------------------------------------------------
    RESULTADO FINAL
    ------------------------------------------------------
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
FIN PALGEOSIMPLIFICADO v1.4 LTS
========================================================
*/



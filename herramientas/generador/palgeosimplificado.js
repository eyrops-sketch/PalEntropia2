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

IMPORTANTE:

Los ceros iniciales NO representan magnitud.

002.5800
↓
2,58 Ma

0000.0117
↓
11.700 a

0295.0000
↓
295 Ma

0272.3000
↓
272,3 Ma

========================================================
*/


window.PALGEOSIMPLIFICADO = {


/* ======================================================
   FORMATEAR UN VALOR

   Entrada:
   millones de años

   Salida humana:

   295
   ↓
   295 Ma

   272.3
   ↓
   272,3 Ma

   2.58
   ↓
   2,58 Ma

   0.0117
   ↓
   11.700 a

   0
   ↓
   Actualidad
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
    MENOS DE 1 Ma
    → años
    */

    if(valor < 1){

        let anos =
            Math.round(
                valor * 1000000
            );


        return (
            anos.toLocaleString(
                "es-ES"
            )
            +
            " a"
        );

    }


    /*
    MILLONES DE AÑOS
    */

    let texto =
        valor.toFixed(4);


    /*
    Eliminar ceros decimales
    */

    texto =
        texto.replace(
            /\.?0+$/,
            ""
        );


    /*
    Decimal español
    */

    texto =
        texto.replace(
            ".",
            ","
        );


    return (
        texto
        +
        " Ma"
    );

},


/* ======================================================
   DECODIFICAR UN VALOR INTERNO

   Convierte explícitamente:

   002.5800 → 2.58

   0000.0117 → 0.0117

   0295.0000 → 295

   Esto evita cualquier interpretación
   basada en los ceros iniciales.
====================================================== */

decodificarValorInterno(texto){

    if(
        texto === undefined ||
        texto === null
    ){

        return null;

    }


    texto =
        String(texto)
        .trim();


    /*
    FORMATO EXACTO:

    MMMM.DDDD
    */

    if(
        !/^\d{4}\.\d{4}$/.test(
            texto
        )
    ){

        return null;

    }


    /*
    Separar entero y decimal
    */

    let partes =
        texto.split(".");


    let entero =
        Number(
            partes[0]
        );


    let decimal =
        Number(
            partes[1]
        ) / 10000;


    if(
        !Number.isFinite(entero) ||
        !Number.isFinite(decimal)
    ){

        return null;

    }


    return (
        entero +
        decimal
    );

},


/* ======================================================
   DECODIFICAR RANGO INTERNO

   Entrada:

   0521.0000-0509.0000

   Salida:

   521 Ma - 509 Ma
====================================================== */

decodificarRango(cronologia){

    if(!cronologia){

        return null;

    }


    let texto =
        String(cronologia)
        .trim();


    /*
    COMPROBAR FORMATO
    */

    if(
        !/^\d{4}\.\d{4}-\d{4}\.\d{4}$/.test(
            texto
        )
    ){

        return null;

    }


    let partes =
        texto.split("-");


    if(partes.length !== 2){

        return null;

    }


    /*
    DECODIFICAR EXPLÍCITAMENTE
    CADA EXTREMO
    */

    let inicio =
        this.decodificarValorInterno(
            partes[0]
        );


    let fin =
        this.decodificarValorInterno(
            partes[1]
        );


    if(
        inicio === null ||
        fin === null
    ){

        return null;

    }


    /*
    SENTIDO TEMPORAL

    MÁS ANTIGUO
    →
    MÁS RECIENTE
    */

    if(inicio < fin){

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

   Acepta:

   521 Ma
   59,2 Ma

   11.700 a
   11700 a

   Actualidad
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


        return (
            anos / 1000000
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


        if(numero === ""){

            return null;

        }


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
    SIN UNIDAD
    */

    return null;

},


/* ======================================================
   NORMALIZAR VALOR

   Salida:

   MMMM.DDDD

   Ejemplos:

   521
   ↓
   0521.0000

   2.58
   ↓
   0002.5800

   0.0117
   ↓
   0000.0117

   0
   ↓
   0000.0000
====================================================== */

normalizarValor(valor){

    if(
        typeof valor !== "number" ||
        !Number.isFinite(valor) ||
        valor < 0
    ){

        return null;

    }


    /*
    Evitar pequeñas diferencias
    de coma flotante.
    */

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

   Texto humano
   ↓
   Formato interno
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
    MÁS ANTIGUO
    →
    MÁS RECIENTE
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
        this.decodificarValorInterno(
            partes[0]
        );


    let fin =
        this.decodificarValorInterno(
            partes[1]
        );


    if(
        inicio === null ||
        fin === null
    ){

        return false;

    }


    /*
    MÁS ANTIGUO
    →
    MÁS RECIENTE
    */

    if(inicio < fin){

        return false;

    }


    return true;

},


/* ======================================================
   EXTRAER DATOS DE PALGEO

   SISTEMA B

   Se incluyen TODOS los intervalos
   que intersecten temporalmente.

   Los límites exactos cuentan.
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


    /*
    IMPORTANTE:

    Se utilizan los valores
    numéricos reales, no el texto
    con ceros iniciales.
    */

    let inicio =
        this.decodificarValorInterno(
            partes[0]
        );


    let fin =
        this.decodificarValorInterno(
            partes[1]
        );


    if(
        inicio === null ||
        fin === null
    ){

        return null;

    }


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


            if(
                !intervalo ||
                typeof intervalo.inicio_ma !==
                "number" ||
                typeof intervalo.fin_ma !==
                "number"
            ){

                return;

            }


            /*
            =================================================
            SISTEMA B

            INTERSECCIÓN INCLUSIVA

            inicio >= fin_ma

            Y

            fin <= inicio_ma
            =================================================
            */

            let compatible = (

                inicio >=
                intervalo.fin_ma

                &&

                fin <=
                intervalo.inicio_ma

            );


            if(!compatible){

                return;

            }


            /*
            CÓDIGO
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
            PERÍODO
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
            EDAD
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

   Entrada:

   0521.0000-0509.0000

   Salida:

   cronologia
   inicio_ma
   fin_ma
   rango
   codes
   periodo
   edad
====================================================== */

analizar(cronologia){

    if(!cronologia){

        return null;

    }


    /*
    LIMPIAR
    */

    cronologia =
        String(cronologia)
        .trim();


    /*
    VALIDAR
    */

    if(
        !this.validarCronologia(
            cronologia
        )
    ){

        return null;

    }


    let partes =
        cronologia.split("-");


    /*
    DECODIFICAR EXPLÍCITAMENTE
    */

    let inicio =
        this.decodificarValorInterno(
            partes[0]
        );


    let fin =
        this.decodificarValorInterno(
            partes[1]
        );


    if(
        inicio === null ||
        fin === null
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

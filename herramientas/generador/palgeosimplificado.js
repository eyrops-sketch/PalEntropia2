/*
========================================================
PalEntropía
palgeosimplificado.js v1.2 LTS

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

ENTRADAS HUMANAS VÁLIDAS:

521 Ma - 509 Ma

59,2 Ma - 56 Ma

11.700 a - 4.200 a

11700 a - 4200 a

21.700 a - Actualidad

21700 a - Actualidad

--------------------------------------------------------

FORMATO INTERNO VÁLIDO:

MMMM.DDDD-MMMM.DDDD

Ejemplo:

0521.0000-0509.0000

--------------------------------------------------------

REGLA TEMPORAL:

MÁS ANTIGUO → MÁS RECIENTE

521 Ma - 509 Ma     ✓
21.700 a - Actualidad ✓

509 Ma - 521 Ma     ✗

--------------------------------------------------------

SISTEMA B

Se incluyen TODOS los intervalos de PALGEO
que intersecten temporalmente con la cronología
consultada.

Los límites exactos TAMBIÉN cuentan.

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

   Entrada:
   millones de años

   Salida humana:
   Ma / a / Actualidad
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

    Ejemplo:

    0.0117 Ma
    ↓
    11.700 a
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

   Entrada:

   0521.0000-0509.0000

   Salida:

   521 Ma - 509 Ma
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

   Acepta:

   521 Ma
   59,2 Ma

   11.700 a
   11700 a

   21.700 a
   21700 a

   Actualidad

   Devuelve millones de años.
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
        Coma = decimal

        21,7
        ↓
        21.7
        */

        numero =
            numero.replace(
                ",",
                "."
            );


        /*
        Solo números positivos.
        */

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


        /*
        Convertir años → Ma
        */

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


        /*
        En Ma:

        59,2 → 59.2

        No eliminamos puntos porque
        aquí representan decimal.
        */

        numero =
            numero.replace(
                ",",
                "."
            );


        /*
        Solo números positivos.
        */

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
    SIN UNIDAD:

    No se interpreta.

    Evita confundir:

    521 años

    con:

    521 Ma
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

   0.0217
   ↓
   0000.0217

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


    /*
    El protocolo requiere
    exactamente cuatro cifras decimales.
    */

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

   ENTRADAS:

   521 Ma - 509 Ma

   11.700 a - 4.200 a

   11700 a - 4200 a

   21.700 a - Actualidad

   21700 a - Actualidad

   SALIDA:

   MMMM.DDDD-MMMM.DDDD

====================================================== */

codificarRango(texto){

    if(!texto){

        return null;

    }


    /*
    Convertir a texto y eliminar
    espacios exteriores.
    */

    texto =
        String(texto)
        .trim();


    /*
    Separar los dos extremos.

    Solo debe existir un guion.
    */

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


    /*
    PARSEAR EXTREMOS
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
    VALIDAR SENTIDO TEMPORAL

    MÁS ANTIGUO
    ↓
    MÁS RECIENTE
    */

    if(inicio < fin){

        return null;

    }


    /*
    NORMALIZAR
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


    /*
    RESULTADO
    */

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

   Formato obligatorio:

   MMMM.DDDD-MMMM.DDDD

   Ejemplo:

   0521.0000-0509.0000
====================================================== */

validarCronologia(cronologia){

    if(!cronologia){

        return false;

    }


    let texto =
        String(cronologia)
        .trim();


    /*
    Comprobar estructura exacta.

    4 cifras
    .
    4 cifras
    -
    4 cifras
    .
    4 cifras
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
   EXTRAER DATOS DE PALGEO

   SISTEMA B

   Se seleccionan TODOS los intervalos
   que intersecten el rango.

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
            SISTEMA B

            Rango consultado:

            [fin, inicio]

            Intervalo PALGEO:

            [intervalo.fin_ma,
             intervalo.inicio_ma]

            Intersección inclusiva:

            inicio >= intervalo.fin_ma

            Y

            fin <= intervalo.inicio_ma

            Los límites exactos cuentan.
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

            Solo si existe en PALGEO.
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

            Solo si existe en PALGEO.
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

   Devuelve:

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
    Solo se acepta aquí
    cronología interna.

    La conversión humana se realiza
    mediante codificarRango().
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
FIN PALGEOSIMPLIFICADO v1.2 LTS
========================================================
*/





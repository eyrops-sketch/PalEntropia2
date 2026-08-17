 /*
========================================================
PalEntropía
leepalhab.js v1.0 LTS

LECTOR DE HÁBITATS DEL CONTENEDOR INTERMEDIO

Función:
- Lee j5 y j6 del registro CSV.
- j5 = Hábitat principal (HP).
- j6 = Hábitat secundario (HS).
- Cada campo contiene 12 caracteres numéricos.
- Cada campo se divide en 4 slots de 3 caracteres.
- Cada slot se consulta en PALHAB.
- El prefijo "H" se utiliza únicamente como referencia
  interna para consultar PALHAB.

ENTRADA:

j5:
002000000000

j6:
062254084000

DESCOMPOSICIÓN:

002 | 000 | 000 | 000

062 | 254 | 084 | 000

CONSULTA INTERNA:

H002
H000
H000
H000

H062
H254
H084
H000

SALIDA PARA GENERADOR:

Hábitat principal:
Océano pelágico

Hábitat secundario:
[hábitats correspondientes]

IMPORTANTE:

- HP y HS son referencias del contenedor.
- No se muestran como códigos.
- No se devuelve el prefijo "H".
- No se inventan ni interpretan hábitats.
- PALHAB es la única fuente de información.
- Los slots 000 se ignoran en la presentación.
========================================================
*/


window.LEEPALHAB_VERSION = "1.0 LTS";


window.LEEPALHAB = {


/* ======================================================
   LEER CAMPO

   Comprueba que el campo tenga exactamente
   12 caracteres numéricos.

   Ejemplo:

   002000000000

   Devuelve:

   [
       "002",
       "000",
       "000",
       "000"
   ]

====================================================== */

descomponer(campo){

    if(
        campo === undefined ||
        campo === null
    ){

        return null;

    }


    campo =
        String(campo)
        .trim();


    /*
    FORMATO OBLIGATORIO

    12 caracteres
    únicamente numéricos
    */

    if(
        !/^\d{12}$/.test(campo)
    ){

        return null;

    }


    /*
    DIVIDIR EN 4 SLOTS
    DE 3 CARACTERES
    */

    return [

        campo.substring(0,3),

        campo.substring(3,6),

        campo.substring(6,9),

        campo.substring(9,12)

    ];

},


/* ======================================================
   CONSULTAR PALHAB

   Recibe un slot:

   "002"

   y construye internamente:

   "H002"

   para consultar PALHAB.

   El prefijo H NO se devuelve
   como codificación.

====================================================== */

consultarSlot(slot){

    if(
        slot === undefined ||
        slot === null
    ){

        return null;

    }


    slot =
        String(slot)
        .trim();


    /*
    SLOT OBLIGATORIO:

    3 caracteres numéricos
    */

    if(
        !/^\d{3}$/.test(slot)
    ){

        return null;

    }


    /*
    SLOT 000

    Corresponde a H000,
    pero no se presenta como
    hábitat válido en el generador.
    */

    if(slot === "000"){

        return null;

    }


    /*
    COMPROBAR PALHAB
    */

    if(
        !window.PALHAB ||
        typeof window.PALHAB !== "object"
    ){

        return null;

    }


    /*
    REFERENCIA INTERNA

    002
    ↓
    H002
    */

    let referencia =
        "H" + slot;


    /*
    CONSULTAR BASE MAESTRA
    */

    let habitat =
        window.PALHAB[
            referencia
        ];


    if(
        !habitat ||
        typeof habitat !== "object"
    ){

        return null;

    }


    /*
    DEVOLVER LOS DATOS
    DEL REGISTRO DE PALHAB.

    No se modifica la base maestra.
    */

    return {

        nombre:
            habitat.nombre || "",

        descripcion:
            habitat.descripcion || ""

    };

},


/* ======================================================
   LEER CAMPO DE HÁBITAT

   Entrada:

   002000000000

   Devuelve un array de hábitats
   válidos encontrados.

====================================================== */

leerCampo(campo){

    let slots =
        this.descomponer(
            campo
        );


    if(!slots){

        return null;

    }


    let resultado = [];


    /*
    RECORRER LOS 4 SLOTS
    */

    slots.forEach(

        slot => {

            let habitat =
                this.consultarSlot(
                    slot
                );


            /*
            Los slots 000 o inexistentes
            no se presentan.
            */

            if(!habitat){

                return;

            }


            /*
            Evitar duplicados.

            Si el mismo hábitat aparece
            más de una vez, solo se
            presenta una vez.
            */

            let existe =
                resultado.some(

                    elemento =>
                        elemento.nombre ===
                        habitat.nombre

                );


            if(existe){

                return;

            }


            resultado.push({

                nombre:
                    habitat.nombre,

                descripcion:
                    habitat.descripcion

            });

        }

    );


    return resultado;

},


/* ======================================================
   PREPARAR HP

   j5 = Hábitat principal

====================================================== */

prepararHP(registro){

    if(
        !registro ||
        typeof registro !== "object"
    ){

        return null;

    }


    /*
    j5 ES LA ÚNICA ENTRADA
    PARA HÁBITAT PRINCIPAL
    */

    let hp =
        registro.j5;


    if(
        hp === undefined ||
        hp === null
    ){

        return null;

    }


    let habitats =
        this.leerCampo(
            hp
        );


    if(!habitats){

        return null;

    }


    return habitats;

},


/* ======================================================
   PREPARAR HS

   j6 = Hábitat secundario

====================================================== */

prepararHS(registro){

    if(
        !registro ||
        typeof registro !== "object"
    ){

        return null;

    }


    /*
    j6 ES LA ÚNICA ENTRADA
    PARA HÁBITAT SECUNDARIO
    */

    let hs =
        registro.j6;


    if(
        hs === undefined ||
        hs === null
    ){

        return null;

    }


    let habitats =
        this.leerCampo(
            hs
        );


    if(!habitats){

        return null;

    }


    return habitats;

},


/* ======================================================
   PREPARAR

   Lee simultáneamente:

   j5 → HP
   j6 → HS

   Devuelve los datos preparados
   para el generador.

====================================================== */

preparar(registro){

    if(
        !registro ||
        typeof registro !== "object"
    ){

        return null;

    }


    /*
    COMPROBAR PALHAB
    */

    if(
        !window.PALHAB ||
        typeof window.PALHAB !== "object"
    ){

        return null;

    }


    let hp =
        this.prepararHP(
            registro
        );


    let hs =
        this.prepararHS(
            registro
        );


    /*
    Si no existe ninguno,
    no hay datos que presentar.
    */

    if(
        !hp &&
        !hs
    ){

        return null;

    }


    return {

        habitat_principal:
            hp || [],

        habitat_secundario:
            hs || []

    };

},


/* ======================================================
   FORMATEAR PARA GENERADOR

   Convierte los arrays de objetos
   en texto de presentación.

====================================================== */

formatearParaGenerador(datos){

    if(
        !datos ||
        typeof datos !== "object"
    ){

        return null;

    }


    /*
    -----------------------------------------------
    HÁBITAT PRINCIPAL
    -----------------------------------------------
    */

    let habitatPrincipal =
        Array.isArray(
            datos.habitat_principal
        )

        ?

        datos.habitat_principal.map(

            habitat =>
                habitat.nombre

        ).join(
            " · "
        )

        :

        "";


    /*
    -----------------------------------------------
    HÁBITAT SECUNDARIO
    -----------------------------------------------
    */

    let habitatSecundario =
        Array.isArray(
            datos.habitat_secundario
        )

        ?

        datos.habitat_secundario.map(

            habitat =>
                habitat.nombre

        ).join(
            " · "
        )

        :

        "";


    /*
    -----------------------------------------------
    RESULTADO
    -----------------------------------------------
    */

    return {

        habitat_principal:
            habitatPrincipal,

        habitat_secundario:
            habitatSecundario

    };

},


/* ======================================================
   FUNCIÓN PRINCIPAL

   Entrada:

   registro del contenedor

   Salida:

   Datos preparados para Generador.

====================================================== */

leer(registro){

    /*
    PREPARAR
    */

    let datos =
        this.preparar(
            registro
        );


    if(!datos){

        return null;

    }


    /*
    FORMATEAR
    */

    return this.formatearParaGenerador(
        datos
    );

}


};


/*
========================================================
FIN LEEPALHAB v1.0 LTS
========================================================
*/





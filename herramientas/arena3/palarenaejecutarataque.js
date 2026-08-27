/*
==========================================================
PALARENA
palarenaejecutarataque.js v1.0
PalEntropía

EJECUCIÓN DE ATAQUES
==========================================================
*/

function ejecutarAtaqueArena(
    atacante,
    objetivo,
    codigoAtaque
) {

    const resultado = {

        tipo: "ataque",

        atacante: atacante.nombre,

        objetivo: objetivo.nombre,

        ataque: null,

        dano: 0,

        critico: false,

        esquiva: false,

        efecto: null,

        mensaje: ""

    };


    if (
        typeof obtenerAtaqueArena !== "function"
    ) {

        resultado.mensaje =
            "No se ha cargado la base de datos de ataques.";

        return resultado;

    }


    const ataque =
        obtenerAtaqueArena(
            codigoAtaque
        );


    if (!ataque) {

        resultado.mensaje =
            "Ataque no encontrado.";

        return resultado;

    }


    resultado.ataque =
        ataque.nombre;


    const precision =
        Number(ataque.precision) || 100;


    const dadoPrecision =
        arenaAleatorioDecimal(
            0,
            100
        );


    if (
        dadoPrecision > precision
    ) {

        resultado.mensaje =
            atacante.nombre +
            " falla su ataque.";

        return resultado;

    }


    if (
        comprobarEsquivaArena(
            objetivo
        )
    ) {

        resultado.esquiva = true;

        resultado.mensaje =
            objetivo.nombre +
            " esquiva el ataque.";

        return resultado;

    }


    const calculo =
        calcularDanoArena(
            atacante,
            objetivo,
            ataque
        );


    resultado.dano =
        calculo.dano;


    resultado.critico =
        calculo.critico;


    objetivo.hp -=
        resultado.dano;


    if (
        objetivo.hp <= 0
    ) {

        objetivo.hp = 0;

        objetivo.derrotado = true;

    }


    if (
        ataque.efecto &&
        !objetivo.derrotado
    ) {

        resultado.efecto =
            aplicarEfectoArena(
                atacante,
                objetivo,
                ataque.efecto
            );

    }


    resultado.mensaje =
        atacante.nombre +
        " usa " +
        ataque.nombre +
        " y causa " +
        resultado.dano +
        " de daño.";


    if (
        resultado.critico
    ) {

        resultado.mensaje +=
            " ¡CRÍTICO!";

    }


    return resultado;

}


/*
==========================================================
FIN PALARENA_EJECUTAR_ATAQUE
==========================================================
*/

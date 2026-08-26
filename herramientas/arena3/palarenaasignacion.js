/*
============================================================
palentropía — arena
archivo: palarenaasignacion.js
versión: 1.0
estado: sistema de asignación de ataques
============================================================

módulo:
herramientas/arena/

función:
asignar automáticamente un ataque especial a una
paleoficha utilizando sus características existentes.

datos utilizados:
- j7 → dieta
- j8 → anatomía
- e1-e11 → estadísticas base
- indicadores generales cuando estén disponibles

reglas:
- no se crean estadísticas nuevas.
- no se asigna manualmente una especie concreta.
- las reglas se aplican por características.
- cada criatura obtiene un ataque especial.
- si ninguna regla resulta compatible se utiliza A001.
- el sistema devuelve un código de ataque.

============================================================
*/


/*
============================================================
CONFIGURACIÓN
============================================================
*/

const PALARENAASIGNACION = {

    ataque_defecto: "A001",

    umbrales: {

        ofensiva_alta: 70,
        defensa_alta: 70,
        movilidad_alta: 70,
        velocidad_alta: 70,
        tamano_alto: 70,
        inteligencia_alta: 70

    }

};


/*
============================================================
NORMALIZACIÓN
============================================================
*/

function normalizarTextoArena(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


/*
============================================================
OBTENCIÓN DE ESTADÍSTICAS
============================================================
*/

function obtenerEstadisticasArena(datos) {

    if (!datos) {
        return {};
    }

    return {

        adaptabilidad: Number(datos.e1) || 0,
        sociabilidad: Number(datos.e2) || 0,
        resistencia: Number(datos.e3) || 0,
        reproduccion: Number(datos.e4) || 0,
        ofensiva: Number(datos.e5) || 0,
        defensa: Number(datos.e6) || 0,
        movilidad: Number(datos.e7) || 0,
        plasticidad: Number(datos.e8) || 0,
        tamano: Number(datos.e9) || 0,
        velocidad: Number(datos.e10) || 0,
        inteligencia: Number(datos.e11) || 0

    };

}


/*
============================================================
DETECCIÓN DE CARACTERÍSTICAS ANATÓMICAS
============================================================
*/

function contieneCaracteristicaArena(texto, palabras) {

    const valor = normalizarTextoArena(texto);

    return palabras.some(function(palabra) {

        return valor.includes(
            normalizarTextoArena(palabra)
        );

    });

}


/*
============================================================
REGLA: MORDISCO DEVASTADOR
============================================================
*/

function puedeMordiscoDevastador(datos, stats) {

    const anatomia = datos.j8 || "";
    const dieta = datos.j7 || "";

    const anatomiaCompatible =
        contieneCaracteristicaArena(anatomia, [
            "diente",
            "dientes",
            "colmillo",
            "mandibula",
            "mandibula",
            "pico dentado",
            "dentado",
            "mordisco"
        ]);

    const dietaCompatible =
        contieneCaracteristicaArena(dieta, [
            "carnivoro",
            "depredador",
            "insectivoro",
            "piscivoro",
            "omnivoro"
        ]);

    return (
        anatomiaCompatible &&
        dietaCompatible &&
        stats.ofensiva >= PALARENAASIGNACION.umbrales.ofensiva_alta
    );

}


/*
============================================================
REGLA: ATAQUE RÁPIDO
============================================================
*/

function puedeAtaqueRapido(stats) {

    return (
        stats.movilidad >= PALARENAASIGNACION.umbrales.movilidad_alta &&
        stats.velocidad >= PALARENAASIGNACION.umbrales.velocidad_alta
    );

}


/*
============================================================
REGLA: GOLPE PESADO
============================================================
*/

function puedeGolpePesado(stats) {

    return (
        stats.tamano >= PALARENAASIGNACION.umbrales.tamano_alto &&
        stats.ofensiva >= PALARENAASIGNACION.umbrales.ofensiva_alta
    );

}


/*
============================================================
REGLA: ATAQUE PERFORANTE
============================================================
*/

function puedeAtaquePerforante(datos, stats) {

    const anatomia = datos.j8 || "";

    const anatomiaCompatible =
        contieneCaracteristicaArena(anatomia, [
            "colmillo",
            "diente",
            "dientes",
            "garra",
            "espina",
            "pico",
            "hocico",
            "colmillos"
        ]);

    return (
        anatomiaCompatible &&
        stats.ofensiva >= 60
    );

}


/*
============================================================
REGLA: AGARRE
============================================================
*/

function puedeAgarre(datos) {

    const anatomia = datos.j8 || "";

    return contieneCaracteristicaArena(anatomia, [
        "garra",
        "garras",
        "mano",
        "manos",
        "tentaculo",
        "tentaculos",
        "pinza",
        "pinzas",
        "agarre"
    ]);

}


/*
============================================================
REGLA: EMBESTIDA
============================================================
*/

function puedeEmbestida(stats) {

    return (
        stats.tamano >= 60 &&
        stats.movilidad >= 55 &&
        stats.ofensiva >= 60
    );

}


/*
============================================================
REGLA: GOLPE PRECISO
============================================================
*/

function puedeGolpePreciso(stats) {

    return (
        stats.inteligencia >= PALARENAASIGNACION.umbrales.inteligencia_alta &&
        stats.ofensiva >= 55
    );

}


/*
============================================================
ASIGNACIÓN PRINCIPAL
============================================================
*/

function asignarAtaqueArena(datos) {

    if (!datos) {
        return PALARENAASIGNACION.ataque_defecto;
    }


    const stats = obtenerEstadisticasArena(datos);


    /*
    --------------------------------------------------------
    1. ATAQUE RÁPIDO
    --------------------------------------------------------
    */

    if (puedeAtaqueRapido(stats)) {

        return "A005";

    }


    /*
    --------------------------------------------------------
    2. MORDISCO DEVASTADOR
    --------------------------------------------------------
    */

    if (puedeMordiscoDevastador(datos, stats)) {

        return "A003";

    }


    /*
    --------------------------------------------------------
    3. GOLPE PESADO
    --------------------------------------------------------
    */

    if (puedeGolpePesado(stats)) {

        return "A006";

    }


    /*
    --------------------------------------------------------
    4. ATAQUE PERFORANTE
    --------------------------------------------------------
    */

    if (puedeAtaquePerforante(datos, stats)) {

        return "A007";

    }


    /*
    --------------------------------------------------------
    5. AGARRE
    --------------------------------------------------------
    */

    if (puedeAgarre(datos)) {

        return "A008";

    }


    /*
    --------------------------------------------------------
    6. EMBESTIDA
    --------------------------------------------------------
    */

    if (puedeEmbestida(stats)) {

        return "A004";

    }


    /*
    --------------------------------------------------------
    7. GOLPE PRECISO
    --------------------------------------------------------
    */

    if (puedeGolpePreciso(stats)) {

        return "A002";

    }


    /*
    --------------------------------------------------------
    8. ATAQUE POR DEFECTO
    --------------------------------------------------------
    */

    return PALARENAASIGNACION.ataque_defecto;

}


/*
============================================================
OBTENER OBJETO COMPLETO DEL ATAQUE
============================================================
*/

function obtenerAtaqueAsignadoArena(datos) {

    const codigo = asignarAtaqueArena(datos);

    if (
        typeof obtenerAtaqueArena === "function"
    ) {

        return obtenerAtaqueArena(codigo);

    }

    return {

        codigo: codigo

    };

}


/*
============================================================
EXPLICACIÓN DE LA ASIGNACIÓN
============================================================
*/

function explicarAsignacionAtaqueArena(datos) {

    const codigo = asignarAtaqueArena(datos);

    const explicaciones = {

        A001: "No se encontró una característica específica compatible. Se utiliza el ataque normal.",

        A002: "La combinación de inteligencia y capacidad ofensiva favorece un ataque preciso.",

        A003: "La dieta, la anatomía y la capacidad ofensiva son compatibles con un mordisco devastador.",

        A004: "El tamaño, la movilidad y la capacidad ofensiva favorecen una embestida.",

        A005: "La elevada movilidad y velocidad favorecen un ataque rápido.",

        A006: "El tamaño y la capacidad ofensiva favorecen un golpe pesado.",

        A007: "La anatomía presenta características compatibles con un ataque perforante.",

        A008: "La anatomía presenta estructuras compatibles con un ataque de agarre."

    };

    return {

        codigo: codigo,

        explicacion:
            explicaciones[codigo] ||
            "Ataque asignado mediante las reglas de Arena."

    };

}

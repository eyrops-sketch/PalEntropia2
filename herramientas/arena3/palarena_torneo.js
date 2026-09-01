/* ==========================================================
   PALARENA — TORNEO
   archivo: palarena_torneo.js
   versión: 1.0
   estado: base limpia

   FUNCIÓN:
   - Configuración del torneo
   - 4 / 8 / 16 / 32 / 64 participantes
   - Mejor de cualquier número impar
   - Creación del cuadro
   - Gestión de rondas
   - Registro de victorias
   - Avance de ganadores
   - Campeón

   NO MODIFICA:
   - palarena.js
   - motor de combate
   - interfaz Arena existente
   ========================================================== */


/* ==========================================================
   ESTADO DEL TORNEO
   ========================================================== */

let TORNEO_ARENA = {

    nombre: "Copa Arena",

    participantes: 4,

    mejorDe: 1,

    rondaActual: 1,

    rondas: [],

    participantesLista: [],

    activo: false,

    finalizado: false,

    campeon: null

};


/* ==========================================================
   CONFIGURACIÓN PERMITIDA
   ========================================================== */

const PARTICIPANTES_TORNEO = [
    4,
    8,
    16,
    32,
    64
];


/* ==========================================================
   ESCAPAR HTML
   ========================================================== */

function escaparHTMLTorneo(texto){

    return String(texto ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ==========================================================
   COMPROBAR SERIE
   ========================================================== */

function comprobarSerieTorneo(mejorDe){

    const numero =
        Number(mejorDe);


    if(
        !Number.isInteger(numero) ||
        numero < 1 ||
        numero % 2 === 0
    ){

        throw new Error(
            "La serie debe ser un número impar."
        );

    }


    return numero;

}


/* ==========================================================
   OBTENER CONFIGURACIÓN
   ========================================================== */

function obtenerConfiguracionTorneo(){

    const selectorParticipantes =
        document.getElementById(
            "torneoParticipantes"
        );

    const selectorSerie =
        document.getElementById(
            "torneoSerie"
        );

    const selectorNombre =
        document.getElementById(
            "torneoNombre"
        );


    if(
        !selectorParticipantes ||
        !selectorSerie
    ){

        throw new Error(
            "No se encontraron los controles del torneo."
        );

    }


    const participantes =
        Number(
            selectorParticipantes.value
        );


    const mejorDe =
        comprobarSerieTorneo(
            selectorSerie.value
        );


    if(
        !PARTICIPANTES_TORNEO.includes(
            participantes
        )
    ){

        throw new Error(
            "Número de participantes no válido."
        );

    }


    const nombre =
        selectorNombre &&
        selectorNombre.value.trim()

            ? selectorNombre.value.trim()

            : "Copa Arena";


    return {

        nombre:
            nombre,

        participantes:
            participantes,

        mejorDe:
            mejorDe

    };

}


/* ==========================================================
   CREAR COMBATE VACÍO
   ========================================================== */

function crearCombateTorneo(numero){

    return {

        numero:
            numero,

        participante1:
            null,

        participante2:
            null,

        victorias1:
            0,

        victorias2:
            0,

        ganador:
            null,

        finalizado:
            false

    };

}


/* ==========================================================
   NOMBRE DE RONDA
   ========================================================== */

function nombreRondaTorneo(participantes){

    const nombres = {

        64: "Treintaidosavos de final",

        32: "Dieciseisavos de final",

        16: "Octavos de final",

        8: "Cuartos de final",

        4: "Semifinales",

        2: "Final"

    };


    return (
        nombres[participantes] ||
        "Ronda"
    );

}


/* ==========================================================
   CREAR RONDA
   ========================================================== */

function crearRondaTorneo(
    numero,
    participantes
){

    const numeroCombates =
        participantes / 2;


    const combates = [];


    for(
        let i = 0;
        i < numeroCombates;
        i++
    ){

        combates.push(
            crearCombateTorneo(
                i + 1
            )
        );

    }


    return {

        numero:
            numero,

        nombre:
            nombreRondaTorneo(
                participantes
            ),

        participantes:
            participantes,

        combates:
            combates

    };

}


/* ==========================================================
   CREAR TORNEO
   ========================================================== */

function crearTorneoArena(){

    const configuracion =
        obtenerConfiguracionTorneo();


    TORNEO_ARENA = {

        nombre:
            configuracion.nombre,

        participantes:
            configuracion.participantes,

        mejorDe:
            configuracion.mejorDe,

        rondaActual:
            1,

        rondas: [

            crearRondaTorneo(
                1,
                configuracion.participantes
            )

        ],

        participantesLista: [],

        activo: true,

        finalizado: false,

        campeon: null

    };


    mostrarCuadroTorneoArena();


    return TORNEO_ARENA;

}


/* ==========================================================
   ASIGNAR PARTICIPANTES
   ========================================================== */

function asignarParticipantesTorneo(
    participantes
){

    if(
        !Array.isArray(
            participantes
        )
    ){

        return false;

    }


    const total =
        TORNEO_ARENA.participantes;


    if(
        participantes.length !==
        total
    ){

        throw new Error(
            "El número de participantes no coincide con el torneo."
        );

    }


    TORNEO_ARENA.participantesLista =
        participantes.slice();


    const ronda =
        TORNEO_ARENA.rondas[0];


    participantes.forEach(
        (
            participante,
            indice
        ) => {

            const numeroCombate =
                Math.floor(
                    indice / 2
                );


            const combate =
                ronda.combates[
                    numeroCombate
                ];


            if(
                indice % 2 === 0
            ){

                combate.participante1 =
                    participante;

            }
            else{

                combate.participante2 =
                    participante;

            }

        }
    );


    mostrarCuadroTorneoArena();


    return true;

}


/* ==========================================================
   CREAR SIGUIENTE RONDA
   ========================================================== */

function crearSiguienteRondaTorneo(){

    const rondaActual =
        TORNEO_ARENA.rondas[
            TORNEO_ARENA.rondas.length - 1
        ];


    if(!rondaActual){

        return null;

    }


    if(
        rondaActual.combates.length <= 1
    ){

        return null;

    }


    const nuevosParticipantes =
        rondaActual.combates.length;


    const nuevaRonda =
        crearRondaTorneo(

            rondaActual.numero + 1,

            nuevosParticipantes

        );


    TORNEO_ARENA.rondas.push(
        nuevaRonda
    );


    TORNEO_ARENA.rondaActual =
        nuevaRonda.numero;


    return nuevaRonda;

}


/* ==========================================================
   AVANZAR GANADORES
   ========================================================== */

function avanzarGanadoresTorneo(){

    const rondaActual =
        TORNEO_ARENA.rondas[
            TORNEO_ARENA.rondas.length - 1
        ];


    if(!rondaActual){

        return false;

    }


    if(
        !rondaActual.combates.every(
            combate =>
                combate.finalizado
        )
    ){

        return false;

    }


    const campeon =
        rondaActual.combates.length === 1;


    if(campeon){

        TORNEO_ARENA.campeon =
            rondaActual.combates[0].ganador;

        TORNEO_ARENA.finalizado =
            true;

        TORNEO_ARENA.activo =
            false;

        mostrarCuadroTorneoArena();

        return true;

    }


    const siguiente =
        crearSiguienteRondaTorneo();


    if(!siguiente){

        return false;

    }


    rondaActual.combates.forEach(
        (
            combate,
            indice
        ) => {

            const ganador =
                combate.ganador;


            const combateSiguiente =
                siguiente.combates[
                    Math.floor(
                        indice / 2
                    )
                ];


            if(
                indice % 2 === 0
            ){

                combateSiguiente.participante1 =
                    ganador;

            }
            else{

                combateSiguiente.participante2 =
                    ganador;

            }

        }
    );


    mostrarCuadroTorneoArena();


    return true;

}


/* ==========================================================
   REGISTRAR VICTORIA
   ========================================================== */

function registrarVictoriaTorneo(
    numeroCombate,
    participante
){

    const ronda =
        TORNEO_ARENA.rondas[
            TORNEO_ARENA.rondas.length - 1
        ];


    if(!ronda){

        return false;

    }


    const combate =
        ronda.combates.find(
            c =>
                c.numero ===
                numeroCombate
        );


    if(!combate){

        return false;

    }


    if(
        combate.finalizado
    ){

        return false;

    }


    if(
        combate.participante1 ===
        participante
    ){

        combate.victorias1++;

    }
    else if(
        combate.participante2 ===
        participante
    ){

        combate.victorias2++;

    }
    else{

        return false;

    }


    const victoriasNecesarias =
        Math.floor(
            TORNEO_ARENA.mejorDe / 2
        ) + 1;


    if(
        combate.victorias1 >=
        victoriasNecesarias
    ){

        combate.ganador =
            combate.participante1;

        combate.finalizado =
            true;

    }


    if(
        combate.victorias2 >=
        victoriasNecesarias
    ){

        combate.ganador =
            combate.participante2;

        combate.finalizado =
            true;

    }


    mostrarCuadroTorneoArena();


    if(
        combate.finalizado
    ){

        avanzarGanadoresTorneo();

    }


    return true;

}


/* ==========================================================
   COMPROBAR RONDA
   ========================================================== */

function rondaCompletaTorneo(){

    const ronda =
        TORNEO_ARENA.rondas[
            TORNEO_ARENA.rondas.length - 1
        ];


    if(!ronda){

        return false;

    }


    return ronda.combates.every(
        combate =>
            combate.finalizado
    );

}


/* ==========================================================
   OBTENER CAMPEÓN
   ========================================================== */

function obtenerCampeonTorneo(){

    return (
        TORNEO_ARENA.campeon ||
        null
    );

}


/* ==========================================================
   MOSTRAR CUADRO
   ========================================================== */

function mostrarCuadroTorneoArena(){

    const cuadro =
        document.getElementById(
            "cuadroTorneo"
        );


    if(!cuadro){

        return;

    }


    cuadro.innerHTML = `

        <div class="torneoCabecera">

            <h2>

                🏆
                ${escaparHTMLTorneo(
                    TORNEO_ARENA.nombre
                )}

            </h2>

            <div>

                ${TORNEO_ARENA.participantes}
                participantes

                ·

                Mejor de
                ${TORNEO_ARENA.mejorDe}

            </div>

        </div>


        ${

            TORNEO_ARENA.rondas

                .map(
                    generarRondaHTMLTorneo
                )

                .join("")

        }


        ${
            TORNEO_ARENA.campeon

                ? `

                    <div class="torneoCampeon">

                        🏆 Campeón:

                        <strong>

                            ${escaparHTMLTorneo(
                                TORNEO_ARENA
                                    .campeon
                                    .nombre ||
                                TORNEO_ARENA
                                    .campeon
                            )}

                        </strong>

                    </div>

                `

                : ""

        }

    `;

}


/* ==========================================================
   GENERAR RONDA HTML
   ========================================================== */

function generarRondaHTMLTorneo(
    ronda
){

    return `

        <section
            class="torneoRonda"
            data-ronda="${ronda.numero}"
        >

            <h3>

                ${escaparHTMLTorneo(
                    ronda.nombre
                )}

            </h3>

            <div class="torneoCombates">

                ${

                    ronda.combates

                        .map(
                            generarCombateHTMLTorneo
                        )

                        .join("")

                }

            </div>

        </section>

    `;

}


/* ==========================================================
   GENERAR COMBATE HTML
   ========================================================== */

function generarCombateHTMLTorneo(
    combate
){

    const nombre1 =
        combate.participante1 &&
        combate.participante1.nombre

            ? combate.participante1.nombre

            : "Pendiente";


    const nombre2 =
        combate.participante2 &&
        combate.participante2.nombre

            ? combate.participante2.nombre

            : "Pendiente";


    const ganador =
        combate.ganador &&
        combate.ganador.nombre

            ? combate.ganador.nombre

            : "";


    return `

        <div
            class="torneoCombate"
            data-combate="${combate.numero}"
        >

            <div class="torneoNumero">

                Combate
                ${combate.numero}

            </div>


            <div class="torneoParticipante">

                🦖

                ${escaparHTMLTorneo(
                    nombre1
                )}

                <span>

                    ${combate.victorias1}

                </span>

            </div>


            <div class="torneoVS">

                VS

            </div>


            <div class="torneoParticipante">

                🦖

                ${escaparHTMLTorneo(
                    nombre2
                )}

                <span>

                    ${combate.victorias2}

                </span>

            </div>


            ${
                ganador

                    ? `

                        <div class="torneoGanador">

                            🏆
                            ${escaparHTMLTorneo(
                                ganador
                            )}

                        </div>

                    `

                    : ""

            }

        </div>

    `;

}


/* ==========================================================
   REINICIAR
   ========================================================== */

function reiniciarTorneoArena(){

    TORNEO_ARENA = {

        nombre: "Copa Arena",

        participantes: 4,

        mejorDe: 1,

        rondaActual: 1,

        rondas: [],

        participantesLista: [],

        activo: false,

        finalizado: false,

        campeon: null

    };


    const cuadro =
        document.getElementById(
            "cuadroTorneo"
        );


    if(cuadro){

        cuadro.innerHTML = "";

    }

}


/* ==========================================================
   EXPORTACIÓN
   ========================================================== */

window.PALARENA_TORNEO = {

    crear:
        crearTorneoArena,

    configurar:
        obtenerConfiguracionTorneo,

    asignarParticipantes:
        asignarParticipantesTorneo,

    registrarVictoria:
        registrarVictoriaTorneo,

    avanzarGanadores:
        avanzarGanadoresTorneo,

    rondaCompleta:
        rondaCompletaTorneo,

    campeon:
        obtenerCampeonTorneo,

    mostrarCuadro:
        mostrarCuadroTorneoArena,

    reiniciar:
        reiniciarTorneoArena,

    estado:
        function(){

            return TORNEO_ARENA;

        }

};

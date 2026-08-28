/* ========================================================
   PALARENA
   archivo: palarenaui4.js
   versión: 4.1
   estado: interfaz de Arena

   funciones:
   - presentación de paleofichas
   - presentación del escenario
   - presentación de ataques
   - presentación de bonificaciones
   - ejecución del combate
   - historial
   - selección desde visor

   no contiene lógica de combate.
======================================================== */


/* ======================================================
   MOSTRAR COMBATIENTE
====================================================== */

async function mostrarCombatienteArena(datos, n) {

    const miniatura =
        await obtenerMiniaturaArena(
            datos.codigo,
            datos.nombre
        );

    const enlace =
        RUTA_GENERADOR +
        "?codigo=" +
        encodeURIComponent(datos.codigo) +
        "&arena=" +
        n;


    /* ==================================================
       HÁBITATS
    ================================================== */

    const habitatsHTML =
        datos.habitats
            .filter(c => c && c !== "H000")
            .map(c => {

                const h =
                    window.PALARENA_DATOS
                        .obtenerHabitat(c);

                const nombre =
                    h && h.nombre
                        ? h.nombre
                        : "";

                return `
                    <div class="habitat">

                        <strong>
                            ${escaparHTML(c)}
                        </strong>

                        ${
                            nombre
                                ? " — " +
                                  escaparHTML(nombre)
                                : ""
                        }

                    </div>
                `;

            })
            .join("");


    /* ==================================================
       MODO DE VIDA
    ================================================== */

    const modo =
        window.PALARENA_DATOS
            .obtenerModo(
                datos.modo
            );

    const modoNombre =
        modo && modo.nombre
            ? modo.nombre
            : "";


    /* ==================================================
       RESULTADO
    ================================================== */

    return `

        <div class="combatiente">

            ${
                miniatura
                    ? `
                        <img
                            class="miniaturaCombatiente"
                            src="${escaparHTML(miniatura)}"
                            alt="${escaparHTML(datos.nombre)}"
                        >
                    `
                    : ""
            }


            <div class="nombre">

                🦖
                ${escaparHTML(datos.nombre)}

            </div>


            <div class="codigoFicha">

                Código:
                ${escaparHTML(datos.codigo)}

            </div>


            <div class="seccion">

                <h3>
                    🧬 Modo de vida
                </h3>

                <div class="dato">

                    <strong>
                        ${escaparHTML(datos.modo)}
                    </strong>

                    ${
                        modoNombre
                            ? " — " +
                              escaparHTML(modoNombre)
                            : ""
                    }

                </div>

            </div>


            <div class="seccion">

                <h3>
                    🏠 Hábitats
                </h3>

                ${
                    habitatsHTML ||
                    '<div class="habitat">Ninguno</div>'
                }

            </div>


            <div class="seccion">

                <h3>
                    📊 Estadísticas
                </h3>

                ${
                    generarEstadisticasArena({
                        estadisticas:
                            datos.estadisticas
                    })
                }

            </div>


            <a
                class="enlace"
                href="${escaparHTML(enlace)}"
                target="_blank"
                rel="noopener noreferrer"
            >

                📖 Consultar Paleoficha

            </a>

        </div>

    `;
}


/* ======================================================
   ATAQUE ESPECIAL
====================================================== */

function mostrarAtaqueArena(combatiente) {

    if (!combatiente) {

        return "";

    }


    /*
    ------------------------------------------------------
    OBTENER CÓDIGO DEL ATAQUE
    ------------------------------------------------------
    */

    let codigo = null;


    if (combatiente.ataque_especial) {

        if (
            typeof combatiente.ataque_especial ===
            "string"
        ) {

            codigo =
                combatiente.ataque_especial;

        }
        else if (
            combatiente.ataque_especial.codigo
        ) {

            codigo =
                combatiente.ataque_especial.codigo;

        }

    }


    if (
        !codigo &&
        combatiente.ataque
    ) {

        if (
            typeof combatiente.ataque ===
            "string"
        ) {

            codigo =
                combatiente.ataque;

        }
        else if (
            combatiente.ataque.codigo
        ) {

            codigo =
                combatiente.ataque.codigo;

        }

    }


    /*
    ------------------------------------------------------
    SI EL MOTOR YA GUARDA EL OBJETO
    ------------------------------------------------------
    */

    let ataque = null;


    if (
        combatiente.ataque_especial &&
        typeof combatiente.ataque_especial ===
        "object"
    ) {

        ataque =
            combatiente.ataque_especial;

    }


    if (
        !ataque &&
        combatiente.ataque &&
        typeof combatiente.ataque ===
        "object"
    ) {

        ataque =
            combatiente.ataque;

    }


    /*
    ------------------------------------------------------
    BUSCAR EN LA BASE DE ATAQUES
    ------------------------------------------------------
    */

    if (
        !ataque &&
        codigo &&
        typeof obtenerAtaqueArena ===
        "function"
    ) {

        ataque =
            obtenerAtaqueArena(codigo);

    }


    /*
    ------------------------------------------------------
    SIN ATAQUE IDENTIFICADO
    ------------------------------------------------------
    */

    if (!ataque) {

        return `
            <div class="seccion">

                <h3>
                    ⚔️ Ataque especial
                </h3>

                <div class="dato">
                    Ataque no identificado
                </div>

            </div>
        `;

    }


    /*
    ------------------------------------------------------
    DATOS VISUALES
    ------------------------------------------------------
    */

    const nombre =
        ataque.nombre ||
        "Ataque especial";

    const tipo =
        ataque.tipo ||
        "—";

    const codigoMostrar =
        ataque.codigo ||
        codigo ||
        "—";


    return `

        <div class="seccion">

            <h3>
                ⚔️ Ataque especial
            </h3>

            <div class="dato">

                <strong>
                    ${escaparHTML(nombre)}
                </strong>

            </div>

            <div class="dato">

                Tipo:
                ${escaparHTML(tipo)}

            </div>

            <div class="dato">

                Código:
                ${escaparHTML(codigoMostrar)}

            </div>

        </div>

    `;

}


/* ======================================================
   OBTENER NOMBRE LEGIBLE DE INDICADOR
====================================================== */

function nombreIndicadorArena(indicador) {

    if (
        indicador === null ||
        indicador === undefined
    ) {

        return "";

    }


    const clave =
        String(indicador)
            .toLowerCase()
            .trim();


    const nombres = {

        ataque:
            "Ataque",

        ofensiva:
            "Ofensiva",

        defensa:
            "Defensa",

        resistencia:
            "Resistencia",

        movilidad:
            "Movilidad",

        velocidad:
            "Velocidad",

        inteligencia:
            "Inteligencia",

        adaptabilidad:
            "Adaptabilidad",

        sociabilidad:
            "Sociabilidad",

        reproduccion:
            "Reproducción",

        plasticidad:
            "Plasticidad ecológica",

        tamano:
            "Tamaño",

        tactica:
            "Táctica",

        iniciativa:
            "Iniciativa",

        hp:
            "HP"

    };


    return
        nombres[clave] ||
        String(indicador);

}


/* ======================================================
   BONIFICACIONES
====================================================== */

function mostrarBonificacionesArena(bonificacion) {

    if (
        !bonificacion ||
        !Array.isArray(
            bonificacion.detalles
        ) ||
        !bonificacion.detalles.length
    ) {

        return `
            <div class="bonificacion">

                Sin bonificaciones

            </div>
        `;

    }


    return bonificacion.detalles

        .map(detalle => {

            /*
            ------------------------------------------------
            EFECTOS
            ------------------------------------------------
            */

            const efectos =

                Array.isArray(
                    detalle.efectos
                )

                    ?

                detalle.efectos

                    .map(efecto => {

                        const indicador =
                            nombreIndicadorArena(
                                efecto.indicador
                            );

                        const valor =
                            numeroArena(
                                efecto.valor
                            );

                        return `

                            <div
                                class="efectoBonificacion"
                            >

                                ↳

                                <strong>
                                    ${escaparHTML(
                                        indicador
                                    )}
                                </strong>

                                +${valor}

                            </div>

                        `;

                    })

                    .join("")

                    :

                "";


            /*
            ------------------------------------------------
            TÍTULO
            ------------------------------------------------
            */

            let titulo =
                detalle.nombre ||
                "Bonificación";


            if (
                detalle.coincidencias !==
                undefined
            ) {

                titulo +=
                    " — " +
                    numeroArena(
                        detalle.coincidencias
                    ) +
                    " coincidencia(s)";

            }


            /*
            ------------------------------------------------
            CÓDIGO
            ------------------------------------------------
            */

            const codigo =

                detalle.codigo

                    ?

                `
                    <div class="codigoBonificacion">

                        ${escaparHTML(
                            detalle.codigo
                        )}

                    </div>
                `

                    :

                "";


            /*
            ------------------------------------------------
            RESULTADO
            ------------------------------------------------
            */

            return `

                <div class="bonificacion">

                    <strong>

                        ${escaparHTML(
                            titulo
                        )}

                    </strong>

                    ${codigo}

                    ${
                        efectos

                            ?

                        `
                            <div
                                class="efectosBonificacion"
                            >

                                ${efectos}

                            </div>
                        `

                            :

                        ""
                    }

                </div>

            `;

        })

        .join("");

}

/* ======================================================
   BONIFICACIONES
   ====================================================== */

function mostrarBonificacionesArena(bonificacion){

    if(
        !bonificacion ||
        !Array.isArray(bonificacion.detalles) ||
        !bonificacion.detalles.length
    ){

        return `
            <div class="bonificacion">
                Sin bonificaciones
            </div>
        `;

    }

    return bonificacion.detalles
        .map(detalle => {

            const efectos =
                Array.isArray(detalle.efectos)
                    ? detalle.efectos
                        .map(efecto => {

                            /*
                            ----------------------------------
                            OBTENER NOMBRE LEGIBLE DEL ATRIBUTO
                            ----------------------------------
                            */

                            const indicador =
                                efecto.indicador ||
                                efecto.stat ||
                                efecto.atributo ||
                                efecto.estadistica ||
                                "";

                            const nombres = {

                                ataque:
                                    "Ofensiva",

                                ofensiva:
                                    "Ofensiva",

                                defensa:
                                    "Defensa",

                                resistencia:
                                    "Resistencia",

                                velocidad:
                                    "Velocidad",

                                movilidad:
                                    "Movilidad",

                                inteligencia:
                                    "Inteligencia",

                                adaptabilidad:
                                    "Adaptabilidad",

                                sociabilidad:
                                    "Sociabilidad",

                                reproduccion:
                                    "Reproducción",

                                plasticidad:
                                    "Plasticidad ecológica",

                                plasticidad_ecologica:
                                    "Plasticidad ecológica",

                                tamano:
                                    "Tamaño",

                                hp:
                                    "HP",

                                iniciativa:
                                    "Iniciativa",

                                tactica:
                                    "Táctica"

                            };

                            const clave =
                                normalizarTextoArena(
                                    indicador
                                );

                            const nombreIndicador =
                                nombres[clave] ||
                                indicador ||
                                "Bonificación";

                            return `
                                <div class="efectoBonificacion">

                                    ↳

                                    <strong>
                                        ${escaparHTML(
                                            nombreIndicador
                                        )}
                                    </strong>

                                    +${numeroArena(
                                        efecto.valor
                                    )}

                                </div>
                            `;

                        })
                        .join("")
                    : "";


            /*
            ----------------------------------
            TÍTULO DE LA BONIFICACIÓN
            ----------------------------------
            */

            let titulo =
                detalle.nombre ||
                "Bonificación";


            if(
                detalle.coincidencias !==
                undefined
            ){

                titulo +=
                    " — " +
                    numeroArena(
                        detalle.coincidencias
                    ) +
                    " coincidencia(s)";

            }


            /*
            ----------------------------------
            CÓDIGO DE LA BONIFICACIÓN
            ----------------------------------
            */

            const codigo =
                detalle.codigo
                    ? `
                        <div class="codigoBonificacion">
                            ${escaparHTML(
                                detalle.codigo
                            )}
                        </div>
                    `
                    : "";


            /*
            ----------------------------------
            RENDER
            ----------------------------------
            */

            return `
                <div class="bonificacion">

                    <strong>
                        ${escaparHTML(titulo)}
                    </strong>

                    ${codigo}

                    ${
                        efectos
                            ? `
                                <div class="efectosBonificacion">
                                    ${efectos}
                                </div>
                            `
                            : ""
                    }

                </div>
            `;

        })
        .join("");
}


/* ======================================================
   OBTENER ATAQUE ESPECIAL DEL COMBATIENTE
   ====================================================== */

function obtenerAtaqueEspecialArena(
    combatiente,
    datos
){

    let codigo = null;


    /*
    ----------------------------------
    BUSCAR CÓDIGO YA ASIGNADO
    ----------------------------------
    */

    if(
        combatiente &&
        combatiente.ataque_especial
    ){

        codigo =
            combatiente.ataque_especial;

    }


    if(
        combatiente &&
        combatiente.ataque
    ){

        if(
            typeof combatiente.ataque ===
            "string"
        ){

            codigo =
                combatiente.ataque;

        }

        if(
            typeof combatiente.ataque ===
            "object"
        ){

            codigo =
                combatiente.ataque.codigo;

        }

    }


    /*
    ----------------------------------
    SI NO EXISTE, USAR ASIGNACIÓN
    ----------------------------------
    */

    if(
        !codigo &&
        typeof asignarAtaqueArena ===
        "function"
    ){

        codigo =
            asignarAtaqueArena(datos);

    }


    /*
    ----------------------------------
    OBTENER DATOS DEL ATAQUE
    ----------------------------------
    */

    let ataque = null;

    if(
        codigo &&
        typeof obtenerAtaqueArena ===
        "function"
    ){

        ataque =
            obtenerAtaqueArena(codigo);

    }


    /*
    ----------------------------------
    FALLBACK
    ----------------------------------
    */

    if(!ataque){

        codigo =
            codigo ||
            "A001";

        ataque = {

            codigo:
                codigo,

            nombre:
                "Ataque normal",

            tipo:
                "normal"

        };

    }


    return ataque;

}


/* ======================================================
   COMBATIENTES PREPARADOS
   ====================================================== */

function mostrarPreparadosArena(
    c1,
    c2,
    b1,
    b2,
    escenario
){

    document.getElementById(
        "panelCombate"
    ).style.display = "block";


    document.getElementById(
        "panelResultadoCombate"
    ).style.display = "none";


    /*
    ======================================================
    ATAQUES ESPECIALES
    ======================================================
    */

    const ataque1 =
        obtenerAtaqueEspecialArena(
            c1,
            c1.datos
        );

    const ataque2 =
        obtenerAtaqueEspecialArena(
            c2,
            c2.datos
        );


    /*
    ======================================================
    PANEL DE COMBATIENTES
    ======================================================
    */

    document.getElementById(
        "combatientesPreparados"
    ).innerHTML = `

        <div>

            <strong>
                ${escaparHTML(
                    c1.nombre
                )}
            </strong>

            <br>

            ❤️ HP:
            ${numeroArena(
                c1.hp_max
            )}

            <br>

            ⚡ Iniciativa:
            ${numeroArena(
                c1.iniciativa
            )}

            <div class="seccion">

                <h3>
                    ⚔️ Ataque especial
                </h3>

                <div class="dato">

                    <strong>
                        ${escaparHTML(
                            ataque1.nombre
                        )}
                    </strong>

                    <br>

                    Tipo:
                    ${escaparHTML(
                        ataque1.tipo ||
                        "normal"
                    )}

                    <br>

                    Código:
                    ${escaparHTML(
                        ataque1.codigo ||
                        "A001"
                    )}

                </div>

            </div>


            <div class="seccion">

                <h3>
                    ✨ Bonificaciones
                </h3>

                ${mostrarBonificacionesArena(
                    b1
                )}

            </div>

        </div>


        <hr>


        <div>

            <strong>
                ${escaparHTML(
                    c2.nombre
                )}
            </strong>

            <br>

            ❤️ HP:
            ${numeroArena(
                c2.hp_max
            )}

            <br>

            ⚡ Iniciativa:
            ${numeroArena(
                c2.iniciativa
            )}

            <div class="seccion">

                <h3>
                    ⚔️ Ataque especial
                </h3>

                <div class="dato">

                    <strong>
                        ${escaparHTML(
                            ataque2.nombre
                        )}
                    </strong>

                    <br>

                    Tipo:
                    ${escaparHTML(
                        ataque2.tipo ||
                        "normal"
                    )}

                    <br>

                    Código:
                    ${escaparHTML(
                        ataque2.codigo ||
                        "A001"
                    )}

                </div>

            </div>


            <div class="seccion">

                <h3>
                    ✨ Bonificaciones
                </h3>

                ${mostrarBonificacionesArena(
                    b2
                )}

            </div>

        </div>

    `;


    /*
    ======================================================
    ESCENARIO
    ======================================================
    */

    const panel =
        document.getElementById(
            "escenarioCombate"
        );


    if(
        !panel ||
        !escenario
    ){

        return;

    }


    /*
    ======================================================
    HÁBITATS DEL ESCENARIO
    ======================================================
    */

    const habitats =
        Array.isArray(
            escenario.habitats
        )

            ? escenario.habitats
                .map(c => {

                    const h =
                        window.PALARENA_DATOS
                            .obtenerHabitat(c);

                    return h &&
                        h.nombre

                        ? escaparHTML(
                            h.nombre
                        )

                        : escaparHTML(c);

                })
                .join(", ")

            : "—";


    /*
    ======================================================
    MODO DEL ESCENARIO
    ======================================================
    */

    const modo =
        window.PALARENA_DATOS
            .obtenerModo(
                escenario.modo
            );


    const modoNombre =
        modo &&
        modo.nombre

            ? modo.nombre

            : escenario.modo ||
              "—";


    /*
    ======================================================
    MEDIOS DEL ESCENARIO
    ======================================================
    */

    const medios =
        Array.isArray(
            escenario.medios
        )

            ? escenario.medios

                .map(medio => {

                    if(!medio){

                        return "";

                    }


                    return [
                        "SM",
                        "L",
                        "ES",
                        "C"
                    ]

                    .map(tipo => {

                        const codigo =
                            medio[tipo];


                        if(!codigo){

                            return "";

                        }


                        const dato =
                            window.PALARENA_DATOS
                                .obtenerMedio(
                                    codigo
                                );


                        return dato &&
                            dato.nombre

                            ? escaparHTML(
                                dato.nombre
                            )

                            : escaparHTML(
                                codigo
                            );

                    })

                    .filter(Boolean)

                    .join(" · ");

                })

                .filter(Boolean)

                .join("<br>")

            : "—";


    /*
    ======================================================
    MOSTRAR ESCENARIO
    ======================================================
    */

    panel.innerHTML = `

        <h3>
            🎲 Escenario
        </h3>

        <div>

            🏠 Hábitats:

            <strong>
                ${habitats}
            </strong>

        </div>

        <div>

            🧬 Modo:

            <strong>
                ${escaparHTML(
                    modoNombre
                )}
            </strong>

        </div>

        <div>

            🌎 Medios:

            <strong>
                ${medios}
            </strong>

        </div>

    `;

}
/* ======================================================
   RESULTADO DE UNA ACCIÓN
====================================================== */

function resultadoArena(valor){

    if(
        valor === null ||
        valor === undefined
    ){
        return "";
    }

    if(
        typeof valor === "string" ||
        typeof valor === "number"
    ){
        return String(valor);
    }

    if(
        typeof valor === "object"
    ){

        if(valor.mensaje){
            return String(
                valor.mensaje
            );
        }

        if(valor.texto){
            return String(
                valor.texto
            );
        }

        if(valor.descripcion){
            return String(
                valor.descripcion
            );
        }

        if(
            valor.dano !== undefined
        ){
            return (
                "Daño: " +
                numeroArena(
                    valor.dano
                )
            );
        }

        if(
            valor.danio !== undefined
        ){
            return (
                "Daño: " +
                numeroArena(
                    valor.danio
                )
            );
        }

        return JSON.stringify(valor);
    }

    return String(valor);

}


/* ======================================================
   HISTORIAL
====================================================== */

function mostrarHistorialArena(
    historial
){

    if(
        !Array.isArray(historial)
    ){
        return "";
    }

    return historial
        .map(turno => {

            if(!turno){
                return "";
            }

            if(
                turno.atacante &&
                turno.objetivo
            ){

                let texto =
                    "Turno " +
                    numeroArena(
                        turno.turno
                    ) +
                    " — " +
                    turno.atacante +
                    " → " +
                    turno.objetivo;

                if(turno.accion){

                    texto +=
                        " — " +
                        turno.accion;

                }

                const resultado =
                    resultadoArena(
                        turno.resultado
                    );

                if(resultado){

                    texto +=
                        " — " +
                        resultado;

                }

                return `
                    <div class="turnoCombate">
                        ${escaparHTML(texto)}
                    </div>
                `;

            }

            if(
                turno.tipo ===
                "efecto"
            ){

                let texto =
                    "Turno " +
                    numeroArena(
                        turno.turno
                    ) +
                    " — Efecto sobre " +
                    (
                        turno.objetivo ||
                        ""
                    );

                const resultado =
                    resultadoArena(
                        turno.resultado
                    );

                if(resultado){

                    texto +=
                        " — " +
                        resultado;

                }

                return `
                    <div class="turnoCombate">
                        ${escaparHTML(texto)}
                    </div>
                `;

            }

            return `
                <div class="turnoCombate">
                    ${escaparHTML(
                        resultadoArena(turno)
                    )}
                </div>
            `;

        })
        .join("");

}


/* ======================================================
   EJECUTAR COMBATE AUTOMÁTICO
====================================================== */

function ejecutarCombateAutomaticoArena(){

    try{

        if(!COMBATE_ARENA){

            throw new Error(
                "No hay un combate preparado."
            );

        }

        /*
        --------------------------------------------------
        RECREAR EL COMBATE CON LOS DATOS MODIFICADOS
        --------------------------------------------------
        */

        COMBATE_ARENA =
            crearCombateArena(
                COMBATE_ARENA
                    .combatiente1
                    .datos,

                COMBATE_ARENA
                    .combatiente2
                    .datos
            );


        /*
        --------------------------------------------------
        EJECUCIÓN
        --------------------------------------------------
        */

        while(
            COMBATE_ARENA.estado !==
            "finalizado"
        ){

            ejecutarTurnoArena(
                COMBATE_ARENA
            );

        }


        const resultado = {

            ganador:
                COMBATE_ARENA.ganador,

            combatiente1:
                COMBATE_ARENA.combatiente1,

            combatiente2:
                COMBATE_ARENA.combatiente2,

            historial:
                COMBATE_ARENA.historial

        };


        /*
        --------------------------------------------------
        MOSTRAR RESULTADO
        --------------------------------------------------
        */

        document.getElementById(
            "panelResultadoCombate"
        ).style.display = "block";


        document.getElementById(
            "ganadorCombate"
        ).innerHTML = `

            🏆 Ganador:

            <strong>
                ${escaparHTML(
                    resultado.ganador
                )}
            </strong>

        `;


        /*
        --------------------------------------------------
        HP COMBATIENTE 1
        --------------------------------------------------
        */

        const hp1 =
            numeroArena(
                resultado
                    .combatiente1
                    .hp
            );

        const hpMax1 =
            numeroArena(
                resultado
                    .combatiente1
                    .hp_max
            );


        /*
        --------------------------------------------------
        HP COMBATIENTE 2
        --------------------------------------------------
        */

        const hp2 =
            numeroArena(
                resultado
                    .combatiente2
                    .hp
            );

        const hpMax2 =
            numeroArena(
                resultado
                    .combatiente2
                    .hp_max
            );


        /*
        --------------------------------------------------
        PORCENTAJES DE HP
        --------------------------------------------------
        */

        const porcentajeHp1 =
            hpMax1 > 0
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            hp1 /
                            hpMax1
                        ) * 100
                    )
                )
                : 0;


        const porcentajeHp2 =
            hpMax2 > 0
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            hp2 /
                            hpMax2
                        ) * 100
                    )
                )
                : 0;


        /*
        --------------------------------------------------
        ESTADO FINAL DE LOS COMBATIENTES
        --------------------------------------------------
        */

        document.getElementById(
            "estadoCombatientes"
        ).innerHTML = `

            <div class="combateFicha">

                <h3>
                    ${escaparHTML(
                        resultado
                            .combatiente1
                            .nombre
                    )}
                </h3>

                ❤️ HP:
                ${hp1}
                /
                ${hpMax1}

                <div class="barraHp">

                    <div
                        class="barraHpInterior"
                        style="width:${porcentajeHp1}%"
                    ></div>

                </div>

            </div>


            <div class="combateFicha">

                <h3>
                    ${escaparHTML(
                        resultado
                            .combatiente2
                            .nombre
                    )}
                </h3>

                ❤️ HP:
                ${hp2}
                /
                ${hpMax2}

                <div class="barraHp">

                    <div
                        class="barraHpInterior"
                        style="width:${porcentajeHp2}%"
                    ></div>

                </div>

            </div>

        `;


        /*
        --------------------------------------------------
        HISTORIAL
        --------------------------------------------------
        */

        document.getElementById(
            "historialCombate"
        ).innerHTML =
            mostrarHistorialArena(
                resultado.historial
            );

    }
    catch(error){

        console.error(
            "Error ejecutando combate:",
            error
        );

        document.getElementById(
            "panelResultadoCombate"
        ).style.display = "block";

        document.getElementById(
            "ganadorCombate"
        ).innerHTML = `

            <span class="error">

                ❌
                ${escaparHTML(
                    error.message
                )}

            </span>

        `;

    }

}


/* ======================================================
   SELECCIÓN DESDE VISOR
====================================================== */

function recibirSeleccionArena(){

    const seleccion =
        localStorage.getItem(
            "palentropia_arena_seleccion"
        );

    if(!seleccion){

        return null;

    }

    try{

        const datos =
            JSON.parse(
                seleccion
            );

        if(
            !datos ||
            !datos.arena ||
            !datos.codigo
        ){

            return null;

        }

        localStorage.removeItem(
            "palentropia_arena_seleccion"
        );

        return datos;

    }
    catch(error){

        localStorage.removeItem(
            "palentropia_arena_seleccion"
        );

        return null;

    }

}


/* ======================================================
   APLICAR SELECCIÓN
====================================================== */

async function aplicarSeleccionArena(){

    const seleccion =
        recibirSeleccionArena();

    if(
        !seleccion ||
        !COMBATE_ARENA
    ){

        return false;

    }


    const nuevosDatos =
        crearDatosCombatienteArena(
            seleccion.codigo
        );


    /*
    --------------------------------------------------
    ARENA 1
    --------------------------------------------------
    */

    if(
        seleccion.arena ===
        "1"
    ){

        const datos2 =
            COMBATE_ARENA
                .combatiente2
                .datos;


        document.getElementById(
            "codigo1"
        ).textContent =
            nuevosDatos.codigo;


        document.getElementById(
            "resultado"
        ).innerHTML =

            await mostrarCombatienteArena(
                nuevosDatos,
                1
            ) +

            await mostrarCombatienteArena(
                datos2,
                2
            );


        prepararCombateArena(
            nuevosDatos,
            datos2
        );

        return true;

    }


    /*
    --------------------------------------------------
    ARENA 2
    --------------------------------------------------
    */

    if(
        seleccion.arena ===
        "2"
    ){

        const datos1 =
            COMBATE_ARENA
                .combatiente1
                .datos;


        document.getElementById(
            "codigo2"
        ).textContent =
            nuevosDatos.codigo;


        document.getElementById(
            "resultado"
        ).innerHTML =

            await mostrarCombatienteArena(
                datos1,
                1
            ) +

            await mostrarCombatienteArena(
                nuevosDatos,
                2
            );


        prepararCombateArena(
            datos1,
            nuevosDatos
        );

        return true;

    }


    return false;

}


/* ======================================================
   INICIAR ARENA
====================================================== */

async function iniciarArena(){

    try{

        document.getElementById(
            "estado"
        ).innerHTML =
            "⏳ Cargando datos...";


        await cargarPaleofichasArena();


        const cargado =
            await window.PALARENA_DATOS
                .cargar();


        if(!cargado){

            throw new Error(
                "No se pudo cargar master.csv"
            );

        }


        document.getElementById(
            "estado"
        ).innerHTML = `

            <span class="ok">

                ✓ Paleofichas cargadas
                correctamente

            </span>

        `;


        nuevoCombateArena();

    }
    catch(error){

        console.error(
            "Error iniciando Arena:",
            error
        );

        document.getElementById(
            "estado"
        ).innerHTML = `

            <span class="error">

                ✗
                ${escaparHTML(
                    error.message
                )}

            </span>

        `;

    }

}


/* ======================================================
   BOTONES
====================================================== */

document.getElementById(
    "btnNuevo"
).addEventListener(
    "click",
    nuevoCombateArena
);


document.getElementById(
    "btnEjecutarCombate"
).addEventListener(
    "click",
    ejecutarCombateAutomaticoArena
);


/* ======================================================
   INICIO
====================================================== */

iniciarArena();


/* ======================================================
   COMPROBAR SELECCIÓN
====================================================== */

setInterval(
    async function(){

        try{

            await aplicarSeleccionArena();

        }
        catch(error){

            console.error(
                "Error aplicando selección desde visor:",
                error
            );

        }

    },
    500
);

/*
========================================================
PALARENA
palarena_ui4.js
PalEntropía

INTERFAZ DE ARENA
========================================================
*/

function escaparHTML(v){
    return String(v??"")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function numeroArena(v){
    const n=Number(v);
    return Number.isFinite(n)?n:0;
}


/* ======================================================
   COMBATIENTE
====================================================== */

async function mostrarCombatienteArena(datos,n){

    const miniatura=await obtenerMiniaturaArena(
        datos.codigo,
        datos.nombre
    );

    const enlace=
        RUTA_GENERADOR+
        "?codigo="+
        encodeURIComponent(datos.codigo)+
        "&arena="+n;

    const habitats=datos.habitats
        .filter(c=>c&&c!=="H000")
        .map(c=>{
            const h=PALARENA_DATOS.obtenerHabitat(c);
            return `
                <div class="habitat">
                    <strong>${escaparHTML(c)}</strong>
                    ${h?.nombre?" — "+escaparHTML(h.nombre):""}
                </div>
            `;
        }).join("");

    const modo=PALARENA_DATOS.obtenerModo(datos.modo);

    return `
        <div class="combatiente">
            ${miniatura?
                `<img class="miniaturaCombatiente"
                    src="${escaparHTML(miniatura)}"
                    alt="${escaparHTML(datos.nombre)}">`
                :""
            }

            <div class="nombre">
                🦖 ${escaparHTML(datos.nombre)}
            </div>

            <div class="codigoFicha">
                Código: ${escaparHTML(datos.codigo)}
            </div>

            <div class="seccion">
                <h3>🧬 Modo de vida</h3>
                <div class="dato">
                    <strong>${escaparHTML(datos.modo)}</strong>
                    ${modo?.nombre?
                        " — "+escaparHTML(modo.nombre):""}
                </div>
            </div>

            <div class="seccion">
                <h3>🏠 Hábitats</h3>
                ${habitats||'<div class="habitat">Ninguno</div>'}
            </div>

            <div class="seccion">
                <h3>📊 Estadísticas</h3>
                ${generarEstadisticasArena({
                    estadisticas:datos.estadisticas
                })}
            </div>

            <a class="enlace"
                href="${escaparHTML(enlace)}"
                target="_blank"
                rel="noopener noreferrer">
                📖 Consultar Paleoficha
            </a>
        </div>
    `;
}


/* ======================================================
   BONIFICACIONES
====================================================== */

function mostrarBonificacionesArena(b){

    if(!b?.detalles?.length)
        return "<div>Sin bonificaciones</div>";

    return b.detalles.map(d=>{

        const efectos=(d.efectos||[])
            .map(e=>
                `${e.indicador} +${numeroArena(e.valor)}`
            )
            .join(", ");

        return `
            <div>
                ✨ ${escaparHTML(
                    d.nombre||d.tipo||"Bonificación"
                )}
                ${efectos?
                    ` — ${escaparHTML(efectos)}`:""}
            </div>
        `;

    }).join("");
}


/* ======================================================
   HP
====================================================== */

function mostrarHpArena(c){

    const inicial=numeroArena(c.hp_max);
    const actual=numeroArena(c.hp);

    return inicial===actual
        ?`❤️ HP: ${inicial}`
        :`❤️ HP: ${inicial} → ${actual}`;
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
    ).style.display="block";

    document.getElementById(
        "panelResultadoCombate"
    ).style.display="none";


    document.getElementById(
        "combatientesPreparados"
    ).innerHTML=`

        <div>
            <strong>
                ${escaparHTML(c1.nombre)}
            </strong><br>

            ${mostrarHpArena(c1)}<br>

            ⚡ Iniciativa:
            ${numeroArena(c1.iniciativa)}

            <div class="seccion">
                <h3>✨ Bonificaciones</h3>
                ${mostrarBonificacionesArena(b1)}
            </div>
        </div>

        <hr>

        <div>
            <strong>
                ${escaparHTML(c2.nombre)}
            </strong><br>

            ${mostrarHpArena(c2)}<br>

            ⚡ Iniciativa:
            ${numeroArena(c2.iniciativa)}

            <div class="seccion">
                <h3>✨ Bonificaciones</h3>
                ${mostrarBonificacionesArena(b2)}
            </div>
        </div>
    `;


    const panel=
        document.getElementById(
            "escenarioCombate"
        );

    if(!panel||!escenario)
        return;


    const habitats=
        (escenario.habitats||[])
            .map(escaparHTML)
            .join(", ");


    const medios=
        (escenario.medios||[])
            .map(m=>m?.nombre||m?.codigo||"")
            .filter(Boolean)
            .map(escaparHTML)
            .join(", ");


    panel.innerHTML=`
        <h3>🎲 Escenario</h3>

        <div>
            🏠 Hábitats:
            <strong>${habitats||"—"}</strong>
        </div>

        <div>
            🧬 Modo:
            <strong>
                ${escaparHTML(escenario.modo||"—")}
            </strong>
        </div>

        <div>
            🌎 Medios:
            <strong>${medios||"—"}</strong>
        </div>
    `;
}


/* ======================================================
   NUEVO COMBATE
====================================================== */

async function nuevoCombateArena(){

    try{

        const fichas=
            obtenerDosFichasAleatoriasArena();

        const datos1=
            crearDatosCombatienteArena(fichas[0].j1);

        const datos2=
            crearDatosCombatienteArena(fichas[1].j1);


        document.getElementById("codigo1")
            .textContent=datos1.codigo;

        document.getElementById("codigo2")
            .textContent=datos2.codigo;


        document.getElementById("resultado")
            .innerHTML=
                await mostrarCombatienteArena(datos1,1)+
                await mostrarCombatienteArena(datos2,2);


        prepararCombateArena(
            datos1,
            datos2
        );

    }catch(error){

        console.error(
            "Error generando nuevo combate:",
            error
        );

        document.getElementById("estado")
            .innerHTML=`
                <span class="error">
                    ✗ ${escaparHTML(error.message)}
                </span>
            `;
    }
}


/* ======================================================
   RESULTADO DE EFECTOS / ATAQUES
====================================================== */

function resultadoArena(valor){

    if(valor==null)
        return "";

    if(
        typeof valor==="string"||
        typeof valor==="number"
    )
        return String(valor);

    if(typeof valor==="object"){

        if(valor.mensaje)
            return String(valor.mensaje);

        if(valor.texto)
            return String(valor.texto);

        if(valor.descripcion)
            return String(valor.descripcion);

        if(valor.dano!==undefined)
            return "Daño: "+numeroArena(valor.dano);

        if(valor.danio!==undefined)
            return "Daño: "+numeroArena(valor.danio);

        try{
            return JSON.stringify(valor);
        }catch{
            return "";
        }
    }

    return String(valor);
}


/* ======================================================
   HISTORIAL
====================================================== */

function mostrarHistorialArena(historial){

    return (historial||[]).map(turno=>{

        if(!turno)
            return "";

        let texto="";


        if(turno.atacante&&turno.objetivo){

            texto=
                "Turno "+
                numeroArena(turno.turno)+
                " — "+
                turno.atacante+
                " → "+
                turno.objetivo;

            if(turno.accion)
                texto+=" — "+turno.accion;

            const resultado=
                resultadoArena(turno.resultado);

            if(resultado)
                texto+=" — "+resultado;

        }else if(turno.tipo==="efecto"){

            texto=
                "Turno "+
                numeroArena(turno.turno)+
                " — Efecto sobre "+
                (turno.objetivo||"");

            const resultado=
                resultadoArena(turno.resultado);

            if(resultado)
                texto+=" — "+resultado;

        }else{

            texto=resultadoArena(turno);
        }


        return `
            <div class="turnoCombate">
                ${escaparHTML(texto)}
            </div>
        `;

    }).join("");
}


/* ======================================================
   EJECUTAR COMBATE
====================================================== */

function ejecutarCombateAutomaticoArena(){

    try{

        if(!COMBATE_ARENA)
            throw new Error(
                "No hay un combate preparado."
            );


        COMBATE_ARENA=
            crearCombateArena(
                COMBATE_ARENA.combatiente1.datos,
                COMBATE_ARENA.combatiente2.datos
            );


        while(
            COMBATE_ARENA.estado!=="finalizado"
        ){

            ejecutarTurnoArena(
                COMBATE_ARENA
            );
        }


        const c1=
            COMBATE_ARENA.combatiente1;

        const c2=
            COMBATE_ARENA.combatiente2;


        document.getElementById(
            "panelResultadoCombate"
        ).style.display="block";


        document.getElementById(
            "ganadorCombate"
        ).innerHTML=`
            🏆 Ganador:
            <strong>
                ${escaparHTML(COMBATE_ARENA.ganador)}
            </strong>
        `;


        const mostrarResultado=(c)=>{

            const hp=numeroArena(c.hp);
            const max=numeroArena(c.hp_max);

            const porcentaje=max>0
                ?Math.max(
                    0,
                    Math.min(
                        100,
                        hp/max*100
                    )
                )
                :0;

            return `
                <div class="combateFicha">

                    <h3>
                        ${escaparHTML(c.nombre)}
                    </h3>

                    ❤️ HP final: ${hp} / ${max}

                    <div class="barraHp">
                        <div
                            class="barraHpInterior"
                            style="width:${porcentaje}%">
                        </div>
                    </div>

                </div>
            `;
        };


        document.getElementById(
            "estadoCombatientes"
        ).innerHTML=
            mostrarResultado(c1)+
            mostrarResultado(c2);


        document.getElementById(
            "historialCombate"
        ).innerHTML=
            mostrarHistorialArena(
                COMBATE_ARENA.historial
            );


    }catch(error){

        console.error(
            "Error ejecutando combate:",
            error
        );

        document.getElementById(
            "panelResultadoCombate"
        ).style.display="block";

        document.getElementById(
            "ganadorCombate"
        ).innerHTML=`
            <span class="error">
                ❌ ${escaparHTML(error.message)}
            </span>
        `;
    }
}


/* ======================================================
   SELECCIÓN DESDE VISOR
====================================================== */

function recibirSeleccionArena(){

    const clave=
        "palentropia_arena_seleccion";

    const seleccion=
        localStorage.getItem(clave);

    if(!seleccion)
        return null;

    try{

        const datos=
            JSON.parse(seleccion);

        if(
            !datos||
            !datos.arena||
            !datos.codigo
        )
            return null;

        localStorage.removeItem(clave);

        return datos;

    }catch{

        localStorage.removeItem(clave);

        return null;
    }
}


async function aplicarSeleccionArena(){

    const seleccion=
        recibirSeleccionArena();

    if(
        !seleccion||
        !COMBATE_ARENA
    )
        return false;


    const nuevosDatos=
        crearDatosCombatienteArena(
            seleccion.codigo
        );


    const datos1=
        COMBATE_ARENA.combatiente1.datos;

    const datos2=
        COMBATE_ARENA.combatiente2.datos;


    if(seleccion.arena==="1"){

        document.getElementById("codigo1")
            .textContent=nuevosDatos.codigo;

        document.getElementById("resultado")
            .innerHTML=
                await mostrarCombatienteArena(
                    nuevosDatos,1
                )+
                await mostrarCombatienteArena(
                    datos2,2
                );

        prepararCombateArena(
            nuevosDatos,
            datos2
        );

        return true;
    }


    if(seleccion.arena==="2"){

        document.getElementById("codigo2")
            .textContent=nuevosDatos.codigo;

        document.getElementById("resultado")
            .innerHTML=
                await mostrarCombatienteArena(
                    datos1,1
                )+
                await mostrarCombatienteArena(
                    nuevosDatos,2
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
   INICIO
====================================================== */

async function iniciarArena(){

    try{

        document.getElementById("estado")
            .innerHTML=
                "⏳ Cargando datos...";


        await cargarPaleofichasArena();


        if(
            !await window.PALARENA_DATOS.cargar()
        ){

            throw new Error(
                "No se pudo cargar master.csv"
            );
        }


        document.getElementById("estado")
            .innerHTML=`
                <span class="ok">
                    ✓ Paleofichas cargadas correctamente
                </span>
            `;


        nuevoCombateArena();


    }catch(error){

        console.error(
            "Error iniciando Arena:",
            error
        );

        document.getElementById("estado")
            .innerHTML=`
                <span class="error">
                    ✗ ${escaparHTML(error.message)}
                </span>
            `;
    }
}


/* ======================================================
   EVENTOS
====================================================== */

document.getElementById("btnNuevo")
    ?.addEventListener(
        "click",
        nuevoCombateArena
    );


document.getElementById("btnEjecutarCombate")
    ?.addEventListener(
        "click",
        ejecutarCombateAutomaticoArena
    );


/* ======================================================
   ARRANQUE
====================================================== */

iniciarArena();


/* ======================================================
   SELECCIÓN DESDE VISOR
====================================================== */

setInterval(
    aplicarSeleccionArena,
    500
);

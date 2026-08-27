/*
========================================================
PALARENA
palarena_ui4.js
PalEntropía

INTERFAZ DE ARENA
========================================================
*/


/* ======================================================
   MOSTRAR COMBATIENTE
====================================================== */

async function mostrarCombatienteArena(datos,n){

    const miniatura=
        await obtenerMiniaturaArena(
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
            const h=
                window.PALARENA_DATOS
                    .obtenerHabitat(c);

            return `
                <div class="habitat">
                    <strong>${escaparHTML(c)}</strong>
                    ${
                        h&&h.nombre
                            ?" — "+escaparHTML(h.nombre)
                            :""
                    }
                </div>
            `;
        })
        .join("");

    const modo=
        window.PALARENA_DATOS
            .obtenerModo(datos.modo);

    return `
        <div class="combatiente">

            ${
                miniatura
                    ?`<img class="miniaturaCombatiente"
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
                    ${
                        modo&&modo.nombre
                            ?" — "+escaparHTML(modo.nombre)
                            :""
                    }
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
   COMBATIENTES PREPARADOS + ESCENARIO
====================================================== */

function mostrarPreparadosArena(
    c1,c2,b1,b2,escenario
){

    document.getElementById(
        "panelCombate"
    ).style.display="block";

    document.getElementById(
        "panelResultadoCombate"
    ).style.display="none";


    function ficha(c,b){

        return `
            <div class="combateFicha">

                <strong>
                    ${escaparHTML(c.nombre)}
                </strong>

                <br>

                ❤️ HP inicial:
                <strong>
                    ${numeroArena(c.hp_max)}
                </strong>

                <br>

                ⚡ Iniciativa:
                ${numeroArena(c.iniciativa)}

                <div class="seccion">
                    <h3>✨ Bonificaciones</h3>
                    ${generarBonificacionesArena(b)}
                </div>

            </div>
        `;
    }


    document.getElementById(
        "combatientesPreparados"
    ).innerHTML=
        ficha(c1,b1)+
        "<hr>"+
        ficha(c2,b2);


    const panel=
        document.getElementById(
            "escenarioCombate"
        );

    if(!panel||!escenario)return;


    const habitats=
        Array.isArray(escenario.habitats)
            ?escenario.habitats
                .filter(c=>c&&c!=="H000")
                .map(c=>{
                    const h=
                        window.PALARENA_DATOS
                            .obtenerHabitat(c);

                    return h&&h.nombre
                        ?escaparHTML(h.nombre)
                        :escaparHTML(c);
                })
                .join(", ")
            :"—";


    const modo=
        window.PALARENA_DATOS
            .obtenerModo(
                escenario.modo
            );

    const modoNombre=
        modo&&modo.nombre
            ?modo.nombre
            :escenario.modo||"—";


    const medios=
        Array.isArray(escenario.medios)
            ?escenario.medios
                .map(m=>{

                    if(!m)return "";

                    const nombres=[];

                    ["SM","L","ES","C"]
                        .forEach(tipo=>{

                            if(!m[tipo])return;

                            const dato=
                                window.PALARENA_DATOS
                                    .obtenerMedio(m[tipo]);

                            if(
                                dato&&
                                dato.nombre
                            ){
                                nombres.push(
                                    dato.nombre
                                );
                            }

                        });

                    return nombres
                        .map(escaparHTML)
                        .join(" · ");

                })
                .filter(Boolean)
                .join("<br>")
            :"—";


    panel.innerHTML=`
        <h3>🎲 Escenario</h3>

        <div>
            🏠 Hábitats:
            <strong>${habitats}</strong>
        </div>

        <div>
            🧬 Modo:
            <strong>${escaparHTML(modoNombre)}</strong>
        </div>

        <div>
            🌎 Medios:
            <strong>${medios}</strong>
        </div>
    `;
}


/* ======================================================
   RESULTADO DE ACCIÓN
====================================================== */

function resultadoArena(valor){

    if(valor===null||valor===undefined)return "";

    if(
        typeof valor==="string"||
        typeof valor==="number"
    ){
        return String(valor);
    }

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

        return JSON.stringify(valor);
    }

    return String(valor);
}


/* ======================================================
   HISTORIAL
====================================================== */

function mostrarHistorialArena(historial){

    return historial.map(turno=>{

        if(!turno)return "";

        let texto;


        if(
            turno.atacante&&
            turno.objetivo
        ){

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
                resultadoArena(
                    turno.resultado
                );

            if(resultado)
                texto+=" — "+resultado;

        }

        else if(
            turno.tipo==="efecto"
        ){

            texto=
                "Turno "+
                numeroArena(turno.turno)+
                " — Efecto sobre "+
                (turno.objetivo||"");

            const resultado=
                resultadoArena(
                    turno.resultado
                );

            if(resultado)
                texto+=" — "+resultado;

        }

        else{

            texto=
                resultadoArena(turno);

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
                ${escaparHTML(
                    COMBATE_ARENA.ganador
                )}
            </strong>
        `;


        function resultado(c){

            const hp=
                numeroArena(c.hp);

            const max=
                numeroArena(c.hp_max);

            const porcentaje=
                max>0
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

                    ❤️ HP final:
                    <strong>${hp}</strong>
                    / ${max}

                    <div class="barraHp">
                        <div
                            class="barraHpInterior"
                            style="width:${porcentaje}%"
                        ></div>
                    </div>

                </div>
            `;
        }


        document.getElementById(
            "estadoCombatientes"
        ).innerHTML=
            resultado(c1)+
            resultado(c2);


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
   NUEVO COMBATE
====================================================== */

async function nuevoCombateArena(){

    try{

        const fichas=
            obtenerDosFichasAleatoriasArena();

        const datos1=
            crearDatosCombatienteArena(
                fichas[0].j1
            );

        const datos2=
            crearDatosCombatienteArena(
                fichas[1].j1
            );


        document.getElementById(
            "codigo1"
        ).textContent=datos1.codigo;

        document.getElementById(
            "codigo2"
        ).textContent=datos2.codigo;


        document.getElementById(
            "resultado"
        ).innerHTML=
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

        document.getElementById(
            "estado"
        ).innerHTML=`
            <span class="error">
                ✗ ${escaparHTML(error.message)}
            </span>
        `;
    }
}


/* ======================================================
   SELECCIÓN DESDE VISOR
====================================================== */

function recibirSeleccionArena(){

    const valor=
        localStorage.getItem(
            "palentropia_arena_seleccion"
        );

    if(!valor)return null;

    try{

        const datos=
            JSON.parse(valor);

        if(
            !datos||
            !datos.arena||
            !datos.codigo
        ){
            return null;
        }

        localStorage.removeItem(
            "palentropia_arena_seleccion"
        );

        return datos;

    }catch(error){

        localStorage.removeItem(
            "palentropia_arena_seleccion"
        );

        return null;
    }
}


async function aplicarSeleccionArena(){

    const seleccion=
        recibirSeleccionArena();

    if(
        !seleccion||
        !COMBATE_ARENA
    ){
        return false;
    }


    const nuevo=
        crearDatosCombatienteArena(
            seleccion.codigo
        );


    const datos1=
        COMBATE_ARENA.combatiente1.datos;

    const datos2=
        COMBATE_ARENA.combatiente2.datos;


    if(seleccion.arena==="1"){

        document.getElementById(
            "codigo1"
        ).textContent=nuevo.codigo;

        document.getElementById(
            "resultado"
        ).innerHTML=
            await mostrarCombatienteArena(nuevo,1)+
            await mostrarCombatienteArena(datos2,2);

        prepararCombateArena(
            nuevo,
            datos2
        );

        return true;
    }


    if(seleccion.arena==="2"){

        document.getElementById(
            "codigo2"
        ).textContent=nuevo.codigo;

        document.getElementById(
            "resultado"
        ).innerHTML=
            await mostrarCombatienteArena(datos1,1)+
            await mostrarCombatienteArena(nuevo,2);

        prepararCombateArena(
            datos1,
            nuevo
        );

        return true;
    }


    return false;
}


/* ======================================================
   INICIAR
====================================================== */

async function iniciarArena(){

    try{

        document.getElementById(
            "estado"
        ).innerHTML=
            "⏳ Cargando datos...";


        await cargarPaleofichasArena();


        if(
            !await window.PALARENA_DATOS.cargar()
        ){
            throw new Error(
                "No se pudo cargar master.csv"
            );
        }


        document.getElementById(
            "estado"
        ).innerHTML=`
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

        document.getElementById(
            "estado"
        ).innerHTML=`
            <span class="error">
                ✗ ${escaparHTML(error.message)}
            </span>
        `;
    }
}


/* ======================================================
   EVENTOS
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


iniciarArena();


setInterval(
    aplicarSeleccionArena,
    500
);

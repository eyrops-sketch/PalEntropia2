/*
==========================================================
 actualizar_modo.js v1.0
 PalEntropía
 Fase 1 - Lectura de palmodo.csv
==========================================================
*/

console.log("========================================");
console.log(" PalEntropía - Actualizador de Modo");
console.log(" Fase 1 - Leyendo palmodo.csv");
console.log("========================================");


fetch("palmodo.csv")

.then(res => res.text())

.then(texto => {


    const lineas = texto.trim().split("\n");


    const cabecera = lineas[0].split(",");


    let registros = [];


    for(let i = 1; i < lineas.length; i++){


        const datos = lineas[i].split(",");


        registros.push({

            codigo: datos[0],
            nombre: datos[1],
            MV: datos[2],
            SM_L_ES_C: datos[3]

        });

    }


    console.log("Registros leídos:", registros.length);


    registros.forEach(f => {


        console.log(
            f.codigo,
            f.nombre,
            "MV" + f.MV,
            f.SM_L_ES_C
        );


    });


    console.log("Lectura completada correctamente.");


})

.catch(error => {


    console.error(
        "Error leyendo palmodo.csv:",
        error
    );


});






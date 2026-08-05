/*
==========================================================
 actualizar_modo.js v1.0
 PalEntropía

 Actualizador automático de campos de modo de vida

 Entrada:
 - palmodo.csv
 - paleofichas.json

 Salida:
 - paleofichas_actualizado.json

==========================================================
*/


const CSV_ENTRADA = "palmodo.csv";

const JSON_ENTRADA = "paleofichas.json";

const JSON_SALIDA = "paleofichas_actualizado.json";


console.log("====================================");
console.log(" PalEntropía - Actualizador de Modo");
console.log(" Iniciando proceso...");
console.log("====================================");



/*
------------------------------------------
 Cargar CSV
------------------------------------------
*/


fetch(CSV_ENTRADA)

.then(res => res.text())

.then(csv => {


    console.log("CSV cargado correctamente");


    const lineas = csv.trim().split("\n");


    const cabecera = lineas[0].split(",");


    let modos = {};


    for(let i = 1; i < lineas.length; i++){


        const datos = lineas[i].split(",");


        modos[datos[0]] = {


            modo_vida:
            "MV" + datos[2],


            medio_compuesto:
            datos[3]


        };


    }


    console.log(
        "Registros CSV cargados:",
        Object.keys(modos).length
    );


    return modos;


})

/*
------------------------------------------
 Cargar paleofichas.json
------------------------------------------
*/


.then(modos => {


    return fetch(JSON_ENTRADA)

    .then(res => res.json())

    .then(fichas => {


        console.log(
            "JSON cargado correctamente"
        );


        console.log(
            "Fichas encontradas:",
            fichas.length
        );


        let actualizadas = 0;

        let noEncontradas = [];


        /*
        ----------------------------------
        Actualizar campos
        ----------------------------------
        */


        fichas.forEach(ficha => {


            const codigo = ficha.codigo;


            if(modos[codigo]){


                ficha.modo_vida =
                modos[codigo].modo_vida;


                ficha.medio_compuesto =
                modos[codigo].medio_compuesto;


                actualizadas++;


            }

            else{


                noEncontradas.push(codigo);


            }


        });



        console.log(
            "Fichas actualizadas:",
            actualizadas
        );


        console.log(
            "Fichas sin coincidencia:",
            noEncontradas.length
        );


        return fichas;


    });


})

/*
------------------------------------------
 Guardar nuevo JSON
------------------------------------------
*/


.then(fichasActualizadas => {


    const contenido = JSON.stringify(
        fichasActualizadas,
        null,
        2
    );


    /*
    --------------------------------------
    Descarga del archivo generado
    --------------------------------------
    */


    const blob = new Blob(
        [contenido],
        {
            type:"application/json"
        }
    );


    const enlace = document.createElement("a");


    enlace.href =
    URL.createObjectURL(blob);


    enlace.download =
    JSON_SALIDA;


    enlace.click();



    console.log(
        "===================================="
    );

    console.log(
        "Proceso terminado correctamente"
    );

    console.log(
        "Archivo generado:",
        JSON_SALIDA
    );

    console.log(
        "===================================="
    );


})

.catch(error => {


    console.error(
        "Error durante la actualización:",
        error
    );


});





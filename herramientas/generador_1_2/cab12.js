/*
========================================================
CAB12.js
PRUEBA MODO DE VIDA
========================================================
*/

window.CAB12 = {

    mostrar: function(contenedor) {

        console.log("CAB12: EJECUTADO");

        if (!contenedor) {

            console.error(
                "CAB12: no existe contenedor."
            );

            return;

        }

        contenedor.innerHTML =

            "<h3>Modo de vida</h3>" +

            "<p>PRUEBA CAB12 FUNCIONANDO</p>";

    }

};

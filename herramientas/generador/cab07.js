/* ========================================================
   CAB07.js
   PalEntropía — Obtener J3 desde master.csv
======================================================== */

window.CAB07 = {

    async procesar(j1) {

        try {

            const respuesta = await fetch("master.csv");

            if (!respuesta.ok) {
                console.error("CAB07: No se pudo cargar master.csv");
                return null;
            }

            const csv = await respuesta.text();

            const lineas = csv.split(/\r?\n/);

            for (const linea of lineas) {

                const columnas = linea.split(",");

                if (columnas.length < 3) continue;

                const codigo =
                    columnas[0].trim();

                if (codigo === String(j1).trim()) {

                    const j3 =
                        columnas[2].trim();

                    /*
                    ========================================
                    MOSTRAR J3
                    ========================================
                    */

                    let salida =
                        document.getElementById("cab07-j3");

                    if (!salida) {

                        salida =
                            document.createElement("div");

                        salida.id = "cab07-j3";

                        salida.style.marginTop = "15px";

                        const imagenes =
                            document.querySelector(
                                "#imagenes"
                            ) ||
                            document.querySelector(
                                ".imagenes"
                            ) ||
                            document.querySelector(
                                "#galeria"
                            ) ||
                            document.querySelector(
                                ".galeria"
                            );

                        if (imagenes) {

                            imagenes.parentNode.insertBefore(
                                salida,
                                imagenes.nextSibling
                            );

                        } else {

                            document.body.appendChild(
                                salida
                            );

                        }

                    }

                    salida.innerHTML =
                        "<strong>Cronología:</strong> " +
                        j3;


                    /*
                    ========================================
                    DEVOLVER J3
                    ========================================
                    */

                    return j3;

                }

            }

            console.warn(
                "CAB07: No encontrado:",
                j1
            );

            return null;

        }

        catch (error) {

            console.error(
                "CAB07:",
                error
            );

            return null;

        }

    }

};


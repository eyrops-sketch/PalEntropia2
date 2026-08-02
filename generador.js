/*
========================================================
GENERADOR PALENTROPÍA v2.0
Lector ZONA TEMP prueba

Carga:
- paleofichas.json
- paldb.js
- palstats.js

Genera:
- Datos biológicos
- Stats
- Recursos visuales
========================================================
*/


document.body.innerHTML = `

<h1>
Generador PalEntropía
</h1>

<label>
Código especie:
</label>

<input 
id="codigoInput"
value="001_01"
>

<button onclick="cargarEspecie()">
Cargar
</button>

<hr>

<div id="resultado"></div>

`;



async function cargarEspecie(){


let codigo = 
document
.getElementById("codigoInput")
.value
.trim();



try{


/*
========================================================
PALEOFICHAS JSON
========================================================
*/


let respuesta = 
await fetch("datos/paleofichas.json");


let paleofichas = 
await respuesta.json();



let ficha = 
paleofichas.find(
x => x.codigo === codigo
);



if(!ficha){

throw "No existe en paleofichas.json";

}



/*
========================================================
PALDB
========================================================
*/


let db = 
PALDB.find(
x => x.codigo === codigo
);



if(!db){

throw "No existe en PALDB";

}



/*
========================================================
PALSTATS
========================================================
*/


let stats =
PALSTATS[codigo];



if(!stats){

throw "No existe en PALSTATS";

}



/*
========================================================
ZONA TEMP
========================================================
*/


let zonaTemp = {


taxon:{

codigo:ficha.codigo,
nombre:ficha.nombre

},


tiempo:{

periodo:ficha.periodo

},


ecologia:{

medio:ficha.medio,
habitat:ficha.habitat_principal,
dieta:ficha.dieta

},


anatomia:
ficha.anatomia,


stats:stats,


recursos:db


};




/*
========================================================
IMAGENES
========================================================
*/


let rutaImagen =

"paleofichas/vol" +

db.volumen
.toString()
.padStart(3,"0")

+

"/"

+

db.carpeta

+

"/";





let html = `


<h2>
${ficha.nombre}
</h2>


<h3>
ZONA TEMP
</h3>


<pre>
${JSON.stringify(
zonaTemp,
null,
2
)}
</pre>



<h3>
Imágenes
</h3>


<div style="
display:flex;
gap:15px;
flex-wrap:wrap;
">

`;




for(let i=0;i<4;i++){


html += `


<div>

<img

src="${rutaImagen}${db.imagenes["i"+i]}"

width="180"

loading="lazy"

onerror="
this.outerHTML='<p>Error imagen ${i}</p>'
"

>

<p>
i${i}
</p>


</div>


`;

}



html += `

</div>



<h3>
PALDB
</h3>


<pre>
${JSON.stringify(
db,
null,
2
)}
</pre>



<h3>
PALSTATS
</h3>


<pre>
${JSON.stringify(
stats,
null,
2
)}
</pre>


`;



document
.getElementById("resultado")
.innerHTML =
html;



}



catch(error){


document
.getElementById("resultado")
.innerHTML =

`

<h2>
Error
</h2>

<p>
${error}
</p>

`;

}



}








const PALNAVEGADOR = {
version: "1.0 LTS",
registros: [],
filtroActivo: null,
indice: -1,
codigoActual: null,

async inicializar() {
if (!window.LEEPALJSON || typeof window.LEEPALJSON.cargar !== "function") {
throw new Error("PALNAVEGADOR: LEEPALJSON no está disponible.");
}

await window.LEEPALJSON.cargar();

const contenedor = window.LEEPALJSON.obtener();

if (!Array.isArray(contenedor) || !contenedor.length) {
  throw new Error("PALNAVEGADOR: no hay registros en master.csv.");
}

this.registros = contenedor.filter(
  registro => registro && registro.codigo
);

return this.registros;

},

normalizarCodigo(codigo) {
if (codigo === undefined || codigo === null) {
return "";
}

return String(codigo).trim().toUpperCase();

},

conjuntoActivo() {
return this.filtroActivo
? this.filtroActivo
: this.registros;
},

buscarIndice(codigo) {
const j1 = this.normalizarCodigo(codigo);
const conjunto = this.conjuntoActivo();

return conjunto.findIndex(
  registro =>
    this.normalizarCodigo(registro.codigo) === j1
);

},

async posicionar(codigo) {
const j1 = this.normalizarCodigo(codigo);

if (!j1) {
  throw new Error("PALNAVEGADOR: código vacío.");
}

const indice = this.buscarIndice(j1);

if (indice === -1) {
  return false;
}

this.indice = indice;
this.codigoActual = j1;

return true;

},

async cargarIndice(indice) {
const conjunto = this.conjuntoActivo();

if (!conjunto.length) {
  throw new Error("PALNAVEGADOR: el conjunto activo está vacío.");
}

if (indice < 0) {
  indice = 0;
}

if (indice >= conjunto.length) {
  indice = conjunto.length - 1;
}

const registro = conjunto[indice];

if (!registro || !registro.codigo) {
  throw new Error("PALNAVEGADOR: registro inválido.");
}

this.indice = indice;
this.codigoActual =
  this.normalizarCodigo(registro.codigo);

if (
  !window.CARGACONT ||
  typeof window.CARGACONT.cargar !== "function"
) {
  throw new Error("PALNAVEGADOR: CARGACONT no está disponible.");
}

return await window.CARGACONT.cargar(
  this.codigoActual
);

},

async primero() {
return await this.cargarIndice(0);
},

async anterior() {
const conjunto = this.conjuntoActivo();

if (!conjunto.length) {
  return null;
}

if (this.indice <= 0) {
  return await this.cargarIndice(0);
}

return await this.cargarIndice(
  this.indice - 1
);

},

async siguiente() {
const conjunto = this.conjuntoActivo();

if (!conjunto.length) {
  return null;
}

if (this.indice >= conjunto.length - 1) {
  return await this.cargarIndice(
    conjunto.length - 1
  );
}

return await this.cargarIndice(
  this.indice + 1
);

},

async ultimo() {
const conjunto = this.conjuntoActivo();

return await this.cargarIndice(
  conjunto.length - 1
);

},

async aleatorio() {
const conjunto = this.conjuntoActivo();

if (!conjunto.length) {
  throw new Error(
    "PALNAVEGADOR: no hay registros disponibles."
  );
}

const indice =
  Math.floor(
    Math.random() * conjunto.length
  );

return await this.cargarIndice(indice);

},

aplicarFiltro(registros) {
if (!Array.isArray(registros)) {
throw new Error(
"PALNAVEGADOR: el filtro debe ser un array."
);
}

this.filtroActivo = registros;

if (!this.filtroActivo.length) {
  this.indice = -1;
  return;
}

if (this.codigoActual) {
  const indice =
    this.filtroActivo.findIndex(
      registro =>
        this.normalizarCodigo(
          registro.codigo
        ) === this.codigoActual
    );

  if (indice !== -1) {
    this.indice = indice;
    return;
  }
}

this.indice = 0;

},

limpiarFiltro() {
const codigoActual =
this.codigoActual;

this.filtroActivo = null;

if (!codigoActual) {
  this.indice = -1;
  return;
}

const indice =
  this.buscarIndice(
    codigoActual
  );

this.indice = indice;

},

estaFiltrado() {
return Array.isArray(
this.filtroActivo
);
},

obtenerActual() {
const conjunto =
this.conjuntoActivo();

if (
  this.indice < 0 ||
  this.indice >= conjunto.length
) {
  return null;
}

return conjunto[this.indice];

},

estado() {
const conjunto =
this.conjuntoActivo();

return {
  version: this.version,
  total: conjunto.length,
  indice: this.indice,
  posicion:
    this.indice >= 0
      ? this.indice + 1
      : 0,
  codigo:
    this.codigoActual,
  filtrado:
    this.estaFiltrado()
};

}
};

window.PALNAVEGADOR =
PALNAVEGADOR;






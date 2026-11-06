"use strict";

let nodoIdCounter = 0;

class Nodo {
  constructor(valor) {
    this.id = ++nodoIdCounter;
    this.valor = valor;
    this.izquierda = null;
    this.derecha = null;
  }
}

class ArbolBinario {
  constructor() {
    this.raiz = null;
    this.tipoValores = null;
  }

  compararValores(a, b) {
    const valorA = this.normalizarParaComparacion(a);
    const valorB = this.normalizarParaComparacion(b);

    if (valorA === valorB) {
      return 0;
    }

    if (valorA < valorB) {
      return -1;
    }

    return 1;
  }

  normalizarParaComparacion(valor) {
    if (typeof valor === "number") {
      return valor;
    }

    if (typeof valor === "string") {
      return valor.trim().toLowerCase();
    }

    return String(valor).trim().toLowerCase();
  }

  insertar(valor) {
    const tipo = typeof valor === "number" ? "numero" : "letra";
    if (this.tipoValores && this.tipoValores !== tipo) {
      return {
        exito: false,
        mensaje: `Este árbol contiene ${this.tipoValores === "numero" ? "números" : "letras"}; no se pueden mezclar tipos.`
      };
    }

    const nuevoNodo = new Nodo(valor);

    if (!this.raiz) {
      this.raiz = nuevoNodo;
      this.tipoValores = tipo;
      return { exito: true, mensaje: `Se insertó ${this.formatearValor(valor)} como raíz.` };
    }

    let actual = this.raiz;
    let encontroIgual = false;

    while (actual) {
      const comparacion = this.compararValores(valor, actual.valor);

      if (comparacion <= 0) {
        if (comparacion === 0) {
          encontroIgual = true;
        }

        if (!actual.izquierda) {
          actual.izquierda = nuevoNodo;
          const detalle = encontroIgual ? " como repetido, a la izquierda del valor igual" : " en el lado izquierdo";
          return { exito: true, mensaje: `Se insertó ${this.formatearValor(valor)}${detalle}.` };
        }
        actual = actual.izquierda;
      } else {
        if (!actual.derecha) {
          actual.derecha = nuevoNodo;
          const detalle = encontroIgual ? " como repetido, dentro del lado izquierdo del valor igual" : " en el lado derecho";
          return { exito: true, mensaje: `Se insertó ${this.formatearValor(valor)}${detalle}.` };
        }
        actual = actual.derecha;
      }
    }

    return { exito: true, mensaje: `Se insertó ${this.formatearValor(valor)}.` };
  }

  buscar(valor) {
    const visitados = [];
    const camino = [];
    let actual = this.raiz;

    while (actual) {
      visitados.push(actual.valor);
      const comparacion = this.compararValores(valor, actual.valor);

      if (comparacion === 0) {
        camino.push({ nodo: actual, direccion: "encontrado" });
        return { encontrado: true, camino, visitados, nodo: actual };
      }

      if (comparacion < 0) {
        camino.push({ nodo: actual, direccion: "izquierda" });
        actual = actual.izquierda;
      } else {
        camino.push({ nodo: actual, direccion: "derecha" });
        actual = actual.derecha;
      }
    }

    return { encontrado: false, camino, visitados, nodo: null };
  }

  eliminar(valor) {
    const resultado = this._eliminarRecursivo(this.raiz, valor);
    this.raiz = resultado.raiz;
    return resultado;
  }

  _eliminarRecursivo(nodo, valor) {
    if (!nodo) {
      return { raiz: null, encontrado: false, mensaje: `El valor ${this.formatearValor(valor)} no existe.` };
    }

    const comparacion = this.compararValores(valor, nodo.valor);

    if (comparacion < 0) {
      const resultado = this._eliminarRecursivo(nodo.izquierda, valor);
      nodo.izquierda = resultado.raiz;
      return { raiz: nodo, encontrado: resultado.encontrado, mensaje: resultado.mensaje };
    }

    if (comparacion > 0) {
      const resultado = this._eliminarRecursivo(nodo.derecha, valor);
      nodo.derecha = resultado.raiz;
      return { raiz: nodo, encontrado: resultado.encontrado, mensaje: resultado.mensaje };
    }

    if (!nodo.izquierda && !nodo.derecha) {
      if (nodo === this.raiz) {
        this.tipoValores = null;
      }
      return { raiz: null, encontrado: true, mensaje: `Se eliminó ${this.formatearValor(valor)}. Era un nodo hoja.` };
    }

    if (!nodo.izquierda || !nodo.derecha) {
      const hijo = nodo.izquierda ? nodo.izquierda : nodo.derecha;
      if (nodo === this.raiz) {
        this.tipoValores = hijo ? (typeof hijo.valor === "number" ? "numero" : "letra") : null;
      }
      return { raiz: hijo, encontrado: true, mensaje: `Se eliminó ${this.formatearValor(valor)}. Tenía un solo hijo.` };
    }

    const sucesor = this._minimo(nodo.derecha);
    nodo.valor = sucesor.valor;
    const resultado = this._eliminarRecursivo(nodo.derecha, sucesor.valor);
    nodo.derecha = resultado.raiz;

    return {
      raiz: nodo,
      encontrado: true,
      mensaje: `Se eliminó ${this.formatearValor(valor)} usando el sucesor inorden ${this.formatearValor(sucesor.valor)}.`
    };
  }

  _minimo(nodo) {
    let actual = nodo;
    while (actual && actual.izquierda) {
      actual = actual.izquierda;
    }
    return actual;
  }

  preorden() {
    const salida = [];
    this._recorrerPreorden(this.raiz, salida);
    return salida;
  }

  _recorrerPreorden(nodo, salida) {
    if (!nodo) {
      return;
    }
    salida.push(nodo.valor);
    this._recorrerPreorden(nodo.izquierda, salida);
    this._recorrerPreorden(nodo.derecha, salida);
  }

  inorden() {
    const salida = [];
    this._recorrerInorden(this.raiz, salida);
    return salida;
  }

  _recorrerInorden(nodo, salida) {
    if (!nodo) {
      return;
    }
    this._recorrerInorden(nodo.izquierda, salida);
    salida.push(nodo.valor);
    this._recorrerInorden(nodo.derecha, salida);
  }

  postorden() {
    const salida = [];
    this._recorrerPostorden(this.raiz, salida);
    return salida;
  }

  _recorrerPostorden(nodo, salida) {
    if (!nodo) {
      return;
    }
    this._recorrerPostorden(nodo.izquierda, salida);
    this._recorrerPostorden(nodo.derecha, salida);
    salida.push(nodo.valor);
  }

  altura(nodo = this.raiz) {
    if (!nodo) {
      return -1;
    }

    return 1 + Math.max(this.altura(nodo.izquierda), this.altura(nodo.derecha));
  }

  analizarSubarboles() {
    const subarboles = [];

    const analizarNodo = (nodo, nivel, camino) => {
      if (!nodo) {
        return {
          cantidadNodos: 0,
          altura: -1,
          grado: 0,
          preorden: [],
          inorden: [],
          postorden: []
        };
      }

      const analisis = {
        nodo,
        nivel,
        camino,
        gradoRaiz: Number(Boolean(nodo.izquierda)) + Number(Boolean(nodo.derecha)),
        cantidadNodosDirectos: 1 + Number(Boolean(nodo.izquierda)) + Number(Boolean(nodo.derecha)),
        cantidadNodos: 0,
        altura: 0,
        grado: 0,
        preorden: [],
        inorden: [],
        postorden: []
      };
      subarboles.push(analisis);

      const izquierda = analizarNodo(nodo.izquierda, nivel + 1, [...camino, "izquierda"]);
      const derecha = analizarNodo(nodo.derecha, nivel + 1, [...camino, "derecha"]);

      analisis.cantidadNodos = 1 + izquierda.cantidadNodos + derecha.cantidadNodos;
      analisis.altura = 1 + Math.max(izquierda.altura, derecha.altura);
      analisis.grado = Math.max(analisis.gradoRaiz, izquierda.grado, derecha.grado);
      analisis.preorden = [nodo.valor, ...izquierda.preorden, ...derecha.preorden];
      analisis.inorden = [...izquierda.inorden, nodo.valor, ...derecha.inorden];
      analisis.postorden = [...izquierda.postorden, ...derecha.postorden, nodo.valor];

      return analisis;
    };

    analizarNodo(this.raiz, 0, []);
    return subarboles;
  }

  formatearValor(valor) {
    return String(valor);
  }

  rutaInsercion(valor) {
    const ruta = [];
    let actual = this.raiz;
    let padre = null;
    let duplicado = false;

    while (actual) {
      const comparacion = this.compararValores(valor, actual.valor);
      if (comparacion === 0) {
        duplicado = true;
      }
      const direccion = comparacion <= 0 ? "izquierda" : "derecha";
      ruta.push({ nodo: actual, comparacion, direccion });

      padre = actual;
      actual = direccion === "izquierda" ? actual.izquierda : actual.derecha;
    }

    const posicion = padre ? (this.compararValores(valor, padre.valor) <= 0 ? "izquierda" : "derecha") : "raiz";
    return { duplicado, ruta, padre, posicion };
  }
}

const appState = {
  tree: new ArbolBinario(),
  animationLock: false,
  quiz: null,
  activeConcept: "arbol-binario"
};

const conceptData = {
  "arbol-binario": {
    titulo: "Árbol binario",
    definicion: "Un árbol binario es una estructura jerárquica formada por nodos donde cada nodo tiene como máximo dos hijos: izquierdo y derecho.",
    significado: "Permite organizar datos y recorrerlos de manera ordenada, rápida y visualmente comprensible.",
    ejemplo: "Un árbol puede representar una colección de valores como 50, 20, 80, 10, 30, donde la raíz es 50 y cada rama divide el conjunto en subárboles.",
    colores: ["Raíz", "Hijos", "Hojas"]
  },
  nodo: {
    titulo: "Nodo",
    definicion: "Un nodo es cada elemento del árbol. Guarda un valor y referencias a sus hijos izquierdo y derecho.",
    significado: "Es la unidad básica que conecta la estructura del árbol.",
    ejemplo: "Cada círculo del árbol es un nodo y contiene un valor como 7 o A.",
    colores: ["Valor", "Hijo izquierdo", "Hijo derecho"]
  },
  "nodo-raiz": {
    titulo: "Nodo raíz",
    definicion: "Es el primer nodo del árbol y el punto de partida para todas las operaciones, como inserción, búsqueda y recorrido.",
    significado: "La raíz determina la estructura general del árbol.",
    ejemplo: "En un árbol con 50 como raíz, todos los demás nodos descienden desde ese valor.",
    colores: ["Raíz"]
  },
  padre: {
    titulo: "Nodo padre",
    definicion: "Un padre es un nodo que tiene uno o dos hijos conectados a él.",
    significado: "La relación padre-hijo organiza la jerarquía del árbol.",
    ejemplo: "Si 30 tiene a 20 y 40 como hijos, entonces 30 es el padre de ambos.",
    colores: ["Padre", "Hijos"]
  },
  hijo: {
    titulo: "Nodo hijo",
    definicion: "Es un nodo conectado directamente debajo de otro nodo, llamado padre.",
    significado: "Cada nodo de un árbol binario puede tener como máximo dos hijos: izquierdo y derecho.",
    ejemplo: "En la relación 50 → 20, el nodo 20 es hijo izquierdo de 50.",
    colores: ["Hijo izquierdo", "Hijo derecho"]
  },
  rama: {
    titulo: "Rama",
    definicion: "Es el camino de nodos y conexiones que va desde la raíz hacia una hoja.",
    significado: "Las ramas muestran las rutas que pueden seguirse dentro del árbol.",
    ejemplo: "En 50 → 20 → 10, esa secuencia forma una rama desde la raíz hasta la hoja 10.",
    colores: ["Raíz", "Hijos", "Hoja"]
  },
  "hijo-izquierdo": {
    titulo: "Hijo izquierdo",
    definicion: "Es el hijo que aparece a la izquierda de un nodo en el árbol binario.",
    significado: "En un árbol binario de búsqueda, todos los valores menores que la raíz suelen ir a la izquierda.",
    ejemplo: "Si la raíz es 25, entonces 10 puede ir en el hijo izquierdo.",
    colores: ["Izquierda"]
  },
  "hijo-derecho": {
    titulo: "Hijo derecho",
    definicion: "Es el hijo que aparece a la derecha de un nodo en el árbol binario.",
    significado: "En un árbol binario de búsqueda, los valores mayores se ubican a la derecha.",
    ejemplo: "Si la raíz es 25, entonces 30 puede ir en el hijo derecho.",
    colores: ["Derecha"]
  },
  hoja: {
    titulo: "Hoja",
    definicion: "Una hoja es un nodo que no tiene hijos.",
    significado: "Marca el final de una rama del árbol.",
    ejemplo: "Si 10 no tiene descendientes, es una hoja.",
    colores: ["Hoja"]
  },
  subarbol: {
    titulo: "Subárbol",
    definicion: "Un subárbol es cualquier parte del árbol que se toma como raíz de una estructura secundaria.",
    significado: "Permite resolver operaciones recursivas sobre una porción del árbol.",
    ejemplo: "El conjunto de nodos bajo 30 forma el subárbol izquierdo del nodo 50.",
    colores: ["Subárbol"]
  },
  altura: {
    titulo: "Altura",
    definicion: "La altura de un árbol es la cantidad de aristas en la ruta más larga desde su raíz hasta una hoja.",
    significado: "Se usa para analizar la profundidad y la forma del árbol. Una hoja tiene altura 0.",
    ejemplo: "Si 50 es la raíz y 20 y 80 son sus hijos, la altura del árbol es 1 arista.",
    colores: ["Altura"]
  },
  grado: {
    titulo: "Grado",
    definicion: "El grado de un nodo es la cantidad de hijos directos que tiene; en un árbol binario puede ser 0, 1 o 2.",
    significado: "El grado del árbol es el mayor grado entre sus nodos.",
    ejemplo: "Si 50 tiene como hijos a 20 y 80, el grado de 50 es 2. Si ningún nodo tiene más de un hijo, el grado del árbol es 1.",
    colores: ["Grado"]
  },
  orden: {
    titulo: "Orden",
    definicion: "El orden de un árbol indica el máximo número de hijos que puede tener cada nodo.",
    significado: "En un árbol binario el orden es 2: cada nodo puede tener hijo izquierdo, hijo derecho, ambos o ninguno.",
    ejemplo: "Un nodo con dos hijos alcanza el máximo permitido por el orden 2 de un árbol binario.",
    colores: ["Hijo izquierdo", "Hijo derecho"]
  },
  nivel: {
    titulo: "Nivel",
    definicion: "El nivel indica la profundidad de un nodo respecto de la raíz.",
    significado: "La raíz está en el nivel 0, sus hijos en el nivel 1 y así sucesivamente.",
    ejemplo: "Los nodos 20 y 80 están en el nivel 1 si son hijos de 50.",
    colores: ["Nivel 0", "Nivel 1", "Nivel 2"]
  },
  "arboles-distintos": {
    titulo: "Árboles binarios distintos",
    definicion: "Dos árboles binarios son distintos cuando su estructura o la disposición de sus nodos no es la misma.",
    significado: "Comparar su forma permite diferenciarlos aunque tengan la misma cantidad de nodos.",
    ejemplo: "Un árbol con raíz e hijo izquierdo y otro con raíz e hijo derecho tienen estructuras distintas.",
    colores: ["Estructura A", "Estructura B"]
  },
  "arboles-equivalentes": {
    titulo: "Árboles binarios equivalentes",
    definicion: "Dos árboles binarios son equivalentes cuando tienen la misma estructura, aunque los valores guardados puedan ser diferentes.",
    significado: "La equivalencia compara la forma y las relaciones padre-hijo, no los datos de cada nodo.",
    ejemplo: "Dos árboles con raíz y dos hijos en las mismas posiciones son equivalentes aunque sus valores sean distintos.",
    colores: ["Misma estructura"]
  },
  "arbol-completo": {
    titulo: "Árbol binario completo",
    definicion: "Es un árbol en el que todos los niveles, excepto quizá el último, están llenos; el último se ocupa de izquierda a derecha.",
    significado: "Esta forma mantiene los nodos lo más agrupados posible hacia la izquierda.",
    ejemplo: "Un árbol con todos sus niveles completos salvo el último, cuyos nodos comienzan por la izquierda, es completo.",
    colores: ["Niveles llenos", "Izquierda"]
  }
};

function formatValue(value) {
  return typeof value === "string" ? value : String(value);
}

function parseInputValue(rawText, tipoEsperado = null) {
  const text = String(rawText || "").trim();

  if (!text) {
    throw new Error("Debes ingresar un valor antes de continuar.");
  }

  if (/^-?\d+$/.test(text)) {
    const numero = Number(text);
    if (!Number.isSafeInteger(numero)) {
      throw new Error("El número es demasiado grande. Ingresa un entero válido.");
    }
    if (tipoEsperado === "letra") {
      throw new Error("Este árbol contiene letras. No se pueden mezclar letras y números.");
    }
    return numero;
  }

  if (/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]$/.test(text)) {
    if (tipoEsperado === "numero") {
      throw new Error("Este árbol contiene números. No se pueden mezclar números y letras.");
    }
    return text.toUpperCase();
  }

  throw new Error("Entrada inválida. Ingresa un número entero o una sola letra; no se aceptan decimales.");
}

function appendConsole(message, type = "info") {
  const consoleBox = document.getElementById("console");
  const line = document.createElement("div");
  line.className = `console-line ${type}`;
  line.textContent = message;
  consoleBox.appendChild(line);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function clearConsole() {
  const consoleBox = document.getElementById("console");
  consoleBox.innerHTML = "";
}

function obtenerColorNodo(valor, indice) {
  const palette = ["#c9d9b8", "#e7c99f", "#aec6c2", "#e2b9a8", "#c5bdd7", "#e4d99e"];
  const seed = typeof valor === "string" ? valor.charCodeAt(0) : Number(valor);
  return palette[Math.abs(seed + indice) % palette.length];
}

function renderTree(treeRoot, containerId = "tree-container") {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!treeRoot) {
    container.style.width = "100%";
    container.style.height = "430px";
    container.innerHTML = '<div class="empty-state">El árbol está vacío.</div>';
    return;
  }

  const nodes = [];
  let maxDepth = 0;
  const collect = (node, depth = 0) => {
    if (!node) return;
    nodes.push({ node, depth });
    maxDepth = Math.max(maxDepth, depth);
    collect(node.izquierda, depth + 1);
    collect(node.derecha, depth + 1);
  };
  collect(treeRoot);

  const nodeSpacing = 86;
  const width = Math.max(container.clientWidth || 600, nodes.length * nodeSpacing);
  const height = Math.max(430, 100 + maxDepth * 100);
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;

  const positions = new Map();
  let inorderIndex = 0;
  const assignInOrder = (node, depth) => {
    if (!node) return;
    assignInOrder(node.izquierda, depth + 1);
    positions.set(node.id, { x: 43 + inorderIndex * nodeSpacing, y: 55 + depth * 100 });
    inorderIndex += 1;
    assignInOrder(node.derecha, depth + 1);
  };
  assignInOrder(treeRoot, 0);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "tree-svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  container.appendChild(svg);

  const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(lineGroup);
  for (const entry of nodes) {
    const node = entry.node;
    if (node.izquierda) {
      const parentPos = positions.get(node.id);
      const childPos = positions.get(node.izquierda.id);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", parentPos.x);
      line.setAttribute("y1", parentPos.y);
      line.setAttribute("x2", childPos.x);
      line.setAttribute("y2", childPos.y);
      line.setAttribute("stroke", "rgba(201, 221, 242, 0.7)");
      line.setAttribute("stroke-width", "2");
      lineGroup.appendChild(line);
    }

    if (node.derecha) {
      const parentPos = positions.get(node.id);
      const childPos = positions.get(node.derecha.id);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", parentPos.x);
      line.setAttribute("y1", parentPos.y);
      line.setAttribute("x2", childPos.x);
      line.setAttribute("y2", childPos.y);
      line.setAttribute("stroke", "rgba(201, 221, 242, 0.7)");
      line.setAttribute("stroke-width", "2");
      lineGroup.appendChild(line);
    }
  }

  const nodeMap = new Map();
  for (const entry of nodes) {
    const node = entry.node;
    const pos = positions.get(node.id);
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";
    if (node === treeRoot) {
      nodeDiv.classList.add("root-node");
    }

    nodeDiv.style.left = `${pos.x}px`;
    nodeDiv.style.top = `${pos.y}px`;
    const color = obtenerColorNodo(node.valor, node.id);
    nodeDiv.style.background = color;
    nodeDiv.dataset.nodeId = String(node.id);
    nodeDiv.textContent = formatValue(node.valor);
    container.appendChild(nodeDiv);
    nodeMap.set(node.id, nodeDiv);
  }

  return { positions, nodeMap };
}

function ocultarAnalisisSubarboles() {
  const panel = document.getElementById("subtree-analysis");
  panel.hidden = true;
  panel.innerHTML = "";
}

function mostrarAnalisisSubarboles() {
  if (appState.animationLock) {
    appendConsole("Hay una operación en curso. Espera a que termine antes de analizar los subárboles.", "warning");
    return;
  }

  const panel = document.getElementById("subtree-analysis");
  const subarboles = appState.tree.analizarSubarboles();
  const subarbolesConRamas = subarboles.filter((analisis) => analisis.gradoRaiz > 0);
  panel.innerHTML = "";
  panel.hidden = false;

  const titulo = document.createElement("h3");
  titulo.textContent = "Análisis de subárboles";
  panel.appendChild(titulo);

  if (subarboles.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "Inserta valores para analizar los subárboles.";
    panel.appendChild(mensaje);
    return;
  }

  const analisisCompleto = subarboles[0];
  const tarjetaArbol = document.createElement("article");
  tarjetaArbol.className = "subtree-card";

  const tituloArbol = document.createElement("h4");
  tituloArbol.textContent = `Árbol completo · raíz ${formatValue(analisisCompleto.nodo.valor)}`;
  tarjetaArbol.appendChild(tituloArbol);

  const metricasArbol = document.createElement("ul");
  metricasArbol.className = "subtree-metrics";
  const datosArbol = [
    `Cantidad total de nodos: ${analisisCompleto.cantidadNodos}`,
    "Orden: 2",
    `Nivel de la raíz: ${analisisCompleto.nivel}`,
    `Altura: ${analisisCompleto.altura} ${analisisCompleto.altura === 1 ? "arista" : "aristas"}`,
    `Grado de la raíz: ${analisisCompleto.gradoRaiz}`,
    `Grado máximo del árbol: ${analisisCompleto.grado}`
  ];
  for (const dato of datosArbol) {
    const elemento = document.createElement("li");
    elemento.textContent = dato;
    metricasArbol.appendChild(elemento);
  }
  tarjetaArbol.appendChild(metricasArbol);

  const recorridosArbol = [
    ["Preorden", analisisCompleto.preorden],
    ["Inorden", analisisCompleto.inorden],
    ["Postorden", analisisCompleto.postorden]
  ];
  for (const [nombre, secuencia] of recorridosArbol) {
    const recorrido = document.createElement("p");
    recorrido.className = "subtree-traversal";
    recorrido.textContent = `${nombre}: ${secuencia.map(formatValue).join(" → ")}`;
    tarjetaArbol.appendChild(recorrido);
  }
  panel.appendChild(tarjetaArbol);

  if (subarbolesConRamas.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No hay subárboles con ramas para mostrar; las hojas se excluyen del análisis individual.";
    panel.appendChild(mensaje);
    return;
  }

  const lista = document.createElement("div");
  lista.className = "subtree-list";

  for (const analisis of subarbolesConRamas) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "subtree-card";

    const encabezado = document.createElement("h4");
    encabezado.textContent = `Subárbol con raíz ${formatValue(analisis.nodo.valor)}`;
    tarjeta.appendChild(encabezado);

    const ruta = document.createElement("p");
    const direcciones = analisis.camino.map((direccion) => direccion === "izquierda" ? "izquierda" : "derecha");
    ruta.className = "subtree-path";
    ruta.textContent = `Ruta: ${direcciones.length ? direcciones.join(" → ") : "raíz"} · Nivel ${analisis.nivel}`;
    tarjeta.appendChild(ruta);

    const metricas = document.createElement("ul");
    metricas.className = "subtree-metrics";
    const datosMetricas = [
      `Nodos (raíz e hijos directos): ${analisis.cantidadNodosDirectos}`,
      "Orden del árbol binario: 2",
      `Altura: ${analisis.altura} ${analisis.altura === 1 ? "arista" : "aristas"}`,
      `Grado de la raíz: ${analisis.gradoRaiz}`,
      `Grado máximo del subárbol: ${analisis.grado}`
    ];
    for (const dato of datosMetricas) {
      const elemento = document.createElement("li");
      elemento.textContent = dato;
      metricas.appendChild(elemento);
    }
    tarjeta.appendChild(metricas);

    const recorridos = [
      ["Preorden", analisis.preorden],
      ["Inorden", analisis.inorden],
      ["Postorden", analisis.postorden]
    ];
    for (const [nombre, secuencia] of recorridos) {
      const recorrido = document.createElement("p");
      recorrido.className = "subtree-traversal";
      recorrido.textContent = `${nombre}: ${secuencia.map(formatValue).join(" → ")}`;
      tarjeta.appendChild(recorrido);
    }

    lista.appendChild(tarjeta);
  }

  panel.appendChild(lista);
}

function highlightTreeNode(nodeId, extraClass = "visiting") {
  const container = document.getElementById("tree-container");
  if (!container) {
    return;
  }

  const target = container.querySelector(`[data-node-id="${nodeId}"]`);
  if (target) {
    target.classList.add(extraClass);
  }
}

function clearTreeHighlights() {
  const container = document.getElementById("tree-container");
  if (!container) {
    return;
  }

  container.querySelectorAll(".tree-node").forEach((node) => {
    node.classList.remove("visiting");
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function animarBusqueda(valorBuscado) {
  if (appState.animationLock) {
    appendConsole("Hay una operación en curso. Espera a que termine antes de continuar.", "warning");
    return;
  }

  appState.animationLock = true;
  clearTreeHighlights();

  try {
    const valor = parseInputValue(valorBuscado, appState.tree.tipoValores);
    const resultado = appState.tree.buscar(valor);
    appendConsole(`Inicia búsqueda de ${formatValue(valor)}.`, "info");

    for (const paso of resultado.camino) {
      highlightTreeNode(paso.nodo.id, "visiting");
      appendConsole(`Revisando nodo ${formatValue(paso.nodo.valor)}.`, "info");

      if (paso.direccion === "izquierda" || paso.direccion === "derecha") {
        appendConsole(`Dirección: ${paso.direccion}.`, "warning");
      } else {
        appendConsole(`Se encontró el valor ${formatValue(paso.nodo.valor)}.`, "success");
      }

      await sleep(650);
    }

    if (resultado.encontrado) {
      appendConsole(`Resultado: el valor ${formatValue(valor)} fue encontrado.`, "success");
    } else {
      appendConsole(`Resultado: ${formatValue(valor)} no existe en el árbol.`, "error");
    }
  } catch (error) {
    appendConsole(error.message, "error");
  } finally {
    clearTreeHighlights();
    appState.animationLock = false;
  }
}

async function animarInsercion(valor) {
  if (appState.animationLock) {
    appendConsole("Hay una operación en curso. Espera a que termine antes de continuar.", "warning");
    return;
  }

  appState.animationLock = true;
  clearTreeHighlights();

  try {
    const valorNormalizado = parseInputValue(valor, appState.tree.tipoValores);
    const ruta = appState.tree.rutaInsercion(valorNormalizado);

    appendConsole(`Inicia inserción de ${formatValue(valorNormalizado)}.`, "info");

    if (appState.tree.tipoValores && appState.tree.tipoValores !== (typeof valorNormalizado === "number" ? "numero" : "letra")) {
      throw new Error(`Este árbol contiene ${appState.tree.tipoValores === "numero" ? "números" : "letras"}; no se pueden mezclar tipos.`);
    }

    if (ruta.ruta.length === 0) {
      appendConsole(`El árbol está vacío. Se insertará como raíz.`, "info");
      appState.tree.insertar(valorNormalizado);
      ocultarAnalisisSubarboles();
      renderTree(appState.tree.raiz);
      appendConsole(`Inserción exitosa: ${formatValue(valorNormalizado)} es la raíz.`, "success");
      appState.animationLock = false;
      return;
    }

    for (let i = 0; i < ruta.ruta.length; i += 1) {
      const paso = ruta.ruta[i];
      highlightTreeNode(paso.nodo.id, "visiting");
      appendConsole(`Comparando ${formatValue(valorNormalizado)} con ${formatValue(paso.nodo.valor)}.`, "info");

      if (paso.comparacion === 0) {
        appendConsole(`El valor es igual; se continúa hacia la izquierda para colocar el repetido.`, "warning");
      } else if (paso.direccion === "izquierda") {
        appendConsole(`Se mueve hacia la izquierda.`, "warning");
      } else {
        appendConsole(`Se mueve hacia la derecha.`, "warning");
      }

      await sleep(650);
    }

    const validacion = appState.tree.insertar(valorNormalizado);
    if (validacion.exito) {
      ocultarAnalisisSubarboles();
    }
    renderTree(appState.tree.raiz);

    if (validacion.exito) {
      appendConsole(`${validacion.mensaje}`, "success");
      appendConsole(`La posición final es en el lado ${ruta.posicion === "raiz" ? "raíz" : ruta.posicion}.`, "success");
    } else {
      appendConsole(`${validacion.mensaje}`, "error");
    }
  } catch (error) {
    appendConsole(error.message, "error");
  } finally {
    clearTreeHighlights();
    appState.animationLock = false;
  }
}

async function animarEliminacion(valorEliminar) {
  if (appState.animationLock) {
    appendConsole("Hay una operación en curso. Espera a que termine antes de continuar.", "warning");
    return;
  }

  if (!appState.tree.raiz) {
    appendConsole("No hay nodos en el árbol para eliminar.", "error");
    return;
  }

  appState.animationLock = true;
  clearTreeHighlights();

  try {
    const valor = parseInputValue(valorEliminar, appState.tree.tipoValores);
    const busqueda = appState.tree.buscar(valor);

    if (!busqueda.encontrado) {
      appendConsole(`No se encontró ${formatValue(valor)}. No se altera el árbol.`, "error");
      appState.animationLock = false;
      return;
    }

    appendConsole(`Inicia eliminación de ${formatValue(valor)}.`, "info");

    for (let i = 0; i < busqueda.camino.length; i += 1) {
      const paso = busqueda.camino[i];
      highlightTreeNode(paso.nodo.id, "visiting");
      appendConsole(`Comparando con ${formatValue(paso.nodo.valor)}.`, "info");
      if (paso.direccion === "izquierda") {
        appendConsole(`Se desplaza a la izquierda.`, "warning");
      } else if (paso.direccion === "derecha") {
        appendConsole(`Se desplaza a la derecha.`, "warning");
      }
      await sleep(500);
    }

    const resultado = appState.tree.eliminar(valor);
    if (resultado.encontrado) {
      ocultarAnalisisSubarboles();
    }
    renderTree(appState.tree.raiz);
    appendConsole(resultado.mensaje, resultado.encontrado ? "success" : "error");
  } catch (error) {
    appendConsole(error.message, "error");
  } finally {
    clearTreeHighlights();
    appState.animationLock = false;
  }
}

async function ejecutarRecorrido(tipo) {
  if (appState.animationLock) {
    appendConsole("Hay una operación en curso. Espera a que termine antes de continuar.", "warning");
    return;
  }

  if (!appState.tree.raiz) {
    appendConsole("No se puede recorrer un árbol vacío.", "error");
    return;
  }

  appState.animationLock = true;
  clearTreeHighlights();

  const secuencia = tipo === "preorden" ? appState.tree.preorden() : tipo === "inorden" ? appState.tree.inorden() : appState.tree.postorden();
  const nombreRecorrido = tipo.toUpperCase();

  appendConsole(`Inicio recorrido ${nombreRecorrido}.`, "info");

  const stack = [];
  if (tipo === "preorden") {
    const walk = (nodo) => {
      if (!nodo) return;
      stack.push({ nodo, etapa: "visitar" });
      walk(nodo.izquierda);
      walk(nodo.derecha);
    };
    walk(appState.tree.raiz);
  } else if (tipo === "inorden") {
    const walk = (nodo) => {
      if (!nodo) return;
      walk(nodo.izquierda);
      stack.push({ nodo, etapa: "visitar" });
      walk(nodo.derecha);
    };
    walk(appState.tree.raiz);
  } else {
    const walk = (nodo) => {
      if (!nodo) return;
      walk(nodo.izquierda);
      walk(nodo.derecha);
      stack.push({ nodo, etapa: "visitar" });
    };
    walk(appState.tree.raiz);
  }

  for (let i = 0; i < stack.length; i += 1) {
    const paso = stack[i];
    highlightTreeNode(paso.nodo.id, "visiting");
    appendConsole(`Visita actual: ${formatValue(paso.nodo.valor)}.`, "info");
    await sleep(550);
  }

  appendConsole(`Secuencia ${nombreRecorrido}: ${secuencia.join(" -> ")}.`, "success");
  clearTreeHighlights();
  appState.animationLock = false;
}

function reiniciarSimulador() {
  appState.tree = new ArbolBinario();
  ocultarAnalisisSubarboles();
  renderTree(null, "tree-container");
  clearConsole();
  appendConsole("Simulador reiniciado. El árbol está vacío.", "info");
}

function limpiarArbol() {
  appState.tree = new ArbolBinario();
  ocultarAnalisisSubarboles();
  renderTree(null, "tree-container");
  appendConsole("El árbol fue limpiado completamente.", "info");
}

function cargarEjemplo() {
  const exampleValues = [50, 20, 70, 10, 30, 60, 80, 5, 15, 25, 35];
  appState.tree = new ArbolBinario();
  for (const valor of exampleValues) {
    appState.tree.insertar(valor);
  }
  ocultarAnalisisSubarboles();
  renderTree(appState.tree.raiz, "tree-container");
  appendConsole(`Se cargó un árbol de ejemplo con valores: ${exampleValues.join(", ")}.`, "success");
}

function renderConceptButtons() {
  const list = document.getElementById("concept-list");
  list.innerHTML = "";

  Object.entries(conceptData).forEach(([key, data]) => {
    const button = document.createElement("button");
    button.className = "concept-item" + (appState.activeConcept === key ? " active" : "");
    button.textContent = data.titulo;
    button.addEventListener("click", () => {
      appState.activeConcept = key;
      renderConceptButtons();
      renderConceptDetail();
    });
    list.appendChild(button);
  });
}

function renderConceptDetail() {
  const detail = document.getElementById("concept-detail");
  const data = conceptData[appState.activeConcept];

  detail.innerHTML = `
    <div class="concept-card">
      <h3>${data.titulo}</h3>
      <p><strong>Definición:</strong> ${data.definicion}</p>
      <p><strong>Función:</strong> ${data.significado}</p>
      <p><strong>Ejemplo:</strong> ${data.ejemplo}</p>
      <div class="example-box">
        <h4>Microanimación conceptual</h4>
        <div class="tree-legend">
          ${data.colores.map((color) => `<span class="legend-pill"><span class="legend-dot" style="background:${color.includes("Raíz") ? "#62d0ff" : color.includes("Hijo") || color.includes("Izquierda") ? "#7ef0c1" : color.includes("Derecha") ? "#ffa26b" : color.includes("Hoja") ? "#ffd166" : color.includes("Sub") ? "#b99cff" : color.includes("Nivel") ? "#ff7eb6" : "#62d0ff"};"></span>${color}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function prepareConceptSection() {
  renderConceptButtons();
  renderConceptDetail();
}

function generarPreguntaAleatoria(tipo) {
  const valoresBase = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 75, 90, 15, 45, 95, 5, 12, 68, 88, 22];
  const cantidad = 6 + Math.floor(Math.random() * 4);
  const mezcla = [...valoresBase].sort(() => Math.random() - 0.5).slice(0, cantidad);
  const arbol = new ArbolBinario();

  mezcla.forEach((valor) => arbol.insertar(valor));
  const secuencia = arbol[tipo]();
  return { categoria: "recorrido", tipo, arbol, secuencia };
}

function generarPreguntasConceptuales() {
  return [
    {
      categoria: "concepto",
      pregunta: "¿Cómo se llama el nodo conectado directamente debajo de otro nodo?",
      respuesta: "hijo",
      respuestasAceptadas: ["hijo", "nodo hijo"],
      explicacion: "Un hijo está conectado directamente con su nodo padre."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cómo se llama el nodo que tiene uno o más hijos?",
      respuesta: "padre",
      respuestasAceptadas: ["padre", "nodo padre"],
      explicacion: "El padre es el nodo del que descienden directamente uno o dos hijos."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cómo se llama el primer nodo del árbol, que no tiene padre?",
      respuesta: "raíz",
      respuestasAceptadas: ["raiz", "nodo raiz"],
      explicacion: "La raíz es el punto inicial del árbol y no tiene padre."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cómo se llama un nodo que no tiene hijos?",
      respuesta: "hoja",
      respuestasAceptadas: ["hoja", "nodo hoja"],
      explicacion: "Una hoja es un nodo sin hijos."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cómo se llama el camino de nodos desde la raíz hasta una hoja?",
      respuesta: "rama",
      respuestasAceptadas: ["rama", "una rama"],
      explicacion: "Una rama es una ruta que conecta la raíz con una hoja."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cuál es el orden de un árbol binario (máximo de hijos por nodo)?",
      respuesta: "2",
      respuestasAceptadas: ["2", "dos"],
      explicacion: "El orden es 2 porque cada nodo puede tener como máximo dos hijos."
    },
    {
      categoria: "concepto",
      pregunta: "Si el nodo 40 tiene dos hijos directos, ¿cuál es su grado?",
      respuesta: "2",
      respuestasAceptadas: ["2", "dos"],
      explicacion: "El grado de un nodo es la cantidad de hijos directos que tiene."
    },
    {
      categoria: "concepto",
      pregunta: "Si la raíz está en el nivel 0, ¿en qué nivel están sus hijos directos?",
      respuesta: "1",
      respuestasAceptadas: ["1", "nivel 1"],
      explicacion: "Los hijos directos de la raíz están en el nivel 1."
    },
    {
      categoria: "concepto",
      pregunta: "Si la ruta más larga desde la raíz hasta una hoja tiene 3 aristas, ¿cuál es la altura del árbol?",
      respuesta: "3",
      respuestasAceptadas: ["3", "3 aristas"],
      explicacion: "La altura cuenta las aristas de la ruta más larga desde la raíz hasta una hoja."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cómo se clasifican dos árboles cuya estructura o disposición de nodos es diferente?",
      respuesta: "distintos",
      respuestasAceptadas: ["distintos", "diferentes", "arboles distintos", "arboles binarios distintos"],
      explicacion: "Los árboles binarios distintos no tienen la misma estructura o disposición."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cómo se clasifican dos árboles con la misma estructura, aunque sus valores sean diferentes?",
      respuesta: "equivalentes",
      respuestasAceptadas: ["equivalentes", "arboles equivalentes", "arboles binarios equivalentes"],
      explicacion: "Los árboles equivalentes conservan la misma forma y relaciones entre nodos, aunque cambien los datos."
    },
    {
      categoria: "concepto",
      pregunta: "¿Cómo se llama el árbol donde todos los niveles salvo quizá el último están llenos y el último se ocupa de izquierda a derecha?",
      respuesta: "completo",
      respuestasAceptadas: ["completo", "arbol completo", "arbol binario completo"],
      explicacion: "En un árbol binario completo, el último nivel se llena de izquierda a derecha."
    }
  ];
}

function generarPreguntasCuestionario() {
  const preguntasRecorridos = ["preorden", "inorden", "postorden"].map(generarPreguntaAleatoria);
  const preguntas = [...preguntasRecorridos, ...generarPreguntasConceptuales()];

  for (let indice = preguntas.length - 1; indice > 0; indice -= 1) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));
    [preguntas[indice], preguntas[aleatorio]] = [preguntas[aleatorio], preguntas[indice]];
  }

  return preguntas;
}

function renderQuizTree(arbol) {
  const container = document.getElementById("quiz-tree-container");
  if (!container) return;

  container.innerHTML = "";

  if (!arbol || !arbol.raiz) {
    container.innerHTML = '<div class="empty-state">Genera una pregunta para mostrar el árbol.</div>';
    return;
  }

  const nodes = [];
  let maxDepth = 0;
  function walk(node, depth = 0) {
    if (!node) return;
    nodes.push({ node, depth });
    maxDepth = Math.max(maxDepth, depth);
    walk(node.izquierda, depth + 1);
    walk(node.derecha, depth + 1);
  }
  walk(arbol.raiz);

  const nodeSpacing = 76;
  const canvasWidth = Math.max(container.clientWidth || 500, nodes.length * nodeSpacing + 20);
  const canvasHeight = Math.max(270, 90 + maxDepth * 78);
  const canvas = document.createElement("div");
  canvas.className = "quiz-tree-canvas";
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  container.appendChild(canvas);

  const positions = new Map();
  let inorderIndex = 0;
  function assignInOrder(node, depth) {
    if (!node) return;
    assignInOrder(node.izquierda, depth + 1);
    positions.set(node.id, {
      x: 38 + inorderIndex * nodeSpacing,
      y: 45 + depth * 78
    });
    inorderIndex += 1;
    assignInOrder(node.derecha, depth + 1);
  }
  assignInOrder(arbol.raiz, 0);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "tree-svg");
  svg.setAttribute("width", String(canvasWidth));
  svg.setAttribute("height", String(canvasHeight));
  canvas.appendChild(svg);

  const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(lineGroup);

  for (const entry of nodes) {
    const node = entry.node;
    if (node.izquierda) {
      const parentPos = positions.get(node.id);
      const childPos = positions.get(node.izquierda.id);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", parentPos.x);
      line.setAttribute("y1", parentPos.y + 31);
      line.setAttribute("x2", childPos.x);
      line.setAttribute("y2", childPos.y - 31);
      line.setAttribute("stroke", "rgba(201, 221, 242, 0.7)");
      line.setAttribute("stroke-width", "2");
      lineGroup.appendChild(line);
    }
    if (node.derecha) {
      const parentPos = positions.get(node.id);
      const childPos = positions.get(node.derecha.id);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", parentPos.x);
      line.setAttribute("y1", parentPos.y + 31);
      line.setAttribute("x2", childPos.x);
      line.setAttribute("y2", childPos.y - 31);
      line.setAttribute("stroke", "rgba(201, 221, 242, 0.7)");
      line.setAttribute("stroke-width", "2");
      lineGroup.appendChild(line);
    }
  }

  for (const entry of nodes) {
    const node = entry.node;
    const pos = positions.get(node.id);
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";
    if (node === arbol.raiz) {
      nodeDiv.classList.add("root-node");
    }
    nodeDiv.style.left = `${pos.x}px`;
    nodeDiv.style.top = `${pos.y}px`;
    nodeDiv.style.background = obtenerColorNodo(node.valor, node.id);
    nodeDiv.textContent = formatValue(node.valor);
    canvas.appendChild(nodeDiv);
  }
}

function iniciarCuestionario() {
  const preguntas = generarPreguntasCuestionario();
  appState.quiz = {
    preguntas,
    indice: 0,
    correctas: 0,
    incorrectas: 0,
    completado: false
  };

  document.getElementById("quiz-title").textContent = `Pregunta 1 de ${preguntas.length}`;
  document.getElementById("quiz-answer").value = "";
  document.getElementById("score-correct").textContent = "0";
  document.getElementById("score-incorrect").textContent = "0";
  document.getElementById("score-total").textContent = "0%";
  document.getElementById("score-summary").textContent = "Aún no has terminado el cuestionario.";
  document.getElementById("quiz-feedback").textContent = "El árbol está listo. Escribe la secuencia del recorrido o responde la pregunta de conceptos.";
  mostrarPreguntaActual();
}

function mostrarPreguntaActual() {
  if (!appState.quiz || appState.quiz.indice >= appState.quiz.preguntas.length) {
    finalizarCuestionario();
    return;
  }

  const pregunta = appState.quiz.preguntas[appState.quiz.indice];
  const indicePregunta = appState.quiz.indice + 1;
  const cantidadPreguntas = appState.quiz.preguntas.length;
  const respuestaLabel = document.getElementById("quiz-answer-label");

  if (pregunta.categoria === "recorrido") {
    const recorridoLabel = pregunta.tipo.charAt(0).toUpperCase() + pregunta.tipo.slice(1);
    document.getElementById("quiz-title").textContent = `Pregunta ${indicePregunta} de ${cantidadPreguntas} — Recorrido ${recorridoLabel}`;
    renderQuizTree(pregunta.arbol);
    respuestaLabel.textContent = "Escribe la secuencia correcta";
    document.getElementById("quiz-answer").placeholder = "Ej. 10 5 2 8 15";
    document.getElementById("quiz-feedback").textContent = "El árbol está listo. Escribe la secuencia del recorrido indicado.";
  } else {
    document.getElementById("quiz-title").textContent = `Pregunta ${indicePregunta} de ${cantidadPreguntas} — Concepto`;
    const container = document.getElementById("quiz-tree-container");
    container.innerHTML = "";
    const enunciado = document.createElement("div");
    enunciado.className = "empty-state";
    enunciado.textContent = pregunta.pregunta;
    container.appendChild(enunciado);
    respuestaLabel.textContent = "Escribe la respuesta correcta";
    document.getElementById("quiz-answer").placeholder = "Escribe tu respuesta";
    document.getElementById("quiz-feedback").textContent = "Escribe tu respuesta en el campo.";
  }
  document.getElementById("quiz-answer").focus();
}

function normalizarSecuenciaRespuesta(valor) {
  if (!valor) {
    return [];
  }

  return valor
    .replace(/,/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((item) => String(item).trim().toUpperCase());
}

function normalizarRespuestaConceptual(valor) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[¿?.,:;]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function evaluarRespuestaActual() {
  if (!appState.quiz) {
    document.getElementById("quiz-feedback").textContent = "Primero inicia el cuestionario.";
    return;
  }

  const respuesta = document.getElementById("quiz-answer").value.trim();
  if (!respuesta) {
    document.getElementById("quiz-feedback").textContent = "La respuesta no puede estar vacía.";
    return;
  }

  const pregunta = appState.quiz.preguntas[appState.quiz.indice];
  document.getElementById("quiz-answer").value = "";

  let correcta;
  let retroalimentacion;
  if (pregunta.categoria === "recorrido") {
    const respuestaNormalizada = normalizarSecuenciaRespuesta(respuesta);
    const esperada = pregunta.secuencia.map((valor) => String(valor).toUpperCase());
    correcta = JSON.stringify(respuestaNormalizada) === JSON.stringify(esperada);
    retroalimentacion = correcta
      ? `¡Correcto! El recorrido ${pregunta.tipo} es ${esperada.join(" ")}.`
      : `Incorrecto. La secuencia correcta era: ${esperada.join(" ")}.`;
  } else {
    const respuestaNormalizada = normalizarRespuestaConceptual(respuesta);
    correcta = pregunta.respuestasAceptadas.some(
      (respuestaAceptada) => normalizarRespuestaConceptual(respuestaAceptada) === respuestaNormalizada
    );
    retroalimentacion = correcta
      ? `¡Correcto! ${pregunta.explicacion}`
      : `Incorrecto. ${pregunta.explicacion} Respuesta: ${pregunta.respuesta}.`;
  }

  if (correcta) {
    appState.quiz.correctas += 1;
    document.getElementById("quiz-feedback").textContent = retroalimentacion;
  } else {
    appState.quiz.incorrectas += 1;
    document.getElementById("quiz-feedback").textContent = retroalimentacion;
  }

  appState.quiz.indice += 1;
  document.getElementById("score-correct").textContent = String(appState.quiz.correctas);
  document.getElementById("score-incorrect").textContent = String(appState.quiz.incorrectas);

  setTimeout(() => {
    if (appState.quiz.indice < appState.quiz.preguntas.length) {
      mostrarPreguntaActual();
    } else {
      finalizarCuestionario();
    }
  }, 1000);
}

function finalizarCuestionario() {
  if (!appState.quiz) {
    return;
  }

  const total = appState.quiz.preguntas.length;
  const porcentaje = Math.round((appState.quiz.correctas / total) * 100);
  document.getElementById("score-total").textContent = `${porcentaje}%`;

  const resultText = `Correctas: ${appState.quiz.correctas} | Incorrectas: ${appState.quiz.incorrectas} | Calificación final: ${porcentaje}%`;
  document.getElementById("score-summary").textContent = resultText;

  if (porcentaje >= 80) {
    document.getElementById("score-summary").textContent += " ¡Excelente! Dominas los recorridos del árbol binario.";
  } else if (porcentaje >= 60) {
    document.getElementById("score-summary").textContent += " Muy bien, pero puedes reforzar algunos conceptos.";
  } else if (porcentaje >= 40) {
    document.getElementById("score-summary").textContent += " Estás en camino. Repasa la teoría y vuelve a intentarlo.";
  } else {
    document.getElementById("score-summary").textContent += " Necesitas estudiar más el tema y practicar con recorridos.";
  }

  appState.quiz.completado = true;
  document.getElementById("quiz-title").textContent = "Cuestionario finalizado";
  document.getElementById("quiz-answer").value = "";
  document.getElementById("quiz-feedback").textContent = "El cuestionario ha terminado. Puedes intentarlo otra vez desde el botón de reinicio.";
}

function reiniciarCuestionario() {
  appState.quiz = null;
  document.getElementById("quiz-title").textContent = "Cuestionario listo";
  document.getElementById("quiz-feedback").textContent = "Se ha reiniciado el recorrido del quiz.";
  document.getElementById("quiz-answer").value = "";
  document.getElementById("score-correct").textContent = "0";
  document.getElementById("score-incorrect").textContent = "0";
  document.getElementById("score-total").textContent = "0%";
  document.getElementById("score-summary").textContent = "Aún no has comenzado.";
  const container = document.getElementById("quiz-tree-container");
  container.innerHTML = "";
}

function setActiveSection(targetId) {
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active-panel"));
  document.querySelectorAll(".nav-btn").forEach((button) => button.classList.remove("active"));

  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add("active-panel");
  }

  const selectedButton = document.querySelector(`[data-target="${targetId}"]`);
  if (selectedButton) {
    selectedButton.classList.add("active");
  }
}

function setupEvents() {
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => setActiveSection(button.dataset.target));
  });

  document.getElementById("insert-btn").addEventListener("click", () => {
    const input = document.getElementById("valor-input");
    const valor = input.value;
    animarInsercion(valor);
    if (valor.trim()) input.value = "";
  });

  document.getElementById("delete-btn").addEventListener("click", () => {
    const input = document.getElementById("valor-input");
    const valor = input.value;
    animarEliminacion(valor);
    if (valor.trim()) input.value = "";
  });

  document.getElementById("search-btn").addEventListener("click", () => {
    const input = document.getElementById("valor-input");
    const valor = input.value;
    animarBusqueda(valor);
    if (valor.trim()) input.value = "";
  });

  document.getElementById("preorder-btn").addEventListener("click", () => ejecutarRecorrido("preorden"));
  document.getElementById("inorder-btn").addEventListener("click", () => ejecutarRecorrido("inorden"));
  document.getElementById("postorder-btn").addEventListener("click", () => ejecutarRecorrido("postorden"));

  document.getElementById("clear-tree-btn").addEventListener("click", limpiarArbol);
  document.getElementById("reset-simulator-btn").addEventListener("click", reiniciarSimulador);
  document.getElementById("load-example-btn").addEventListener("click", cargarEjemplo);
  document.getElementById("analyze-subtrees-btn").addEventListener("click", mostrarAnalisisSubarboles);
  document.getElementById("clear-console-btn").addEventListener("click", clearConsole);

  document.getElementById("start-quiz-btn").addEventListener("click", iniciarCuestionario);
  document.getElementById("submit-answer-btn").addEventListener("click", evaluarRespuestaActual);
  document.getElementById("restart-quiz-btn").addEventListener("click", reiniciarCuestionario);

  document.getElementById("valor-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const insertButton = document.getElementById("insert-btn");
      insertButton.click();
    }
  });

  document.getElementById("quiz-answer").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      evaluarRespuestaActual();
    }
  });
}

function initializeApplication() {
  clearConsole();
  appendConsole("Sistema listo. El árbol está vacío y preparado para usar.", "info");
  renderTree(null, "tree-container");
  prepareConceptSection();
  reiniciarCuestionario();
  setupEvents();
}

document.addEventListener("DOMContentLoaded", initializeApplication);

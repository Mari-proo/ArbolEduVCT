# Manual de usuario e instalación – ArbolEduCYM

## 1. Nombre y objetivo

**ArbolEduCYM** es una aplicación educativa interactiva desarrollada para aprender árboles binarios. Su propósito es enseñar visualmente cómo se insertan, eliminan, buscan y recorren los nodos de un árbol binario, además de ofrecer una sección teórica y un cuestionario de evaluación.

## 2. Requisitos del sistema

- Navegador web moderno (Chrome, Edge, Firefox o Safari).
- Sistema operativo compatible con cualquier navegador actual.
- No requiere instalación de paquetes ni bibliotecas externas.

## 3. Archivos del proyecto

La carpeta `ArbolEduVCT` contiene lo siguiente:

- `index.html`: estructura general de la interfaz.
- `styles.css`: diseño visual, responsividad y animaciones.
- `script.js`: lógica del árbol binario, recorridos, validaciones y cuestionario.
- `README.md`: descripción breve y ejecución rápida.
- `MANUAL_USUARIO_INSTALACION.md`: guía completa de uso e instalación.

## 4. Instalación y preparación

1. Descarga o descomprime la carpeta `ArbolEduVCT`.
2. Verifica que todos los archivos estén dentro de la misma carpeta.
3. No se requieren comandos ni dependencias adicionales.

## 5. Ejecución de la aplicación

1. Abre el archivo `index.html` con tu navegador.
2. La interfaz principal muestra los tres módulos:
   - Simulador visual.
   - Bloque teórico.
   - Evaluador de competencias.
3. La aplicación funciona completamente en el navegador sin depender de un servidor externo.

## 6. Uso del simulador

### Inserción

1. Escribe un valor en el campo principal.
2. Acepta enteros (positivos o negativos) o una sola letra. No se aceptan números decimales.
3. Pulsa **Insertar**.
4. La aplicación compara paso a paso el valor con los nodos existentes y muestra la dirección de movimiento hacia izquierda o derecha.
5. Se permiten valores repetidos. Cuando un valor es igual al nodo comparado, la inserción continúa hacia la izquierda.

### Eliminación

1. Escribe el valor a eliminar.
2. Pulsa **Eliminar**.
3. La aplicación busca el nodo y ejecuta la eliminación real siguiendo los casos:
   - Nodo hoja.
   - Nodo con un hijo.
   - Nodo con dos hijos usando sucesor inorden.
4. Si el valor no existe, el árbol se conserva sin cambios.

### Búsqueda

1. Escribe un valor en el campo.
2. Pulsa **Buscar**.
3. La aplicación recorre el árbol desde la raíz, resalta los nodos revisados y muestra la ruta.
4. El sistema informa si el valor fue encontrado o no.

### Recorridos recursivos

Los recorridos se ejecutan con algoritmos recursivos reales:

- **Preorden**: raíz, izquierdo, derecho.
- **Inorden**: izquierdo, raíz, derecho.
- **Postorden**: izquierdo, derecho, raíz.

Al pulsar cualquiera de los botones, la interfaz:

- resalta los nodos visitados,
- muestra la secuencia real,
- imprime la salida en la consola integrada.

### Análisis de subárboles

1. Pulsa **Analizar subárboles** después de construir el árbol.
2. Se muestra una ficha con los datos del árbol completo —cantidad total de nodos, orden, nivel y grado de la raíz, grado máximo, altura y recorridos— y otra ficha por cada nodo que tiene al menos un hijo, considerado como raíz de un subárbol.
3. Cada ficha de subárbol cuenta solo la raíz y sus hijos directos (de 1 a 3 nodos). También muestra los recorridos preorden, inorden y postorden, la altura completa del subárbol, el grado de su raíz, el grado máximo del subárbol y el nivel de esa raíz en el árbol completo.
4. Los recorridos y las medidas de altura y grado abarcan todas las ramas del subárbol; el conteo de nodos de la ficha solo incluye la raíz y sus hijos directos. Las hojas no se muestran como subárboles individuales. Si el árbol solo tiene una raíz-hoja, se muestra un aviso sin fichas de subárbol.
5. El resumen del árbol completo sí cuenta todos sus nodos. La altura cuenta aristas desde la raíz del subárbol hasta su hoja más lejana; una hoja tiene altura 0. El nivel de la raíz del árbol es 0. El grado de un nodo es la cantidad de hijos que tiene, y el grado del subárbol es el grado máximo entre sus nodos.
6. Si el árbol cambia, el resultado anterior se oculta; vuelve a pulsar el botón para analizar su estructura actual.

## 7. Módulo teórico

La sección teórica presenta un glosario con conceptos fundamentales:

- Árbol binario
- Nodo
- Nodo raíz
- Nodo padre
- Nodo hijo
- Hijo izquierdo
- Hijo derecho
- Hoja
- Rama
- Subárbol
- Orden
- Altura
- Grado
- Nivel
- Árboles binarios distintos
- Árboles binarios equivalentes
- Árbol binario completo

Cada concepto incluye:

- nombre,
- definición,
- función,
- ejemplo breve.

### Regla de comparación

- Los números enteros se ordenan numéricamente.
- Las letras se ordenan alfabéticamente, sin distinguir entre mayúsculas y minúsculas.
- Un árbol solo puede contener números enteros o letras, no ambos tipos. El tipo se establece al insertar el primer valor; si se elimina el último nodo, puede elegirse un tipo nuevo.
- Se permiten valores repetidos y se insertan hacia la izquierda al encontrar un valor igual. La búsqueda devuelve el primer nodo igual que encuentra y cada eliminación quita una sola aparición.
- La estructura del árbol se construye con nodos enlazados; las rutas, recorridos y preguntas también se guardan en listas enlazadas, sin arreglos.

La visualización del simulador permite desplazarse horizontal y verticalmente cuando el árbol excede el espacio visible, para poder consultar todos sus nodos.

## 8. Evaluador de competencias (Quiz)

La sección de evaluación genera un cuestionario de 15 preguntas por intento. Incluye preguntas de conceptos y recorridos:

- pregunta sobre nodo raíz, padre, hijo, hoja, rama, orden, grado, nivel y altura,
- repasa árboles binarios distintos, equivalentes y completos,
- genera árboles para practicar preorden, inorden y postorden,
- pide escribir una respuesta breve y la valida sin distinguir mayúsculas ni acentos,
- calcula la calificación final.

El árbol de cada pregunta se acomoda según su estructura. Si excede el ancho disponible, se puede desplazar horizontalmente; si es alto, la página se extiende para mostrar todos sus niveles.

### Calificación

La puntuación se calcula sobre 100 de acuerdo con el porcentaje de respuestas correctas.

La aplicación finaliza con:

- número de respuestas correctas,
- número de respuestas incorrectas,
- calificación final,
- retroalimentación según el resultado,
- opción para reiniciar el cuestionario.

## 9. Controles adicionales

La interfaz incluye botones para:

- limpiar el árbol,
- reiniciar el simulador,
- cargar un árbol de ejemplo,
- limpiar la consola.

## 10. Solución de problemas comunes

### El árbol no muestra nodos

Verifica que hayas insertado valores válidos. Usa un número o un solo carácter.

### La operación parece no ejecutarse

Comprueba que no haya otra operación en curso. La aplicación impide ejecuciones simultáneas para mantener el orden de las animaciones.

### El valor no aparece al buscarlo

La búsqueda se realiza desde la raíz y sigue la ruta real del algoritmo. Si el valor no existe, la aplicación lo indica correctamente.

### El cuestionario no inicia

Pulsa el botón **Iniciar cuestionario** y luego escribe la secuencia según el recorrido indicado.

## 11. Conclusión

ArbolEduCYM es una aplicación escolar completa que combina simulación visual, teoría y evaluación, ejecutándose localmente en un navegador moderno sin depender de servicios externos.

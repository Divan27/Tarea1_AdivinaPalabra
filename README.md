# 🎮 Batalla de Palabra — Tarea 1

## Lenguajes de Programación

**Estudiante:** Dilan Zamora Sánchez  
**Curso:** Lenguajes de Programación  
**Tarea:** Tarea 1 — Adivina Palabra  
**Tecnologías:** Node.js, Express.js y React  
**Tipo de aplicación:** Aplicación Web Backend-Frontend

---

# 📌 Portada

## Batalla de Palabra

Aplicación web desarrollada como parte de la **Tarea 1 del curso Lenguajes de Programación**.

El proyecto consiste en un juego de dos jugadores denominado **"Batalla de Palabra"**, donde ambos participantes compiten intentando adivinar palabras secretas en el menor número de intentos posible.

La aplicación está desarrollada utilizando una arquitectura **Backend-Frontend**, empleando:

- ⚛️ React para el Frontend.
- 🟢 Node.js para el entorno de ejecución del Backend.
- 🚀 Express.js para la creación de la API y manejo de las solicitudes.
- 🌐 Comunicación entre Frontend y Backend mediante peticiones HTTP.

### 👨‍💻 Información del estudiante

| Información | Detalle |
|---|---|
| Estudiante | Dilan Zamora Sánchez |
| Curso | Lenguajes de Programación |
| Proyecto | Tarea 1 — Adivina Palabra |
| Aplicación | Batalla de Palabra |
| Arquitectura | Backend + Frontend |
| Backend | Node.js + Express |
| Frontend | React |

---

# 📖 Descripción del problema

El proyecto consiste en desarrollar una aplicación web que permita realizar partidas de **Batalla de Palabra entre dos jugadores**.

Cada jugador debe intentar descubrir una palabra secreta utilizando la menor cantidad de intentos posible. Durante cada ronda, un jugador asume el papel de adivinador mientras que el otro jugador observa. Posteriormente, los roles se intercambian.

La partida está compuesta por **6 rondas en total**, correspondiendo 3 rondas a cada jugador.

El sistema debe controlar los intentos realizados, proporcionar pistas sobre los caracteres de la palabra, registrar el tiempo utilizado y determinar automáticamente al ganador de la partida.

El ganador será el jugador que consiga adivinar sus palabras utilizando la menor cantidad total de intentos. En caso de empate en la cantidad de intentos, se utilizará como segundo criterio el menor tiempo total utilizado.

Además, la aplicación debe mantener un **historial de resultados**, permitiendo consultar las partidas realizadas y sus respectivos resultados.

---

# 🎯 Objetivos del proyecto

## Objetivo general

Desarrollar una aplicación web Backend-Frontend que permita gestionar partidas de dos jugadores en un juego de adivinanza de palabras, registrando intentos, tiempos, resultados y determinando automáticamente al ganador.

## Objetivos específicos

- Permitir registrar los nombres de dos jugadores.
- Seleccionar aleatoriamente el orden de los jugadores.
- Crear partidas de seis rondas.
- Permitir tres rondas para cada jugador.
- Generar palabras secretas con una longitud entre 4 y 8 caracteres.
- Permitir al jugador realizar intentos para descubrir la palabra.
- Mostrar pistas después de cada intento.
- Registrar la cantidad de intentos realizados.
- Registrar el tiempo utilizado por cada jugador.
- Determinar automáticamente el ganador.
- Resolver empates mediante el tiempo total utilizado.
- Mostrar un resumen al finalizar la partida.
- Mantener un historial de las partidas realizadas.
- Separar correctamente la lógica del Backend y la interfaz del Frontend.

---

# ⚙️ Requerimientos funcionales

## a) Jugar partida de Batalla de Palabra

### I. Inicio de partida

El sistema permite iniciar una partida solicitando los nombres de los dos jugadores.

La partida está compuesta por:

- 2 jugadores.
- 3 rondas por jugador.
- 6 rondas en total.

---

### II. Selección de jugadores

Al iniciar una partida, el sistema determina aleatoriamente quién será el jugador 1 y quién será el jugador 2.

El jugador seleccionado como **Jugador 1 inicia la partida**.

---

### III. Funcionamiento de las rondas

Cada ronda consiste en que uno de los jugadores intenta adivinar una palabra secreta.

Mientras un jugador intenta descubrir la palabra, el otro jugador observa.

Una vez finalizada la ronda, los jugadores intercambian roles.

El proceso continúa hasta completar las 6 rondas de la partida.

---

### IV. Longitud de la palabra

Las palabras utilizadas durante la partida tienen una longitud de:

**4 a 8 caracteres.**

El sistema informa al jugador la cantidad de caracteres que posee la palabra que debe adivinar.

---

### V. Sistema de pistas

Después de cada intento, el sistema proporciona información al jugador para ayudarlo a descubrir la palabra.

Las pistas permiten identificar caracteres que se encuentran en la posición correcta.

Por ejemplo:

> "El carácter de la 5° posición es correcto."

De esta forma, el jugador puede utilizar la información obtenida para mejorar sus siguientes intentos.

---

### VI. Interfaz de usuario

La aplicación cuenta con una interfaz web desarrollada utilizando **React**.

La interfaz permite:

- Registrar jugadores.
- Iniciar partidas.
- Visualizar la ronda actual.
- Introducir intentos.
- Mostrar pistas.
- Mostrar cantidad de intentos.
- Mostrar información del tiempo.
- Visualizar el resultado de la partida.
- Consultar el historial de partidas.

---

### VII. Finalización de la partida

La aplicación determina automáticamente cuándo se han completado las 6 rondas.

Al finalizar la partida, el sistema calcula el resultado utilizando los siguientes criterios:

1. Menor cantidad total de intentos.
2. En caso de empate, menor tiempo total utilizado.

El sistema muestra un resumen de la partida con:

- Nombre de los jugadores.
- Intentos realizados por cada ronda.
- Tiempo utilizado por cada participante.
- Resultado.
- Ganador o empate.

---

# 🏆 Criterios para determinar al ganador

El ganador se determina mediante la cantidad total de intentos utilizados durante sus tres rondas.

### Primer criterio

Gana el jugador que tenga **menor cantidad total de intentos**.

### Segundo criterio

Si ambos jugadores tienen la misma cantidad de intentos, se compara el **tiempo total utilizado**.

El jugador con menor tiempo será declarado ganador.

### Empate

Si ambos jugadores tienen:

- La misma cantidad total de intentos.
- El mismo tiempo total.

La partida se declara como **empate**.

---

# 📊 Historial de resultados

La aplicación cuenta con una sección destinada al historial de partidas.

En esta sección se pueden consultar los resultados de las partidas realizadas.

El historial muestra información como:

| Información | Descripción |
|---|---|
| Jugadores | Nombres de los participantes |
| Intentos | Cantidad de intentos realizados |
| Tiempo | Tiempo acumulado de cada jugador |
| Resultado | Resultado final de la partida |
| Ganador | Jugador ganador, si existe |

Esto permite consultar los resultados obtenidos en partidas anteriores.

---

# 🏗️ Arquitectura del proyecto

El proyecto utiliza una arquitectura separada en **Frontend y Backend**.

```text
                 ┌──────────────────────┐
                 │       USUARIO        │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │       FRONTEND       │
                 │        React         │
                 └──────────┬───────────┘
                            │
                       HTTP / API
                            │
                            ▼
                 ┌──────────────────────┐
                 │       BACKEND        │
                 │    Node.js + Express │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Lógica del juego     │
                 │ Partidas             │
                 │ Rondas               │
                 │ Intentos             │
                 │ Tiempos              │
                 │ Resultados           │
                 └──────────────────────┘

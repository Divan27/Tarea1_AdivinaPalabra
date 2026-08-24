const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const archivoPartidas = path.join(
    __dirname,
    "..",
    "data",
    "partidas.json"
);

const palabrasTemporales = {};


// Lee y devuelve todas las partidas almacenadas en el archivo JSON.
function leerPartidas() {

    const datos = fs.readFileSync(
        archivoPartidas,
        "utf-8"
    );

    return JSON.parse(datos);
}


// Guarda la información de las partidas en el archivo JSON.
function guardarPartidas(datos) {

    fs.writeFileSync(
        archivoPartidas,
        JSON.stringify(datos, null, 2),
        "utf-8"
    );
}


// Crea una nueva partida y asigna aleatoriamente los jugadores J1 y J2.
app.post("/api/partidas", (req, res) => {

    const { nombre1, nombre2 } = req.body;

    const jugadorA = nombre1?.trim();
    const jugadorB = nombre2?.trim();

    if (!jugadorA || !jugadorB) {

        return res.status(400).json({
            mensaje: "Debe ingresar ambos nombres"
        });

    }

    let J1;
    let J2;

    if (Math.random() < 0.5) {

        J1 = jugadorA;
        J2 = jugadorB;

    } else {

        J1 = jugadorB;
        J2 = jugadorA;

    }

    const nuevaPartida = {

        J1: J1,
        J2: J2,

        intentosR1J1: null,
        intentosR2J1: null,
        intentosR3J1: null,
        tiempoJ1: null,

        intentosR1J2: null,
        intentosR2J2: null,
        intentosR3J2: null,
        tiempoJ2: null,

        ganador: null
    };

    try {

        const datos = leerPartidas();

        datos.partidas.push(nuevaPartida);

        const idPartida = datos.partidas.length - 1;

        guardarPartidas(datos);

        res.status(201).json({

            mensaje: "Partida creada correctamente",

            idPartida: idPartida,

            partida: nuevaPartida

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la partida"
        });

    }

});


// Guarda temporalmente la palabra secreta utilizada durante una ronda.
app.post("/api/palabra-secreta", (req, res) => {

    const {
        idPartida,
        palabra
    } = req.body;

    const palabraLimpia = palabra
        ?.trim()
        .toLowerCase();

    if (!palabraLimpia) {

        return res.status(400).json({
            mensaje: "Debe ingresar una palabra"
        });

    }

    if (
        palabraLimpia.length < 4 ||
        palabraLimpia.length > 8
    ) {

        return res.status(400).json({
            mensaje:
                "La palabra debe tener entre 4 y 8 letras"
        });

    }

    if (!/^[a-záéíóúüñ]+$/i.test(palabraLimpia)) {

        return res.status(400).json({
            mensaje: "La palabra solamente puede contener letras"
        });

    }

    palabrasTemporales[idPartida] = palabraLimpia;

    res.status(200).json({

        mensaje: "Palabra guardada",

        longitud: palabraLimpia.length

    });

});


// Compara el intento del jugador con la palabra secreta y devuelve una pista o confirmación.
app.post("/api/revisar-palabra", (req, res) => {

    const {
        idPartida,
        palabraIntento
    } = req.body;

    const palabraSecreta = palabrasTemporales[idPartida];

    const intento = palabraIntento
        ?.trim()
        .toLowerCase();

    if (!palabraSecreta) {

        return res.status(400).json({
            mensaje: "No existe una palabra secreta"
        });

    }

    if (!intento) {

        return res.status(400).json({
            mensaje: "Debe completar todos los espacios"
        });

    }

    if (intento.length !== palabraSecreta.length) {

        return res.status(400).json({
            mensaje:
                `La palabra debe tener ${palabraSecreta.length} letras`
        });

    }

    if (intento === palabraSecreta) {

        return res.status(200).json({

            correcta: true,

            mensaje: "¡Palabra correcta!"

        });

    }

    let posicionCorrecta = null;

    for (
        let i = 0;
        i < palabraSecreta.length;
        i++
    ) {

        if (intento[i] === palabraSecreta[i]) {

            posicionCorrecta = i + 1;

            break;
        }
    }

    let mensaje = "Palabra incorrecta";

    if (posicionCorrecta !== null) {

        mensaje =
            `La letra en la posición ${posicionCorrecta} es correcta`;

    }

    res.status(200).json({

        correcta: false,

        posicionCorrecta: posicionCorrecta,

        mensaje: mensaje

    });

});


// Guarda la cantidad de intentos realizados por un jugador en una ronda específica.
app.put("/api/partidas/:id/ronda", (req, res) => {

    const idPartida = Number(req.params.id);

    const {
        jugador,
        ronda,
        intentos
    } = req.body;

    try {

        const datos = leerPartidas();

        const partida = datos.partidas[idPartida];

        if (!partida) {

            return res.status(404).json({
                mensaje: "Partida no encontrada"
            });

        }

        const nombreCampo =
            `intentosR${ronda}J${jugador}`;

        partida[nombreCampo] = intentos;

        guardarPartidas(datos);

        res.status(200).json({

            mensaje: "Ronda guardada correctamente",

            partida: partida

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al guardar la ronda"
        });

    }

});


// Guarda el tiempo total acumulado por un jugador durante sus tres rondas.
app.put("/api/partidas/:id/tiempo", (req, res) => {

    const idPartida = Number(req.params.id);

    const {
        jugador,
        tiempo
    } = req.body;

    try {

        const datos = leerPartidas();

        const partida = datos.partidas[idPartida];

        if (!partida) {

            return res.status(404).json({
                mensaje: "Partida no encontrada"
            });

        }

        const nombreCampo = `tiempoJ${jugador}`;

        partida[nombreCampo] = tiempo;

        guardarPartidas(datos);

        res.status(200).json({

            mensaje: "Tiempo guardado",

            partida: partida

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al guardar el tiempo"
        });

    }

});


// Finaliza la partida calculando el ganador según intentos y, en caso de empate, tiempo.
app.put("/api/partidas/:id/finalizar", (req, res) => {

    const idPartida = Number(req.params.id);

    try {

        const datos = leerPartidas();

        const partida = datos.partidas[idPartida];

        if (!partida) {

            return res.status(404).json({
                mensaje: "Partida no encontrada"
            });

        }

        const totalIntentosJ1 =
            partida.intentosR1J1 +
            partida.intentosR2J1 +
            partida.intentosR3J1;

        const totalIntentosJ2 =
            partida.intentosR1J2 +
            partida.intentosR2J2 +
            partida.intentosR3J2;

        let ganador = "Empate";

        if (totalIntentosJ1 < totalIntentosJ2) {

            ganador = partida.J1;

        } else if (totalIntentosJ2 < totalIntentosJ1) {

            ganador = partida.J2;

        } else {

            if (partida.tiempoJ1 < partida.tiempoJ2) {

                ganador = partida.J1;

            } else if (partida.tiempoJ2 < partida.tiempoJ1) {

                ganador = partida.J2;

            }

        }

        partida.ganador = ganador;

        guardarPartidas(datos);

        delete palabrasTemporales[idPartida];

        res.status(200).json({

            mensaje: "Partida finalizada",

            partida: partida,

            totalIntentosJ1: totalIntentosJ1,
            totalIntentosJ2: totalIntentosJ2

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al finalizar la partida"
        });

    }

});


// Obtiene y devuelve el historial completo de partidas guardadas.
app.get("/api/partidas", (req, res) => {

    try {

        const datos = leerPartidas();

        res.status(200).json({
            partidas: datos.partidas
        });

    } catch (error) {

        console.error(
            "Error al obtener el historial:",
            error
        );

        res.status(500).json({
            mensaje: "No se pudo obtener el historial"
        });

    }

});


// Inicia el servidor backend en el puerto configurado.
app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});
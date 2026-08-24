import { useEffect, useState } from "react";
import "./App.css";


function App() {

    // =================================================
    // DATOS INICIALES
    // =================================================

    const [nombre1, setNombre1] = useState("");
    const [nombre2, setNombre2] = useState("");


    // =================================================
    // CONTROL DE PARTIDA
    // =================================================

    const [partida, setPartida] = useState(null);
    const [idPartida, setIdPartida] = useState(null);

    // 1 = J1
    // 2 = J2
    const [jugadorActual, setJugadorActual] = useState(1);

    // Ronda actual de 1 a 3
    const [rondaActual, setRondaActual] = useState(1);


    // =================================================
    // CONTROL DE PANTALLAS
    // =================================================

    const [pantalla, setPantalla] = useState("inicio");


    // =================================================
    // PALABRA SECRETA
    // =================================================

    const [palabraSecreta, setPalabraSecreta] =
        useState("");

    const [longitudPalabra, setLongitudPalabra] =
        useState(0);


    // =================================================
    // LETRAS DEL INTENTO
    // =================================================

    // Ejemplo:
    // ["F", "O", "C", "O"]

    const [letras, setLetras] = useState([]);


    // =================================================
    // INTENTOS
    // =================================================

    const [intentosRonda, setIntentosRonda] =
        useState(0);



    // =================================================
    // SONIDO DE INICIO
    // =================================================

    const reproducirSonidoInicio = () => {

        // AudioContext permite crear sonidos directamente
        // desde JavaScript.

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const contexto = new AudioContext();

        // Frecuencias utilizadas para un tono suave
        const notas = [261.63, 329.63, 392.0];

        notas.forEach((frecuencia, posicion) => {

            const oscilador =
                contexto.createOscillator();

            const volumen =
                contexto.createGain();


            // Conectamos:
            // Oscilador -> Volumen -> Parlantes

            oscilador.connect(volumen);

            volumen.connect(contexto.destination);


            // Sonido tipo seno, más suave
            oscilador.type = "sine";

            oscilador.frequency.value = frecuencia;


            // Volumen bajo para un sonido tranquilo
            volumen.gain.setValueAtTime(
                0.03,
                contexto.currentTime
            );


            // Cada nota comienza después de la anterior
            const inicio =
                contexto.currentTime +
                (posicion * 0.15);


            const final = inicio + 0.5;


            // Disminuimos el volumen suavemente
            volumen.gain.exponentialRampToValueAtTime(
                0.001,
                final
            );


            oscilador.start(inicio);

            oscilador.stop(final);

        });

    };
    // =================================================
    // TIEMPO
    // =================================================

    // Tiempo acumulado de J1 en segundos
    const [tiempoJ1, setTiempoJ1] = useState(0);

    // Tiempo acumulado de J2 en segundos
    const [tiempoJ2, setTiempoJ2] = useState(0);

    // Controla si el cronómetro está corriendo
    const [cronometroActivo, setCronometroActivo] =
        useState(false);


    // =================================================
    // MENSAJES
    // =================================================

    const [mensaje, setMensaje] = useState("");


    // =================================================
    // HISTORIAL
    // =================================================

    const [historial, setHistorial] = useState([]);

    // =================================================
    // RESULTADO FINAL
    // =================================================

    
    const [resultadoFinal, setResultadoFinal] =
        useState(null);



    // =================================================
    // CRONÓMETRO
    // =================================================

    useEffect(() => {

        // Si no estamos jugando, no hacemos nada
        if (!cronometroActivo) {
            return;
        }


        const intervalo = setInterval(() => {

            // El tiempo solamente aumenta para
            // el jugador que está intentando adivinar

            if (jugadorActual === 1) {

                setTiempoJ1((tiempo) => tiempo + 1);

            } else {

                setTiempoJ2((tiempo) => tiempo + 1);

            }

        }, 1000);


        // Al cambiar de pantalla o pausar,
        // eliminamos el intervalo anterior

        return () => clearInterval(intervalo);

    }, [cronometroActivo, jugadorActual]);


    // =================================================
    // INICIAR PARTIDA
    // =================================================

    const iniciarPartida = async () => {

        const jugadorA = nombre1.trim();
        const jugadorB = nombre2.trim();


        if (!jugadorA || !jugadorB) {

            setMensaje(
                "Debe ingresar el nombre de ambos jugadores"
            );

            return;
        }


        try {

            const respuesta = await fetch(
                "http://localhost:3001/api/partidas",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre1: jugadorA,
                        nombre2: jugadorB
                    })
                }
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(datos.mensaje);
                return;

            }


            setPartida(datos.partida);
            setIdPartida(datos.idPartida);
            // Reproducimos un sonido chill al iniciar la partida
            reproducirSonidoInicio();

            // J1 comienza adivinando
            setJugadorActual(1);
            setRondaActual(1);

            setMensaje("");

            // J2 debe crear la primera palabra
            setPantalla("palabraSecreta");

        } catch (error) {

            console.error(error);

            setMensaje(
                "No se pudo conectar con el backend"
            );

        }

    };

    // =================================================
    // ABRIR HISTORIAL
    // =================================================

    const abrirHistorial = async () => {

        try {

            // Solicitamos las partidas al backend
            const respuesta = await fetch(
                "http://localhost:3001/api/partidas"
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(
                    datos.mensaje ||
                    "No se pudo obtener el historial"
                );

                return;
            }


            // Guardamos las partidas recibidas
            setHistorial(datos.partidas);

            // Limpiamos mensajes anteriores
            setMensaje("");

            // Cambiamos al nuevo Frame de historial
            setPantalla("historial");


        } catch (error) {

            console.error(
                "Error al obtener el historial:",
                error
            );

            setMensaje(
                "No se pudo conectar con el backend"
            );

        }

    };


    // =================================================
    // OBTENER QUIÉN CREA LA PALABRA
    // =================================================

    const obtenerNombreCreador = () => {

        // Si J1 está adivinando,
        // J2 crea la palabra.

        if (jugadorActual === 1) {
            return partida?.J2;
        }

        // Si J2 está adivinando,
        // J1 crea la palabra.

        return partida?.J1;
    };


    // =================================================
    // OBTENER QUIÉN ESTÁ JUGANDO
    // =================================================

    const obtenerNombreJugadorActual = () => {

        if (jugadorActual === 1) {
            return partida?.J1;
        }

        return partida?.J2;
    };


    // =================================================
    // GUARDAR PALABRA SECRETA
    // =================================================

    const avanzar = async () => {

        const palabraLimpia =
            palabraSecreta.trim();


        if (
            palabraLimpia.length < 4 ||
            palabraLimpia.length > 8
        ) {

            setMensaje(
                "La palabra debe tener entre 4 y 8 letras"
            );

            return;
        }


        try {

            const respuesta = await fetch(
                "http://localhost:3001/api/palabra-secreta",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        idPartida: idPartida,

                        palabra: palabraLimpia

                    })
                }
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(datos.mensaje);
                return;

            }


            // Guardamos únicamente la longitud necesaria
            setLongitudPalabra(datos.longitud);


            // Creamos los espacios para las letras
            setLetras(
                Array(datos.longitud).fill("")
            );


            // Reiniciamos intentos de la nueva ronda
            setIntentosRonda(0);

            // Limpiamos la palabra escrita
            setPalabraSecreta("");

            // Limpiamos mensajes
            setMensaje("");


            // Iniciamos el juego
            setPantalla("juego");

            // El cronómetro empieza ahora
            setCronometroActivo(true);


        } catch (error) {

            console.error(error);

            setMensaje(
                "No se pudo guardar la palabra"
            );

        }

    };


    // =================================================
    // CAMBIAR UNA LETRA
    // =================================================

    const cambiarLetra = (posicion, valor) => {

        // Permitimos solamente una letra
        const letra = valor.slice(-1);


        // Copiamos el arreglo actual
        const nuevasLetras = [...letras];


        // Cambiamos solamente la posición indicada
        nuevasLetras[posicion] = letra;


        // Actualizamos el estado
        setLetras(nuevasLetras);

    };


    // =================================================
    // REVISAR PALABRA
    // =================================================

    const revisarPalabra = async () => {

        // Verificamos que todos los espacios estén llenos
        if (letras.some((letra) => letra === "")) {

            setMensaje(
                "Debe completar todos los espacios"
            );

            return;
        }


        // Unimos las letras
        const palabraIntento = letras.join("");


        try {

            const respuesta = await fetch(
                "http://localhost:3001/api/revisar-palabra",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        idPartida: idPartida,

                        palabraIntento: palabraIntento

                    })
                }
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(datos.mensaje);
                return;

            }


            // =================================================
            // CADA REVISIÓN CUENTA COMO INTENTO
            // =================================================

            const nuevosIntentos =
                intentosRonda + 1;


            setIntentosRonda(nuevosIntentos);


            // =================================================
            // PALABRA CORRECTA
            // =================================================

            if (datos.correcta) {

                // Pausamos el cronómetro
                setCronometroActivo(false);

                // Mostramos el mensaje de palabra correcta
                setMensaje("¡Palabra correcta!");

                // Esperamos 2 segundos para que el jugador
                // pueda ver el mensaje antes de continuar
                setTimeout(async () => {

                    // Limpiamos el mensaje
                    setMensaje("");

                    // Guardamos los intentos de esta ronda
                    // y continuamos con el juego
                    await terminarRonda(nuevosIntentos);

                }, 2000);

                return;
            }


            // =================================================
            // PALABRA INCORRECTA
            // =================================================

            setMensaje(datos.mensaje);


            // Limpiamos todos los espacios
            setLetras(
                Array(longitudPalabra).fill("")
            );


        } catch (error) {

            console.error(error);

            setMensaje(
                "No se pudo revisar la palabra"
            );

        }

    };


    // =================================================
    // TERMINAR RONDA
    // =================================================

    const terminarRonda = async (intentosFinales) => {

        try {

            // Guardamos los intentos de la ronda
            const respuesta = await fetch(
                `http://localhost:3001/api/partidas/${idPartida}/ronda`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        jugador: jugadorActual,

                        ronda: rondaActual,

                        intentos: intentosFinales

                    })
                }
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(datos.mensaje);
                return;

            }


            // Actualizamos la copia local
            setPartida(datos.partida);


            // Reiniciamos los intentos visuales
            setIntentosRonda(0);


            // =================================================
            // AÚN QUEDAN RONDAS DEL MISMO JUGADOR
            // =================================================

            if (rondaActual < 3) {

                // Aumentamos ronda
                setRondaActual(
                    (ronda) => ronda + 1
                );


                // Limpiamos datos temporales
                setPalabraSecreta("");
                setLetras([]);
                setLongitudPalabra(0);


                // Volvemos a Frame 2.
                // El contrincante debe escribir
                // una nueva palabra.

                setPantalla("palabraSecreta");

                return;
            }


            // =================================================
            // TERMINAR LAS 3 RONDAS DEL JUGADOR
            // =================================================

            await terminarTresRondas(datos.partida);


        } catch (error) {

            console.error(error);

            setMensaje(
                "Error al guardar la ronda"
            );

        }

    };


    // =================================================
    // TERMINAR LAS 3 RONDAS DE UN JUGADOR
    // =================================================

    const terminarTresRondas = async (partidaActualizada) => {

        // Obtenemos el tiempo actual del jugador
        const tiempoFinal = jugadorActual === 1
            ? tiempoJ1
            : tiempoJ2;


        try {

            // Guardamos el tiempo acumulado
            const respuesta = await fetch(
                `http://localhost:3001/api/partidas/${idPartida}/tiempo`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        jugador: jugadorActual,

                        tiempo: tiempoFinal

                    })
                }
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                setMensaje(datos.mensaje);
                return;

            }


            setPartida(datos.partida);


            // =================================================
            // J1 TERMINÓ: AHORA JUEGA J2
            // =================================================

            if (jugadorActual === 1) {

                // J2 será ahora quien adivina
                setJugadorActual(2);

                // Reiniciamos contador de rondas
                setRondaActual(1);

                // Limpiamos datos visuales
                setIntentosRonda(0);
                setLetras([]);
                setLongitudPalabra(0);
                setPalabraSecreta("");

                // J1 debe crear la nueva palabra
                setPantalla("palabraSecreta");

                return;
            }


            // =================================================
            // J2 TERMINÓ: FINALIZAR PARTIDA
            // =================================================

            const respuestaFinal = await fetch(
                `http://localhost:3001/api/partidas/${idPartida}/finalizar`,
                {
                    method: "PUT"
                }
            );


            const datosFinal =
                await respuestaFinal.json();


            if (!respuestaFinal.ok) {

                setMensaje(datosFinal.mensaje);
                return;

            }


            // Guardamos el resultado
            setResultadoFinal(datosFinal);

            setPartida(datosFinal.partida);

            // Mostramos resultado final
            setPantalla("resultado");


        } catch (error) {

            console.error(error);

            setMensaje(
                "Error al guardar el tiempo"
            );

        }

    };


    // =================================================
    // FORMATEAR TIEMPO
    // =================================================

    const formatearTiempo = (segundos) => {

        const minutos =
            Math.floor(segundos / 60);

        const segundosRestantes =
            segundos % 60;


        return (
            String(minutos).padStart(2, "0") +
            ":" +
            String(segundosRestantes).padStart(2, "0")
        );

    };


    // =================================================
    // SALIR
    // =================================================

    const salir = () => {

        // Detenemos el cronómetro
        setCronometroActivo(false);


        // Regresamos al inicio
        setPantalla("inicio");


        // Limpiamos datos
        setNombre1("");
        setNombre2("");
        setPartida(null);
        setIdPartida(null);

        setJugadorActual(1);
        setRondaActual(1);

        setPalabraSecreta("");
        setLongitudPalabra(0);
        setLetras([]);

        setIntentosRonda(0);

        setTiempoJ1(0);
        setTiempoJ2(0);

        setMensaje("");
        setResultadoFinal(null);

    };


    // =================================================
    // FRAME 1: NOMBRES
    // =================================================

    const mostrarInicio = () => (

        <section className="formulario-jugadores">

            <label htmlFor="nombre1">
                Nombre 1
            </label>

            <input
                id="nombre1"
                type="text"
                value={nombre1}
                onChange={(evento) =>
                    setNombre1(evento.target.value)
                }
                placeholder="Ingrese el nombre"
            />


            <label htmlFor="nombre2">
                Nombre 2
            </label>

            <input
                id="nombre2"
                type="text"
                value={nombre2}
                onChange={(evento) =>
                    setNombre2(evento.target.value)
                }
                placeholder="Ingrese el nombre"
            />


            <button
                className="boton-iniciar"
                onClick={iniciarPartida}
            >
                Iniciar Partida
            </button>

        </section>

    );


    // =================================================
    // FRAME 2: ESCRIBIR PALABRA SECRETA
    // =================================================

    const mostrarPalabraSecreta = () => (

        <section className="formulario-jugadores">

            <h2 className="nombre-jugador">
                {obtenerNombreCreador()}
            </h2>


            <p className="instruccion">
                Escriba una palabra secreta para
                {` ${obtenerNombreJugadorActual()}`}
            </p>


            <label htmlFor="palabra">
                Palabra Secreta
            </label>


            <input
                id="palabra"
                type="text"
                value={palabraSecreta}
                onChange={(evento) =>
                    setPalabraSecreta(
                        evento.target.value
                    )
                }
                placeholder="De 4 a 8 letras"
            />


            <button
                className="boton-iniciar"
                onClick={avanzar}
            >
                Avanzar
            </button>

        </section>

    );


    // =================================================
    // FRAME 3: JUEGO
    // =================================================

    const mostrarJuego = () => (

        <section className="zona-juego">


            {/* INFORMACIÓN SUPERIOR */}

            <div className="informacion-juego">


                <div className="ronda">

                    <strong>
                        Jugador {jugadorActual}
                    </strong>

                    <span>
                        Ronda {rondaActual} / 3
                    </span>

                </div>


                <div className="contador-intentos">

                    Intentos: {intentosRonda}

                </div>

            </div>


            {/* JUGADOR */}

            <h2 className="nombre-jugador nombre-juego">

                {obtenerNombreJugadorActual()}

            </h2>


            {/* ESPACIOS DE LA PALABRA */}

            <div className="espacios-palabra">

                {letras.map(
                    (letra, posicion) => (

                        <div
                            className="contenedor-letra"
                            key={posicion}
                        >

                            <span className="numero-posicion">
                                {posicion + 1}
                            </span>


                            <input
                                type="text"
                                maxLength="1"
                                value={letra}
                                onChange={(evento) =>
                                    cambiarLetra(
                                        posicion,
                                        evento.target.value
                                    )
                                }
                            />

                        </div>

                    )
                )}

            </div>


            {/* BOTÓN REVISAR */}

            <button
                className="boton-iniciar boton-revisar"
                onClick={revisarPalabra}
            >
                Revisar
            </button>


            {/* CRONÓMETRO */}

            <div className="cronometro">

                ⏱ {formatearTiempo(
                    jugadorActual === 1
                        ? tiempoJ1
                        : tiempoJ2
                )}

            </div>

        </section>

    );


    // =================================================
    // FRAME RESULTADO FINAL
    // =================================================

    const mostrarResultado = () => (

        <section className="resultado-final">

            <h1>
                {resultadoFinal?.partida.ganador === "Empate"
                    ? "¡La partida terminó en empate!"
                    : `¡Felicidades ${resultadoFinal?.partida.ganador}!`
                }
            </h1>


            <h2>
                Resultado final
            </h2>


            {/* JUGADOR 1 */}

            <div className="estadistica-jugador">

                <h3>
                    {partida?.J1}
                </h3>

                <p>
                    Ronda 1:
                    {" "}
                    {partida?.intentosR1J1} intentos
                </p>

                <p>
                    Ronda 2:
                    {" "}
                    {partida?.intentosR2J1} intentos
                </p>

                <p>
                    Ronda 3:
                    {" "}
                    {partida?.intentosR3J1} intentos
                </p>

                <p>
                    Tiempo:
                    {" "}
                    {formatearTiempo(partida?.tiempoJ1 || 0)}
                </p>

            </div>


            {/* JUGADOR 2 */}

            <div className="estadistica-jugador">

                <h3>
                    {partida?.J2}
                </h3>

                <p>
                    Ronda 1:
                    {" "}
                    {partida?.intentosR1J2} intentos
                </p>

                <p>
                    Ronda 2:
                    {" "}
                    {partida?.intentosR2J2} intentos
                </p>

                <p>
                    Ronda 3:
                    {" "}
                    {partida?.intentosR3J2} intentos
                </p>

                <p>
                    Tiempo:
                    {" "}
                    {formatearTiempo(partida?.tiempoJ2 || 0)}
                </p>

            </div>

        </section>

    );

    // =================================================
    // FRAME: HISTORIAL
    // =================================================

    const mostrarHistorial = () => (

        <section className="historial">

            <h1>
                Historial de Partidas
            </h1>


            {historial.length === 0 ? (

                <p className="sin-historial">
                    No hay partidas guardadas.
                </p>

            ) : (

                <div className="lista-partidas">

                    {historial.map(
                        (partidaHistorial, posicion) => (

                            <article
                                className="partida-historial"
                                key={posicion}
                            >

                                <h2>
                                    Partida {posicion + 1}
                                </h2>


                                {/* =====================
                                    JUGADOR 1
                                ===================== */}

                                <div className="datos-historial">

                                    <h3>
                                        {partidaHistorial.J1}
                                    </h3>

                                    <p>
                                        Intentos:
                                        {" "}
                                        R1: {
                                            partidaHistorial.intentosR1J1
                                        }
                                        {" | "}
                                        R2: {
                                            partidaHistorial.intentosR2J1
                                        }
                                        {" | "}
                                        R3: {
                                            partidaHistorial.intentosR3J1
                                        }
                                    </p>

                                    <p>
                                        Total:
                                        {" "}
                                        {
                                            (partidaHistorial.intentosR1J1 || 0) +
                                            (partidaHistorial.intentosR2J1 || 0) +
                                            (partidaHistorial.intentosR3J1 || 0)
                                        }
                                        {" intentos"}
                                    </p>

                                    <p>
                                        Tiempo:
                                        {" "}
                                        {formatearTiempo(
                                            partidaHistorial.tiempoJ1 || 0
                                        )}
                                    </p>

                                </div>


                                {/* =====================
                                    JUGADOR 2
                                ===================== */}

                                <div className="datos-historial">

                                    <h3>
                                        {partidaHistorial.J2}
                                    </h3>

                                    <p>
                                        Intentos:
                                        {" "}
                                        R1: {
                                            partidaHistorial.intentosR1J2
                                        }
                                        {" | "}
                                        R2: {
                                            partidaHistorial.intentosR2J2
                                        }
                                        {" | "}
                                        R3: {
                                            partidaHistorial.intentosR3J2
                                        }
                                    </p>

                                    <p>
                                        Total:
                                        {" "}
                                        {
                                            (partidaHistorial.intentosR1J2 || 0) +
                                            (partidaHistorial.intentosR2J2 || 0) +
                                            (partidaHistorial.intentosR3J2 || 0)
                                        }
                                        {" intentos"}
                                    </p>

                                    <p>
                                        Tiempo:
                                        {" "}
                                        {formatearTiempo(
                                            partidaHistorial.tiempoJ2 || 0
                                        )}
                                    </p>

                                </div>


                                {/* =====================
                                    RESULTADO
                                ===================== */}

                                <div className="resultado-historial">

                                    <strong>
                                        Resultado:
                                    </strong>

                                    {" "}

                                    {partidaHistorial.ganador === "Empate"
                                        ? "Empate"
                                        : "Gane"
                                    }

                                    <br />

                                    {partidaHistorial.ganador !== null &&
                                        partidaHistorial.ganador !== "Empate" && (

                                            <>
                                                <strong>
                                                    Ganador:
                                                </strong>

                                                {" "}

                                                {partidaHistorial.ganador}
                                            </>
                                        )
                                    }

                                </div>

                            </article>

                        )
                    )}

                </div>

            )}


            {/* BOTÓN PARA VOLVER */}

            <button
                className="boton-volver"
                onClick={() => setPantalla("inicio")}
            >
                Volver
            </button>

        </section>

    );


    // =================================================
    // INTERFAZ PRINCIPAL
    // =================================================

    return (

        <div className="aplicacion">


            {/* HEADER */}

            <header className="header">

                <div className="titulo-header">
                    ADIVINA LA PALABRA
                </div>

            </header>


            {/* BODY */}

            <main className="contenido-principal">


                {pantalla === "inicio" &&
                    mostrarInicio()
                }


                {pantalla === "palabraSecreta" &&
                    mostrarPalabraSecreta()
                }


                {pantalla === "juego" &&
                    mostrarJuego()
                }


                {pantalla === "resultado" &&
                    mostrarResultado()
                }

                {pantalla === "historial" &&
                    mostrarHistorial()
                }


                {/* MENSAJES */}

                {mensaje !== "" && (

                    <p className="mensaje">
                        {mensaje}
                    </p>

                )}

                {/* BOTÓN HISTORIAL */}

                {pantalla === "inicio" && (

                    <button
                        className="boton-historial"
                        onClick={abrirHistorial}
                    >
                        Historial
                    </button>

                )}


                {/* SALIR */}

                <button
                    className="boton-salir"
                    onClick={salir}
                >
                    Salir
                </button>

            </main>

        </div>

    );

}


export default App;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- 1. CONFIGURACIÓN (PROYECTO: CUESTIONARIO NEGOCIOS - CLAVES CORREGIDAS) ---
const firebaseConfig = {
  apiKey: "AIzaSyCDZHOnzskotkjSZlVkV91D2NEbHYDzfP0",
  authDomain: "cuestionario-negocios.firebaseapp.com",
  projectId: "cuestionario-negocios",
  storageBucket: "cuestionario-negocios.firebasestorage.app",
  messagingSenderId: "121378663958",
  appId: "1:121378663958:web:5135ac597a5d9823a04f37",
  measurementId: "G-CYQQFM7LF1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 2. LISTA DE CORREOS AUTORIZADOS Y DIFERENCIADOS ---

// Correo que tendrán límite de 2 dispositivos
const correosDosDispositivos = [
    "dpachecog2@unemi.edu.ec", "htigrer@unemi.edu.ec", "sgavilanezp2@unemi.edu.ec", 
    "jzamoram9@unemi.edu.ec", "fcarrillop@unemi.edu.ec", "naguilarb@unemi.edu.ec", 
    "kholguinb2@unemi.edu.ec"
];

// Correos que tendrán límite de 1 dispositivo
const correosUnDispositivo = [
    "cnavarretem4@unemi.edu.ec", "gorellanas2@unemi.edu.ec", "ehidalgoc4@unemi.edu.ec", 
    "lbrionesg3@unemi.edu.ec", "xsalvadorv@unemi.edu.ec", "nbravop4@unemi.edu.ec", 
    "jmoreirap6@unemi.edu.ec", "jcastrof8@unemi.edu.ec"
];

// Unimos las listas para la validación de acceso inicial
const correosPermitidos = [
    ...correosDosDispositivos, 
    ...correosUnDispositivo
];

// --- 3. BANCO DE PREGUNTAS (Inteligencia de Negocios) ---
// ⚠️ ATENCIÓN: Debes reemplazar estas 5 preguntas de ejemplo por tus 64 preguntas de la materia
const bancoPreguntas = [
    // PREGUNTAS DE INTELIGENCIA DE NEGOCIOS

    {
        texto: "Adoptar tendencias emergentes es una ventaja.",
        opciones: ["Falso", "Verdadero"],
        respuesta: 1,
        explicacion: "Adoptar nuevas tendencias permite a las empresas mantenerse competitivas y aprovechar oportunidades tempranas."
    },
    {
        texto: "Complete: Un Data Warehouse debe mantener datos",
        opciones: ["Históricos", "Anónimos", "Volátiles", "Temporales sin trazas"],
        respuesta: 0,
        explicacion: "La función principal de un DW es almacenar datos históricos para permitir el análisis de tendencias a lo largo del tiempo."
    },
    {
        texto: "BI ayuda a:",
        opciones: ["Evitar visualizaciones", "Eliminar controles", "Aumentar tiempos de respuesta", "Optimizar procesos y detectar ineficiencias"],
        respuesta: 3,
        explicacion: "La Inteligencia de Negocios busca identificar puntos de mejora para optimizar el rendimiento operativo."
    },
    {
        texto: "Compartir visualizaciones suele ser más fácil que tablas crudas.",
        opciones: ["Verdadero", "Falso"],
        respuesta: 0,
        explicacion: "Las visualizaciones resumen información compleja de manera gráfica, facilitando su comprensión rápida frente a los datos crudos."
    },
    {
        texto: "Complete: Un diagrama de ______ ilustra planificación temporal de tareas.",
        opciones: ["Secuencia", "Árbol", "Gantt", "Red"],
        respuesta: 2,
        explicacion: "El diagrama de Gantt es la herramienta estándar para visualizar la cronología y planificación de proyectos."
    },
    {
        texto: "Complete: 'Load' almacena datos transformados en el Data",
        opciones: ["Socket", "Warehouse", "Frame", "Sheet"],
        respuesta: 1,
        explicacion: "En el proceso ETL, la carga (Load) deposita los datos finales en el Data Warehouse."
    },
    {
        texto: "Complete: Un KPI debe estar",
        opciones: ["Alineado a objetivos del negocio", "Aislado", "Oculto", "Contradictorio"],
        respuesta: 0,
        explicacion: "Para ser efectivo, un Indicador Clave de Desempeño (KPI) debe medir el progreso hacia objetivos estratégicos concretos."
    },
    {
        texto: "BI ayuda a anticipar cambios del mercado.",
        opciones: ["Verdadero", "Falso"],
        respuesta: 0,
        explicacion: "El análisis predictivo de BI permite identificar tendencias futuras y adaptar la estrategia antes que ocurran los cambios."
    },
    {
        texto: "Business Intelligence (BI) es:",
        opciones: ["Un ERP de finanzas", "El proceso de transformar datos en información valiosa", "Un único dashboard", "Un lenguaje de programación"],
        respuesta: 1,
        explicacion: "BI se define como el conjunto de procesos y tecnologías para convertir datos brutos en información útil para la toma de decisiones."
    },
    {
        texto: "La calidad de los datos extraídos depende de:",
        opciones: ["El número de columnas extraídas", "La integridad y disponibilidad de las fuentes", "El formato de salida", "La cantidad de transformaciones aplicadas"],
        respuesta: 1,
        explicacion: "Si la fuente de datos no es íntegra o fiable (GIGO: Garbage In, Garbage Out), el resultado del análisis será deficiente."
    },
    {
        texto: "La carga completa reemplaza todo el contenido anterior.",
        opciones: ["Falso", "Verdadero"],
        respuesta: 1,
        explicacion: "Una carga completa borra los datos existentes y los sustituye totalmente por los nuevos, a diferencia de la carga incremental."
    },
    {
        texto: "El exceso de elementos visuales puede distraer.",
        opciones: ["Verdadero", "Falso"],
        respuesta: 0,
        explicacion: "La sobrecarga visual dificulta que el usuario enfoque su atención en los datos importantes (ruido visual)."
    },
    {
        texto: "La carga es la última fase del proceso ETL.",
        opciones: ["Falso", "Verdadero"],
        respuesta: 1,
        explicacion: "El orden es Extracción, Transformación y Carga (Load), siendo esta última la fase final hacia el destino."
    },
    {
        texto: "La carga mal configurada puede producir datos incompletos.",
        opciones: ["Verdadero", "Falso"],
        respuesta: 0,
        explicacion: "Errores en la configuración pueden causar pérdida de registros, truncamiento de datos o nulos no deseados."
    },
    {
        texto: "El diseño visual debe buscar:",
        opciones: ["Contrastes irrelevantes", "Exceso de elementos", "Complejidad visual", "Claridad, coherencia y enfoque informativo"],
        respuesta: 3,
        explicacion: "El objetivo principal de la visualización es comunicar información de manera clara, eficiente y sin ambigüedades."
    },
    {
        texto: "El exceso de color puede distraer al usuario.",
        opciones: ["Falso", "Verdadero"],
        respuesta: 1,
        explicacion: "El uso indiscriminado de colores reduce el contraste efectivo y cansa la vista, distrayendo del mensaje de los datos."
    },
    {
        texto: "La consistencia de datos se asegura mediante validaciones.",
        opciones: ["Falso", "Verdadero"],
        respuesta: 1,
        explicacion: "Las reglas de validación garantizan que los datos cumplan con los formatos y lógica de negocio requeridos."
    },
    {
        texto: "BI puede apoyar decisiones operativas y estratégicas.",
        opciones: ["Falso", "Verdadero"],
        respuesta: 1,
        explicacion: "BI sirve tanto para el día a día (operativo) como para la planificación a largo plazo (estratégico)."
    },
    {
        texto: "BI siempre ignora datos externos.",
        opciones: ["Verdadero", "Falso"],
        respuesta: 1,
        explicacion: "Falso. BI integra datos internos y externos (mercado, competidores, economía) para un análisis completo."
    },
    {
        texto: "BI no requiere visualización.",
        opciones: ["Verdadero", "Falso"],
        respuesta: 1,
        explicacion: "La visualización es crítica en BI para hacer comprensibles los grandes volúmenes de datos analizados."
    },
    {
        texto: "BI apoya a la organización a:",
        opciones: ["Reaccionar tarde siempre", "Ignorar clientes", "Eliminar monitoreo", "Anticiparse a cambios del mercado"],
        respuesta: 3,
        explicacion: "La capacidad predictiva de BI permite a las empresas ser proactivas en lugar de reactivas."
    },
    {
        texto: "BI sólo aplica a grandes empresas.",
        opciones: ["Verdadero", "Falso"],
        respuesta: 1,
        explicacion: "Falso. BI es escalable y beneficia a PyMEs y grandes corporaciones por igual mediante herramientas adaptadas."
    },
    {
        texto: "BI no ayuda a optimizar procesos.",
        opciones: ["Falso", "Verdadero"],
        respuesta: 0,
        explicacion: "Falso. Uno de los propósitos centrales de BI es precisamente la optimización de procesos mediante datos."
    },
    // --- NUEVAS PREGUNTAS (Extraídas de las Imágenes) ---
    {
        texto: "BI soporta:",
        opciones: ["Sólo marketing", "Sólo RRHH", "Sólo finanzas", "Toma de decisiones estratégicas y operativas"],
        respuesta: 3,
        explicacion: "BI es transversal a la organización y apoya la toma de decisiones en todos los niveles y departamentos."
    },
    {
        texto: "En el MQ de Gartner, líderes suelen:",
        opciones: ["Ser de nicho siempre", "No innovar", "Tener soluciones maduras y de alto alcance", "Evitar escalabilidad"],
        respuesta: 2,
        explicacion: "En el Cuadrante Mágico (MQ), los líderes se caracterizan por tener una visión completa y alta capacidad de ejecución (soluciones maduras)."
    },
    {
        texto: "En ETL, la transformación puede incluir:",
        opciones: ["Sólo cifrado", "Sólo backup", "Sólo indexación", "Limpieza, agregación, conformado"],
        respuesta: 3,
        explicacion: "La fase de Transformación implica limpiar, estandarizar y agregar datos para que sean útiles en el análisis."
    },
    {
        texto: "En BI, datos pasan por limpieza y transformación antes de almacenarse.",
        opciones: ["True", "False"],
        respuesta: 0,
        explicacion: "Es crucial limpiar y transformar los datos antes de cargarlos al DW para asegurar su calidad y consistencia."
    },
    {
        texto: "En el MQ, visionarios se caracterizan por:",
        opciones: ["Baja innovación", "No relevancia", "Alta capacidad de innovar", "Sólo nicho local"],
        respuesta: 2,
        explicacion: "Los 'Visionarios' en el cuadrante de Gartner tienen una fuerte visión de mercado e innovación, aunque quizás menos capacidad de ejecución que los líderes."
    },
    {
        texto: "En DS OLAP, 'roll-up' es:",
        opciones: ["Concatenar", "Subir a niveles agregados superiores", "Eliminar dimensiones", "Bajar a detalle"],
        respuesta: 1,
        explicacion: "Roll-up es la operación de resumir datos subiendo en la jerarquía de una dimensión (ej. de días a meses)."
    },
    {
        texto: "Las claves primarias deben preservarse durante la carga.",
        opciones: ["True", "False"],
        respuesta: 0,
        explicacion: "Mantener la integridad referencial y la unicidad de los registros es vital durante el proceso de carga ETL."
    },
    {
        texto: "Las claves sustitutas ayudan a mantener integridad en el DW.",
        opciones: ["False", "True"],
        respuesta: 1,
        explicacion: "Las claves sustitutas (surrogate keys) son identificadores internos del DW que aíslan los cambios en las claves del sistema fuente."
    },
    {
        texto: "Las dimensiones representan ejes de análisis, como tiempo o producto.",
        opciones: ["True", "False"],
        respuesta: 0,
        explicacion: "En un modelo dimensional, las dimensiones proporcionan el contexto (quién, qué, cuándo) para analizar las métricas."
    },
    {
        texto: "Las cargas deben programarse para evitar interferencias.",
        opciones: ["False", "True"],
        respuesta: 1,
        explicacion: "Las cargas ETL suelen programarse en horarios de baja actividad para no afectar el rendimiento de los sistemas operacionales."
    },
    {
        texto: "Las fuentes de datos pueden ser bases de datos, archivos planos o APIs.",
        opciones: ["True", "False"],
        respuesta: 0,
        explicacion: "BI es capaz de ingerir y combinar datos de múltiples tipos de fuentes heterogéneas."
    },
    {
        texto: "El monitoreo de reportes permite detectar errores.",
        opciones: ["True", "False"],
        respuesta: 0,
        explicacion: "Monitorear el uso y la generación de reportes ayuda a identificar fallos en los datos o problemas de rendimiento."
    },
    {
        texto: "El mantenimiento del despliegue debe ser continuo.",
        opciones: ["False", "True"],
        respuesta: 1,
        explicacion: "BI no es un proyecto de una sola vez; requiere mantenimiento continuo para adaptarse a nuevos requisitos y datos."
    },
    {
        texto: "El mantenimiento del despliegue garantiza:",
        opciones: ["Borrado de métricas", "Pérdida de histórico", "Reducción de seguridad", "Actualización y consistencia de los datos presentados"],
        respuesta: 3,
        explicacion: "Un buen mantenimiento asegura que la información siga siendo relevante, precisa y esté actualizada para los usuarios."
    },
    {
        texto: "El mantenimiento evita obsolescencia en reportes.",
        opciones: ["True", "False"],
        respuesta: 0,
        explicacion: "Revisar y actualizar los reportes periódicamente asegura que sigan respondiendo a las necesidades actuales del negocio."
    }
];

// VARIABLES GLOBALES
let preguntasExamen = []; // Se llena aleatoriamente con 20 preguntas
let indiceActual = 0;
let respuestasUsuario = []; 
let seleccionTemporal = null; 
let tiempoRestante = 0;
let intervaloTiempo;

// REFERENCIAS HTML
const authScreen = document.getElementById('auth-screen');
const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const reviewScreen = document.getElementById('review-screen');
const btnLogout = document.getElementById('btn-logout');
const btnNextQuestion = document.getElementById('btn-next-question');

// --- 4. FUNCIÓN: OBTENER ID ÚNICO DEL DISPOSITIVO ---
function obtenerDeviceId() {
    let deviceId = localStorage.getItem('device_id_seguro');
    if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('device_id_seguro', deviceId);
    }
    return deviceId;
}

// --- 5. LÓGICA DE SEGURIDAD AVANZADA (CUPOS DIFERENCIADOS) ---
async function validarDispositivo(user) {
    const email = user.email;
    const miDeviceId = obtenerDeviceId(); 
    
    // Determinar el límite de dispositivos para este usuario
    let limiteDispositivos = 1;
    if (correosDosDispositivos.includes(email)) {
        limiteDispositivos = 2;
    }

    // Consultar la base de datos
    const docRef = doc(db, "usuarios_seguros", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const datos = docSnap.data();
        let listaDispositivos = datos.dispositivos || []; 
        
        if (listaDispositivos.includes(miDeviceId)) {
            return true; // Dispositivo ya registrado
        } else {
            if (listaDispositivos.length < limiteDispositivos) {
                // Registrar nuevo dispositivo
                listaDispositivos.push(miDeviceId);
                await setDoc(docRef, { dispositivos: listaDispositivos }, { merge: true });
                return true;
            } else {
                // Acceso denegado por exceder el límite
                alert(`⛔ ACCESO DENEGADO ⛔\n\nHas excedido tu límite de ${limiteDispositivos} dispositivos registrados. Debes cerrar sesión en otro equipo para continuar.`);
                await signOut(auth);
                location.reload();
                return false;
            }
        }
    } else {
        // Primer inicio de sesión: registrar el dispositivo con su límite
        await setDoc(docRef, {
            dispositivos: [miDeviceId],
            fecha_registro: new Date().toISOString()
        });
        return true;
    }
}

// --- 6. MONITOR DE AUTENTICACIÓN ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (correosPermitidos.includes(user.email)) {
            const titulo = document.querySelector('h2');
            if(titulo) titulo.innerText = "Verificando Dispositivo..."; 
            
            const dispositivoValido = await validarDispositivo(user);
            
            if (dispositivoValido) {
                authScreen.classList.add('hidden');
                setupScreen.classList.remove('hidden');
                btnLogout.classList.remove('hidden');
                document.getElementById('user-display').innerText = user.email;
                if(titulo) titulo.innerText = "Bienvenido";
            }
        } else {
            alert("ACCESO RESTRINGIDO: Tu correo no está autorizado.");
            signOut(auth);
        }
    } else {
        authScreen.classList.remove('hidden');
        setupScreen.classList.add('hidden');
        quizScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        reviewScreen.classList.add('hidden');
        btnLogout.classList.add('hidden');
    }
});

// --- 7. EVENTOS ---
document.getElementById('btn-google').addEventListener('click', () => {
    signInWithPopup(auth, new GoogleAuthProvider()).catch(e => alert("Error Google: " + e.message));
});

btnLogout.addEventListener('click', () => { signOut(auth); location.reload(); });

// --- 8. LÓGICA DEL EXAMEN (Aleatorio 20 o Estudio todas) ---
document.getElementById('btn-start').addEventListener('click', () => {
    const tiempo = document.getElementById('time-select').value;
    const modo = document.getElementById('mode-select').value;

    if (tiempo !== 'infinity') { tiempoRestante = parseInt(tiempo) * 60; iniciarReloj(); } 
    else { document.getElementById('timer-display').innerText = "--:--"; }
    
    // Lógica de Modo
    if (modo === 'study') {
        preguntasExamen = [...bancoPreguntas].sort(() => 0.5 - Math.random());
    } else {
        // MODO EXAMEN: Carga 20 preguntas aleatorias
        preguntasExamen = [...bancoPreguntas]
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 20); // 20 PREGUNTAS
    }
    
    respuestasUsuario = []; 
    indiceActual = 0;
    setupScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    cargarPregunta();
});

function cargarPregunta() {
    seleccionTemporal = null; 
    btnNextQuestion.classList.add('hidden'); 
    
    if (indiceActual >= preguntasExamen.length) { terminarQuiz(); return; }
    
    const data = preguntasExamen[indiceActual];
    document.getElementById('question-text').innerText = `${indiceActual + 1}. ${data.texto}`;
    const cont = document.getElementById('options-container'); cont.innerHTML = '';
    
    data.opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.innerText = opcion;
        btn.onclick = () => seleccionarOpcion(index, btn); 
        cont.appendChild(btn);
    });
    document.getElementById('progress-display').innerText = `Pregunta ${indiceActual + 1} de ${preguntasExamen.length}`;

    if(indiceActual === preguntasExamen.length - 1) {
        btnNextQuestion.innerHTML = 'Finalizar <i class="fa-solid fa-check"></i>';
    } else {
        btnNextQuestion.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';
    }
}

// --- FUNCIÓN MODIFICADA PARA SEPARAR EL MODO ESTUDIO/EXAMEN ---
function seleccionarOpcion(index, btnClickeado) {
    const isStudyMode = document.getElementById('mode-select').value === 'study';

    // Si ya se ha seleccionado una opción en el modo estudio, no permitir cambiar
    if (isStudyMode && seleccionTemporal !== null) {
        return;
    }
    
    seleccionTemporal = index;
    const botones = document.getElementById('options-container').querySelectorAll('button');
    botones.forEach(b => b.classList.remove('option-selected'));
    btnClickeado.classList.add('option-selected');
    
    if (isStudyMode) {
        mostrarResultadoInmediato(index);
    } else {
        // MODO EXAMEN: Solo guarda la selección temporal y muestra el botón Siguiente
        btnNextQuestion.classList.remove('hidden');
    }
}

// --- NUEVA FUNCIÓN: Muestra respuesta y explicación en modo Estudio ---
function mostrarResultadoInmediato(seleccionada) {
    const pregunta = preguntasExamen[indiceActual];
    const correcta = pregunta.respuesta;
    const cont = document.getElementById('options-container');
    const botones = cont.querySelectorAll('button');
    
    // Deshabilitar todos los botones para que no se pueda cambiar la respuesta
    botones.forEach(btn => btn.disabled = true);

    // Iterar para mostrar el feedback visual (verde/rojo)
    botones.forEach((btn, index) => {
        btn.classList.remove('option-selected'); // Quitar selección temporal
        
        if (index === correcta) {
            btn.classList.add('ans-correct', 'feedback-visible');
        } else if (index === seleccionada) {
            btn.classList.add('ans-wrong', 'feedback-visible');
        }
    });

    // Añadir la explicación
    const divExplicacion = document.createElement('div');
    divExplicacion.className = 'explanation-feedback';
    divExplicacion.innerHTML = `<strong>Explicación:</strong> ${pregunta.explicacion}`;
    cont.appendChild(divExplicacion);
    
    // Registrar la respuesta y mostrar el botón Siguiente
    respuestasUsuario.push(seleccionada);
    btnNextQuestion.classList.remove('hidden');
}


// --- EVENTO MODIFICADO para el botón Siguiente ---
btnNextQuestion.addEventListener('click', () => {
    const isStudyMode = document.getElementById('mode-select').value === 'study';
    
    // En modo estudio, simplemente avanza a la siguiente pregunta (la respuesta ya fue registrada en mostrarResultadoInmediato)
    if (isStudyMode && seleccionTemporal !== null) {
        indiceActual++;
        cargarPregunta();
        return; 
    }
    
    // MODO EXAMEN: Registra la respuesta y avanza (sin feedback inmediato)
    if (seleccionTemporal !== null) {
        respuestasUsuario.push(seleccionTemporal);
        indiceActual++;
        cargarPregunta();
    }
});


function iniciarReloj() {
    intervaloTiempo = setInterval(() => {
        tiempoRestante--;
        let m = Math.floor(tiempoRestante / 60), s = tiempoRestante % 60;
        document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (tiempoRestante <= 0) { clearInterval(intervaloTiempo); terminarQuiz(); }
    }, 1000);
}

function terminarQuiz() {
    clearInterval(intervaloTiempo);
    let aciertos = 0;
    preguntasExamen.forEach((p, i) => { if (respuestasUsuario[i] === p.respuesta) aciertos++; });
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    document.getElementById('score-final').innerText = `${aciertos} / ${preguntasExamen.length}`;
    
    // --- Ocultar botón Revisar Respuestas si es modo Estudio ---
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect && modeSelect.value === 'study') {
        document.getElementById('btn-review').classList.add('hidden');
    } else {
        document.getElementById('btn-review').classList.remove('hidden');
    }
    // --------------------------------------------------------
}

// --- 9. REVISIÓN ---
document.getElementById('btn-review').addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    reviewScreen.classList.remove('hidden');
    const cont = document.getElementById('review-container'); cont.innerHTML = '';
    
    preguntasExamen.forEach((p, i) => {
        const dada = respuestasUsuario[i], ok = (dada === p.respuesta);
        const card = document.createElement('div'); card.className = 'review-item';
        let ops = '';
        p.opciones.forEach((o, x) => {
            let c = (x === p.respuesta) ? 'ans-correct' : (x === dada && !ok ? 'ans-wrong' : '');
            let ico = (x === p.respuesta) ? '✅ ' : (x === dada && !ok ? '❌ ' : '');
            let b = (x === dada) ? 'user-selected' : '';
            ops += `<div class="review-answer ${c} ${b}">${ico}${o}</div>`;
        });
        card.innerHTML = `<div class="review-question">${i+1}. ${p.texto}</div>${ops}<div class="review-explanation"><strong>Explicación:</strong> ${p.explicacion}</div>`;
        cont.appendChild(card);
    });
});

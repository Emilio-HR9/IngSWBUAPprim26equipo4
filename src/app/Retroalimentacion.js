let repActual = 0
let repTotal = 10

let puntos = 0
let racha = 0

const mensajes = [
"¡Excelente!",
"¡Muy bien!",
"¡Sigue así!",
"¡Gran trabajo!",
"¡Impresionante!"
]

function registrarRepeticion(){

if(repActual < repTotal){

repActual++

sumarPuntos(10)
actualizarContador()
actualizarBarra()
mostrarMensaje()

if(repActual === repTotal){
completarEjercicio()
}

}

}

function sumarPuntos(valor){

puntos += valor

document.getElementById("puntos").innerText =
"⭐ Puntos: " + puntos

}

function actualizarContador(){

document.getElementById("contador").innerText =
repActual + " / " + repTotal + " repeticiones"

}

function actualizarBarra(){

let porcentaje = (repActual / repTotal) * 100

document.getElementById("barraProgreso").style.width =
porcentaje + "%"

}

function mostrarMensaje(){

let mensaje = document.getElementById("mensaje")

let random = Math.floor(Math.random() * mensajes.length)

mensaje.classList.remove("d-none")
mensaje.innerText = mensajes[random]

setTimeout(()=>{
mensaje.classList.add("d-none")
},1500)

}

function completarEjercicio(){

// bonus de puntos
sumarPuntos(50)

// aumentar racha
racha++

document.getElementById("racha").innerText =
"🔥 Racha: " + racha

mostrarResumen()
mostrarLogro()
lanzarConfetti()

}

function mostrarResumen(){

document.getElementById("resumen").innerHTML =

`
<div class="alert alert-info mt-3">

<h4>🎉 Sesión completada</h4>

<p>Completaste ${repActual} de ${repTotal} repeticiones.</p>

<p><strong>Puntos ganados:</strong> ${puntos}</p>

</div>
`

}

function mostrarLogro(){

let resumen = document.getElementById("resumen")

resumen.innerHTML +=

`
<div class="alert alert-success mt-2">
🏅 ¡Logro desbloqueado! Primer ejercicio completado
</div>
`

}

function lanzarConfetti(){

confetti({
particleCount: 150,
spread: 70,
origin: { y: 0.6 }
})

}
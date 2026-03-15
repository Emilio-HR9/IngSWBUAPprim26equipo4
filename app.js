let repActual = 0
let repTotal = 10

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

actualizarContador()
actualizarBarra()
mostrarMensaje()

if(repActual === repTotal){
mostrarResumen()
}

}

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

function mostrarResumen(){

document.getElementById("resumen").innerHTML =

`
<div class="alert alert-info mt-3">

<h4>🎉 Sesión completada</h4>

<p>Completaste ${repActual} de ${repTotal} repeticiones.</p>

</div>
`

}
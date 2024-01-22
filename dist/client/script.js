// Conexión al servidor Socket.IO
const socket = io.connect();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

const globalUsername = prompt("Ingrese su nombre de usuario:");

const room = prompt("Ingrese el nombre de la sala:");

// Se emite en evento joinRoom con la info del usuario especificada en los prompt
socket.emit("joinRoom", { room, username: globalUsername });

// Escucha el evento userJoined enviado desde el servidor (Server.ts) 
socket.on("userJoined", (username) => {
  // Creación de un elemento de lista (<li>) e inserción en el contenedor de mensajes
  const item = `<li><i>${username} se unió a la sala</i></li>`;
  messages.insertAdjacentHTML("beforeend", item);
});

// Escucha el evento chat message enviado desde el servidor (Server.ts)
socket.on("chat message", (data) => { // data es { room, username: globalUsername, message: input.value }
  // Creación de un elemento de lista (<li>) e inserción en el contenedor de mensajes
  const item = `<li><strong>${data.username}:</strong> ${data.message}</li>`;
  messages.insertAdjacentHTML("beforeend", item);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    // objeto que contiene la info necesaria para tener el mensaje. En la funcion de devolucion de llamada es equivalente a 'data'
    socket.emit("chat message", { room, username: globalUsername, message: input.value });
    input.value = "";
  }
});



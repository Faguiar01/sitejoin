// Dentro de assets/js/firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Suas credenciais REAIS do projeto JoinXperience Web
const firebaseConfig = {
  apiKey: "AIzaSyAXtFYlnq57P0COp-b4TFuYucGlbn4NkAK",
  authDomain: "joinxperience-site.firebaseapp.com",
  projectId: "joinxperience-site",
  storageBucket: "joinxperience-site.appspot.com",
  messagingSenderId: "140037739806",
  appId: "1:140037739806:web:322493d72ca6149abce50f",
  measurementId: "G-V4SRK0FNBN"
};

// Inicializa o Firebase com as suas configurações
const app = initializeApp(firebaseConfig);

// Opcional, mas útil: exportar a app se precisar noutros ficheiros
export { app };
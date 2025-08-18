// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// As suas credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAXtFYlnq57POCOp-b4TFuYucGlbn4NkAk",
    authDomain: "joinxperience-site.firebaseapp.com",
    projectId: "joinxperience-site",
    storageBucket: "joinxperience-site.appspot.com",
    messagingSenderId: "140037739806",
    appId: "1:140037739806:web:322493d72ca6149abce50f",
    measurementId: "G-V4SRK0FNBN"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Cria e exporta as instâncias dos serviços que vamos usar no projeto
const auth = getAuth(app);
const db = getFirestore(app);

// A linha que causava o erro (db.settings) foi removida, pois não é necessária na v9.

export { auth, db };

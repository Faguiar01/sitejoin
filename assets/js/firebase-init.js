// Importa as funções necessárias do SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ESTE É O BLOCO CORRETO QUE VOCÊ ENVIOU
const firebaseConfig = {
  apiKey: "AIzaSyAXtFYlnq57POCOp-b4TFuYucGlbn4NkAk",
  authDomain: "joinxperience-site.firebaseapp.com",
  projectId: "joinxperience-site",
  storageBucket: "joinxperience-site.firebasestorage.app",
  messagingSenderId: "140037739806",
  appId: "1:140037739806:web:322493d72ca6149abce50f",
  measurementId: "G-V4SRK0FNBN"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que você vai usar em outras partes do seu site
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Cria e exporta as instâncias dos serviços que vamos usar no projeto
const auth = getAuth(app);
const db = getFirestore(app);

// A linha que causava o erro (db.settings) foi removida, pois não é necessária na v9.

export { auth, db };

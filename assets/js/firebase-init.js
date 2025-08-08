// firebase-init.js - Versão Segura e Modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
  getAuth, 
  setPersistence, 
  browserSessionPersistence 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuração encapsulada para evitar vazamentos
const getFirebaseConfig = () => ({
  apiKey: "AIzaSyAXtFYlnq57POCOp-b4TFuYucGlbn4NkAk",
  authDomain: "joinxperience-site.firebaseapp.com",
  projectId: "joinxperience-site",
  storageBucket: "joinxperience-site.appspot.com",
  messagingSenderId: "140037739806",
  appId: "1:140037739806:web:322493d72ca6149abce50f",
  measurementId: "G-V4SRK0FNBN"
});

// Inicialização segura
const app = initializeApp(getFirebaseConfig());

// Configuração de autenticação com persistência de sessão
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Erro na persistência de autenticação:", error);
  });

// Configuração do Firestore com cache otimizado
const db = getFirestore(app);
db.settings({
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Ativa persistência offline (opcional)
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Persistência offline não suportada em múltiplas abas");
    } else if (err.code === 'unimplemented') {
      console.warn("Seu navegador não suporta persistência offline");
    }
  });

// Exportações nomeadas para controle explícito
export { auth, db };
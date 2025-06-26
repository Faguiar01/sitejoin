// Importa as funções que vamos usar do Firebase Authentication
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Inicia o serviço de autenticação
const auth = getAuth();

// Cria o "vigia" que observa o estado do login
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 1. Se existir um 'user', significa que ele está LOGADO.
    console.log("Acesso autorizado. Bem-vindo, utilizador!");

    // Mostra o conteúdo da página que estava oculto
    document.body.style.display = 'block';

  } else {
    // 2. Se não existir 'user', ele NÃO está logado.
    console.error("Acesso negado. A redirecionar...");

    // Redireciona o utilizador para a página de login
    // Ajuste o caminho se for diferente!
    window.location.href = "/login.html"; 
  }
});
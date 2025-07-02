// Importa as funções necessárias do Firebase
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
// Importa a instância 'auth' do seu arquivo de inicialização.
// O caminho './firebase-init.js' funciona porque ambos estão na mesma pasta (assets/js).
import { auth } from './firebase-init.js';

// --- LÓGICA DO GUARDA DE AUTENTICAÇÃO ---

// MELHORIA: Definimos o caminho para a página de login a partir da raiz do seu site.
// Isso é mais robusto do que usar a URL completa, pois funciona em qualquer servidor.
const loginPagePath = "/sitejoin/login.html";
const currentPath = window.location.pathname;

onAuthStateChanged(auth, (user) => {
    // 1. Se NÃO há usuário logado...
    if (!user) {
        // ...e a página atual NÃO é a de login, então redirecionamos.
        // Esta verificação evita um loop infinito de redirecionamentos.
        if (!currentPath.endsWith(loginPagePath)) {
            console.log("Auth Guard: Acesso negado. Redirecionando para login.");
            
            // Constrói a URL completa para o redirecionamento
            window.location.href = window.location.origin + loginPagePath;
        }
        return; // Interrompe a execução se não houver usuário.
    }

    // 2. Se HÁ um usuário logado, a página pode ser exibida.
    console.log("Auth Guard: Acesso permitido.");

    // O CSS de todas as páginas protegidas deve ter 'body { display: none; }'
    // Aqui, nós tornamos o body visível.

    // Verifica se o body da página deve usar Flexbox
    if (document.body.classList.contains('flex-body')) {
        document.body.style.display = 'flex';
    } else {
        // Caso contrário, usa o 'block' como padrão
        document.body.style.display = 'block';
    }
});
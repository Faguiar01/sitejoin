// Importa as funções necessárias do Firebase
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
// Importa a instância 'auth' do seu ficheiro de inicialização
// Este caminho ('./') funciona porque este script e o firebase-init.js estão na mesma pasta.
import { auth } from './firebase-init.js';

// URL completa da sua página de login
const urlLogin = 'https://faguiar01.github.io/sitejoin/login.html';

// Observa o estado de autenticação
onAuthStateChanged(auth, (user) => {
    // Se o usuário NÃO está logado...
    if (!user) {
        console.log("Auth Guard: Acesso negado. Redirecionando para login.");
        // ...e não estamos já na página de login, redireciona para lá.
        // A verificação 'window.location.href !== urlLogin' ajuda a prevenir loops.
        if (window.location.href !== urlLogin) {
            window.location.href = urlLogin;
        }
    } else {
        // Se o usuário está logado, a página pode ser exibida.
        console.log("Auth Guard: Acesso permitido.");
        // O body de todas as páginas protegidas deve ter 'display: none' por padrão no CSS.
        document.body.style.display = 'block';
        
        // Caso especial para páginas que usam display:flex no body
        if (document.body.classList.contains('flex-body')) {
             document.body.style.display = 'flex';
        }
    }
});

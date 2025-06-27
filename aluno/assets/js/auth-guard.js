// assets/js/auth-guard.js (NOVA VERSÃO - ROTEADOR INTELIGENTE)

// Importa as funções necessárias do Firebase
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Assume que você tem um 'firebase-init.js' que exporta 'auth' e 'db'
// Se o caminho estiver errado, ajuste-o conforme a sua estrutura.
import { auth, db } from './firebase-init.js';

/**
 * Redireciona o usuário para a página correta com base no seu perfil e progresso.
 * @param {object} userData - Os dados do usuário vindos do Firestore.
 */
function redirecionarUsuario(userData) {
    const perfil = userData.perfil;
    const urlBase = "https://faguiar01.github.io/sitejoin";
    let urlDestino = `${urlBase}/login.html`; // URL Padrão de segurança

    if (perfil === 'aluno') {
        const rodadaAtual = userData.rodadaAtual || 1; // Padrão para 1 se não existir
        
        switch (rodadaAtual) {
            case 1:
                urlDestino = `${urlBase}/aluno/rodada1-nivelamento.html`;
                break;
            case 2:
                urlDestino = `${urlBase}/aluno/rodada2-fundacao.html`;
                break;
            case 3:
                urlDestino = `${urlBase}/aluno/rodada3-operacoes.html`;
                break;
            // Adicione mais casos para futuras rodadas aqui
            default:
                console.warn(`Rodada ${rodadaAtual} não reconhecida. Enviando para a primeira.`);
                urlDestino = `${urlBase}/aluno/rodada1-nivelamento.html`;
        }

    } else if (perfil === 'professor') {
        // Ajuste se o nome da página principal do professor for diferente
        urlDestino = `${urlBase}/professor/index.html`; 
    } else {
        console.error("Perfil de usuário desconhecido:", perfil);
    }

    // CRÍTICO: Evita loop de redirecionamento infinito.
    // Só redireciona se o usuário NÃO estiver já na página de destino.
    if (window.location.href !== urlDestino) {
        console.log(`Redirecionando para: ${urlDestino}`);
        window.location.href = urlDestino;
    } else {
        console.log("Já está na página correta. Redirecionamento evitado.");
        // Se já está na página correta, apenas mostra o conteúdo.
        document.body.style.display = 'block';
    }
}

// --- PONTO DE ENTRADA DO SCRIPT ---
onAuthStateChanged(auth, async (user) => {
    // Pega o caminho atual da página
    const paginaAtual = window.location.pathname;

    // Se o usuário não estiver logado
    if (!user) {
        // Permite o acesso apenas às páginas de login e cadastro
        if (paginaAtual.endsWith('login.html') || paginaAtual.endsWith('cadastro.html')) {
            document.body.style.display = 'block'; // Mostra a página de login/cadastro
        } else {
            // Se tentar aceder a qualquer outra página, redireciona
            console.log("Usuário não logado. Redirecionando para o login.");
            window.location.href = 'https://faguiar01.github.io/sitejoin/login.html';
        }
        return; // Termina a execução aqui
    }

    // Se o usuário ESTÁ logado
    try {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Se o usuário está na página de login, mas já logado, redireciona-o
            if (paginaAtual.endsWith('login.html')) {
                redirecionarUsuario(userData);
            } else {
                // Para todas as outras páginas, apenas mostra o conteúdo
                // A lógica de proteção de rodada específica (ex: aluno da rodada 1 tentar aceder à rodada 3)
                // pode ser adicionada aqui se necessário. Por agora, apenas mostramos.
                document.body.style.display = 'block';
            }
        } else {
            console.error("Usuário autenticado, mas sem dados no Firestore. UID:", user.uid);
            window.location.href = 'https://faguiar01.github.io/sitejoin/login.html';
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        window.location.href = 'https://faguiar01.github.io/sitejoin/login.html';
    }
});

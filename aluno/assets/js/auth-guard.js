// =================================================================
// AUTH-GUARD.JS - Roteador Inteligente
// Este script protege as páginas e redireciona os utilizadores
// para o local correto com base no seu perfil e progresso.
// =================================================================

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// Importa as variáveis 'auth' e 'db' do seu ficheiro de inicialização.
import { auth, db } from './firebase-init.js';

/**
 * Determina a URL correta para o utilizador com base nos seus dados.
 * @param {object} userData - Dados do utilizador do Firestore.
 * @returns {string} A URL de destino correta.
 */
function getTargetURL(userData) {
    const perfil = userData.perfil;
    // IMPORTANTE: Esta é a URL base do seu projeto no GitHub Pages.
    const urlBase = "https://faguiar01.github.io/sitejoin"; 

    if (perfil === 'aluno') {
        const rodadaAtual = userData.rodadaAtual;
        
        // Se o aluno não tem turmaId, ele deve ser enviado para uma página de espera.
        if (!userData.turmaId) {
            return `${urlBase}/aluno/xperience.html`;
        }

        switch (rodadaAtual) {
            case 1: return `${urlBase}/aluno/rodada1-nivelamento.html`;
            case 2: return `${urlBase}/aluno/rodada2-fundacao.html`;
            case 3: return `${urlBase}/aluno/rodada3-operacoes.html`;
            // Adicione outras rodadas aqui no futuro
            default:
                // Se a rodada for inválida, envia para a página de espera.
                return `${urlBase}/aluno/xperience.html`;
        }
    } else if (perfil === 'professor') {
        return `${urlBase}/professor/professor.html`; // Página principal do professor
    }

    // Se o perfil for desconhecido, envia para o login como segurança
    return `${urlBase}/login.html`;
}

// --- PONTO DE ENTRADA DO SCRIPT ---
onAuthStateChanged(auth, async (user) => {
    const urlBase = "https://faguiar01.github.io/sitejoin";
    const urlLogin = `${urlBase}/login.html`;
    const urlCadastro = `${urlBase}/cadastro.html`;
    const paginaAtual = window.location.href.split('?')[0]; // Ignora parâmetros de URL

    // Se não há utilizador logado...
    if (!user) {
        // ...e a página atual NÃO é a de login nem a de cadastro...
        if (paginaAtual !== urlLogin && paginaAtual !== urlCadastro) {
            // ...redireciona para o login.
            console.log("Acesso não autorizado. Redirecionando para o login...");
            window.location.href = urlLogin;
        } else {
            // Se já está na página de login ou cadastro, apenas mostra o conteúdo.
            document.body.style.display = 'block';
        }
        return;
    }

    // Se há um utilizador logado...
    try {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const urlDestino = getTargetURL(userData);

            // Se o utilizador está numa página que não é a correta para ele, redireciona.
            if (paginaAtual !== urlDestino) {
                // Exceção: não redirecionar se já estiver a ir para o destino
                // Isto previne loops infinitos.
                console.log(`Página atual (${paginaAtual}) é diferente do destino (${urlDestino}). Redirecionando...`);
                window.location.href = urlDestino;
            } else {
                // Se chegou aqui, o utilizador está logado e na página correta.
                document.body.style.display = 'block';
            }

        } else {
            // Caso de segurança: utilizador autenticado mas sem registro no Firestore.
            console.error("Erro: Utilizador autenticado mas não encontrado no Firestore. UID:", user.uid);
            window.location.href = urlLogin;
        }
    } catch (error) {
        console.error("Erro ao verificar autorização:", error);
        window.location.href = urlLogin;
    }
});

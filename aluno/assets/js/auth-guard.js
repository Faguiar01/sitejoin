// =================================================================
// AUTH-GUARD.JS - Roteador Inteligente
// Este script protege as páginas e redireciona os utilizadores
// para o local correto com base no seu perfil e progresso.
// =================================================================

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// Importa as variáveis 'auth' e 'db' do seu ficheiro de inicialização.
// VERIFIQUE SE O CAMINHO PARA O SEU FICHEIRO ESTÁ CORRETO.
import { auth, db } from './firebase-init.js';

/**
 * Determina a URL correta para o utilizador com base nos seus dados.
 * @param {object} userData - Dados do utilizador do Firestore.
 * @returns {string} A URL de destino correta.
 */
function getTargetURL(userData) {
    const perfil = userData.perfil;
    const urlBase = "https://faguiar01.github.io/sitejoin";

    if (perfil === 'aluno') {
        const rodadaAtual = userData.rodadaAtual;
        
        if (!userData.turmaId) {
            return `${urlBase}/aluno/xperience.html`;
        }

        switch (rodadaAtual) {
            case 1: return `${urlBase}/aluno/rodada1-nivelamento.html`;
            case 2: return `${urlBase}/aluno/rodada2-fundacao.html`;
            case 3: return `${urlBase}/aluno/rodada3-operacoes.html`;
            default:
                return `${urlBase}/aluno/xperience.html`;
        }
    } else if (perfil === 'professor') {
        return `${urlBase}/professor/professor.html`;
    }

    return `${urlBase}/login.html`;
}

// --- PONTO DE ENTRADA DO SCRIPT ---
onAuthStateChanged(auth, async (user) => {
    const urlBase = "https://faguiar01.github.io/sitejoin";
    const urlLogin = `${urlBase}/login.html`;
    const urlCadastro = `${urlBase}/cadastro.html`;
    
    // Normaliza a URL atual para evitar problemas com ou sem '/' no final
    const paginaAtual = window.location.href.split('?')[0].replace(/\/$/, "");

    // Se não há utilizador logado...
    if (!user) {
        // ...e a página atual NÃO é a de login nem a de cadastro...
        const paginasPublicas = [urlLogin, urlCadastro, `${urlBase}/`, `${urlBase}/index.html`];
        if (!paginasPublicas.includes(paginaAtual)) {
            // ...redireciona para o login.
            console.log("Acesso não autorizado. Redirecionando para o login...");
            window.location.href = urlLogin;
        } else {
            // Se já está numa página pública, apenas mostra o conteúdo.
            document.body.style.display = 'block';
            if (document.body.style.flexDirection) { // Mantém o estilo flex para login/cadastro
                 document.body.style.display = 'flex';
            }
        }
        return;
    }

    // Se há um utilizador logado...
    try {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const urlDestino = getTargetURL(userData).replace(/\/$/, "");

            // Se o utilizador está numa página que não é a correta para ele, redireciona.
            if (paginaAtual !== urlDestino) {
                // Exceção para páginas de login/cadastro, para evitar loop se já estiver logado
                if (paginaAtual === urlLogin || paginaAtual === urlCadastro) {
                     window.location.href = urlDestino;
                     return;
                }
                
                // Exceção para páginas comuns que todos podem acessar
                const paginasComuns = [
                    'xperience.html',
                    'mural-explorador.html',
                    'perfil-investidor.html',
                    'biblioteca.html',
                    'faq.html'
                ];
                const nomePaginaAtual = paginaAtual.split('/').pop();
                if (userData.perfil === 'aluno' && paginasComuns.includes(nomePaginaAtual)) {
                     document.body.style.display = 'block'; // Permite o acesso
                     if (document.body.style.flexDirection) {
                        document.body.style.display = 'flex';
                     }
                     return;
                }


                console.log(`Página atual (${paginaAtual}) é diferente do destino (${urlDestino}). Redirecionando...`);
                window.location.href = urlDestino;
            } else {
                // Se já está na página correta, apenas mostra o conteúdo.
                console.log("Já está na página correta. Exibindo conteúdo.");
                 document.body.style.display = 'block';
                 if (document.body.style.flexDirection) {
                    document.body.style.display = 'flex';
                 }
            }

        } else {
            console.error("Erro: Utilizador autenticado mas não encontrado no Firestore. UID:", user.uid);
            window.location.href = urlLogin;
        }
    } catch (error) {
        console.error("Erro ao verificar autorização:", error);
        window.location.href = urlLogin;
    }
});

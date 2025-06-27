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
    const urlBase = "https://faguiar01.github.io/sitejoin"; // Base do seu site no GitHub Pages

    if (perfil === 'aluno') {
        const rodadaAtual = userData.rodadaAtual || 1;
        switch (rodadaAtual) {
            case 1: return `${urlBase}/aluno/rodada1-nivelamento.html`;
            case 2: return `${urlBase}/aluno/rodada2-fundacao.html`;
            case 3: return `${urlBase}/aluno/rodada3-operacoes.html`;
            // Adicione outras rodadas aqui no futuro
            default: return `${urlBase}/aluno/rodada1-nivelamento.html`;
        }
    } else if (perfil === 'professor') {
        return `${urlBase}/professor/index.html`; // Página principal do professor
    }

    // Se o perfil for desconhecido, envia para o login como segurança
    return `${urlBase}/login.html`;
}

// --- PONTO DE ENTRADA DO SCRIPT ---
onAuthStateChanged(auth, async (user) => {
    const urlLogin = 'https://faguiar01.github.io/sitejoin/login.html';
    const urlCadastro = 'https://faguiar01.github.io/sitejoin/cadastro.html';
    const paginaAtual = window.location.href;

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

            // Se o utilizador está na página de login/cadastro, mas já está logado, redireciona.
            if (paginaAtual === urlLogin || paginaAtual === urlCadastro) {
                window.location.href = urlDestino;
                return;
            }

            // Se o utilizador está numa página que não é a correta para ele, redireciona.
            // Ex: Aluno da rodada 1 tentando aceder a URL da rodada 3 diretamente.
            if (paginaAtual !== urlDestino) {
                 // Exceção: Permitir que o aluno aceda a páginas comuns como 'xperience.html' ou 'mural-explorador.html'
                 // Adicione aqui outras páginas "comuns" que não devem causar redirecionamento.
                const paginasPermitidasSempre = [
                    'xperience.html',
                    'mural-explorador.html',
                    'perfil-investidor.html',
                    'biblioteca.html',
                    'faq.html'
                ];

                const nomePaginaAtual = paginaAtual.split('/').pop();
                if (paginasPermitidasSempre.includes(nomePaginaAtual)) {
                    document.body.style.display = 'block'; // Permite o acesso
                    return;
                }

                // Se não for uma página permitida, e não for a página correta da rodada, redireciona.
                console.log(`Página incorreta. Redirecionando para: ${urlDestino}`);
                window.location.href = urlDestino;
                return;
            }

            // Se chegou até aqui, o utilizador está logado e na página correta.
            document.body.style.display = 'block';

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
```

### Resumo da Correção

Este novo `auth-guard.js` é muito mais completo:

1.  **Identifica o Perfil:** Sabe se o utilizador é `aluno` ou `professor`.
2.  **Lê a Rodada Atual:** Para alunos, ele verifica o campo `rodadaAtual` no Firestore.
3.  **Calcula o Destino Certo:** Determina qual é a página correta para aquele utilizador (`rodada1-nivelamento.html`, `professor/index.html`, etc.).
4.  **Redireciona Sempre que Necessário:** Se o utilizador tentar aceder a uma página errada (ou à página de login quando já está logado), ele é automaticamente corrigido e enviado para o local certo.

Com este ficheiro implementado em todas as páginas, o seu sistema de navegação ficará correto e seguro. Por favor, teste e me diga se agora funciona como espera
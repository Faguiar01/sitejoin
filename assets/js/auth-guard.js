// auth-guard.js - Versão Otimizada
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { auth } from './firebase-init.js';

// --- CONSTANTES ---
const LOGIN_PAGE = "/sitejoin/login.html";
const PUBLIC_PAGES = [
  "/sitejoin/login.html",
  "/sitejoin/recover.html"
];

// --- LÓGICA PRINCIPAL ---
onAuthStateChanged(auth, (user) => {
  const currentPath = window.location.pathname;

  // 1. Páginas públicas: ignora verificação
  if (PUBLIC_PAGES.some(page => currentPath.endsWith(page))) {
    unlockPage();
    return;
  }

  // 2. Páginas privadas: exige autenticação
  if (!user) {
    console.warn("Auth Guard: Redirecionando para login...");
    redirectToLogin();
    return;
  }

  // 3. Verificação adicional para alunos (opcional)
  if (currentPath.includes('/aluno/') && !user.email.endsWith('@escola.com')) {
    console.error("Auth Guard: Acesso restrito a alunos");
    redirectToLogin();
    return;
  }

  unlockPage();
});

// --- FUNÇÕES AUXILIARES ---
function redirectToLogin() {
  // Evita loops em páginas de erro
  if (!window.location.href.includes(LOGIN_PAGE)) {
    window.location.href = window.location.origin + LOGIN_PAGE;
  }
}

function unlockPage() {
  // Remove bloqueio de CSS de forma segura
  document.body.style.display = 
    document.body.classList.contains('flex-body') ? 'flex' : 'block';
}
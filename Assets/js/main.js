/* =====================================================================
   MAIN.JS — Responsável por: menu mobile, navegação (rolagem suave e
   item ativo), eventos globais e carregamento dinâmico de componentes
   (navbar/footer/sidebar). Também contém a lógica da tela de login
   (index.html), que é a única página fora de pages/ e pages/admin/.
   ===================================================================== */

/* =====================================================================
   COMPONENTES (NAVBAR / FOOTER / SIDEBAR)
   ===================================================================== */

/** Carrega a navbar pública e o footer nas páginas do site (home/cardápio/promoções). */
async function carregarComponentesPublicos() {
  await carregarComponente("../components/navbar.html", "#navbar-placeholder");
  await carregarComponente("../components/footer.html", "#footer-placeholder");
  await carregarComponenteHeader();

  configurarMenuMobile();
  configurarNavegacaoAtiva();
  configurarRolagemSuave();
}

/** Carrega o componente de cabeçalho de seção (components/header.html), se a página tiver o placeholder. */
async function carregarComponenteHeader() {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;

  await carregarComponente("../components/header.html", "#header-placeholder");

  const subtitulo = placeholder.dataset.subtitle;
  const elementoSubtitulo = placeholder.querySelector("[data-header-subtitle]");
  if (subtitulo && elementoSubtitulo) {
    elementoSubtitulo.textContent = subtitulo;
  }
}

/** Carrega a sidebar nas páginas do painel administrativo. */
async function carregarComponentesAdmin() {
  await carregarComponente("../../components/sidebar.html", "#sidebar-placeholder");
  configurarNavegacaoAtivaAdmin();
  configurarMenuMobileAdmin();
}

/* =====================================================================
   MENU MOBILE (SITE PÚBLICO)
   ===================================================================== */

function configurarMenuMobile() {
  const botao = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!botao || !links) return;

  botao.addEventListener("click", () => {
    const aberto = links.classList.toggle("active");
    botao.setAttribute("aria-expanded", String(aberto));
  });

  // Fecha o menu mobile ao clicar em qualquer link.
  links.addEventListener("click", (evento) => {
    if (evento.target.tagName === "A") {
      links.classList.remove("active");
      botao.setAttribute("aria-expanded", "false");
    }
  });
}

/* =====================================================================
   MENU MOBILE (PAINEL ADMINISTRATIVO)
   ===================================================================== */

function configurarMenuMobileAdmin() {
  const botao = document.getElementById("sidebar-toggle");
  const sidebarMenu = document.querySelector(".sidebar-menu");
  if (!botao || !sidebarMenu) return;

  botao.addEventListener("click", () => {
    sidebarMenu.classList.toggle("active");
  });
}

/* =====================================================================
   NAVEGAÇÃO ATIVA
   ===================================================================== */

/** Marca como ativo o link da navbar correspondente à página atual. */
function configurarNavegacaoAtiva() {
  const paginaAtual = document.body.dataset.active;
  if (!paginaAtual) return;

  document.querySelectorAll(".nav-links a[data-nav]").forEach((link) => {
    if (link.dataset.nav === paginaAtual) {
      link.classList.add("active");
    }
  });
}

/** Marca como ativo o item da sidebar correspondente à página atual. */
function configurarNavegacaoAtivaAdmin() {
  const paginaAtual = document.body.dataset.active;
  if (!paginaAtual) return;

  document.querySelectorAll(".sidebar-menu a[data-nav]").forEach((link) => {
    if (link.dataset.nav === paginaAtual) {
      link.classList.add("active");
    }
  });
}

/* =====================================================================
   ROLAGEM SUAVE (links internos com #âncora)
   ===================================================================== */

function configurarRolagemSuave() {
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
      const href = link.getAttribute("href");
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const idDestino = href.slice(hashIndex + 1);
      const destino = document.getElementById(idDestino);

      // Só intercepta a navegação se a âncora existir na página atual.
      if (destino) {
        evento.preventDefault();
        destino.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* =====================================================================
   LOGIN (index.html)
   ===================================================================== */

const USUARIOS_SISTEMA = {
  admin: {
    senha: "admin123",
    papel: "admin",
    redirecionarPara: "pages/admin/dashboard.html",
    nome: "Allan Gustavo",
  },
  usuario: {
    senha: "1234",
    papel: "user",
    redirecionarPara: "pages/home.html",
    nome: "Usuário",
  },
};

let abaAtual = "admin";

function selecionarAba(aba) {
  abaAtual = aba;

  document.getElementById("tab-admin").classList.toggle("active", aba === "admin");
  document.getElementById("tab-user").classList.toggle("active", aba === "user");

  document.getElementById("btn-text").textContent =
    aba === "admin" ? "Entrar como Administrador" : "Entrar como Usuário";

  document.getElementById("hint-admin").style.display = aba === "admin" ? "block" : "none";
  document.getElementById("hint-user").style.display = aba === "user" ? "block" : "none";

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("username").focus();
}

function alternarSenhaVisivel() {
  const input = document.getElementById("password");
  const icone = document.getElementById("eye-icon");

  if (input.type === "password") {
    input.type = "text";
    icone.className = "ri-eye-off-line";
  } else {
    input.type = "password";
    icone.className = "ri-eye-line";
  }
}

function realizarLogin() {
  const usuarioDigitado = document.getElementById("username").value.trim();
  const senhaDigitada = document.getElementById("password").value;
  const lembrar = document.getElementById("remember-me").checked;

  if (!usuarioDigitado || !senhaDigitada) {
    mostrarToast("Preencha todos os campos", "error");
    return;
  }

  const usuario = USUARIOS_SISTEMA[usuarioDigitado];

  if (!usuario) {
    mostrarToast("Usuário não encontrado", "error");
    return;
  }

  if (usuario.papel !== abaAtual) {
    const abaCorreta = usuario.papel === "admin" ? "Administrador" : "Usuário";
    mostrarToast(`Use a aba "${abaCorreta}" para este login`, "error");
    return;
  }

  if (usuario.senha !== senhaDigitada) {
    mostrarToast("Senha incorreta. Tente novamente.", "error");
    return;
  }

  if (lembrar) {
    localStorage.setItem("rememberMe", "true");
    localStorage.setItem("savedUsername", usuarioDigitado);
    localStorage.setItem("savedTab", abaAtual);
  } else {
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("savedTab");
  }

  sessionStorage.setItem("loggedUser", usuarioDigitado);
  sessionStorage.setItem("loggedRole", usuario.papel);
  sessionStorage.setItem("loggedName", usuario.nome);

  const destino = usuario.papel === "admin" ? "Dashboard" : "Home";
  mostrarToast(`Bem-vindo, ${usuario.nome}! Indo para ${destino}...`, "success");

  setTimeout(() => {
    window.location.href = usuario.redirecionarPara;
  }, 1500);
}

function inicializarLogin() {
  document.getElementById("hint-admin").style.display = "block";

  if (localStorage.getItem("rememberMe") === "true") {
    const usuarioSalvo = localStorage.getItem("savedUsername");
    const abaSalva = localStorage.getItem("savedTab") || "admin";

    selecionarAba(abaSalva);
    document.getElementById("username").value = usuarioSalvo || "";
    document.getElementById("remember-me").checked = true;
  }

  document.getElementById("tab-admin").addEventListener("click", () => selecionarAba("admin"));
  document.getElementById("tab-user").addEventListener("click", () => selecionarAba("user"));
  document.querySelector(".password-toggle").addEventListener("click", alternarSenhaVisivel);
  document.querySelector(".btn-login").addEventListener("click", realizarLogin);

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") realizarLogin();
  });
}

/* =====================================================================
   INICIALIZAÇÃO GERAL
   ===================================================================== */

/* =====================================================================
   FORMULÁRIOS DE CONFIGURAÇÕES (pages/admin/configuracoes.html)
   ===================================================================== */

function configurarFormulariosConfiguracoes() {
  document.querySelectorAll(".settings-card").forEach((form) => {
    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      mostrarToast("Alterações salvas com sucesso!", "success");
    });
  });
}

/* =====================================================================
   INICIALIZAÇÃO GERAL
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("navbar-placeholder")) {
    carregarComponentesPublicos();
  }

  if (document.getElementById("sidebar-placeholder")) {
    carregarComponentesAdmin();
  }

  if (document.getElementById("tab-admin")) {
    inicializarLogin();
  }

  if (document.querySelector(".settings-section")) {
    configurarFormulariosConfiguracoes();
  }
});

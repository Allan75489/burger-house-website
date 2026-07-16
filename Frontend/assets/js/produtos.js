const CATEGORIAS_CARDAPIO = [
  { chave: "hamburguer", titulo: "🍔 Hambúrgueres" },
  { chave: "batata", titulo: "🍟 Batatas" },
  { chave: "bebida", titulo: "🥤 Bebidas" },
  { chave: "sobremesa", titulo: "🍨 Sobremesas" },
];

let produtosCache = [];

/**
 * Cria o elemento de card de um produto.
 * @param {{id:number, nome:string, descricao:string, preco:number, imagem:string}} produto
 * @returns {HTMLElement}
 */
function criarCardProduto(produto) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="../${produto.imagem}" alt="${produto.nome}" loading="lazy">
    <h3>${produto.nome}</h3>
    <span class="preco">R$ ${formatarPreco(produto.preco)}</span>
    <button class="botao" type="button">Pedir</button>
  `;

  card.querySelector("button").addEventListener("click", () => {
    adicionarAoCarrinho(produto);
    renderizarCarrinhoCardapio();
    mostrarToast(`${produto.nome} adicionado ao carrinho 🔥`, "success");
  });

  return card;
}

/**
 * Renderiza o cardápio completo (todas as categorias) dentro do
 * elemento <main class="cardapio-container">.
 * @param {Array} produtos
 * @param {string} filtroCategoria - "todos" ou uma chave de categoria
 */
function renderizarCardapio(produtos, filtroCategoria = "todos") {
  const container = document.getElementById("categorias-cardapio");
  if (!container) return;

  container.innerHTML = "";

  const categoriasParaExibir =
    filtroCategoria === "todos"
      ? CATEGORIAS_CARDAPIO
      : CATEGORIAS_CARDAPIO.filter((cat) => cat.chave === filtroCategoria);

  categoriasParaExibir.forEach((categoria) => {
    const produtosDaCategoria = produtos.filter((p) => p.categoria === categoria.chave);
    if (produtosDaCategoria.length === 0) return;

    const secao = document.createElement("section");
    secao.className = "categoria";
    secao.innerHTML = `<h2>${categoria.titulo}</h2>`;

    const grid = document.createElement("div");
    grid.className = "grid";

    produtosDaCategoria.forEach((produto) => {
      grid.appendChild(criarCardProduto(produto));
    });

    secao.appendChild(grid);
    container.appendChild(secao);
  });
}

/** Configura os botões de filtro de categoria do cardápio. */
function configurarFiltros(produtos) {
  const botoes = document.querySelectorAll(".filtro-btn");
  if (botoes.length === 0) return;

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoes.forEach((b) => b.classList.remove("active"));
      botao.classList.add("active");
      renderizarCardapio(produtos, botao.dataset.categoria);
    });
  });
}

/** Renderiza a lista de itens do carrinho na página do cardápio. */
function renderizarCarrinhoCardapio() {
  const lista = document.getElementById("lista-carrinho");
  const totalSpan = document.getElementById("total-carrinho");
  if (!lista || !totalSpan) return;

  const carrinho = obterCarrinho();
  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = `<li class="carrinho-vazio">Seu carrinho está vazio.</li>`;
  }

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "carrinho-item";
    li.innerHTML = `
      <span>${item.nome} x${item.quantidade} — R$ ${formatarPreco(calcularSubtotalItem(item))}</span>
      <button class="remover-item" type="button" aria-label="Remover ${item.nome}">❌</button>
    `;

    li.querySelector(".remover-item").addEventListener("click", () => {
      removerUmDoCarrinho(index);
      renderizarCarrinhoCardapio();
    });

    lista.appendChild(li);
  });

  totalSpan.textContent = formatarPreco(calcularTotalCarrinho(carrinho));
}

/** Configura os botões "Limpar" e "Finalizar Pedido" do painel do carrinho. */
function configurarAcoesCarrinhoCardapio() {
  const btnLimpar = document.getElementById("btn-limpar-carrinho");
  const btnFinalizar = document.getElementById("btn-finalizar-pedido");

  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      limparCarrinho();
      renderizarCarrinhoCardapio();
    });
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      const carrinho = obterCarrinho();

      if (carrinho.length === 0) {
        mostrarToast("Seu carrinho está vazio!", "error");
        return;
      }

      const mensagem = montarMensagemPedido(carrinho);
      const url = montarLinkWhatsApp("5583991998747", mensagem);
      window.open(url, "_blank");
    });
  }
}

/** Inicializa a página de cardápio: carrega produtos, renderiza e liga eventos. */
async function inicializarCardapio() {
  produtosCache = await carregarJSON("../assets/data/produtos.json");
  renderizarCardapio(produtosCache);
  configurarFiltros(produtosCache);
  renderizarCarrinhoCardapio();
  configurarAcoesCarrinhoCardapio();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("categorias-cardapio")) {
    inicializarCardapio();
  }

  if (document.getElementById("grid-promocoes")) {
    inicializarPromocoes();
  }
});

/* =====================================================================
   PROMOÇÕES — carregamento e renderização dos combos da semana, e do
   carrinho-drawer (painel deslizante) da página promocoes.html.
   ===================================================================== */

/**
 * Cria o elemento de card de uma promoção.
 * @param {{id:number, nome:string, descricao:string, precoAntigo:number, preco:number, emoji:string}} promocao
 * @returns {HTMLElement}
 */
function criarCardPromocao(promocao) {
  const card = document.createElement("div");
  card.className = "card-promocao";
  card.innerHTML = `
    <h3>${promocao.emoji} ${promocao.nome}</h3>
    <p>${promocao.descricao}</p>
    <span class="preco-antigo">R$ ${formatarPreco(promocao.precoAntigo)}</span>
    <span class="preco-novo">R$ ${formatarPreco(promocao.preco)}</span>
    <button type="button">Adicionar ao Carrinho</button>
  `;

  card.querySelector("button").addEventListener("click", () => {
    adicionarAoCarrinho(promocao);
    renderizarCarrinhoDrawer();
    mostrarToast(`${promocao.nome} adicionado ao carrinho 🔥`, "success");
  });

  return card;
}

/** Renderiza a grade de promoções dentro de #grid-promocoes. */
function renderizarPromocoes(promocoes) {
  const grid = document.getElementById("grid-promocoes");
  if (!grid) return;

  grid.innerHTML = "";
  promocoes.forEach((promocao) => grid.appendChild(criarCardPromocao(promocao)));
}

/** Renderiza os itens do carrinho-drawer (painel deslizante) e o contador. */
function renderizarCarrinhoDrawer() {
  const lista = document.getElementById("itens");
  const totalSpan = document.getElementById("total-drawer");
  const contador = document.getElementById("contador");
  if (!lista || !totalSpan || !contador) return;

  const carrinho = obterCarrinho();
  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
  }

  carrinho.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span>${item.nome} x${item.quantidade} — R$ ${formatarPreco(calcularSubtotalItem(item))}</span>
      <button class="remover" type="button" aria-label="Remover ${item.nome}">X</button>
    `;

    div.querySelector(".remover").addEventListener("click", () => {
      removerUmDoCarrinho(index);
      renderizarCarrinhoDrawer();
    });

    lista.appendChild(div);
  });

  totalSpan.textContent = `R$ ${formatarPreco(calcularTotalCarrinho(carrinho))}`;
  contador.textContent = calcularQuantidadeTotal(carrinho);
}

/** Abre/fecha o painel deslizante do carrinho (drawer) e o overlay. */
function configurarDrawerCarrinho() {
  const carrinhoEl = document.getElementById("carrinho-drawer");
  const overlay = document.getElementById("overlay");
  const btnAbrir = document.getElementById("btn-abrir-carrinho");
  const btnFechar = document.getElementById("btn-fechar-carrinho");

  const abrir = () => {
    carrinhoEl.classList.add("ativo");
    overlay.classList.add("ativo");
  };

  const fechar = () => {
    carrinhoEl.classList.remove("ativo");
    overlay.classList.remove("ativo");
  };

  btnAbrir?.addEventListener("click", abrir);
  btnFechar?.addEventListener("click", fechar);
  overlay?.addEventListener("click", fechar);
}

/** Configura os botões "Finalizar Pedido" e "Limpar Carrinho" do drawer. */
function configurarAcoesCarrinhoDrawer() {
  const btnFinalizar = document.getElementById("btn-finalizar-pedido-drawer");
  const btnLimpar = document.getElementById("btn-limpar-carrinho-drawer");

  btnFinalizar?.addEventListener("click", () => {
    const carrinho = obterCarrinho();

    if (carrinho.length === 0) {
      mostrarToast("Carrinho vazio", "error");
      return;
    }

    const mensagem = montarMensagemPedido(carrinho);
    const url = montarLinkWhatsApp("5583991998747", mensagem);
    window.open(url, "_blank");
  });

  btnLimpar?.addEventListener("click", () => {
    limparCarrinho();
    renderizarCarrinhoDrawer();
  });
}

/** Inicializa a página de promoções: carrega combos, renderiza e liga eventos. */
async function inicializarPromocoes() {
  const promocoes = await carregarJSON("../assets/data/promocoes.json");
  renderizarPromocoes(promocoes);
  renderizarCarrinhoDrawer();
  configurarDrawerCarrinho();
  configurarAcoesCarrinhoDrawer();
}

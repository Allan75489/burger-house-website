/* =====================================================================
   CARRINHO.JS — Carrinho de compras persistido em localStorage.
   Responsável por: adicionar produto, remover produto, atualizar
   quantidade e calcular subtotal/total. Sem backend.
   Compartilhado entre as páginas de cardápio e promoções.
   ===================================================================== */

const CARRINHO_STORAGE_KEY = "fireBurgerHouse.carrinho";

/**
 * Lê o carrinho salvo no localStorage.
 * @returns {Array<{id:number, nome:string, preco:number, quantidade:number}>}
 */
function obterCarrinho() {
  try {
    const dados = localStorage.getItem(CARRINHO_STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao ler carrinho do localStorage:", erro);
    return [];
  }
}

/**
 * Persiste o carrinho no localStorage.
 * @param {Array} carrinho
 */
function salvarCarrinho(carrinho) {
  localStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(carrinho));
}

/**
 * Adiciona um produto ao carrinho. Se já existir (mesmo id ou nome),
 * apenas incrementa a quantidade.
 * @param {{id?: number, nome: string, preco: number}} produto
 */
function adicionarAoCarrinho(produto) {
  const carrinho = obterCarrinho();

  const chave = produto.id ?? produto.nome;
  const itemExistente = carrinho.find((item) => (item.id ?? item.nome) === chave);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      id: produto.id ?? null,
      nome: produto.nome,
      preco: Number(produto.preco),
      quantidade: 1,
    });
  }

  salvarCarrinho(carrinho);
  return carrinho;
}

/**
 * Remove uma unidade do item no índice informado. Se a quantidade
 * chegar a zero, o item é removido da lista.
 * @param {number} index
 */
function removerUmDoCarrinho(index) {
  const carrinho = obterCarrinho();
  const item = carrinho[index];
  if (!item) return carrinho;

  if (item.quantidade > 1) {
    item.quantidade -= 1;
  } else {
    carrinho.splice(index, 1);
  }

  salvarCarrinho(carrinho);
  return carrinho;
}

/**
 * Remove completamente um item do carrinho, independente da quantidade.
 * @param {number} index
 */
function removerItemDoCarrinho(index) {
  const carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  return carrinho;
}

/**
 * Atualiza a quantidade de um item do carrinho para um valor exato.
 * Remove o item se a nova quantidade for menor ou igual a zero.
 * @param {number} index
 * @param {number} novaQuantidade
 */
function atualizarQuantidade(index, novaQuantidade) {
  const carrinho = obterCarrinho();
  const item = carrinho[index];
  if (!item) return carrinho;

  if (novaQuantidade <= 0) {
    carrinho.splice(index, 1);
  } else {
    item.quantidade = novaQuantidade;
  }

  salvarCarrinho(carrinho);
  return carrinho;
}

/** Esvazia completamente o carrinho. */
function limparCarrinho() {
  salvarCarrinho([]);
  return [];
}

/** Calcula o subtotal de um item (preço x quantidade). */
function calcularSubtotalItem(item) {
  return item.preco * item.quantidade;
}

/** Calcula o total geral do carrinho. */
function calcularTotalCarrinho(carrinho) {
  return carrinho.reduce((total, item) => total + calcularSubtotalItem(item), 0);
}

/** Retorna a quantidade total de itens (somando as quantidades). */
function calcularQuantidadeTotal(carrinho) {
  return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

/**
 * Monta a mensagem de pedido formatada para envio via WhatsApp.
 * @param {Array} carrinho
 * @returns {string} mensagem já com %0A para quebras de linha
 */
function montarMensagemPedido(carrinho) {
  let mensagem = "🍔 *Pedido - Fire Burger House*%0A%0A";

  carrinho.forEach((item) => {
    const subtotal = calcularSubtotalItem(item);
    mensagem += `• ${item.nome} x${item.quantidade} — R$ ${formatarPreco(subtotal)}%0A`;
  });

  mensagem += `%0A💰 *Total: R$ ${formatarPreco(calcularTotalCarrinho(carrinho))}*`;
  return mensagem;
}

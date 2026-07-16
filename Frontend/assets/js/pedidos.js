const PEDIDOS_MOCK = [
  { id: "#1024", cliente: "João Silva", item: "Combo Fire Burger", valor: 39.9, status: "pendente" },
  { id: "#1025", cliente: "Maria Oliveira", item: "Duplo Bacon", valor: 44.9, status: "preparo" },
  { id: "#1026", cliente: "Carlos Souza", item: "Fire Chicken", valor: 29.9, status: "entregue" },
  { id: "#1027", cliente: "Ana Costa", item: "Fire Cheese", valor: 34.9, status: "pendente" },
  { id: "#1028", cliente: "Roberto Santos", item: "Fire Bacon", valor: 39.9, status: "preparo" },
  { id: "#1029", cliente: "Juliana Mendes", item: "Fire Double", valor: 49.9, status: "preparo" },
  { id: "#1030", cliente: "João Pedro", item: "Combo Fire Burger", valor: 29.9, status: "entregue" },
  { id: "#1031", cliente: "Lukas Silva", item: "Fire Chicken", valor: 29.9, status: "pendente" },
];

const STATUS_LABEL = {
  pendente: "Pendente",
  preparo: "Em preparo",
  entregue: "Entregue",
};

/** Renderiza as linhas da tabela de pedidos a partir de um array de pedidos. */
function renderizarPedidos(pedidos) {
  const corpoTabela = document.getElementById("corpo-tabela-pedidos");
  if (!corpoTabela) return;

  corpoTabela.innerHTML = "";

  pedidos.forEach((pedido, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.item}</td>
      <td>R$ ${formatarPreco(pedido.valor)}</td>
      <td><span class="status ${pedido.status}">${STATUS_LABEL[pedido.status]}</span></td>
      <td>
        <button class="btn-action btn-view" data-index="${index}">Ver</button>
        <button class="btn-action btn-delete" data-index="${index}">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });

  configurarAcoesPedidos(pedidos);
}

/** Liga os eventos de clique dos botões "Ver" e "Excluir" da tabela. */
function configurarAcoesPedidos(pedidos) {
  document.querySelectorAll(".btn-view").forEach((botao) => {
    botao.addEventListener("click", () => {
      const pedido = pedidos[Number(botao.dataset.index)];
      mostrarToast(`Pedido ${pedido.id} de ${pedido.cliente}`, "success");
    });
  });

  document.querySelectorAll(".btn-delete").forEach((botao) => {
    botao.addEventListener("click", () => {
      const index = Number(botao.dataset.index);
      const removido = pedidos.splice(index, 1)[0];
      renderizarPedidos(pedidos);
      if (removido) mostrarToast(`Pedido ${removido.id} excluído`, "error");
    });
  });
}

/** Inicializa a página de pedidos do painel administrativo. */
function inicializarPedidos() {
  const pedidos = [...PEDIDOS_MOCK];
  renderizarPedidos(pedidos);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("corpo-tabela-pedidos")) {
    inicializarPedidos();
  }
});

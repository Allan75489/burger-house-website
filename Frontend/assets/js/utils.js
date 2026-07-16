/**

 * @param {number} valor
 * @returns {string}
 */
function formatarPreco(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

/**
 * Exibe uma notificação tipo toast no canto superior direito.
 * @param {string} texto
 * @param {"success"|"error"} tipo
 */
function mostrarToast(texto, tipo = "success") {
  const antigo = document.querySelector(".toast");
  if (antigo) antigo.remove();

  const div = document.createElement("div");
  div.className = `toast ${tipo}`;
  div.textContent = texto;
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

/**
 * Busca um arquivo JSON e retorna os dados já parseados.
 * @param {string} caminho
 * @returns {Promise<any[]>}
 */
async function carregarJSON(caminho) {
  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`Falha ao buscar ${caminho}`);
    return await resposta.json();
  } catch (erro) {
    console.error("Erro ao carregar JSON:", erro);
    return [];
  }
}

/**
 * Carrega um componente HTML (header/footer/navbar/sidebar) e injeta
 * dentro do elemento alvo indicado.
 * @param {string} caminho - caminho relativo do arquivo .html do componente
 * @param {string} seletorAlvo - seletor CSS do elemento que receberá o HTML
 */
async function carregarComponente(caminho, seletorAlvo) {
  const alvo = document.querySelector(seletorAlvo);
  if (!alvo) return;

  try {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`Falha ao buscar ${caminho}`);
    alvo.innerHTML = await resposta.text();
  } catch (erro) {
    console.error("Erro ao carregar componente:", erro);
  }
}

/**
 * Monta a URL de redirecionamento do WhatsApp com a mensagem do pedido.
 * @param {string} telefone - apenas dígitos, com DDI (ex.: 5583991998747)
 * @param {string} mensagem - mensagem já formatada com %0A para quebras de linha
 * @returns {string}
 */
function montarLinkWhatsApp(telefone, mensagem) {
  return `https://wa.me/${telefone}?text=${mensagem}`;
}

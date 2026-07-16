  function renderizarGraficoVendasSemanais() {
    const canvas = document.getElementById("salesChart");
    if (!canvas) return;

    new Chart(canvas, {
      type: "line",
      data: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [
          {
            label: "Vendas (R$)",
            data: [1200, 1900, 3000, 2500, 4200, 5100, 4800],
            borderWidth: 3,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });
  }

  /** Renderiza o gráfico de faturamento mensal (Relatórios). */
  function renderizarGraficoFaturamentoMensal() {
    const canvas = document.getElementById("monthlyChart");
    if (!canvas) return;

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        datasets: [
          {
            label: "Faturamento (R$)",
            data: [7200, 8100, 9000, 8700, 9400, 10500],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderizarGraficoVendasSemanais();
    renderizarGraficoFaturamentoMensal();
  });

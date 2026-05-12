document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".menu-link");
    const conteudo = document.getElementById("conteudo");

    // Guarda o HTML original do Dashboard
    const dashboardOriginal = conteudo.innerHTML;

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Ativa menu
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Se for Dashboard → restaura conteúdo original
            if (link.dataset.dashboard === "true") {
                conteudo.innerHTML = dashboardOriginal;
                reiniciarGrafico();
                return;
            }

            // Carrega outras páginas
            const pagina = link.dataset.page;
            if (pagina) {
                fetch(pagina)
                    .then(res => res.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        const novoConteudo = doc.querySelector(".main-content");

                        conteudo.innerHTML = novoConteudo
                            ? novoConteudo.innerHTML
                            : "<p>Erro ao carregar conteúdo.</p>";
                    })
                    .catch(() => {
                        conteudo.innerHTML = "<p>Erro ao carregar a página.</p>";
                    });
            }
        });
    });

    // Recria o gráfico ao voltar pro dashboard
    function reiniciarGrafico() {
        const canvas = document.getElementById("salesChart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Vendas (R$)',
                    data: [1200, 1900, 3000, 2500, 4200, 5100, 4800],
                    borderWidth: 3,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }
});

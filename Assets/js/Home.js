// =============================
// MENU MOBILE
// =============================

const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// =============================
// ROLAGEM SUAVE
// =============================

const links = document.querySelectorAll(".nav_links a");

links.forEach(link => {
    link.addEventListener("click", function (e) {

        const target = this.getAttribute("href");

        if (target.startsWith("#")) {
            e.preventDefault();

            const section = document.querySelector(target);

            section.scrollIntoView({
                behavior: "smooth"
            });
        }

    });
});


// =============================
// BOTÃO ADICIONAR
// =============================

const botoes = document.querySelectorAll(".burger_card button");

botoes.forEach(botao => {

    botao.addEventListener("click", () => {

        alert("Hambúrguer adicionado ao carrinho 🔥");

    });

});
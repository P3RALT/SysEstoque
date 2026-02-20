// validarEmail.js
const emailsCadastrados = [
  "supervisorcomercial@imobiliarialopes.com.br",
  "suporte@imobiliarialopes.com.br", 
  "sinistros@imobiliarialopes.com.br",
  "supervisora@@imobiliarialopes.com.br",
  "supervisorsvistoria@imobiliarialopes.com.br",
  "marcelosilva@imobiliarialopes.com.br",
  "rh@imobiliarialopes.com.br"
];

function validarEmail(event) {
  event.preventDefault(); 

  const nome = document.querySelector('input[name="nome"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();

  if (!nome) {
    alert("Por favor, digite seu nome.");
    return;
  }

  if (!email) {
    alert("Por favor, digite um e-mail.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, digite um e-mail válido.");
    return;
  }

  const emailValido = emailsCadastrados.some(e => 
    e.toLowerCase() === email.toLowerCase()
  );

  if (emailValido) {
    localStorage.setItem("usuarioNome", nome);
    localStorage.setItem("usuarioEmail", email);
    
    alert(`Bem-vindo, ${nome}! Acesso autorizado ✅`);
    
    // 🔥 CORREÇÃO: Agora apontando para a pasta Page
    window.location.href = "Page/Catalog.html";
    
  } else {
    alert("E-mail não cadastrado ❌\n\nVerifique com o administrador da Imobiliária Lopes Contagem.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.removeEventListener("submit", validarEmail);
  form.addEventListener("submit", validarEmail);

  const nomeSalvo = localStorage.getItem("usuarioNome");
  const emailSalvo = localStorage.getItem("usuarioEmail");
  
  if (nomeSalvo) {
    document.querySelector('input[name="nome"]').value = nomeSalvo;
  }
  
  if (emailSalvo) {
    document.querySelector('input[name="email"]').value = emailSalvo;
  }
});

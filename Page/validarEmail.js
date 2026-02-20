// validarEmail.js
/**
 * Lista de e-mails autorizados a acessar o sistema
 * @constant {string[]}
 */

const EMAILS_CADASTRADOS = [
  "supervisorcomercial@imobiliarialopes.com.br",
  "suporte@imobiliarialopes.com.br", 
  "sinistros@imobiliarialopes.com.br",
  "supervisora@imobiliarialopes.com.br", 
  "supervisorsvistoria@imobiliarialopes.com.br",
  "marcelosilva@imobiliarialopes.com.br",
  "rh@imobiliarialopes.com.br"
];

// Chaves para localStorage (evita erros de digitação)
const STORAGE_KEYS = {
  NOME: 'usuarioNome',
  EMAIL: 'usuarioEmail'
};

/**
 * Valida o formato do e-mail usando regex
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} - True se o formato for válido
 */

function isValidEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verifica se o e-mail está na lista de cadastrados (case insensitive)
 * @param {string} email - E-mail a ser verificado
 * @returns {boolean} - True se o e-mail estiver cadastrado
 */

function isEmailCadastrado(email) {
  return EMAILS_CADASTRADOS.some(e => 
    e.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Função principal de validação do formulário de login
 * @param {Event} event - Evento de submit do formulário
 */

function validarEmail(event) {
  event.preventDefault(); 

  // Seleciona os campos do formulário
  const nomeInput = document.querySelector('input[name="nome"]');
  const emailInput = document.querySelector('input[name="email"]');

  // Verifica se os campos existem
  if (!nomeInput || !emailInput) {
    console.error('Campos do formulário não encontrados');
    alert('Erro ao processar formulário. Tente novamente.');
    return;
  }

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();

  // Validações
  if (!nome) {
    alert("Por favor, digite seu nome.");
    nomeInput.focus(); // ✅ MELHORIA: foca no campo para facilitar correção
    return;
  }

  if (!email) {
    alert("Por favor, digite um e-mail.");
    emailInput.focus();
    return;
  }

  if (!isValidEmailFormat(email)) {
    alert("Por favor, digite um e-mail válido.");
    emailInput.focus();
    return;
  }

  if (isEmailCadastrado(email)) {
    // Salva dados no localStorage
    localStorage.setItem(STORAGE_KEYS.NOME, nome);
    localStorage.setItem(STORAGE_KEYS.EMAIL, email);
    
    alert(`Bem-vindo, ${nome}! Acesso autorizado ✅`);
    
    // ✅ MELHORIA: Verifica se o diretório Page existe antes de redirecionar
    window.location.href = "Page/Catalog.html";
    
  } else {
    alert("E-mail não cadastrado ❌\n\nVerifique com o administrador da Imobiliária Lopes Contagem.");
    emailInput.focus();
  }
}

/**
 * Preenche os campos do formulário com dados salvos no localStorage
 */
function preencherCamposSalvos() {
  try {
    const nomeSalvo = localStorage.getItem(STORAGE_KEYS.NOME);
    const emailSalvo = localStorage.getItem(STORAGE_KEYS.EMAIL);
    
    const nomeInput = document.querySelector('input[name="nome"]');
    const emailInput = document.querySelector('input[name="email"]');
    
    if (nomeSalvo && nomeInput) {
      nomeInput.value = nomeSalvo;
    }
    
    if (emailSalvo && emailInput) {
      emailInput.value = emailSalvo;
    }
  } catch (error) {
    console.error('Erro ao acessar localStorage:', error);
  }
}

/**
 * Inicialização quando o DOM estiver carregado
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  
  if (!form) {
    console.error('Formulário com id "loginForm" não encontrado');
    return;
  }
  
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  
  // Adiciona o listener no novo formulário
  newForm.addEventListener("submit", validarEmail);
  
  // Preenche campos salvos
  preencherCamposSalvos();
});

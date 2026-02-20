// enviarEmail.js - Módulo dedicado para envio de emails

// CONFIGURAÇÕES CORRETAS DO EMAILJS
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "D-KPvFhn-l8LN2H4V",
    SERVICE_ID: "service_7j9fmai", 
    TEMPLATE_ID: "template_684yy78"
};

// Inicializar EmailJS com as credenciais corretas
console.log('🔧 Inicializando EmailJS com:', EMAILJS_CONFIG);
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

/**
 * Envia email de requisição de materiais
 * @param {Array} cartData - Dados do carrinho
 * @param {Object} usuario - Dados do usuário {nome, email}
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function enviarEmailRequisicao(cartData, usuario) {
    return new Promise((resolve) => {
        try {
            console.log('📧 Iniciando envio de email...');
            console.log('🔑 Credenciais:', EMAILJS_CONFIG);
            
            // Determinar para quais emails enviar baseado nas categorias selecionadas
            const categoriasSelecionadas = [...new Set(cartData.map(item => item.category))];
            const emailsDestino = [];
            
            // Mapear categorias para emails
            if (categoriasSelecionadas.includes('Materiais de Escritório') || 
                categoriasSelecionadas.includes('Suprimentos de Escritório') || 
                categoriasSelecionadas.includes('Placa Vistoria')) {
                emailsDestino.push('rh@imobiliarialopes.com.br');
            }
            
            if (categoriasSelecionadas.includes('Materiais de Periféricos')) {
                emailsDestino.push('suporte@imobiliarialopes.com.br');
            }
            
            // Se não houver emails destino, não enviar
            if (emailsDestino.length === 0) {
                console.log('Nenhum email destino encontrado');
                resolve({ success: false, message: 'Nenhum email configurado para as categorias selecionadas' });
                return;
            }

            // Preparar template do email
            const templateParams = {
                to_email: emailsDestino.join(', '),
                user_name: usuario.nome,
                user_email: usuario.email,
                requisition_date: new Date().toLocaleString('pt-BR'),
                total_items: cartData.length,
                items_list: cartData.map(item => 
                    `• ${item.name} - ${item.quantity} unid. (${item.category})`
                ).join('\n')
            };

            console.log('📧 Preparando envio para:', emailsDestino);
            console.log('📧 Service ID:', EMAILJS_CONFIG.SERVICE_ID);
            console.log('📧 Template ID:', EMAILJS_CONFIG.TEMPLATE_ID);
            console.log('📧 Template Params:', templateParams);

            // Enviar email usando EmailJS com timeout
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout no envio do email')), 15000)
            );

            const emailPromise = emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID, 
                EMAILJS_CONFIG.TEMPLATE_ID, 
                templateParams
            );
            
            Promise.race([emailPromise, timeoutPromise])
                .then((response) => {
                    console.log('✅ Email enviado com sucesso:', response);
                    resolve({ 
                        success: true, 
                        message: 'Email enviado com sucesso',
                        response: response
                    });
                })
                .catch((error) => {
                    console.error('❌ Erro detalhado no email:', error);
                    
                    // Tratamento específico de erros do EmailJS
                    let errorMessage = 'Erro desconhecido';
                    if (error.text) {
                        errorMessage = error.text;
                    } else if (error.message) {
                        errorMessage = error.message;
                    } else if (error.status) {
                        errorMessage = `Status ${error.status}`;
                    }
                    
                    // Log detalhado para debug
                    console.error('🔍 Detalhes do erro:', {
                        status: error.status,
                        text: error.text,
                        message: error.message,
                        stack: error.stack
                    });
                    
                    resolve({ 
                        success: false, 
                        message: 'Erro no envio do email: ' + errorMessage,
                        error: error
                    });
                });
                
        } catch (error) {
            console.error('❌ Erro inesperado no email:', error);
            resolve({ 
                success: false, 
                message: 'Erro inesperado: ' + (error.message || 'Erro desconhecido'),
                error: error
            });
        }
    });
}

/**
 * Método alternativo de envio usando mailto: (fallback)
 * @param {Array} cartData - Dados do carrinho
 * @param {Object} usuario - Dados do usuário
 * @returns {{success: boolean, message: string}}
 */
function enviarEmailAlternativo(cartData, usuario) {
    try {
        console.log('📧 Usando método mailto: alternativo...');
        
        const categoriasSelecionadas = [...new Set(cartData.map(item => item.category))];
        let emailsDestino = [];
        
        if (categoriasSelecionadas.includes('Materiais de Escritório') || 
            categoriasSelecionadas.includes('Suprimentos de Escritório') || 
            categoriasSelecionadas.includes('Placa Vistoria') ||
            categoriasSelecionadas.includes('Troca Tunner')) {
            emailsDestino.push('suporte@imobiliarialopes.com.br');
        }
        
        if (categoriasSelecionadas.includes('Materiais de Periféricos')) {
            emailsDestino.push('suporte@imobiliarialopes.com.br');
        }
        
        if (emailsDestino.length === 0) {
            emailsDestino = ['suporte@imobiliarialopes.com.br']; // Email padrão
        }

        const assunto = `Solicitação de Materiais - ${usuario.nome}`;
        
        const corpoEmail = `
Solicitação de Materiais

Usuário: ${usuario.nome}
Email: ${usuario.email}
Data: ${new Date().toLocaleString('pt-BR')}

ITENS SOLICITADOS (${cartData.length} itens):
${cartData.map(item => `• ${item.name} - ${item.quantity} unid. (${item.category})`).join('\n')}

Total de itens: ${cartData.length}
        `.trim();

        // Criar link mailto:
        const mailtoLink = `mailto:${emailsDestino.join(',')}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoEmail)}`;
        
        // Abrir cliente de email
        window.open(mailtoLink, '_blank');
        
        return { 
            success: true, 
            message: 'Cliente de email aberto. Preencha e envie manualmente.' 
        };
        
    } catch (error) {
        console.error('❌ Erro no método alternativo:', error);
        return { 
            success: false, 
            message: 'Erro ao abrir cliente de email: ' + error.message 
        };
    }
}

/**
 * Método de fallback para copiar dados da requisição
 * @param {Array} cartData - Dados do carrinho
 * @param {Object} usuario - Dados do usuário
 * @param {string} erroOriginal - Mensagem de erro original
 * @returns {Promise<boolean>}
 */
async function tentarEnvioAlternativo(cartData, usuario, erroOriginal) {
    try {
        console.log('🔄 Usando método alternativo de notificação...');
        
        // Criar um resumo simples que pode ser copiado
        const resumoItens = cartData.map(item => 
            `${item.name} - ${item.quantity} unid (${item.category})`
        ).join('\n');
        
        const textoParaCopiar = `SOLICITAÇÃO DE MATERIAIS\n\nUsuário: ${usuario.nome} (${usuario.email})\nData: ${new Date().toLocaleString('pt-BR')}\n\nItens:\n${resumoItens}\n\nTotal: ${cartData.length} itens`;
        
        // Mostrar opção para copiar
        const confirmacao = confirm(
            `❌ Email não pôde ser enviado automaticamente.\n\n${erroOriginal}\n\nClique em OK para copiar os dados da requisição e enviar manualmente por email.`
        );
        
        if (confirmacao) {
            // Copiar para área de transferência
            await navigator.clipboard.writeText(textoParaCopiar);
            alert('✅ Dados copiados! Cole no seu email e envie para os responsáveis.');
            return true;
        }
        return false;
        
    } catch (fallbackError) {
        console.error('❌ Erro no método alternativo:', fallbackError);
        alert('⚠️ Sistema temporariamente indisponível. Anote os itens e tente mais tarde.');
        return false;
    }
}

// Exportar funções para uso global
window.emailUtils = {
    enviarEmailRequisicao,
    enviarEmailAlternativo,
    tentarEnvioAlternativo,
    EMAILJS_CONFIG
};

console.log('✅ Módulo de email carregado com sucesso');
console.log('🔑 Configurações:', EMAILJS_CONFIG);

// carrinho.js - Código principal do carrinho

document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addBtn');
    const sendBtn = document.getElementById('sendBtn');
    const cartItems = document.getElementById('cartItems');
    
    // Função para adicionar item ao carrinho
    addBtn.addEventListener('click', function() {
        const itemData = getFilledItemData();
        
        if (itemData) {
            addItemToCart(itemData);
            clearInputFields();
        } else {
            alert('Por favor, preencha pelo menos um item e sua quantidade.');
        }
    });
    
    // Função para obter dados do item preenchido
    function getFilledItemData() {
        let itemName = '';
        let quantity = 0;
        let category = '';
        
        if (document.getElementById('escritorioInput').value && document.getElementById('escritorioQtd').value) {
            itemName = document.getElementById('escritorioInput').value;
            quantity = parseInt(document.getElementById('escritorioQtd').value);
            category = 'Materiais de Escritório';
        } else if (document.getElementById('suprimentosInput').value && document.getElementById('suprimentosQtd').value) {
            itemName = document.getElementById('suprimentosInput').value;
            quantity = parseInt(document.getElementById('suprimentosQtd').value);
            category = 'Suprimentos de Escritório';
        } else if (document.getElementById('perifericosInput').value && document.getElementById('perifericosQtd').value) {
            itemName = document.getElementById('perifericosInput').value;
            quantity = parseInt(document.getElementById('perifericosQtd').value);
            category = 'Materiais de Periféricos';
        } else if (document.getElementById('placaInput').value && document.getElementById('placaQtd').value) {
            itemName = document.getElementById('placaInput').value;
            quantity = parseInt(document.getElementById('placaQtd').value);
            category = 'Placa Vistoria';
        } else if (document.getElementById('tonnerInput').value && document.getElementById('tonnerQtd').value) {
            itemName = document.getElementById('tonnerInput').value;
            quantity = parseInt(document.getElementById('tonnerQtd').value);
            category = 'Troca Tonner';
        }

        
        if (itemName && quantity > 0) {
            return {
                name: itemName,
                quantity: quantity,
                category: category
            };
        }
        
        return null;
    }
    
    // Função para adicionar item ao carrinho
    function addItemToCart(itemData) {
        // Remover mensagem de carrinho vazio se existir
        const emptyCart = cartItems.querySelector('.empty-cart');
        if (emptyCart) {
            emptyCart.remove();
        }
        
        // Criar elemento do item no carrinho
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${itemData.name}</span>
                <span class="cart-item-category">${itemData.category}</span>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-qtd">Qtd: ${itemData.quantity}</span>
                <button class="remove-item"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Adicionar evento para remover item
        const removeBtn = cartItem.querySelector('.remove-item');
        removeBtn.addEventListener('click', function() {
            removeCartItem(cartItem);
        });
        
        cartItems.appendChild(cartItem);
        
        // Feedback visual
        showTempMessage('✅ Item adicionado ao carrinho!', 'success');
    }
    
    // Função para remover item do carrinho
    function removeCartItem(itemElement) {
        itemElement.remove();
        
        // Se não houver mais itens, mostrar mensagem de carrinho vazio
        if (cartItems.children.length === 0) {
            showEmptyCartMessage();
        }
        
        showTempMessage('🗑️ Item removido do carrinho', 'info');
    }
    
    // Função para mostrar mensagem de carrinho vazio
    function showEmptyCartMessage() {
        const emptyCartDiv = document.createElement('div');
        emptyCartDiv.className = 'empty-cart';
        emptyCartDiv.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <p>Nenhum item adicionado</p>
        `;
        cartItems.appendChild(emptyCartDiv);
    }
    
    // Função para limpar campos de entrada
    function clearInputFields() {
        document.getElementById('escritorioInput').value = '';
        document.getElementById('escritorioQtd').value = '';
        document.getElementById('suprimentosInput').value = '';
        document.getElementById('suprimentosQtd').value = '';
        document.getElementById('perifericosInput').value = '';
        document.getElementById('perifericosQtd').value = '';
        document.getElementById('tonnerInput').value = '';
        document.getElementById('tonnerQtd').value = '';
        document.getElementById('placaInput').value = '';
        document.getElementById('placaQtd').value = '';
    }
    
    // Função para enviar requisição
    sendBtn.addEventListener('click', function() {
        const items = cartItems.querySelectorAll('.cart-item');
        
        if (items.length === 0) {
            alert('Adicione pelo menos um item antes de enviar.');
            return;
        }
        
        // Coletar dados do carrinho
        const cartData = collectCartData();
        
        // Enviar requisição
        sendRequisition(cartData);
    });
    
    // Função para coletar dados do carrinho
    function collectCartData() {
        const items = [];
        const cartItemsElements = cartItems.querySelectorAll('.cart-item');
        
        cartItemsElements.forEach(item => {
            const name = item.querySelector('.cart-item-name').textContent;
            const category = item.querySelector('.cart-item-category').textContent;
            const quantity = parseInt(item.querySelector('.cart-item-qtd').textContent.replace('Qtd: ', ''));
            
            items.push({
                name: name,
                category: category,
                quantity: quantity
            });
        });
        
        return items;
    }
    
    // FUNÇÃO PRINCIPAL DE ENVIO
    async function sendRequisition(cartData) {
        // Mostrar loading no botão
        const originalText = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
        sendBtn.disabled = true;
        
        try {
            console.log('🛒 Iniciando envio do carrinho:', cartData);
            
            // Dados do usuário
            const usuario = {
                nome: document.getElementById('userName').textContent.trim(),
                email: document.getElementById('userEmail').textContent.trim()
            };
            
            console.log('👤 Usuário:', usuario);
            
            // Validar dados do usuário
            if (!usuario.nome || !usuario.email) {
                throw new Error('Dados do usuário não encontrados. Recarregue a página.');
            }
            
            // ✅ TENTAR ENVIAR EMAIL PRIMEIRO
            console.log('📧 Iniciando processo de email...');
            const resultadoEmail = await window.emailUtils.enviarEmailRequisicao(cartData, usuario);
            
            if (resultadoEmail.success) {
                console.log('✅ Email enviado com sucesso!');
                
                // Mostrar mensagem de sucesso
                showTempMessage('✅ Requisição enviada com sucesso!', 'success');
                
                // Mostrar resumo para o usuário
                const resumoItens = cartData.map(item => 
                    `• ${item.name} (${item.quantity} unid - ${item.category})`
                ).join('\n');
                
                alert(`✅ REQUISIÇÃO ENVIADA!\n\nItens solicitados (${cartData.length}):\n${resumoItens}\n\nEmail de notificação enviado para os responsáveis.`);
                
                // Limpar carrinho após envio
                clearCart();
                
            } else {
                // ❌ Se EmailJS falhar, tentar método alternativo com mailto:
                console.log('🔄 EmailJS falhou, tentando método mailto...');
                const resultadoAlternativo = window.emailUtils.enviarEmailAlternativo(cartData, usuario);
                
                if (resultadoAlternativo.success) {
                    showTempMessage('📧 Abrindo cliente de email...', 'info');
                    alert('📧 Cliente de email aberto! Preencha e envie manualmente.');
                    clearCart();
                } else {
                    // ❌ Se mailto falhar, tentar método de copiar
                    console.log('🔄 Tentando método de copiar dados...');
                    const sucessoCopia = await window.emailUtils.tentarEnvioAlternativo(cartData, usuario, resultadoEmail.message);
                    
                    if (sucessoCopia) {
                        clearCart();
                    }
                }
            }
            
        } catch (error) {
            console.error('❌ Erro no envio:', error);
            showTempMessage('❌ Erro ao enviar requisição', 'error');
            
            let mensagemUsuario = error.message;
            if (error.message.includes('Failed to fetch')) {
                mensagemUsuario = 'Erro de conexão. Verifique sua internet.';
            }
            
            alert(`❌ ERRO NO ENVIO:\n${mensagemUsuario}\n\nTente novamente.`);
        } finally {
            // Restaurar botão independente do resultado
            sendBtn.innerHTML = originalText;
            sendBtn.disabled = false;
        }
    }
    
    // Função para limpar carrinho
    function clearCart() {
        cartItems.innerHTML = '';
        showEmptyCartMessage();
    }
    
    // Função para mostrar mensagem temporária
    function showTempMessage(message, type) {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.temp-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `temp-message temp-message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            ${message}
        `;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 300px;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    // Inicialização
    function init() {
        console.log('🛒 Sistema de carrinho inicializado');
        
        // Verificar se módulo de email está carregado
        if (window.emailUtils) {
            console.log('✅ Módulo de email detectado');
            console.log('🔑 Configurações do EmailJS:', window.emailUtils.EMAILJS_CONFIG);
        } else {
            console.log('⚠️ Módulo de email não encontrado');
        }
    }
    
    init();
});

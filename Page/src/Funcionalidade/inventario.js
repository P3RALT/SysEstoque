// inventario.js - Integração com Google Sheets
let inventario = [];

// URL do Web App - ATUALIZADA!
const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw1da_DGkSv9IxpXz6pSCjMoXf9SJkF6D4Tus17qcDksTANQ-WJYvUNfSMSqu-EzY7jkA/exec';

// Carregar inventário do Google Sheets
async function carregarInventario() {
    try {
        console.log('📦 Carregando inventário do Google Sheets...');
        
        const response = await fetch(SHEETS_WEB_APP_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar se é um array válido
        if (Array.isArray(data)) {
            inventario = data;
            console.log('✅ Inventário carregado com sucesso:', inventario.length, 'itens');
            popularDatalists();
        } else {
            throw new Error('Resposta inválida do servidor');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar do Google Sheets:', error);
        console.log('🔄 Usando dados de exemplo...');
        usarDadosExemplo();
    }
}

// Popular os datalists com itens do inventário
function popularDatalists() {
    const mapeamentoCategorias = {
        'escritorioItems': 'Materiais de Escritório',
        'suprimentosItems': 'Suprimentos de Escritório',
        'perifericosItems': 'Materiais Periféricos',
        'tonnerItems': 'Toners de Impressora',
        'placaItems' : 'Placa Vistoria'
    };

    Object.keys(mapeamentoCategorias).forEach(datalistId => {
        const datalist = document.getElementById(datalistId);
        const categoriaSheet = mapeamentoCategorias[datalistId];
        
        if (!datalist) {
            console.warn('Datalist não encontrado:', datalistId);
            return;
        }
        
        // Limpar datalist
        datalist.innerHTML = '';
        
        // Filtrar itens pela categoria
        const itensFiltrados = inventario.filter(item => 
            item.Categoria === categoriaSheet
        );
        
        console.log(`Categoria ${categoriaSheet}:`, itensFiltrados.length, 'itens');
        
        // Adicionar opções ao datalist
        itensFiltrados.forEach(item => {
            const option = document.createElement('option');
            option.value = item.Item;
            option.textContent = `${item.Item} - ${item.Descrição} (${item.Quantidade} ${item.Unidade})`;
            option.setAttribute('data-descricao', item.Descrição);
            option.setAttribute('data-quantidade', item.Quantidade);
            option.setAttribute('data-unidade', item.Unidade);
            datalist.appendChild(option);
        });
    });
    
    console.log('✅ Datalists populados com sucesso!');
}

// Validar se item existe no inventário
function validarItem(categoria, itemNome) {
    const categoriaSheet = obterCategoriaSheet(categoria);
    const itemEncontrado = inventario.some(item => 
        item.Categoria === categoriaSheet && item.Item === itemNome
    );
    
    console.log(`🔍 Validação: ${categoria} -> ${categoriaSheet}, Item: ${itemNome}, Encontrado: ${itemEncontrado}`);
    return itemEncontrado;
}

// Obter informações completas do item
function obterInfoItem(categoria, itemNome) {
    const categoriaSheet = obterCategoriaSheet(categoria);
    const item = inventario.find(item => 
        item.Categoria === categoriaSheet && item.Item === itemNome
    );
    
    return item;
}

// Mapear categorias do formulário para categorias do Sheet
function obterCategoriaSheet(categoriaForm) {
    const mapeamento = {
        'Materiais de Escritório': 'Materiais de Escritório',
        'Suprimentos de Escritório': 'Suprimentos de Escritório',
        'Materiais de Periféricos': 'Materiais Periféricos',
        'Troca Tonner': 'Toners de Impressora',
        'placaItems' : 'Placa Vistoria'
    };
    
    return mapeamento[categoriaForm] || categoriaForm;
}

// Validar quantidade solicitada vs estoque
function validarQuantidadeSolicitada(categoria, itemNome, quantidadeSolicitada) {
    const infoItem = obterInfoItem(categoria, itemNome);
    if (infoItem && infoItem.Quantidade) {
        const quantidadeDisponivel = parseInt(infoItem.Quantidade);
        const valido = quantidadeSolicitada <= quantidadeDisponivel;
        
        console.log(`📊 Validação quantidade: ${quantidadeSolicitada} <= ${quantidadeDisponivel} = ${valido}`);
        return valido;
    }
    return false;
}

// Obter quantidade disponível
function obterQuantidadeDisponivel(categoria, itemNome) {
    const infoItem = obterInfoItem(categoria, itemNome);
    return infoItem ? parseInt(infoItem.Quantidade) : 0;
}

// Função para atualizar estoque no Google Sheets - VERSÃO CORRIGIDA
async function atualizarEstoqueNoSheets(dadosRequisicao) {
    try {
        console.log('📤 Enviando atualização de estoque para Google Sheets...', dadosRequisicao);
        
        const response = await fetch(SHEETS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosRequisicao)
        });
        
        console.log('📨 Status da resposta:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na resposta:', errorText);
            throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
        }
        
        const resultado = await response.json();
        console.log('✅ Resposta do Google Sheets:', resultado);
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro ao atualizar estoque no Sheets:', error);
        return { 
            success: false, 
            message: 'Erro de conexão com o servidor: ' + error.message 
        };
    }
}


// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de inventário inicializando...');
    carregarInventario();
});

// Exportar funções para uso em outros arquivos
window.inventarioUtils = {
    carregarInventario,
    validarItem,
    obterInfoItem,
    validarQuantidadeSolicitada,
    obterQuantidadeDisponivel,
    obterCategoriaSheet,
    atualizarEstoqueNoSheets,
    SHEETS_WEB_APP_URL // Exportar a URL para uso no carrinho
};

# Mutum Delivery • Painel do cliente

Interface web do cliente para login, cadastro, endereços, vitrine dos restaurantes, carrinho e pedidos.

## Melhorias aplicadas
- tela de boot para evitar flash da tela de login ao recarregar
- loading visual em ações importantes
- auto login após cadastro
- abertura automática do cadastro de endereço quando a conta ainda não tem endereço
- suporte a `/proxy/*` e `/api/proxy/*`
- visual refinado com cards, sombras e estados mais claros

## Rodando localmente
1. Crie um `.env` com:
   `API_BASE_URL=http://localhost:3001`
2. Instale dependências:
   `npm install`
3. Inicie:
   `npm start`

O painel abre por padrão na porta `3020`.

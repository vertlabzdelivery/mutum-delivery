# Alterações no painel web do cliente

## O que foi adicionado
- Botão **Cupons** no topo, ao lado de **Pedidos**.
- Modal de **Cupons e indicações** com:
  - código de indicação do usuário;
  - botão para copiar o código;
  - lista de cupons promocionais públicos ativos;
  - lista de cupons de recompensa liberados para o usuário;
  - histórico de indicações em layout compacto;
  - resumo compacto de status das recompensas.
- Checkout com campo de **cupom**, botão **Aplicar**, botão **Limpar** e feedback visual.
- Resumo do carrinho com linha de **Desconto**.
- Pedido enviado com `couponCode` no payload quando houver.
- Cards/detalhes do pedido mostrando cupom e desconto aplicado.

## Rotas consumidas
- `GET /me/referral-code`
- `GET /me/referral-rewards`
- `GET /me/referral-history`
- `GET /coupons/public?limit=20`
- `POST /coupons/validate`
- `POST /orders/quote`
- `POST /orders`

## Arquivos alterados
- `public/index.html`
- `public/styles.css`
- `public/app.js`

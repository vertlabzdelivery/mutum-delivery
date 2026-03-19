# Painel do Restaurante

Painel web simples para contas com **1 restaurante por conta**.

## O que este painel faz

- login com a API
- carrega automaticamente o restaurante da conta em `/restaurants/my/owned`
- edição dos **dados do restaurante** em janela modal
- cadastro de **categorias**
- cadastro de **itens do cardápio** com **grupos de opções** e **escolhas**
- suporte para cenários como **açaí, marmita, combo e personalização**
- cadastro de **minSelect** e **maxSelect** por grupo de opções
- cadastro de **quantos grupos quiser** por item
- gestão de **zonas de entrega** em janela modal
- tela principal focada em **pedidos em lista**

## Exemplos suportados

Você pode criar um item como:

- Açaí 500ml
  - grupo `Frutas` com 10 escolhas e `maxSelect = 4`
  - grupo `Complementos` com 15 escolhas e `maxSelect = 3`
  - grupo `Caldas` com 6 escolhas e `maxSelect = 2`

ou uma marmita como:

- Marmita P
  - grupo `Mistura` obrigatório com `minSelect = 1` e `maxSelect = 2`
  - grupo `Acompanhamentos` com `maxSelect = 4`

## Rodar

```bash
npm install
npm start
```

O painel sobe por padrão em `http://localhost:4175`.

A API pode ser configurada no botão **API** no topo da tela.

# 🧾 WEB POS — Banco de Dados (MariaDB)

## 🎯 Objetivo

Estruturar um banco de dados simples, consistente e funcional para um sistema POS (Point of Sale), suportando:

- autenticação de usuários
- catálogo de produtos
- tamanhos e adicionais
- pedidos e itens
- controle de estoque

---

## 👤 users

Armazena usuários do sistema.

Campos:

- id
- name
- username
- password_hash
- role (ADMINISTRADOR | OPERADOR)
- is_active
- created_at
- updated_at

---

## 📂 categories

Categorias de produtos (sem "all", pois é filtro de UI).

Campos:

- id
- name
- created_at

---

## 💳 payment_methods

Lista fixa de formas de pagamento.

Campos:

- id
- name
- created_at

---

## 🍔 products

Produtos do sistema.

Campos:

- id
- category_id
- title
- description
- image_url
- base_price
- stock
- is_available
- has_sizes
- created_at
- updated_at

---

## 📏 product_sizes

Tamanhos de produto.

Campos:

- id
- product_id
- name (small | medium | large)
- extra_price

---

## ➕ addons

Adicionais disponíveis.

Campos:

- id
- name
- price

---

## 🔗 product_addons

Relaciona produtos com adicionais.

Campos:

- product_id
- addon_id

---

## 🧾 orders

Pedidos realizados.

Campos:

- id
- user_id
- payment_method_id
- status (completed | canceled)
- subtotal
- fee
- total
- canceled_by
- canceled_at
- created_at
- updated_at

---

## 📦 order_items

Itens do pedido.

Campos:

- id
- order_id
- product_id
- product_title
- size_name
- unit_price
- quantity
- total_price

---

## 🧩 order_item_addons

Adicionais do item do pedido.

Campos:

- order_item_id
- addon_id
- addon_name
- addon_price

---

## ⚠️ Regras importantes

- estoque nunca pode ser negativo
- produto com estoque 0 deve ficar indisponível
- adicionais não podem se repetir no mesmo item
- tamanho é obrigatório quando o produto possui tamanhos
- cancelamento de pedido deve restaurar estoque
- taxa padrão de pedido: 6%

---

## 🧠 Observações

- "all" não é categoria de banco, é filtro de UI
- dados de produto são copiados (snapshot) no pedido
- backend deve controlar regras críticas (estoque, cancelamento)

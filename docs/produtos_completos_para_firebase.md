# Produtos completos para cadastrar no Firebase

Use este arquivo como referência para preencher manualmente a coleção `products` no Firestore.

Observação:

- `createdAt` e `updatedAt` agora devem ser cadastrados como `timestamp`
- no JSON abaixo, os valores aparecem em formato ISO apenas como referência visual

## Campos por produto

Preencha estes campos em cada documento:

- `id` → `int64`
- `categoryId` → `int64`
- `title` → `string`
- `description` → `string`
- `imageUrl` → `string`
- `basePrice` → `double`
- `stock` → `int64`
- `isAvailable` → `boolean`
- `hasSizes` → `boolean`
- `addonIds` → `array`
- `barcode` → `string`
- `createdAt` → `timestamp`
- `updatedAt` → `timestamp`

## Legenda rápida

### Categorias

- `1` → `meats`
- `2` → `hamburgers`
- `3` → `pizzas`
- `4` → `drinks`
- `5` → `desserts`
- `6` → `snacks`
- `7` → `pasta`
- `8` → `salads`

### Adicionais

- `1` → `extra_cheese`
- `2` → `onion`
- `3` → `bacon`
- `4` → `whipped_cream`
- `5` → `extra_sauce`

## JSON base

```json
[
  {
    "id": 1,
    "categoryId": 1,
    "title": "Frango Grelhado (Chop)",
    "description": "frango, ovo, cogumelos, salada",
    "imageUrl": "/images/product-1.jpg",
    "basePrice": 32.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000015",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 2,
    "categoryId": 1,
    "title": "Costeleta de Porco Grelhada",
    "description": "porco, ovo, cogumelos, salada",
    "imageUrl": "/images/product-2.jpg",
    "basePrice": 36.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000022",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 3,
    "categoryId": 7,
    "title": "Capellini ao Molho de Tomate",
    "description": "espaguete fino, tomate, cogumelos",
    "imageUrl": "/images/product-3.jpg",
    "basePrice": 27.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000039",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 4,
    "categoryId": 8,
    "title": "Bowl de Salada Vegana",
    "description": "maçã, cenoura, tomate",
    "imageUrl": "/images/product-4.jpg",
    "basePrice": 24.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000046",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 5,
    "categoryId": 3,
    "title": "Pizza Havaiana",
    "description": "pizza, carne de caranguejo, abacaxi",
    "imageUrl": "/images/product-5.jpg",
    "basePrice": 44.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [1, 2, 3],
    "barcode": "2000000000053",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 6,
    "categoryId": 4,
    "title": "Shake de Abacate",
    "description": "abacate, leite, baunilha",
    "imageUrl": "/images/product-6.jpg",
    "basePrice": 14.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": true,
    "addonIds": [4],
    "barcode": "2000000000060",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 7,
    "categoryId": 4,
    "title": "Cafe Latte",
    "description": "espresso, leite",
    "imageUrl": "/images/product-7.jpg",
    "basePrice": 9.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": true,
    "addonIds": [4],
    "barcode": "2000000000077",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 8,
    "categoryId": 4,
    "title": "Suco Detox Vitamina C",
    "description": "damasco, maca, cenoura e gengibre",
    "imageUrl": "/images/product-8.jpg",
    "basePrice": 12.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": true,
    "addonIds": [],
    "barcode": "2000000000084",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 9,
    "categoryId": 6,
    "title": "Panqueca",
    "description": "sem lactose, ovo, fermento, açúcar e farinha de trigo",
    "imageUrl": "/images/product-9.jpg",
    "basePrice": 18.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [5],
    "barcode": "2000000000091",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 10,
    "categoryId": 6,
    "title": "Sopa de Cogumelos",
    "description": "leite evaporado, vinho marsala, caldo de carne, caldo de frango, manteiga",
    "imageUrl": "/images/product-10.jpg",
    "basePrice": 19.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [5],
    "barcode": "2000000000107",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 11,
    "categoryId": 1,
    "title": "Asas de Frango Assadas",
    "description": "asas de frango, molho A1, mel, pimenta caiena",
    "imageUrl": "/images/product-11.jpg",
    "basePrice": 29.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [5],
    "barcode": "2000000000114",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 12,
    "categoryId": 7,
    "title": "Espaguete Vegetariano",
    "description": "abobrinha amarela, massa, pimentao vermelho assado",
    "imageUrl": "/images/product-12.jpg",
    "basePrice": 26.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000121",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 13,
    "categoryId": 5,
    "title": "Casquinha de Sorvete de Baunilha",
    "description": "sorvete de baunilha, casquinha crocante",
    "imageUrl": "/images/product-13.jpg",
    "basePrice": 8.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000138",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 14,
    "categoryId": 5,
    "title": "Macarons Coloridos",
    "description": "farinha de amendoas, acucar, recheio cremoso",
    "imageUrl": "/images/product-14.jpg",
    "basePrice": 12.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000145",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 15,
    "categoryId": 5,
    "title": "Donuts com Cobertura",
    "description": "massa doce, cobertura colorida, confeitos",
    "imageUrl": "/images/product-15.jpg",
    "basePrice": 10.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000152",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 16,
    "categoryId": 5,
    "title": "Cupcakes com Glace",
    "description": "massa de baunilha, glace cremoso, confeitos",
    "imageUrl": "/images/product-16.jpg",
    "basePrice": 11.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [],
    "barcode": "2000000000169",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  },
  {
    "id": 17,
    "categoryId": 2,
    "title": "Hamburguer com Cheddar e Bacon",
    "description": "pao brioche, carne bovina, cheddar cremoso, bacon e ovo",
    "imageUrl": "/images/product-17.jpg",
    "basePrice": 31.9,
    "stock": 10,
    "isAvailable": true,
    "hasSizes": false,
    "addonIds": [1, 2, 3, 5],
    "barcode": "2000000000176",
    "createdAt": "2026-04-09T00:00:00.000Z",
    "updatedAt": "2026-04-09T00:00:00.000Z"
  }
]
```

## Dica prática

Se você for cadastrar manualmente no Firebase:

- use o `id` do produto também como `ID do documento`
- em `addonIds`, escolha tipo `array`
- em `basePrice`, use `double`
- em `stock`, `id` e `categoryId`, use `int64`

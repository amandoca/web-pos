# 🧾 WEB POS

## 📌 Visão Geral

Sistema de ponto de venda (POS) com dois perfis:

- Operador: responsável pela venda
- Admin: responsável pela gestão de produtos

---

## 🏗️ Diagrama de Arquitetura

![Diagrama de Arquitetura](./diagrams/arquitetura.svg)

```plantuml
@startuml
top to bottom direction
skinparam packageStyle rectangle
skinparam shadowing false
skinparam linetype ortho

actor Usuario

package "Camada de Tela" as ScreenLayer {
  component "Telas" as Screens
  component "Componentes de UI" as UIComponents
  component "Hooks de Tela" as ScreenHooks
}

package "Camada de Feature (Domínio + Estado de Servidor)" as FeatureLayer {
  component "Hooks de Feature" as FeatureHooks
  component "Regras de Negócio" as BusinessRules
  component "Validações" as Validations
  component "Gerenciador de Estado de Servidor\n(TanStack Query)" as TanStackQuery
  component "Serviços da Feature" as FeatureServices
}

package "Camada de Application (Infraestrutura)" as ApplicationLayer {
  component "Ações Técnicas" as Actions
  component "Cliente de API" as ApiClient
  component "Estado Global da Aplicação\n(Redux)" as ReduxStore
  component "Orquestrador de Efeitos Colaterais\n(Redux Saga)" as ReduxSaga
  component "Providers da Aplicação" as Providers
  component "Configuração Global" as GlobalConfig
}

package "Sistemas Externos" as ExternalLayer {
  component "API de Backend" as BackendApi
  component "Armazenamento do Navegador" as BrowserStorage
  component "Cookies" as Cookies
  component "Serviços Externos / BFF" as ExternalServices
}

Usuario --> Screens

Screens --> UIComponents
Screens --> ScreenHooks
ScreenHooks --> FeatureHooks

FeatureHooks --> BusinessRules
FeatureHooks --> Validations
FeatureHooks --> TanStackQuery

TanStackQuery --> FeatureServices
FeatureServices --> Actions

Providers --> ReduxStore
Providers --> TanStackQuery
Providers --> GlobalConfig

ReduxStore ..> ReduxSaga : ações / escuta
ReduxSaga --> Actions

Actions --> ApiClient
Actions --> BrowserStorage
Actions --> Cookies

ApiClient --> BackendApi
ApiClient --> ExternalServices

@enduml
```

---

## 🎭 Diagrama de Caso de Uso

![Diagrama de Caso de Uso](./diagrams/caso-de-uso.svg)

```plantuml
@startuml
left to right direction

actor Operador
actor Admin

rectangle "WEB POS" {
  Operador --> (Fazer login)
  Operador --> (Selecionar categoria)
  Operador --> (Visualizar produtos)
  Operador --> (Adicionar item ao carrinho)
  Operador --> (Remover item do carrinho)
  Operador --> (Alterar quantidade)
  Operador --> (Visualizar carrinho)
  Operador --> (Visualizar total do pedido)
  Operador --> (Selecionar forma de pagamento)
  Operador --> (Finalizar pedido)

  Admin --> (Fazer login)
  Admin --> (Visualizar produtos)
  Admin --> (Atualizar estoque)
  Admin --> (Alterar disponibilidade)
  Admin --> (Cancelar pedido)
}
@enduml
```

---

## 🔄 Fluxo do Operador

![Fluxo do Operador](./diagrams/fluxo-operador.svg)

```plantuml
@startuml
start

:Carregar aplicação;
:Exibir tela de login;

repeat
  :Informar credenciais;
  if (Credenciais válidas?) then (Sim)
    :Acessar sistema;
    break
  else (Não)
    :Exibir erro de login;
  endif
repeat while (Tentar novamente?) is (Sim)

:Buscar produtos;
:Exibir produtos;

repeat
  :Selecionar categoria;
  :Filtrar produtos;

  if (Produto disponível?) then (Sim)
    :Adicionar ao carrinho;
  else (Não)
    :Exibir indisponível;
  endif
repeat while (Adicionar mais itens?) is (Sim)

:Alterar quantidade (+/-);
:Visualizar carrinho;
:Calcular total;


repeat
  :Selecionar pagamento;
  if (Pagamento válido?) then (Sim)
    break
  else (Não)
    :Corrigir pagamento;
  endif
repeat while (Tentar novamente?) is (Sim)

repeat
  :Finalizar pedido;
  if (Sucesso?) then (Sim)
    :Limpar carrinho;
    :Exibir confirmação;
    break
  else (Não)
    :Exibir erro;
  endif
repeat while (Tentar novamente?) is (Sim)

stop
@enduml
```

---

## ⚙️ Fluxo do Admin

![Fluxo do Admin](./diagrams/fluxo-admin.svg)

```plantuml
@startuml
title Fluxo do Admin

skinparam DefaultFontName "Helvetica Neue"
skinparam DefaultFontSize 13
skinparam DefaultFontColor #2C2C2A
skinparam ArrowColor #888780
skinparam ArrowFontColor #5F5E5A
skinparam ArrowFontSize 11
skinparam ArrowThickness 1.2
skinparam RoundCorner 6
skinparam Shadowing false
skinparam BackgroundColor #FFFFFF
skinparam ActivityBorderThickness 1

skinparam activity {
  BackgroundColor #EEEDFE
  BorderColor #534AB7
  FontColor #3C3489
  FontSize 13
}

skinparam activityDiamond {
  BackgroundColor #F5F4FD
  BorderColor #534AB7
  FontColor #3C3489
  FontSize 11
}

skinparam activityStart {
  Color #B4B2A9
}

skinparam activityEnd {
  Color #B4B2A9
}

start

partition "Admin - Login" {
  :Carregar aplicação;
  :Exibir tela de login;

  repeat
    :Informar credenciais;
    if (Credenciais válidas?) then (Sim)
      #E1F5EE:Acessar sistema;
      break
    else (Não)
      #FCEBEB:Exibir erro de login;
    endif
  repeat while (Tentar login novamente?) is (Sim)
}

partition "Admin - Gestão de Produtos" {
  :Buscar produtos;
  :Exibir produtos;
  :Selecionar produto;
  :Visualizar dados do produto;

  if (Deseja atualizar estoque?) then (Sim)
    repeat
      :Alterar quantidade de estoque;
      :Salvar alteração;
      if (Estoque atualizado com sucesso?) then (Sim)
        #EAF3DE:Exibir confirmação;
        break
      else (Não)
        #FCEBEB:Exibir erro ao atualizar estoque;
      endif
    repeat while (Tentar salvar estoque novamente?) is (Sim)
  else (Não)
  endif

  if (Deseja alterar disponibilidade?) then (Sim)
    repeat
      :Ativar/Desativar produto;
      :Salvar alteração;
      if (Disponibilidade alterada com sucesso?) then (Sim)
        #EAF3DE:Exibir confirmação;
        break
      else (Não)
        #FCEBEB:Exibir erro ao alterar disponibilidade;
      endif
    repeat while (Tentar salvar disponibilidade novamente?) is (Sim)
  else (Não)
  endif
}

partition "Admin - Cancelamento de Pedido" {
  :Buscar pedidos;
  :Exibir pedidos;
  :Selecionar pedido;

  if (Deseja cancelar pedido?) then (Sim)
    repeat
      :Confirmar cancelamento;
      if (Cancelamento realizado com sucesso?) then (Sim)
        :Atualizar status do pedido para cancelado;
        :Restaurar estoque dos itens;
        #EAF3DE:Exibir confirmação;
        break
      else (Não)
        #FCEBEB:Exibir erro ao cancelar pedido;
      endif
    repeat while (Tentar cancelar novamente?) is (Sim)
  else (Não)
  endif
}

stop
@enduml
```

---

## ✅ Conclusão

- Arquitetura em camadas respeitada
- Separação clara entre Admin e Operador
- Fluxos com retorno de erro
- Coerente com MVP de POS

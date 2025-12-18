# 🔐 Autenticação

Quando as credenciais são válidas, a API:

- Retorna os dados do usuário autenticado
- Gera **access token** e **refresh token**
- Define os tokens em **cookies HTTP-only**
- Em ambientes **não produtivos**, os tokens também são retornados no body da resposta

As rotas de autenticação são responsáveis por **registro**, **login**, **renovação de sessão** e **logout** do usuário.

> 📍 **Base URL** ```<http://localhost:3000/api/``>

## ✨ POST `/api/auth/register`

Cria um novo usuário no sistema a partir dos dados enviados no corpo da requisição.  
Em ambiente **não produtivo**, a rota retorna também os tokens de autenticação.  
Em **produção**, apenas os dados do usuário são retornados, e os tokens são enviados via **cookies HTTP-only**
  Url da requisição: ```http://localhost:3000/api/auth```

🧾 Headers Necessários

  | Header         | Valor                | Obrigatório |
  |----------------|----------------------|-------------|
  | Content-Type   | application/json     | ✅ Sim      |

  ---

📥 Parâmetros

Body (JSON)

  Contrato obrigatório (`CreateUserDTO`):

  ```ts
  {
    name: string;
    email: string;
    password: string;
  }

  ```curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "password": "Senha@123"
  }' ```

  {
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "password": "Senha@123"
  }

  🚀 Ambiente: Desenvolvimento
  ```{
    "user": {
      "id": "user-uuid",
      "name": "João Silva",
      "email": "joao.silva@email.com",
      "createdAt": "2025-01-03T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  } ```

  🚀 Ambiente: Produção
  ```

    {
      "user": {
        "id": "user-uuid",
        "name": "João Silva",
        "email": "joao.silva@email.com",
        "createdAt": "2025-01-03T12:00:00.000Z"
      }
    } 

  ```

  ❌ Exemplos de Resposta — Erro

    🔴 Dados inválidos (Validação Zod): Status: 400 Bad Request
    
      ```json
      {
        "message": "Dados inválidos",
        "errors": [
          {
            "path": ["email"],
            "message": "Email inválido"
          },
          {
            "path": ["password"],
            "message": "Senha deve conter no mínimo 8 caracteres"
          }
        ]
      }

    ```

  🔴  Email já cadastrado: Status: 409 Conflict

  ```json

    {
      "message": "Email já cadastrado"
    }

  ```

  🔴 Erro interno inesperado => Status: 500 Internal Server Error.
  
  ```json
  
    { 
      "message": "Erro interno do servidor"
    }

  ```

📊 Códigos de Status HTTP Possíveis

| Status | Descrição                           |
| ------ | ----------------------------------- |
| 201    | Usuário criado com sucesso          |
| 400    | Dados inválidos (erro de validação) |
| 409    | Email já existente                  |
| 500    | Erro interno do servidor            |

## ✨ POST `/api/auth/login`

---

### 🧾 Headers Necessários

| Header        | Valor            | Obrigatório |
|---------------|------------------|-------------|
| Content-Type  | application/json | ✅ Sim      |

---

### 📥 Parâmetros

#### Body (JSON)

Contrato esperado:

```ts
LoginDTO = {
  email: string;
  password: string;
}


| Campo    | Tipo   | Obrigatório | Descrição                   |
| -------- | ------ | ----------- | --------------------------- |
| email    | string | ✅ Sim       | Email cadastrado do usuário |
| password | string | ✅ Sim       | Senha do usuário            |


📤 Exemplo de Requisição

```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "joao.silva@email.com",
      "password": "Senha@123"
    }'
    
```

```json
{
  "email": "joao.silva@email.com",
  "password": "Senha@123"
}
```

📦 Exemplo de Resposta — Sucesso
✅ Status: 200 OK
🧪 Ambiente: Desenvolvimento / Staging

```json
{
  "user": {
    "id": "user-uuid",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2025-01-03T12:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
🔐 Obs: Os tokens também são enviados via cookies HTTP-only.

```

🚀 Ambiente: Produção

```json
{
  "user": {
    "id": "user-uuid",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2025-01-03T12:00:00.000Z"
  }
}
```

❌ Exemplos de Resposta — Erro
🔴 Credenciais inválidas => Status: 401 Unauthorized

```json
{
  "message": "Email ou senha inválidos"
}
```

🔴 Dados inválidos (Validação) => Status: 400 Bad Request

```json
{
  "message": "Dados inválidos",
  "errors": [
    {
      "path": ["email"],
      "message": "Email inválido"
    }
  ]
}
```

🔴 Erro interno inesperado => Status: 500 Internal Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

📊 Códigos de Status HTTP Possíveis

| Status | Descrição                   |
| ------ | --------------------------- |
| 200    | Login realizado com sucesso |
| 400    | Dados inválidos             |
| 401    | Email ou senha incorretos   |
| 500    | Erro interno do servidor    |

🍪 Cookies Definidos

| Cookie       | Descrição                      | HttpOnly | Secure |
| ------------ | ------------------------------ | -------- | ------ |
| accessToken  | Token de acesso JWT            | ✅ Sim    | ✅ Sim  |
| refreshToken | Token para renovação de sessão | ✅ Sim    | ✅ Sim  |

## ✨ POST `/api/auth/refresh`

## 🔄 POST `/api/auth/refresh`

### 📌 Descrição

Renova os tokens de autenticação (**access token** e **refresh token**) utilizando o **refresh token** enviado automaticamente via **cookies**.

Essa rota é utilizada para:

- Manter o usuário autenticado
- Evitar que o usuário precise fazer login novamente quando o access token expirar
- Reemitir tokens de forma segura, sem expor credenciais

> ⚠️ Esta rota **não recebe body**.  
> O refresh token é lido exclusivamente dos **cookies HTTP-only**.

---

### 🧾 Headers Necessários

| Header        | Valor            | Obrigatório |
|-------------- |------------------|-------------|
| Content-Type  | application/json | ❌ Não      |
| Cookie        | refreshToken     | ✅ Sim      |

> 🍪 O cookie `refreshToken` deve estar presente na requisição.

---

### 📥 Parâmetros

---

### 📤 Exemplo de Requisição

#### cURL

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  --cookie "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

🔐 Em aplicações web, o browser envia os cookies automaticamente.

📦 Exemplo de Resposta — Sucesso
✅ Status: 200 OK
🧪 Ambiente: Desenvolvimento / Staging

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new-access-token",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new-refresh-token"
} ```
🔐 Obs:

* Os novos tokens também são enviados via cookies HTTP-only

* O refresh token anterior é invalidado

🚀 Ambiente: Produção
```json
{
  "message": "Sessão renovada com sucesso"
} ```



❌ Exemplos de Resposta — Erro

🔴 Refresh token ausente => Status: 401 Unauthorized

```json
{
  "message": "Refresh token não encontrado"
}

```

🔴 Refresh token inválido ou expirado => Status: 401 Unauthorized

```
{
  "message": "Refresh token inválido ou expirado"
}
```

🔴 Erro interno inesperado => Status: 500 Internal Server Error

```json
{
  "message": "Erro interno do servidor"
}


```

📊 Códigos de Status HTTP Possíveis

| Status | Descrição                                   |
| ------ | ------------------------------------------- |
| 200    | Tokens renovados com sucesso                |
| 401    | Refresh token ausente, inválido ou expirado |
| 500    | Erro interno do servidor                    |

🍪 Cookies Atualizados

| Cookie       | Descrição                | HttpOnly | Secure |
| ------------ | ------------------------ | -------- | ------ |
| accessToken  | Novo token de acesso JWT | ✅ Sim     | ✅ Sim  |
| refreshToken | Novo token de renovação  | ✅ Sim    | ✅ Sim  |

# 🗂️ Tasks

Esta seção descreve os endpoints responsáveis pelo **gerenciamento de tarefas (Tasks)** do usuário autenticado.

## URL BASE

<http://locahost:3000/api>

Todas as rotas:

- Exigem **usuário autenticado**
- Utilizam **cookies HTTP-only** para autenticação
- Retornam respostas em **JSON**

---

## 🔐 Autenticação

Todas as rotas desta seção exigem que o usuário esteja autenticado.

- O **access token** deve estar presente no cookie `accessToken`
- Caso não esteja autenticado, a API retornará `401 Unauthorized`

---

## 📄 Estrutura da Task

### TaskDTO (Resposta)

```ts
{
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 📥 Criar Task

✨ POST <http://locahost:3000/api/task/>

🧾 Headers Necessários

| Header       | Valor            | Obrigatório |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | ✅ Sim      |
| Cookie       | accessToken      | ✅ Sim      |

📥 Body (JSON)

| Campo       | Tipo   | Obrigatório | Descrição         |
| ----------- | ------ | ----------- | ----------------- |
| title       | string | ✅ Sim      | Título da task    |
| description | string | ❌ Não      | Descrição da task |

📤 Exemplo de Requisição

```bash
  curl -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Estudar Next.js",
      "description": "Estudar App Router e Middleware"
    }'
```

📦 Resposta de Sucesso => Status: 201 Created

```json
{
  "id": "task-cuid",
  "title": "Estudar Next.js",
  "description": "Estudar App Router e Middleware",
  "completed": false,
  "createdAt": "2025-01-03T12:00:00.000Z",
  "updatedAt": "2025-01-03T12:00:00.000Z"
}
```

❌ Erros Possíveis

| Status | Motivo          |
| ------ | --------------- |
| 400    | Dados inválidos |
| 401    | Não autenticado |
| 500    | Erro interno    |

## 📋 Listar Tasks

✨ GET <http://localhost:3000/api/tasks>

**📌 Descrição**

Retorna todas as tasks do usuário autenticado.

```bash
    curl http://localhost:3000/api/tasks
```

📦 Resposta de Sucesso => Status: 200 OK

```json
[
  {
    "id": "task-1",
    "title": "Estudar Next.js",
    "description": "App Router",
    "completed": false,
    "createdAt": "2025-01-03T12:00:00.000Z",
    "updatedAt": "2025-01-03T12:00:00.000Z"
  },
  {
    "id": "task-2",
    "title": "Implementar autenticação",
    "completed": true,
    "createdAt": "2025-01-02T10:00:00.000Z",
    "updatedAt": "2025-01-03T08:00:00.000Z"
  }
]
```

## 🔍 Buscar Task por ID

✨ GET <http://localhost:3000/api/tasks/:id>

**📌 Descrição**

Retorna uma task específica pertencente ao usuário autenticado

```bash

GET /api/tasks/{id}
```

📥 Parâmetros de Path

| Parâmetro | Tipo   | Obrigatório | Descrição  |
| --------- | ------ | ----------- | ---------- |
| id        | string | ✅ Sim      | ID da task |

📦 Resposta de Sucesso => Status: 200 OK

```json
{
  "id": "task-cuid",
  "title": "Estudar Next.js",
  "description": "App Router",
  "completed": false,
  "createdAt": "2025-01-03T12:00:00.000Z",
  "updatedAt": "2025-01-03T12:00:00.000Z"
}
```

## ✏️ Atualizar Task

✨ PATCH <http://localhost/api/tasks/:id>

**OBS:** Eu preferi usar o PATCH ao invés do PUT, isso faz com que:

  1. Garantir a idenpotência das task: A tasks sempre vai ser a mesma task, alterando somente aquolo que é necessário
  2. Econômia de recursos, eu só preciso enviar pra API aquilo que é necessário, no ponto de vista do desenvolvimento é mais fácil para o desenvolvedor



📥 Body (JSON)

```ts
UpdateTaskDTO = {
  title?: string;
  description?: string;
  completed?: boolean;
} 


**📌 Descrição**

Atualiza os dados de uma task existente.

📦 Resposta de Sucesso => Status: 200

```json

{
  "id": "task-uuid",
  "title": "Estudar Next.js avançado",
  "description": "Server Actions",
  "completed": true,
  "createdAt": "2025-01-03T12:00:00.000Z",
  "updatedAt": "2025-01-04T09:00:00.000Z"
}
```

## 🗑️ Deletar Task

✨ DELETE <http://localhost:3000/api/tasks/:id>

**📌 Descrição**

Remove permanentemente uma task do usuário autenticado.

📦 Resposta de Sucesso => Status: 204 No Content


## ❌ Erros Comuns (Todas as Rotas)


| Status | Descrição                |
| ------ | ------------------------ |
| 400    | Dados inválidos          |
| 401    | Usuário não autenticado  |
| 404    | Task não encontrada      |
| 500    | Erro interno do servidor |

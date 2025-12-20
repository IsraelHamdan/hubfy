# ✅ Todo App — Next.js + Prisma + MySQL

🚀 Aplicação fullstack desenvolvida com **Next.js 16**, **Prisma ORM** e **MySQL**, focada em gerenciamento de tarefas (To-Do), com autenticação segura, arquitetura moderna e pronta para execução em ambiente Docker.

---

## 📖 Descrição do Projeto

Este projeto é uma aplicação **fullstack** para gerenciamento de tarefas, permitindo que usuários criem, editem, atualizem status e removam tasks de forma segura e performática.

A aplicação utiliza:

- **Next.js 16 (App Router)** para frontend e backend
- **Prisma ORM** para comunicação com o banco de dados
- **MySQL 8** como banco relacional
- **Docker** para padronização do ambiente
- **Arquitetura moderna**, focada em performance, segurança e experiência do usuário (UX)

---

## 🧰 Tecnologias Utilizadas

### 🔹 Frontend & Backend

- ⚛️ **Next.js 16.0.10**
- ⚛️ **React 19**
- 🎨 **Tailwind CSS**
- 🧩 **shadcn/ui**
- 🧠 **Zustand (state management)**
- 🔄 **TanStack Query**
- 📝 **TanStack Form**
- 🌐 **Axios**

### 🔹 Backend & Infra

- 🗄️ **Prisma ORM**
- 🐬 **MySQL 8**
- 🐳 **Docker & Docker Compose**
- 🔐 **Argon2 (hash de senhas)**
- 🔑 **JWT (jose)**

### 🔹 Testes & Qualidade

- 🧪 **Jest**
- 🧪 **Supertest**
- 🧪 **ts-jest**
- 🧹 **ESLint**
- 📐 **TypeScript**

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | >= 20.19.6    |
| Docker     | >= 24.x       |
| Docker Compose | >= 2.x    |
| MySQL      | 8.x (docker)  | 
| NPM  |

---

## 🐳 Como Rodar o Projeto com Docker

1️⃣ Subir o banco de dados primeiro:

```bash
docker compose up -d mysql
```
2️⃣ Subir a aplicação Next.js:

```bash
docker compose up -d app
```

---

## 📦 Instalação do Projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/IsraelHamdan/hubfy.git
ou via ssh
git@github.com:IsraelHamdan/hubfy.git
// Github CLI
gh repo clone IsraelHamdan/hubfy
cd seu-repo
```

2️⃣ Instalar dependências (rodando sem docker)
npm install

npm run build

npm run start

<http://localhost:3000>

---

## 🗄️ Banco de Dados

🔔 Importante

⚠️ Este projeto NÃO depende de um arquivo db.sql para funcionar em produção.

O banco roda via Docker

O schema é gerenciado pelo Prisma

As migrations cuidam automaticamente da criação das tabelas

📌 Ou seja:

Prisma + Docker já garantem todo o processo de criação e versionamento do banco.

---

## 🧪 Como Rodar os Testes

**Esse comando roda a todos os testes de uma vez**

```bash
npx jest tests
```

**Roda os testes especificos**

```bash
npx jest tests/<path>
```

No path você substitui pela pasta desjada

## 🗂️ Estrutura de Pastas

/
├── app/                # App Router (Next.js 16)
│   ├── api/            # Rotas da API
│   ├── (auth)/         # Rotas de autenticação
│   ├── dashboard/      # Área privada
│
├── lib/                # Serviços, helpers e utils
├── generated/          # Prisma Client gerado
├── prisma/             # Schema e migrations
├── tests/              # Testes unitários e integração
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── README.md


## 🧠 Decisões Técnicas Importantes

### 🔐 Argon2 para Hash de Senhas

Foi utilizado Argon2 no lugar do bcrypt por ser um algoritmo:

Vencedor do Password Hashing Competition

Mais resistente a ataques de força bruta

Melhor adaptado a hardware moderno (GPU/ASIC resistance)

Altamente configurável (memória, tempo e paralelismo)

➡️ Isso aumenta significativamente a segurança das credenciais dos usuários.

### 🔄 TanStack Form + Axios

A combinação de TanStack Form com Axios foi escolhida por:

Melhor controle de estado de formulários

Validação mais previsível

Melhor experiência do usuário (UX)

Integração fluida com TanStack Query

Separação clara entre lógica de formulário e comunicação HTTP

➡️ O resultado é uma aplicação mais performática, escalável e fácil de mante

###

🗄️ Prisma ORM

O Prisma foi adotado como ORM por:

Forte tipagem com TypeScript

Autocomplete e segurança em tempo de desenvolvimento

Menor chance de erros em queries

Migrations automáticas

Melhor produtividade comparado ao SQL puro

➡️ Facilita manutenção e evolução do banco de dados.


### 🎨 Estilização com shadcn/ui + TailwindCSS

O shadcn/ui foi escolhido por ser:

Modular (usa apenas os componentes necessários)

Totalmente customizável

Baseado em Tailwind

Excelente padrão de acessibilidade

Sem dependência de runtime adicional

➡️ Mantém o bundle leve e o design consistente.

## 🚀 Melhorias Futuras

🔄 Refresh Token (Precisa só fazer o frontend consumir o endpoint, mas o backend já esta configurado)

🔐 RBAC (controle de permissões)

📱 Melhorias de responsividade

📊 Dashboard com métricas

🧪 Aumento da cobertura de testes

🌍 Internacionalização (i18n)

⚡ Cache com Redis


# 🧾 Licença

Este projeto é de uso educacional e demonstrativo.

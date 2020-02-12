Aplicação back-end

Linguagem: NodeJS

Banco de dados: MongoDB

Dependências do projeto

Mongoose: é uma biblioteca para modelar os dados da aplicação (ODM) com MongoDB;

Express: é um framework web que proporciona métodos utilitários HTTP para a criação de uma API;

Body-parser: responsável por interpretar todas as requisições que venham com dados em JSON;

JSON Web Tokens: é uma forma de garantir a autenticação e autorização de uso de APIs RESTful. 
Quando um usuário se autentica, o servidor gera um token com data de expiração para ser enviado no cabeçalho das requisições;

MD5: é um algoritmo de hash de 128 bits unidirecional, usado por softwares com protocolo ponto-a-ponto (P2P). 
Por ser um algoritmo unidirecional, um hash MD5 não pode ser transformado novamente na senha que lhe deu origem.

Estrutura do projeto:

bin
├── server.js
src
├── controllers
├── models
├── repositories
├── routes
├── services
└── validators
app.js
config.js
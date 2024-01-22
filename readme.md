# 🦋 TypeScript TDD Template

⚡ Start your Node.js project with Typescript using Test Driven Development (TDD) practices.

### 📋 GitHub Actions Workflow:

[![🏠 Build](https://github.com/AraManjon/typescript-tdd-template/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/AraManjon/typescript-tdd-template/actions/workflows/build.yml)

This GitHub Actions workflow automatically builds and tests the application when code changes are pushed to the master branch or a pull request targeting the master branch is opened or synchronized.

### 📥 Installation

To get started with this template, you first need to clone the repository:

```bash
git clone https://github.com/AraManjon/typescript-tdd-template.git
```

Then, install the project dependencies:

```bash
npm install
```

### 🏁 How To Start

To start the server in development mode, run the following script:
```bash
npm run dev
```
Then, open http://localhost:8000 to access the server.


### 🚀 Production

To run the server in production mode, first build the TypeScript code into JavaScript by running:

```bash
npm run build
```

This will generate the dist directory with the compiled JavaScript files.

Then, start the server by running:

```bash
npm start
```

This will start the server and make it available at http://localhost:27017/


### 🏗️ Scripts
This project comes with several predefined scripts in the package.json file:

```test```: Runs tests using Jest.

```lint```: Runs ESLint to check code quality.

```lint:fix```: Runs ESLint to fix code style issues.

```dev```: Starts the development server with ts-node-dev and allows debugging

```build```: Removes the ./dist folder and compiles the TypeScript code into JavaScript in the ./dist folder.

```start```: Starts the server in production using the compiled files in the dist/ folder.

### 📝 Dependencies

- cors: middleware for handling Cross-Origin Resource Sharing (CORS)

- dotenv: loads environment variables from a .env file

- express: web framework for Node.js

- express-promise-router: promise-based router for Express

- helmet: middleware for adding security headers

- mongodb: driver for MongoDB

. mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js

- mysql2: MySQL client for Node.js

- socket.io: library that enables real-time, bidirectional and event-based communication between the browser and the server

### 🛠️ Dev Dependencies

- @types/cors: TypeScript definitions for cors

- @types/express: TypeScript definitions for express

- @types/jest: TypeScript definitions for jest

- @types/mysql: TypeScript definitions for mysql

- eslint: linter for TypeScript

- eslint-config-codely: ESLint configuration used by CodelyTV

- mysql: MySQL driver for Node.js

- rimraf: cross-platform tool for removing files and directories

- ts-jest: TypeScript preprocessor for Jest

- ts-node-dev: TypeScript execution and development environment for Node.js

- tsc-watch: TypeScript compiler with file watching

- typescript: language for application-scale JavaScript

### 🗂️ Folder structure

In this folder structure, the code is organized according to the principles of Hexagonal Architecture. 

```
src/
├── backend
│   ├── middlewares
│   ├── App.ts
│   ├── server.start.ts
│   └── Server.ts
├── shared
│   ├── utils
│   ├── domain
│   └── infrastructure
│       ├── config
│       └── persistence
└── user
    ├── application
    │   ├── services
    │   └── use-cases
    ├── domain
    │   ├── entities
    │   └── repositories
    └── infrastructure
        ├── controllers
        ├── repositories
        ├── routes
        ├── services
        └── UserModule.ts
```

### Database setup

Ensure MongoDB is installed and running on your machine.

In the Windows terminal, navigate to the MongoDB directory and un ``.\mongod`` to start the MongoDB server.

Then, connect to the server with ``npm start``

### Postman documentation

Testing the GET endpoint:
Make sure your server is running before sending the GET request. 

Select the request type GET with the URL http://localhost:27017/ and click the send button

Then check the response to get sure the GET endpoint is working correctly.

![alt text](./images/Captura1.png)

![alt text](./images/Captura2.png)

### Chat operation

When database and server are connected, the user has to go to the following URL: http://localhost:27017/

The webpage will ask for username and room name and will connect to a chat room. If another user connects in the same way and type the same room name, they will be connected in the same room and they will be able to send messages to each other via chat.
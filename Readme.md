# Nodejs Docker Starter Template

## CLI Command

This repository contains a CLI (Command-Line Interface) tool that allows you to quickly create a new Node.js project using the provided starter template. It is designed to save you time on project setup and configuration, so you can focus on building your application.

## Prerequirements 
1. Node.js (v14 or heigher)
2. Docker

## Features

- Typescript for type safety
- PostgresQL for data storage
- Prisma for ORM
- Docker

## Installation

To use the CLI command, you can install it globally using npm. Open your terminal or command prompt and run the following command:

```

npx nodejs-docker-starter your_file_name

```
## Usage

Once your project directory is created, you can navigate into it and start working on your Node.js application. The starter template provides a solid foundation for building robust backend applications using Node.js, Express, Prisma, PostgreSQL, Docker, and TypeScript.

To run your application, you will need to install the project dependencies. In the project directory, run:

```

pnpm install

```

`Note :After installing all the required dependencied you may need to change database name based on your preference in the -- docker-compose.yml`

After that you can run the server in the docker by running the following command

```

docker compose up

```

To generate  migration for your prisma schema you can just run the following command : 

```

pnpm docker:db:migrate

```

After successful migration you may need to restart to docker container by running : 
```

pnpm rebuild:be

```

`Note : Refer to the scripts inside package.json for better understanding`

# Contributing
If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request. Your contributions are welcome and appreciated!

# License
This project is licensed under the GPL-3.0 [ LICENSE ](https://github.com/MunavvarSinan/nodejs-prisma-docker-postgres-starter/blob/main/License) which means you can use it freely for personal or commercial purposes.
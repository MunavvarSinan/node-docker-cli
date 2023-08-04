#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { execSync } = require('child_process');

const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error('Failed to execute command', command);
        return false;
    }
}

const repoName = process.argv[2];
const githubCheckoutCommand = `git clone --depth 1 https://github.com/MunavvarSinan/nodejs-prisma-docker-postgres-starter ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Creating a new Node.js project in ${repoName}...`);
const checkedOut = runCommand(githubCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log('Installing dependencies...');
const installDeps = runCommand(installDepsCommand);
if (!installDeps) process.exit(-1);

console.log('Congrats! Your project is ready!')
console.log('To start the project, run the following commands:');
console.log(`cd ${repoName} && docker compose up `);

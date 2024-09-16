#!/usr/bin/env node

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import ora from 'ora';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import figlet from 'figlet';

// Utility to execute shell commands asynchronously
const runCommandAsync = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
};

// Function to check if VSCode is installed
const isVSCodeInstalled = () => {
    return new Promise((resolve) => {
        exec('code --version', (error) => {
            resolve(!error);
        });
    });
};

// Prompt the user for a project name if not provided
const promptProjectName = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'repoName',
            message: 'Enter the project name:',
            validate: (input) => (input.trim() !== '' ? true : 'Project name cannot be empty'),
        },
    ]);
    return answers.repoName;
};

// Main project creation function
const createProject = async () => {
    let repoName = process.argv[2];

    // Ask for the project name if not provided
    if (!repoName) {
        repoName = await promptProjectName();
    }

    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, repoName);

    if (fs.existsSync(projectPath)) {
        console.error(chalk.red(`❌ Error: The directory "${repoName}" already exists in the current path.`));
        process.exit(1);
    }

    // Welcome message with ASCII art
    console.log(
        chalk.blue(figlet.textSync('Node Starter', { horizontalLayout: 'full' }))
    );
    console.log(chalk.cyan(`🚀 Creating a new Node.js project in ${chalk.green(projectPath)}...\n`));

    const gitCloneCommand = `git clone --depth 1 https://github.com/MunavvarSinan/node-starter ${repoName}`;
    const installDepsCommand = `cd ${repoName} && npm install`;

    // Step 1: Clone the repository (suppressing logs)
    const spinner = ora({
        text: 'Creating magic... This may take a moment!',
        spinner: 'moon', // Keeping the original moon spinner
    }).start();

    try {
        await runCommandAsync(gitCloneCommand);
        spinner.succeed(chalk.green('✨ Project files have arrived from the magic vault!\n'));
    } catch (error) {
        spinner.fail(chalk.red('🚨 Failed to clone the repository. Something interrupted the magic.'));
        process.exit(1);
    }

    // Step 2: Install dependencies
    spinner.text = 'Installing dependencies...';
    spinner.start();

    try {
        await runCommandAsync(installDepsCommand);
        spinner.succeed(chalk.green('🎉 All dependencies brewed successfully!\n'));
    } catch (error) {
        spinner.fail(chalk.red('⚠️ Failed to install dependencies. Something might be wrong with npm.'));
        process.exit(1);
    }

    // Step 3: Ask if the user wants to initialize a new Git repository
    const { initializeGit } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'initializeGit',
            message: 'Would you like to initialize a new Git repository?',
            default: true,
        },
    ]);

    if (initializeGit) {
        spinner.text = 'Initializing a new Git repository...';
        spinner.start();

        try {
            await runCommandAsync(`cd ${repoName} && rm -rf .git && git init`);
            spinner.succeed(chalk.green('📝 Git repository successfully initialized.\n'));
        } catch (error) {
            spinner.fail(chalk.red('Failed to initialize Git repository.'));
        }
    }

    // Step 4: Ask if the user wants to open the project folder (with VSCode support)
    const { openProject } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'openProject',
            message: 'Would you like to open the project folder now?',
            default: false,
        },
    ]);

    if (openProject) {
        spinner.text = 'Checking for VSCode...';
        spinner.start();

        try {
            const isVSCodeAvailable = await isVSCodeInstalled();

            if (isVSCodeAvailable) {
                spinner.text = 'VSCode detected! Opening project in VSCode...';
                await runCommandAsync(`code ${repoName}`);
                spinner.succeed(chalk.green('💻 Project opened in VSCode!\n'));
            } else {
                spinner.text = 'VSCode not detected. Opening the project folder...';
                const openCommand = process.platform === 'darwin' ? `open ${repoName}` : process.platform === 'win32' ? `start ${repoName}` : `xdg-open ${repoName}`;
                await runCommandAsync(openCommand);
                spinner.succeed(chalk.green('📂 Project folder is now open!\n'));
            }
        } catch (error) {
            spinner.fail(chalk.red('🚪 Could not open the project folder. Please open it manually.'));
        }
    }

    // Step 5: Display final instructions
    console.log(chalk.green('\n🎉 Your project is ready!'));
    console.log(chalk.cyan('\nTo start your project, run the following commands:'));
    console.log(chalk.yellow(`cd ${repoName} && docker compose up`));
};

// Execute the main function and handle any unexpected errors
createProject().catch((error) => {
    console.error(chalk.red('An unexpected error occurred:'), error);
    process.exit(1);
});

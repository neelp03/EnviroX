// lib/utils.js
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const fs = require("fs");
const path = require("path");

// Executes shell commands with a spinner and returns a promise
const execShellCommand = (command, description) => {
  const spinner = ora(description).start();
  return new Promise((resolve, reject) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        spinner.fail(chalk.red(`Error: ${stderr || "Command failed."}`));
        reject(new Error(stderr || "Command failed."));
      } else {
        spinner.succeed(chalk.green(description));
        resolve(stdout);
      }
    });
  });
};

// Detect the operating system
const detectOS = () => {
  switch (process.platform) {
    case 'linux': return 'linux';
    case 'darwin': return 'macos';
    case 'win32': return 'windows';
    default: return 'unsupported';
  }
};

// Checks if a command exists on the system
const checkCommandExists = (command) => shell.which(command);

// Checks if any file in the current directory matches a certain pattern (e.g., *.csproj)
const fileExistsPattern = (pattern) => {
  const files = fs.readdirSync(process.cwd());
  const regex = new RegExp(pattern.replace('*', '.*'));
  return files.some(file => regex.test(file));
};

module.exports = { execShellCommand, detectOS, checkCommandExists, fileExistsPattern };

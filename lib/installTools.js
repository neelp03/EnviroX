// lib/installTools.js
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");

// Helper function to check if a command exists on the system
const checkCommandExists = (command) => shell.which(command);

// Detect the OS
const detectOS = () => {
  const platform = process.platform;
  switch (platform) {
    case 'linux': return 'linux';
    case 'darwin': return 'macos';
    case 'win32': return 'windows';
    default: return 'unsupported';
  }
};

// Function to get the correct Python and pip commands
const getPythonCommands = () => {
  const os = detectOS();
  let pythonCmd = 'python3';
  let pipCmd = 'pip3';

  // On Windows, 'python' and 'pip' are commonly used
  if (os === 'windows') {
    pythonCmd = 'python';
    pipCmd = 'pip';
  }

  // Check if the commands exist; fallback if necessary
  if (!checkCommandExists(pythonCmd)) {
    pythonCmd = checkCommandExists('python') ? 'python' : null;
  }
  if (!checkCommandExists(pipCmd)) {
    pipCmd = checkCommandExists('pip') ? 'pip' : null;
  }

  return { pythonCmd, pipCmd };
};

// Generic function to execute shell commands with a Promise
const execShellCommand = (command, description) => {
  const spinner = ora(description).start();
  return new Promise((resolve, reject) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        spinner.fail(chalk.red(`Error: ${stderr || "Command failed."}`));
        reject(stderr || "Command failed.");
      } else {
        spinner.succeed(chalk.green(description));
        resolve(stdout);
      }
    });
  });
};

// Node.js Installation
const installNodeJS = async () => {
  const spinner = ora("Checking Node.js installation...").start();

  if (!checkCommandExists("node")) {
    spinner.info(chalk.yellow("Node.js is not installed."));
    const os = detectOS();
    try {
      if (os === "linux") {
        await execShellCommand(
          "curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -",
          "Setting up Node.js repository on Linux..."
        );
        await execShellCommand("sudo apt-get install -y nodejs", "Installing Node.js...");
      } else if (os === "macos") {
        await execShellCommand("brew install node", "Installing Node.js on macOS...");
      } else if (os === "windows") {
        spinner.warn(chalk.yellow("Please download and install Node.js from https://nodejs.org/en/download/"));
      } else {
        spinner.fail(chalk.red("Installation not supported on this system."));
      }
      spinner.succeed(chalk.green("Node.js installed successfully."));
    } catch (error) {
      spinner.fail(chalk.red("Failed to install Node.js."));
      // Allow the script to continue
    }
  } else {
    spinner.succeed(chalk.green("Node.js is already installed."));
  }
};

// Package Manager Installation
const installPackageManager = async (manager) => {
  const spinner = ora(`Checking ${manager} installation...`).start();

  const commands = {
    bun: "curl -fsSL https://bun.sh/install | bash",
    yarn: "npm install -g yarn"
  };

  if (!checkCommandExists(manager)) {
    try {
      await execShellCommand(commands[manager], `Installing ${manager}...`);
      spinner.succeed(chalk.green(`${manager} installed successfully.`));
    } catch (error) {
      spinner.fail(chalk.red(`Error installing ${manager}.`));
      // Allow the script to continue
    }
  } else {
    spinner.succeed(chalk.green(`${manager} is already installed.`));
  }
};

// Python Installation
const installPython = async () => {
  const os = detectOS();
  const spinner = ora('Checking Python installation...').start();

  const { pythonCmd } = getPythonCommands();

  if (!pythonCmd) {
    spinner.info(chalk.yellow("Python is not installed."));
    try {
      if (os === 'linux') {
        await execShellCommand("sudo apt-get install -y python3 python3-venv python3-pip", "Installing Python on Linux...");
      } else if (os === 'macos') {
        await execShellCommand("brew install python3", "Installing Python on macOS...");
      } else if (os === 'windows') {
        spinner.warn(chalk.yellow("Please download and install Python from https://www.python.org/downloads/"));
        return;
      } else {
        spinner.fail(chalk.red("Installation not supported on this system."));
        return;
      }
      spinner.succeed(chalk.green("Python installed successfully."));
    } catch (error) {
      spinner.fail(chalk.red(`Error installing Python on ${os}.`));
      // Allow the script to continue
    }
  } else {
    spinner.succeed(chalk.green("Python is already installed."));
  }
};

// Go Installation
const installGo = async () => {
  const os = detectOS();
  const spinner = ora('Checking Go installation...').start();

  if (!checkCommandExists("go")) {
    spinner.info(chalk.yellow("Go is not installed."));
    try {
      if (os === 'linux') {
        await execShellCommand("sudo apt-get install -y golang", "Installing Go on Linux...");
      } else if (os === 'macos') {
        await execShellCommand("brew install go", "Installing Go on macOS...");
      } else if (os === 'windows') {
        spinner.warn(chalk.yellow("Please download and install Go from https://golang.org/dl/"));
        return;
      } else {
        spinner.fail(chalk.red("Installation not supported on this system."));
        return;
      }
      spinner.succeed(chalk.green("Go installed successfully."));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to install Go on ${os}.`));
      // Allow the script to continue
    }
  } else {
    spinner.succeed(chalk.green("Go is already installed."));
  }
};

module.exports = { installNodeJS, installPackageManager, installPython, installGo, getPythonCommands };

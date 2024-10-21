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

// Generic function to execute shell commands with a Promise
const execShellCommand = (command, description) => {
  const spinner = ora(description).start();
  return new Promise((resolve, reject) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        spinner.fail(chalk.red(`Error: ${stderr || "Command failed."}`));
        reject(stderr || "Command failed.");
      } else {
        spinner.succeed(chalk.green(stdout || "Success."));
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
    if (detectOS() === "linux") {
      try {
        await execShellCommand(
          "curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -", 
          "Setting up Node.js repository on Linux..."
        );
        await execShellCommand("sudo apt-get install -y nodejs", "Installing Node.js...");
      } catch (error) {
        spinner.fail(chalk.red("Failed to install Node.js."));
      }
    } else if (detectOS() === "windows") {
      spinner.warn(chalk.yellow("Please download and install Node.js from https://nodejs.org/en/download/"));
    } else {
      spinner.fail(chalk.red("Installation not supported on this system."));
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
    } catch (error) {
      spinner.fail(chalk.red(`Error installing ${manager}.`));
    }
  } else {
    spinner.succeed(chalk.green(`${manager} is already installed.`));
  }
};

// Python Installation
// Install Python if not installed
const installPython = () => {
  const os = detectOS();
  const spinner = ora('Checking Python installation...').start();

  // On Windows, Python might be `python` or `py`, not `python3`
  const pythonCommand = os === 'windows' ? 'python' : 'python3';

  if (!checkCommandExists(pythonCommand)) {
    spinner.info(chalk.yellow("Python is not installed."));
    if (os === 'linux') {
      spinner.text = 'Installing Python on Linux...';
      shell.exec("sudo apt-get install -y python3 python3-venv python3-pip", { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
          spinner.fail(chalk.red("Error installing Python on Linux."));
          console.error(stderr);
        } else {
          spinner.succeed(chalk.green("Python installed successfully."));
        }
      });
    } else if (os === 'macos') {
      spinner.text = 'Installing Python on macOS...';
      shell.exec("brew install python3", { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
          spinner.fail(chalk.red("Error installing Python on macOS."));
          console.error(stderr);
        } else {
          spinner.succeed(chalk.green("Python installed successfully."));
        }
      });
    } else if (os === 'windows') {
      spinner.warn(chalk.yellow("Please download and install Python from https://www.python.org/downloads/"));
    } else {
      spinner.fail(chalk.red("Installation not supported on this system."));
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
    if (os === 'linux') {
      try {
        await execShellCommand("sudo apt-get install -y golang", "Installing Go on Linux...");
      } catch (error) {
        spinner.fail(chalk.red("Failed to install Go on Linux."));
      }
    } else if (os === 'macos') {
      try {
        await execShellCommand("brew install go", "Installing Go on macOS...");
      } catch (error) {
        spinner.fail(chalk.red("Failed to install Go on macOS."));
      }
    } else if (os === 'windows') {
      spinner.warn(chalk.yellow("Please download and install Go from https://golang.org/dl/"));
    } else {
      spinner.fail(chalk.red("Installation not supported on this system."));
    }
  } else {
    spinner.succeed(chalk.green("Go is already installed."));
  }
};

module.exports = { installNodeJS, installPackageManager, installPython, installGo };

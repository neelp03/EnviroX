const shell = require("shelljs");
const chalk = require("chalk"); 
const ora = require("ora");

// Helper function to check if a command exists on the system
const checkCommandExists = (command) => {
  return shell.which(command) ? true : false;
};

// Detect the OS
const detectOS = () => {
  const platform = process.platform;
  if (platform === 'linux') {
    return 'linux';
  } else if (platform === 'darwin') {
    return 'macos';
  } else if (platform === 'win32') {
    return 'windows';
  } else {
    return 'unsupported';
  }
};

const installNodeJS = () => {
  const spinner = ora("Checking Node.js installation...").start();

  if (!checkCommandExists("node")) {
    spinner.info(chalk.yellow("Node.js is not installed."));
    if (process.platform === "linux") {
      spinner.text = "Installing Node.js on Linux...";
      // First call for repository setup
      shell.exec("curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -", { silent: true }, (code) => {
        if (code !== 0) {
          spinner.fail(chalk.red("Error setting up Node.js repository."));
        } else {
          // Second call for installation
          shell.exec("sudo apt-get install -y nodejs", { silent: true }, (installCode) => {
            if (installCode !== 0) {
              spinner.fail(chalk.red("Error installing Node.js."));
            } else {
              spinner.succeed(chalk.green("Node.js installed successfully."));
            }
          });
        }
      });
    } else if (process.platform === "win32") {
      spinner.warn(chalk.yellow("Please download and install Node.js from https://nodejs.org/en/download/"));
    } else {
      spinner.fail(chalk.red("Installation not supported on this system."));
    }
  } else {
    spinner.succeed(chalk.green("Node.js is already installed."));
  }
};

// Install npm dependencies or other package managers
const installPackageManager = (manager) => {
  const spinner = ora(`Checking ${manager} installation...`).start();

  switch (manager) {
    case "bun":
      if (!checkCommandExists("bun")) {
        spinner.text = `Installing Bun...`;
        shell.exec("curl -fsSL https://bun.sh/install | bash", { silent: true }, (code, stdout, stderr) => {
          if (code !== 0) {
            spinner.fail(chalk.red(`Error installing Bun.`));
            console.error(stderr);
          } else {
            spinner.succeed(chalk.green("Bun installed successfully."));
          }
        });
      } else {
        spinner.succeed(chalk.green("Bun is already installed."));
      }
      break;
    case "yarn":
      if (!checkCommandExists("yarn")) {
        spinner.text = `Installing Yarn...`;
        shell.exec("npm install -g yarn", { silent: true }, (code, stdout, stderr) => {
          if (code !== 0) {
            spinner.fail(chalk.red(`Error installing Yarn.`));
            console.error(stderr);
          } else {
            spinner.succeed(chalk.green("Yarn installed successfully."));
          }
        });
      } else {
        spinner.succeed(chalk.green("Yarn is already installed."));
      }
      break;
    default:
      spinner.succeed(chalk.green(`${manager} is already installed.`));
      break;
  }
};

// Install Python if not installed
const installPython = () => {
  const os = detectOS();
  const spinner = ora('Checking Python installation...').start();

  if (!checkCommandExists("python3")) {
    spinner.info(chalk.yellow("Python3 is not installed."));
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
    spinner.succeed(chalk.green("Python3 is already installed."));
  }
};

// Install Go if not installed
const installGo = () => {
  const os = detectOS();
  const spinner = ora('Checking Go installation...').start();

  if (!checkCommandExists("go")) {
    spinner.info(chalk.yellow("Go is not installed."));
    if (os === 'linux') {
      spinner.text = 'Installing Go on Linux...';
      shell.exec("sudo apt-get install -y golang", { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
          spinner.fail(chalk.red("Error installing Go on Linux."));
          console.error(stderr);
        } else {
          spinner.succeed(chalk.green("Go installed successfully."));
        }
      });
    } else if (os === 'macos') {
      spinner.text = 'Installing Go on macOS...';
      shell.exec("brew install go", { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
          spinner.fail(chalk.red("Error installing Go on macOS."));
          console.error(stderr);
        } else {
          spinner.succeed(chalk.green("Go installed successfully."));
        }
      });
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

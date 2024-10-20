const shell = require("shelljs");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const { installNodeJS, installPackageManager, installPython, installGo } = require("./installTools");

const detectConfigFiles = () => {
  const projectRoot = process.cwd();
  const configFiles = {};

  const possibleConfigs = [
    { name: "Node.js", file: "package.json" },
    { name: "Python", file: "requirements.txt" },
    { name: "Go", file: "go.mod" },
    { name: "Docker", file: "Dockerfile" },
  ];

  possibleConfigs.forEach((config) => {
    const filePath = path.join(projectRoot, config.file);
    if (fs.existsSync(filePath)) {
      configFiles[config.name] = filePath;
    }
  });

  return configFiles;
};

const setupEnvironment = async () => {
  const configs = detectConfigFiles();

  const spinner = ora('Setting up your environment...').start();

  // Node.js Setup
  if (configs["Node.js"]) {
    spinner.info(chalk.yellow("Detected Node.js project..."));
    installNodeJS();  // Ensure Node.js is installed
    const packageManager = "npm";  // Default to npm since it's bundled with Node.js
    shell.exec(`${packageManager} install`, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        spinner.fail(chalk.red("Error installing Node.js dependencies."));
        console.error(stderr);
      } else {
        spinner.succeed(chalk.green("Node.js dependencies installed."));
      }
    });

    // Optionally install other package managers like yarn or bun if detected
    if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) {
      installPackageManager("yarn");
    } else if (fs.existsSync(path.join(process.cwd(), "bun.lockb"))) {
      installPackageManager("bun");
    }
  }

  // Python Setup
  if (configs["Python"]) {
    spinner.info(chalk.yellow("Detected Python project..."));
    installPython();  // Ensure Python is installed
    shell.exec("pip install -r requirements.txt", { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        spinner.fail(chalk.red("Error installing Python dependencies."));
        console.error(stderr);
      } else {
        spinner.succeed(chalk.green("Python dependencies installed."));
      }
    });
  }

  // Go Setup
  if (configs["Go"]) {
    spinner.info(chalk.yellow("Detected Go project..."));
    installGo();  // Ensure Go is installed
    shell.exec("go mod tidy", { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        spinner.fail(chalk.red("Error setting up Go environment."));
        console.error(stderr);
      } else {
        spinner.succeed(chalk.green("Go environment set up."));
      }
    });
  }

  // Docker Setup
  if (configs["Docker"]) {
    spinner.info(chalk.yellow("Detected Docker project..."));
    shell.exec("docker build -t envirox_app .", { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        spinner.fail(chalk.red("Error building Docker image."));
        console.error(stderr);
      } else {
        spinner.succeed(chalk.green("Docker image built successfully."));
      }
    });
  }

  if (Object.keys(configs).length === 0) {
    spinner.warn(chalk.yellow("No configuration files detected. Nothing to set up."));
  }
};

module.exports = { setupEnvironment };

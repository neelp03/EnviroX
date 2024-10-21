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

// Wrapper to execute shell commands and handle errors
const execShellCommand = (command) => {
  return new Promise((resolve, reject) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const setupEnvironment = async () => {
  const configs = detectConfigFiles();
  const spinner = ora('Setting up your environment...').start();

  try {
    // Node.js Setup
    if (configs["Node.js"]) {
      spinner.info(chalk.yellow("Detected Node.js project..."));
      await installNodeJS();  // Ensure Node.js is installed

      const packageManager = fs.existsSync(path.join(process.cwd(), "yarn.lock")) ? "yarn" : "npm";
      await execShellCommand(`${packageManager} install`);
      spinner.succeed(chalk.green("Node.js dependencies installed."));

      // Optionally install bun
      if (fs.existsSync(path.join(process.cwd(), "bun.lockb"))) {
        await installPackageManager("bun");
      }
    }

    // Python Setup
    if (configs["Python"]) {
      spinner.info(chalk.yellow("Detected Python project..."));
      await installPython();  // Ensure Python is installed
      await execShellCommand("pip install -r requirements.txt");
      spinner.succeed(chalk.green("Python dependencies installed."));
    }

    // Go Setup
    if (configs["Go"]) {
      spinner.info(chalk.yellow("Detected Go project..."));
      await installGo();  // Ensure Go is installed
      await execShellCommand("go mod tidy");
      spinner.succeed(chalk.green("Go environment set up."));
    }

    // Docker Setup
    if (configs["Docker"]) {
      spinner.info(chalk.yellow("Detected Docker project..."));
      await execShellCommand("docker build -t envirox_app .");
      spinner.succeed(chalk.green("Docker image built successfully."));
    }

    if (Object.keys(configs).length === 0) {
      spinner.warn(chalk.yellow("No configuration files detected. Nothing to set up."));
    }

  } catch (error) {
    spinner.fail(chalk.red(`Error during setup: ${error}`));
    console.error(error);
  }
};

module.exports = { setupEnvironment };

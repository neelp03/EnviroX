// lib/envSetup.js
const shell = require("shelljs");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const { installNodeJS, installPackageManager, installPython, installGo, getPythonCommands } = require("./installTools");

// Wrapper to execute shell commands and handle errors
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

// Function to detect configuration files
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

  let anySetupCompleted = false;

  // Node.js Setup
  if (configs["Node.js"]) {
    spinner.info(chalk.yellow("Detected Node.js project..."));
    try {
      await installNodeJS();  // Ensure Node.js is installed

      const packageManager = fs.existsSync(path.join(process.cwd(), "yarn.lock")) ? "yarn" : "npm";
      await execShellCommand(`${packageManager} install`, `Installing Node.js dependencies with ${packageManager}...`);
      spinner.succeed(chalk.green("Node.js dependencies installed."));

      // Optionally install bun
      if (fs.existsSync(path.join(process.cwd(), "bun.lockb"))) {
        await installPackageManager("bun");
      }

      anySetupCompleted = true;
    } catch (error) {
      spinner.fail(chalk.red(`Node.js setup failed: ${error}`));
      // Continue to the next setup
    }
  }

  // Python Setup
  if (configs["Python"]) {
    spinner.info(chalk.yellow("Detected Python project..."));
    try {
      await installPython();  // Ensure Python is installed

      const { pipCmd } = getPythonCommands();
      if (!pipCmd) {
        spinner.fail(chalk.red("pip is not installed or not found in PATH."));
        // Continue to the next setup
      } else {
        await execShellCommand(`${pipCmd} install -r requirements.txt`, "Installing Python dependencies...");
        spinner.succeed(chalk.green("Python dependencies installed."));
        anySetupCompleted = true;
      }
    } catch (error) {
      spinner.fail(chalk.red(`Python setup failed: ${error}`));
      // Continue to the next setup
    }
  }

  // Go Setup
  if (configs["Go"]) {
    spinner.info(chalk.yellow("Detected Go project..."));
    try {
      await installGo();  // Ensure Go is installed
      await execShellCommand("go mod tidy", "Setting up Go modules...");
      spinner.succeed(chalk.green("Go environment set up."));
      anySetupCompleted = true;
    } catch (error) {
      spinner.fail(chalk.red(`Go setup failed: ${error}`));
      // Continue to the next setup
    }
  }

  // Docker Setup
  if (configs["Docker"]) {
    spinner.info(chalk.yellow("Detected Docker project..."));
    try {
      await execShellCommand("docker build -t envirox_app .", "Building Docker image...");
      spinner.succeed(chalk.green("Docker image built successfully."));
      anySetupCompleted = true;
    } catch (error) {
      spinner.fail(chalk.red(`Docker setup failed: ${error}`));
      // Continue to the next setup
    }
  }

  if (Object.keys(configs).length === 0) {
    spinner.warn(chalk.yellow("No configuration files detected. Nothing to set up."));
  } else if (!anySetupCompleted) {
    spinner.fail(chalk.red("Environment setup failed for all detected configurations."));
  } else {
    spinner.succeed(chalk.green("Environment setup completed with some successes and failures."));
  }
};

module.exports = { setupEnvironment };

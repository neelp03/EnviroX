// lib/envSetup.js
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const technologies = require("./technologies");

const detectTechnologies = () => {
  const projectRoot = process.cwd();
  const detected = [];
  for (const tech of technologies) {
    let found = false;
    if (tech.detector.files) {
      found = tech.detector.files.some(file => fs.existsSync(path.join(projectRoot, file)));
    }
    if (!found && tech.detector.custom) {
      found = tech.detector.custom();
    }
    if (found) {
      detected.push(tech);
    }
  }
  return detected;
};

const setupEnvironment = async () => {
  const spinner = ora('Setting up your environment...').start();
  const detectedTechs = detectTechnologies();

  if (detectedTechs.length === 0) {
    spinner.warn(chalk.yellow("No known configuration files detected. Nothing to set up."));
    return;
  }

  let anySetupCompleted = false;

  for (const tech of detectedTechs) {
    spinner.info(chalk.yellow(`Detected ${tech.name} project...`));
    try {
      if (tech.install) {
        await tech.install();
      }
      if (tech.setup) {
        await tech.setup();
      }
      spinner.succeed(chalk.green(`${tech.name} environment set up successfully.`));
      anySetupCompleted = true;
    } catch (error) {
      spinner.fail(chalk.red(`${tech.name} setup failed: ${error.message}`));
    }
  }

  if (!anySetupCompleted) {
    spinner.fail(chalk.red("Environment setup failed for all detected configurations."));
  } else {
    spinner.succeed(chalk.green("Environment setup completed for one or more technologies."));
  }
};

module.exports = { setupEnvironment };

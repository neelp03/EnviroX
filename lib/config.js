const fs = require("fs-extra");
const path = require("path");

const detectConfigFiles = (directory = process.cwd()) => {
  const configFiles = {};

  const possibleConfigs = [
    { name: "Node.js", file: "package.json" },
    { name: "Python", file: "requirements.txt" },
    { name: "Go", file: "go.mod" },
    { name: "Docker", file: "Dockerfile" },
  ];

  try {
    possibleConfigs.forEach((config) => {
      const filePath = path.join(directory, config.file);
      if (fs.existsSync(filePath)) {
        configFiles[config.name] = filePath;
        console.log(`Detected ${config.name} configuration at ${filePath}`);
      }
    });
  } catch (error) {
    console.error("Error detecting configuration files:", error.message);
  }

  return configFiles;
};

module.exports = { detectConfigFiles };

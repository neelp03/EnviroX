const fs = require("fs-extra");
const path = require("path");

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

module.exports = { detectConfigFiles };

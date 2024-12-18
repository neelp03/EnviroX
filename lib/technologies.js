// lib/technologies.js
const fs = require("fs");
const path = require("path");
const { execShellCommand, detectOS, checkCommandExists, fileExistsPattern } = require("./utils");
const { installNodeJS, installPython, installGo, installPackageManager, getPythonCommands } = require("./installTools");

module.exports = [
  {
    name: "Node.js",
    detector: { files: ["package.json"] },
    install: async () => {
      await installNodeJS();
    },
    setup: async () => {
      const projectRoot = process.cwd();
      let packageManager = "npm";
      if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) {
        packageManager = "yarn";
      } else if (fs.existsSync(path.join(projectRoot, "bun.lockb"))) {
        await installPackageManager("bun");
        packageManager = "bun";
      }
      await execShellCommand(`${packageManager} install`, `Installing Node.js dependencies with ${packageManager}...`);
    }
  },
  {
    name: "Python",
    detector: { files: ["requirements.txt"] },
    install: async () => {
      await installPython();
    },
    setup: async () => {
      const { pipCmd } = getPythonCommands();
      if (!pipCmd) throw new Error("pip not found. Please install pip.");
      await execShellCommand(`${pipCmd} install -r requirements.txt`, "Installing Python dependencies...");
    }
  },
  {
    name: "Go",
    detector: { files: ["go.mod"] },
    install: async () => {
      await installGo();
    },
    setup: async () => {
      await execShellCommand("go mod tidy", "Setting up Go modules...");
    }
  },
  {
    name: "Docker",
    detector: { files: ["Dockerfile"] },
    install: async () => {
      // If needed, add Docker installation logic here.
    },
    setup: async () => {
      await execShellCommand("docker build -t envirox_app .", "Building Docker image...");
    }
  },
  {
    name: "Rust",
    detector: { files: ["Cargo.toml"] },
    install: async () => {
      if (!checkCommandExists("rustc")) {
        // Install Rust using rustup
        try {
          await execShellCommand("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y", "Installing Rust via rustup...");
        } catch (error) {
          // On failure, user may need to install manually
          throw new Error("Failed to install Rust. Please install manually from https://rustup.rs/");
        }
      }
    },
    setup: async () => {
      await execShellCommand("cargo build", "Building Rust project...");
    }
  },
  {
    name: "Ruby",
    detector: { files: ["Gemfile"] },
    install: async () => {
      const os = detectOS();
      if (!checkCommandExists("ruby")) {
        if (os === "linux") {
          await execShellCommand("sudo apt-get update && sudo apt-get install -y ruby-full build-essential zlib1g-dev", "Installing Ruby on Linux...");
        } else if (os === "macos") {
          await execShellCommand("brew install ruby", "Installing Ruby on macOS...");
        } else if (os === "windows") {
          // Instruct user to install Ruby on Windows
          throw new Error("Please install Ruby from https://rubyinstaller.org/");
        } else {
          throw new Error("Unsupported OS for Ruby installation.");
        }
      }
      // Also ensure bundler is installed
      if (!checkCommandExists("bundle")) {
        await execShellCommand("gem install bundler", "Installing Bundler...");
      }
    },
    setup: async () => {
      await execShellCommand("bundle install", "Installing Ruby gems...");
    }
  },
  {
    name: "Java (Maven)",
    detector: { files: ["pom.xml"] },
    install: async () => {
      const os = detectOS();
      if (!checkCommandExists("mvn") || !checkCommandExists("java")) {
        if (os === "linux") {
          await execShellCommand("sudo apt-get update && sudo apt-get install -y maven default-jdk", "Installing Maven and JDK on Linux...");
        } else if (os === "macos") {
          await execShellCommand("brew install maven openjdk", "Installing Maven and JDK on macOS...");
        } else if (os === "windows") {
          throw new Error("Please install Java (JDK) and Maven manually on Windows.");
        } else {
          throw new Error("Unsupported OS for Java Maven installation.");
        }
      }
    },
    setup: async () => {
      await execShellCommand("mvn clean install", "Building project with Maven...");
    }
  },
  {
    name: "Java (Gradle)",
    detector: { files: ["build.gradle"] },
    install: async () => {
      const os = detectOS();
      if (!checkCommandExists("gradle") || !checkCommandExists("java")) {
        if (os === "linux") {
          await execShellCommand("sudo apt-get update && sudo apt-get install -y gradle default-jdk", "Installing Gradle and JDK on Linux...");
        } else if (os === "macos") {
          await execShellCommand("brew install gradle openjdk", "Installing Gradle and JDK on macOS...");
        } else if (os === "windows") {
          throw new Error("Please install Java (JDK) and Gradle manually on Windows.");
        } else {
          throw new Error("Unsupported OS for Java Gradle installation.");
        }
      }
    },
    setup: async () => {
      await execShellCommand("gradle build", "Building project with Gradle...");
    }
  },
  {
    name: "PHP (Composer)",
    detector: { files: ["composer.json"] },
    install: async () => {
      const os = detectOS();
      if (!checkCommandExists("php") || !checkCommandExists("composer")) {
        if (os === "linux") {
          await execShellCommand("sudo apt-get update && sudo apt-get install -y php-cli composer", "Installing PHP and Composer on Linux...");
        } else if (os === "macos") {
          await execShellCommand("brew install php composer", "Installing PHP and Composer on macOS...");
        } else if (os === "windows") {
          throw new Error("Please install PHP and Composer from https://getcomposer.org/download/.");
        } else {
          throw new Error("Unsupported OS for PHP installation.");
        }
      }
    },
    setup: async () => {
      await execShellCommand("composer install", "Installing PHP dependencies with Composer...");
    }
  },
  {
    name: ".NET",
    detector: {
      // Detect .NET by looking for a .csproj file in the directory
      custom: () => fileExistsPattern(".*\\.csproj$")
    },
    install: async () => {
      const os = detectOS();
      if (!checkCommandExists("dotnet")) {
        if (os === "linux") {
          // This depends on distro, for simplicity:
          throw new Error("Please install .NET from https://dotnet.microsoft.com/en-us/download");
        } else if (os === "macos") {
          await execShellCommand("brew install --cask dotnet", "Installing .NET SDK on macOS...");
        } else if (os === "windows") {
          throw new Error("Please install .NET SDK from https://dotnet.microsoft.com/en-us/download on Windows.");
        } else {
          throw new Error("Unsupported OS for .NET installation.");
        }
      }
    },
    setup: async () => {
      await execShellCommand("dotnet restore", "Restoring .NET project dependencies...");
    }
  }
];

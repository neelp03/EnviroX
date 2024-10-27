
![dark-envirox-banner](https://github.com/user-attachments/assets/bd112233-5b48-4767-ae18-d519897f178e)

[![npm version](https://badge.fury.io/js/envirox.svg)](https://www.npmjs.com/package/envirox)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub issues](https://img.shields.io/github/issues/neelp03/envirox.svg)](https://github.com/neelp03/envirox/issues)
[![GitHub contributors](https://img.shields.io/github/contributors/neelp03/envirox.svg)](https://github.com/neelp03/envirox/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/neelp03/envirox.svg?style=social&label=Star&maxAge=2592000)](https://github.com/neelp03/envirox/stargazers)

# EnviroX

**EnviroX** is a CLI tool designed to automate the setup of development environments for various programming languages and frameworks. With a single command, EnviroX detects the necessary dependencies, installs them, and configures your environment to get you started quickly.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Install via npm](#install-via-npm)
  - [Install from Source (Alternative)](#install-from-source-alternative)
- [Usage](#usage)
  - [Options](#options)
  - [Examples](#examples)
- [Supported Languages and Tools](#supported-languages-and-tools)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

- **Automatic Detection**: Identifies project types and required dependencies.
- **Dependency Installation**: Installs packages using appropriate package managers.
- **Cross-Platform Support**: Compatible with Linux, macOS, and Windows.
- **Easy-to-Use CLI**: Simple commands with helpful options.
- **Extensible Design**: Built to support new languages and tools in the future.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)

### Install via npm

Install EnviroX globally using npm:

```bash
npm install -g envirox
```

### Install from Source (Alternative)

Clone the repository and install dependencies:

```bash
git clone https://github.com/neelp03/envirox.git
cd envirox
npm install
```

Install EnviroX globally from the source:

```bash
npm install -g .
```

### Install via .tgz file

Please find the required file in the latest release tab and download it on your machine

```bash
npm install -g "path/to/tgz/file"
```
## Usage

After installing, you can run EnviroX in your project directory:

```bash
envirox
```

EnviroX will automatically detect your project type and set up the necessary environment.

### Options

- `--language=<language>`: Set up a specific language environment (e.g., `node`, `python`, `go`).
- `--docker`: *(Coming soon)* Set up a Docker environment.
- `--help`, `-h`: Display help information.

### Examples

```bash
# Set up a Node.js environment
envirox --language=node

# Set up a Python environment
envirox --language=python

# View available options
envirox --help
```

## Supported Languages and Tools

- **Node.js**: Detects `package.json` and installs dependencies using `npm` or `yarn`.
- **Python**: Detects `requirements.txt` and installs dependencies using `pip`.
- **Go**: Detects `go.mod` and sets up the Go environment.
- **Docker**: *(Coming soon)* Detects `Dockerfile` and builds Docker images.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit and push your changes (`git push origin feature/your-feature`).
5. Create a pull request.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an [issue](https://github.com/neelp03/envirox/issues) on GitHub.

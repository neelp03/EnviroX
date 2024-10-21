
![dark-envirox-banner](https://github.com/user-attachments/assets/bd112233-5b48-4767-ae18-d519897f178e)

---

# EnviroX

**EnviroX** is a CLI tool designed to automate the setup of development environments for various programming languages and frameworks. With a single command, EnviroX detects the necessary dependencies, installs them, and sets up Docker containers if needed.

## Features

- Automatic detection of language and framework (Node.js, Python, Go, etc.)
- Dependency installation for common languages and package managers
- Docker support for containerized environments
- Cross-platform support (Linux, macOS, Windows)
- Easy-to-use CLI interface
- Extensible design to support new languages and tools in the future

## Installation

To use EnviroX, follow the instructions below.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/envirox.git
   cd envirox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install EnviroX globally (optional):
   ```bash
   npm install -g .
   ```

4. Run the CLI:
   ```bash
   envirox
   ```

## Usage

Once installed, you can use EnviroX to set up a development environment by running the following command:

```bash
envirox
```

EnviroX will detect the environment (Node.js, Python, Go, etc.) and install any missing dependencies. You can also specify additional options:

### Example Commands

```bash
# Setup environment for a Node.js project
envirox --language=node

# Setup environment for a Python project
envirox --language=python

# Setup Docker environment
envirox --docker

# View available options
envirox --help
```

## Contributing

Contributions are welcome! Check out `CONTRIBUTING.md` for more information.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit and push your changes (`git push origin feature-branch`).
5. Create a pull request.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

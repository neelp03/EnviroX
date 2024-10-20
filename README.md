
![dark-envirox-banner](https://github.com/user-attachments/assets/bd112233-5b48-4767-ae18-d519897f178e)

---
# EnviroX

**EnviroX** is a CLI tool designed to automate the setup of development environments for various programming languages and frameworks. With a single command, EnviroX detects the necessary dependencies, installs them, and sets up Docker containers if needed.

## Features
- **Automatic detection** of programming languages and frameworks (Node.js, Python, Go, etc.).
- **Installation of dependencies** based on the detected environment, including package managers like `npm`, `yarn`, `bun`, and system tools like `nvm` for Node.js.
- **Cross-platform support** for Linux, macOS, and Windows with OS-specific installation methods.
- **Docker integration** for setting up containerized environments when a `Dockerfile` is detected.
- **Customizable commands**: Allows users to select or specify custom package managers and other tools as needed.
- **User-friendly terminal output** with colored messages and loading indicators to guide users through the setup process.

## Installation

EnviroX is still in active development, so the installation package will be available soon. Stay tuned!

## Usage

Once installed, use the following commands:

- Initialize environment setup:
  ```bash
  envirox init
  ```

- Example for a project using Node.js:
  ```bash
  envirox init
  ```

- Detects the necessary dependencies (Node.js, Python, Go, etc.), installs them, and sets up the environment.

## Supported Languages and Tools
- **Node.js**: Automatically installs or checks for the presence of Node.js, npm, yarn, or bun.
- **Python**: Installs Python3 if not already installed and sets up the necessary virtual environment.
- **Go**: Installs Go if it's missing on the system.
- **Docker**: Builds Docker containers automatically if a `Dockerfile` is detected.
- **Custom Commands**: Allows users to specify package managers or commands if they're not detected automatically.

## Known Issues
- Currently, some installation processes may require manual intervention on Windows (for example, Python and Node.js installations).
- Error handling during installation may fail in rare cases (e.g., if a network error occurs).

## Running Tests

EnviroX comes with automated tests that check various environment setups:

- To run the tests:
  ```bash
  npm test
  ```

- Tests include checking for the presence of programming languages and the proper installation of dependencies.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with detailed changes.

See `CONTRIBUTING.md` for more details.

## License

This project is licensed under the Apache-2.0 License - see the `LICENSE` file for details.

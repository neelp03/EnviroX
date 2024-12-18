#!/usr/bin/env node

const { installNodeJS, installPython, installGo, installPackageManager } = require('../lib/installTools');
const { setupEnvironment } = require('../lib/envSetup');

async function runSetup() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
    EnviroX: Automated Development Environment Setup Tool
    
    Usage:
      --language=node     Install Node.js environment
      --language=python   Install Python environment
      --language=go       Install Go environment
      --docker            Docker setup
      --help, -h          Display this help message
    `);
    return;
  }

  try {
    if (args.includes('--language=node')) {
      await installNodeJS();
      console.log('Node.js setup completed successfully!');
    } else if (args.includes('--language=python')) {
      await installPython();
      console.log('Python setup completed successfully!');
    } else if (args.includes('--language=go')) {
      await installGo();
      console.log('Go setup completed successfully!');
    } else if (args.includes('--docker')) {
      console.log('Docker setup is being handled automatically now if Dockerfile is detected.');
    } else {
      console.log('EnviroX: Automated Development Environment Setup');
      console.log('Detecting project type and setting up environment...');
      await setupEnvironment();
    }

    process.exit(0); // success
  } catch (error) {
    console.error('Error during setup:', error.message);
    process.exit(1); // failure
  }
}

runSetup();

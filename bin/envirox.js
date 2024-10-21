#!/usr/bin/env node

const { installNodeJS, installPython, installGo, installPackageManager } = require('../lib/installTools');

// Main logic for EnviroX CLI
const args = process.argv.slice(2);

if (args.includes('--language=node')) {
  installNodeJS();
} else if (args.includes('--language=python')) {
  installPython();
} else if (args.includes('--language=go')) {
  installGo();
} else if (args.includes('--docker')) {
  console.log('Docker setup coming soon...');
} else {
  console.log('EnviroX: Automated Development Environment Setup');
  console.log('Use --language=node, --language=python, or --docker for specific setups.');
}

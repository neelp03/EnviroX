#!/usr/bin/env node

const yargs = require("yargs");
const { setupEnvironment } = require("../lib/envSetup");

yargs
  .command({
    command: "init",
    describe: "Initialize environment setup",
    handler: () => {
      console.log("Starting environment setup...");
      setupEnvironment();
    },
  })
  .help()
  .argv;

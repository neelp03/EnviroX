#!/usr/bin/env node

const yargs = require("yargs");

// Define the CLI using yargs
yargs
  .command({
    command: "init",
    describe: "Initialize environment setup",
    handler: () => {
      console.log("EnviroX: Initializing environment setup...");
    },
  })
  .help()
  .argv;

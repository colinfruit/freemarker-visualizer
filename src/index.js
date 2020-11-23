const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const os = require('os');

const image = require('./graph');
const getOptions = require('./helpers/config');
const open = require('./helpers/open');
const Tree = require('./tree');

program.version('0.2.0');

program
  .option('--directories [directories...]', 'FTL base directories')
  .option('-c, --config <path>', 'set config path. defaults to ~/.config/freemarker-visualizer/config.js')
  .option('-i, --image <path>', 'optional image path')
  .option('--plugins [plugins...]', 'plugins to generate additional template information');

program.parse();

// flags must be filtered to avoid overwriting
// config keys with `undefined`
const cliFlags = program.opts();
const cliArgs = { template: program.args[0] };

const run = (flags, args) => {
  const configPath = flags.config
    ? path.resolve(flags.config)
    : path.resolve(os.homedir(), '.config/freemarker-visualizer/config.js');
  const options = getOptions(args, flags, configPath);

  const tree = new Tree(options.template, options.directories, options.plugins).generateTree();
  image(tree, options.image).then((imageData) => {
    fs.writeFile(options.image, imageData, () => {
      open(options.image);
    });
  });
};

run(cliFlags, cliArgs);

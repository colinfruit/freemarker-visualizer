const { program } = require('commander')
const path = require('path')
const os = require('os')

const getOptions = require('./config-helper')
const Tree = require('./tree')
const image = require('./graph')
const open = require('./open')

program.version('0.0.1')

program
  .option('-h, --help', 'output extra debugging')
  .option('--directories [directories...]', 'FTL base directories')
  .option('-c, --config <path>', 'set config path. defaults to ~/.config/freemarker-visualizer/config.js')
  .option('-i, --image <path>', 'optional image path')

program.parse()

const flags = program.opts()
const args = { template: program.args[0] }

const run = async (flags, args) => {
  const configPath = flags.config ?
    path.resolve(flags.config) :
    path.resolve(os.homedir(), '.config/freemarker-visualizer/config.js')
  const options = getOptions(args, flags, configPath)
  
  const tree = new Tree(options.template, options.directories).generateTree()
  await image(tree, options.image)
  open(options.image)
}

run(flags, args)

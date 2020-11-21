const {Command, flags} = require('@oclif/command')
const path = require('path')

const getOptions = require('./config-helper')
const Tree = require('./tree')
const image = require('./graph')
const open = require('./open')

class FreemarkerVisualizer extends Command {
  async run() {
    const {args} = this.parse(FreemarkerVisualizer)
    const {flags} = this.parse(FreemarkerVisualizer)
    const configPath = flags.config ?
      path.resolve(flags.config) :
      path.resolve(this.config.configDir, 'config.js')
    const options = getOptions(args, flags, configPath)
    const tree = new Tree(options.template, options.directories).generateTree()
    await image(tree, options.image)
    open(options.image)
  }
}

FreemarkerVisualizer.description = `A command-line utility to produce visualize graphs of FreeMarker dependencies.
freemarker-visualizer path/to/example.ftl --directories path/to/ftl/dirs,second/path/to/ftls --image graph.svg
`

FreemarkerVisualizer.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  directories: flags.string({description: 'comma separated list of FTL base paths'}),
  image: flags.string({description: 'optional image path'}),
  config: flags.string({description: 'optional configuration file'}),
}

FreemarkerVisualizer.args = [
  {
    name: 'template',
    description: 'FTL template path',
    required: true,
  },
]

module.exports = FreemarkerVisualizer

const {Command, flags} = require('@oclif/command')
const path = require('path')

const Tree = require('./tree')
const image = require('./graph')
const getOptions = require('./config-helper')

class FreemarkerVisualizer extends Command {
  async run() {
    const {args} = this.parse(FreemarkerVisualizer)
    const {flags} = this.parse(FreemarkerVisualizer)
    const configPath = flags.config ?
      path.resolve(flags.config) :
      path.resolve(this.config.configDir, 'config.js')
    const options = getOptions(args, flags, configPath)
    console.log(options)
    const tree = new Tree(options.template, options.directories).generateTree()
    image(tree, options.image)
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
  directories: flags.string({char: 'd', description: 'comma separated list of ftl base paths'}),
  image: flags.string({char: 'o', description: 'optional image path'}),
  config: flags.string({char: 'c', description: 'optional configuration file'}),
}

FreemarkerVisualizer.args = [
  {
    name: 'template',
    description: 'FTL template path',
    required: true,
  },
]

module.exports = FreemarkerVisualizer

const {Command, flags} = require('@oclif/command')
const path = require('path')

const Tree = require('./tree')
const image = require('./graph')
const {getConfig, normalizeConfig} = require('./config-helper')

class FreemarkerVisualizer extends Command {
  async run() {
    const {flags} = this.parse(FreemarkerVisualizer)

    const configPath = flags.config ?
      path.resolve(flags.config) :
      path.join(this.config.configDir, 'config.js')
    const config = getConfig(configPath)

    const options = normalizeConfig({...config, ...flags})
    if (options.template && options.directories && options.output) {
      const tree = new Tree(options.template, options.directories).generateTree()
      image(tree, options.output)
    } else {
      throw new Error('you must supply a template, directories, and output flags!')
    }
  }
}

FreemarkerVisualizer.description = `A command-line utility to produce visualize graphs of FreeMarker dependencies.
freemarker-visualizer --template example.ftl --directories path/to/ftl/dirs,second/path/to/ftls --output graph.svg
`

FreemarkerVisualizer.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  template: flags.string({char: 't', description: 'ftl template path'}),
  directories: flags.string({char: 'd', description: 'comma separated list of ftl base paths'}),
  output: flags.string({char: 'o', description: 'output path'}),
  config: flags.string({char: 'c', description: 'optional configuration file'}),
}

module.exports = FreemarkerVisualizer

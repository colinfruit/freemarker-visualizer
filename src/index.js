const {Command, flags} = require('@oclif/command')
const Tree = require('./tree')
const image = require('./graph')

class FreemarkerVisualizerCommand extends Command {
  async run() {
    const {flags} = this.parse(FreemarkerVisualizerCommand)

    if (flags.template && flags.dir && flags.output) {
      const dir = flags.dir.split(',')
      const deps = new Tree(flags.template, dir)
      const tree = deps.generateTree()
      image(tree, flags.output)
    } else {
      throw new Error('you must supply a template, dir, and output flags!')
    }
  }
}

FreemarkerVisualizerCommand.description = `A command-line utility to produce visualize graphs of FreeMarker dependencies.
...
`

FreemarkerVisualizerCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'name to print'}),
  // flag for ftl template path
  template: flags.string({char: 't', description: 'ftl template path'}),
  dir: flags.string({char: 'd', description: 'ftl base path[s]'}),
  // TODO make this work for all img formats
  output: flags.string({char: 'o', description: 'output path'}),
}

module.exports = FreemarkerVisualizerCommand

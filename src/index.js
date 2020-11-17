const {Command, flags} = require('@oclif/command')
const Tree = require('./tree')
const image = require('./graph')

class FreemarkerVisualizer extends Command {
  async run() {
    const {flags} = this.parse(FreemarkerVisualizer)

    if (flags.template && flags.directories && flags.output) {
      const directories = flags.directories.split(',')
      const deps = new Tree(flags.template, directories)
      const tree = deps.generateTree()
      image(tree, flags.output)
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
}

module.exports = FreemarkerVisualizer

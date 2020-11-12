const {Command, flags} = require('@oclif/command')

class FreemarkerVisualizerCommand extends Command {
  async run() {
    const {flags} = this.parse(FreemarkerVisualizerCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from ./src/index.js`)
  }
}

FreemarkerVisualizerCommand.description = `Describe the command here
...
Extra documentation goes here
`

FreemarkerVisualizerCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = FreemarkerVisualizerCommand

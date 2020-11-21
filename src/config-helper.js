const path = require('path')
const os = require('os')
/**
   * Generate options
   * @param {Object} config FreemarkerVisualizer options
   * @return {Object} generate options
   */
const generateOptions = config => {

  if (typeof config.directories === 'string') {
    config.directories = config.directories.split(',')
  }

  if (config.template) {
    // enables the user to provide a template path relative to the cwd
    const templatePath = path.resolve(config.template)
    config.directories.forEach(dir => {
      if (templatePath.includes(dir)) {
        config.template = templatePath.split(dir).pop()
      }
    })
  }

  // create a temporary image file if no image flag is provided
  if (config.image) {
    config.image = path.resolve(config.image)
  } else {
    config.image = path.resolve(os.tmpdir(), 'graph.png')
  }
  return config
}

/**
   * Validate the config
   * @param {Object} config FreemarkerVisualizer config
   */
const validateOptions = config => {
  if (!config.directories) {
    throw new Error('directories configuration option not found')
  }

  if (!config.template) {
    throw new Error('template arg not provided!')
  }
}

/**
   * Return the config
   * @param {Object} args provided cli args
   * @param {Object} flags provided cli flags
   * @param {Object} configPath path to configuration file
   * @return {Object} config from file or empty object
   */
const getOptions = (args, flags, configPath) => {
  let config
  try {
    config = require(configPath)
  } catch (_) {
    config = {}
  }

  // TODO: remove this
  Object.keys(flags).forEach((key) =>  {
      if(flags[key] === undefined) delete flags[key];
  })

  const normalizedOptions = generateOptions({ ...config, ...flags, ...args })
  validateOptions(normalizedOptions)
  return normalizedOptions
}

module.exports = getOptions

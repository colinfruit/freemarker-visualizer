const path = require('path')

/**
   * Read the config
   * @param {Path} configPath path for FreemarkerVisualizer config
   * @return {Object} config from file or empty object
   */
const getConfig = configPath => {
  try {
    return require(configPath)
  } catch (_) {
    return {}
  }
}

/**
   * Normalize the config
   * @param {Object} config FreemarkerVisualizer config
   * @return {Object} sanitized config
   */
const normalizeConfig = config => {
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
  return config
}

module.exports = {getConfig, normalizeConfig}

const path = require('path')

const getConfig = configPath => {
  try {
    return require(configPath)
  } catch (_) {
    return {}
  }
}

const sanitizeConfig = config => {
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

module.exports = {getConfig, sanitizeConfig}

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
    // config.template = path.resolve(config.template)
  }
  return config
}

module.exports = {getConfig, sanitizeConfig}

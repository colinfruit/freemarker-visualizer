const path = require('path');
const os = require('os');

/**
  * Remove undefined keys from object
  * @param {Object} obj
  * @return {Object} without undefined keys
  */
const filterObject = (obj) => {
  const filtered = {};
  Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .forEach((key) => { filtered[key] = obj[key]; });
  return filtered;
};

/**
   * Generate options
   * @param {Object} config file of options
   * @param {Object} flags cli flags
   * @param {Object} args cli args
   * @return {Object} generate options
   */
const generateOptions = (config, flags, args) => {
  const options = { ...config, ...flags, ...args };
  // handle relative or absolute dir paths.
  if (options.directories) {
    options.directories = options.directories.map((dir) => path.resolve(dir));
  }

  if (options.template && options.directories) {
    // enables the user to provide a template path relative to the cwd
    const templatePath = path.resolve(options.template);
    options.directories.forEach((dir) => {
      if (templatePath.includes(dir)) {
        options.template = templatePath.split(dir).pop();
      }
    });
  }

  // create a temporary image if no image flag is provided
  if (options.image) {
    options.image = path.resolve(options.image);
  } else {
    options.image = path.resolve(os.tmpdir(), 'graph.png');
  }

  if (options.plugins) {
    options.plugins = options.plugins.map((plugin) => (
      // eslint-disable-next-line
      require(path.resolve(plugin))
    ));
  }
  return options;
};

/**
   * Validate the config
   * @param {Object} options FreemarkerVisualizer options
   */
const validateOptions = (options) => {
  if (!options.directories) {
    throw new Error('directories not found');
  }

  if (!options.template) {
    throw new Error('template path not found');
  }
};

/**
   * Return the config
   * @param {Object} args provided cli args
   * @param {Object} flags provided cli flags
   * @param {Object} configPath path to configuration file
   * @return {Object} config from file or empty object
   */
const getOptions = (args, flags, configPath) => {
  let config;
  try {
    // eslint-disable-next-line
    config = require(configPath);
  } catch (_) {
    config = {};
  }

  const options = generateOptions(config, filterObject(flags), args);
  validateOptions(options);
  return options;
};

module.exports = getOptions;

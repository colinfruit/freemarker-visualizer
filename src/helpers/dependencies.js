/**
  * @param {Object} token freemarker token
  * @return {Boolean} token is an include directive
  */
const isInclude = (token) => (token.type === 'Directive' && token.text === 'include');

/**
  * @param {Object} token freemarker token
  * @return {Boolean} token is an import directive
  */
const isImport = (token) => (token.type === 'Directive' && token.text === 'import');

/**
  * @param {Object} token freemarker token
  * @return {String|Boolean} a valid file path if it exists or false
  */
const getPath = (token) => {
  const match = /\/.*\.[\w:]+/.exec(token.params);
  if (match && match[0] !== 'undefined') {
    return match[0];
  }
  return false;
};
/**
* Generate a list of dependencies for the provided
* FreeMarker template
* @param {String} data parsed FreeMarker AST and tokens
* @return {Array} array of all files included or imported
*/
const dependencies = (data) => data.tokens
  .filter((token) => isInclude(token) || isImport(token))
  .map(getPath)
  .filter((x) => (x !== false));

module.exports = dependencies;

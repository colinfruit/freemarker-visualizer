const freemarker = require('freemarker-parser')
const fs = require('fs')

class Tree {
  static isInclude(token) {
    return (token.type == "Directive" && token.text == "include");
  }

  static isImport(token) {
    return (token.type == "Directive" && token.text == "import");
  }

  static getPath(token) {
    let match = /\/.*\.[\w:]+/.exec(token.params);
    if (match && match[0] !== 'undefined') {
      return match[0];
    } else {
      return false;
    }
  }

  constructor(template, baseDir) {
    this.templatePath = template;
    this.baseDir = baseDir;
  }

  /**
  	 * Generate a list of dependencies for the provided
     * FreeMarker template
     * @params {String} path
  	 * @return {Array} paths.
  	 */
  getDeps(path) {
    let fileContents;
    this.baseDir.forEach((dir) => {
      if (fs.existsSync(`${dir}${path}`)) {
        fileContents = fs.readFileSync(`${dir}${path}`, "utf8");
      }
    });
    if (!fileContents) {
      return [];
    }
    const parser = new freemarker.Parser();
    const data = parser.parse(fileContents);

    let files = data.tokens
                    .filter((token) => Tree.isInclude(token) || Tree.isImport(token))
                    .map(Tree.getPath)
                    .filter((x) => (x != false ));
    return files;
  }

  /**
  	 * Generate a tree of dependencies for the provided
     * FreeMarker template
     * @params {String} path
  	 * @return {Object} file tree
  	 */
  generateTree(path = this.templatePath) {
    const tree = { filename: path, dependencies: [] };
    let deps = this.getDeps(path);
    tree.dependencies = deps.map((dep) => {
      return this.generateTree(dep);
    });
    return tree;
  }
}

module.exports = Tree;
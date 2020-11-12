const freemarker = require('freemarker-parser')
const fs = require('fs')

class Tree {
  static isInclude(token) {
    return (token.type == "Directive" && token.text == "include");
  }

  static isImport(token) {
    return (token.type == "Directive" && token.text == "import");
  }

  constructor(template, baseDir) {
    this.templatePath = template;
    this.baseDir = baseDir;
  }

  /**
  	 * Generate a tree of dependencies for the provided
     * FreeMarker template
     * @params {String | undefined} path
  	 * @return {Array} tokens
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

    // TODO: clean this up
    let includes = data.tokens.filter((token) => Tree.isInclude(token)).map((token) => (token.params.replace(/"/g, '').replace(/'/g, '').replace(/ /g, '')));
    let imports = data.tokens.filter((token) => Tree.isImport(token)).map((token) => {
      let match = /\/.*\.[\w:]+/.exec(token.params);
      if (match && match[0] !== 'undefined') {
        return match[0];
      } else {
        return false;
      }
    }).filter((x) => (x != false ));
    return includes.concat(imports);
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
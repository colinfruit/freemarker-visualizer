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

    /**
  	 * Generate a list of dependencies for the provided
     * FreeMarker template
     * @params {String} path
  	 * @return {Array} paths.
  	 */
    static getDeps(fileContents) {
        const parser = new freemarker.Parser();
        const ast = parser.parse(fileContents);
    
        let files = ast.tokens
                        .filter((token) => Tree.isInclude(token) || Tree.isImport(token))
                        .map(Tree.getPath)
                        .filter((x) => (x != false ));
        return files;
    }
    

  constructor(template, baseDir, additionalInfoGenerator) {
    this.templatePath = template;
    this.baseDir = baseDir;
    this.additionalInfoGenerator = additionalInfoGenerator;
  }

    /**
  	 * Read file contents for the provided file
     * @params {String} filename
  	 * @return {Array} paths.
  	 */
  readFileContents(filename) {
    let fileContents;
    this.baseDir.forEach((dir) => {
      if (fs.existsSync(`${dir}${filename}`)) {
        fileContents = fs.readFileSync(`${dir}${filename}`, "utf8");
      }
    });

    if (!fileContents) {
        throw new Error(`Could not read ${filename}`);
    }

    let additionalInfo = {};
    if (this.additionalInfoGenerator) {
        additionalInfo = this.additionalInfoGenerator(fileContents);
    }

    return { fileContents, additionalInfo };
  }

  /**
  	 * Generate a tree of dependencies for the provided
     * FreeMarker template
     * @params {String} path
  	 * @return {Object} file tree
  	 */
  generateTree(filename = this.templatePath) {
    let { fileContents, additionalInfo } = this.readFileContents(filename);
    const tree = { filename, additionalInfo, };
    let files = Tree.getDeps(fileContents);
    tree.dependencies = files.map((dep) => {
      return this.generateTree(dep);
    });
    return tree;
  }
}

module.exports = Tree;
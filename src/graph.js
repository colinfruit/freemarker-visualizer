// some of this code is taken from Madge: https://github.com/pahen/madge

// MIT License
//
// Copyright (c) 2017 Patrik Henningsson
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
const graphviz = require('graphviz');
const { exec } = require('child_process');
const path = require('path');

/**
* Checks if graphviz is installed
*/
const checkGraphvizInstalled = () => {
  exec('gvpr -V', null, (error) => {
    if (error) {
      throw new Error(`Graphviz could not be found. Ensure that "gvpr" is in your $PATH.\n${error}`);
    }
  });
};

const defaultConfig = {
  rankdir: 'LR',
  layout: 'dot',
  fontName: 'Arial',
  fontSize: '14px',
  backgroundColor: '#111111',
  nodeColor: '#c6c5fe',
  nodeShape: 'box',
  nodeStyle: 'rounded',
  edgeColor: '#757575',
  graphVizOptions: false,
  type: 'png',
};

/**
 * Return options to use with graphviz digraph.
 * @return {Object} graphVizOptions
 */
const createGraphvizOptions = () => ({
  // Graph
  G: {
    overlap: false,
    pad: 0.3,
    rankdir: defaultConfig.rankdir,
    layout: defaultConfig.layout,
    bgcolor: defaultConfig.backgroundColor,
  },
  // Edge
  E: {
    color: defaultConfig.edgeColor,
  },
  // Node
  N: {
    fontname: defaultConfig.fontName,
    fontsize: defaultConfig.fontSize,
    color: defaultConfig.nodeColor,
    shape: defaultConfig.nodeShape,
    style: defaultConfig.nodeStyle,
    height: 0,
    fontcolor: defaultConfig.nodeColor,
  },
  type: 'png',
});

/**
  * @param {Object} treeNode file tree node
  * @returns {String} display name for file
  */
const getNodeDisplayName = (treeNode) => {
  let displayName = treeNode.filename;
  if (treeNode.additionalInfo) {
    Object.keys(treeNode.additionalInfo).forEach((key) => {
      displayName += `\n${key}: ${treeNode.additionalInfo[key]}`;
    });
  }
  return displayName;
};

/**
 * Recursively generates a dependency graph
 * @param {Object} g graph
 * @param {Object} treeNode file tree node
 * @param {Set} edges set to ensure duplicate edges are not created
 */
const createGraph = (g, treeNode, edges) => {
  const color = treeNode.dependencies.length > 0 ? 'blue' : 'green';
  g.addNode(getNodeDisplayName(treeNode), { color });
  treeNode.dependencies.forEach((dep) => {
    if (!edges.has(`${getNodeDisplayName(treeNode)}${getNodeDisplayName(dep)}`)) {
      // this logic needs to be cleaned up.
      // find a better way to avoid duplicate edges.
      edges.add(`${getNodeDisplayName(treeNode)}${getNodeDisplayName(dep)}`);
      createGraph(g, dep, edges);
      g.addEdge(getNodeDisplayName(treeNode), getNodeDisplayName(dep));
    }
  });
};

/**
 * Creates an image from the module dependency tree.
 * @param  {Object} tree file tree with FTL dependencies and additional info
 * @param {String} outputPath path for generated dependency graph
 */
const image = (tree, outputPath) => {
  checkGraphvizInstalled();
  const options = createGraphvizOptions();
  options.type = path.extname(outputPath).replace('.', '') || 'png';
  const g = graphviz.digraph('G');
  const edges = new Set();
  createGraph(g, tree, edges);
  return new Promise((resolve, reject) => {
    g.output(options, resolve, (_1, _2, err) => reject(err));
  });
};

module.exports = image;

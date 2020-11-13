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
const { writeFile } = require('fs');
const path = require('path');
/**
  * Checks if graphviz can be found
  * @return {}
  */
const checkGraphvizInstalled = () => {
  exec('gvpr -V', null, (error) => { if (error) throw new Error('Graphviz could not be found. Ensure that "gvpr" is in your $PATH.\n' + error);});
}

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
 * @param  {Object} defaultConfig
 * @return {Object}
 */
const createGraphvizOptions = () => {
	const graphVizOptions = defaultConfig.graphVizOptions || {};
	return {
		// Graph
		G: Object.assign({
			overlap: false,
			pad: 0.3,
			rankdir: defaultConfig.rankdir,
			layout: defaultConfig.layout,
			bgcolor: defaultConfig.backgroundColor
		}, graphVizOptions.G),
		// Edge
		E: Object.assign({
			color: defaultConfig.edgeColor
		}, graphVizOptions.E),
		// Node
		N: Object.assign({
			fontname: defaultConfig.fontName,
			fontsize: defaultConfig.fontSize,
			color: defaultConfig.nodeColor,
			shape: defaultConfig.nodeShape,
			style: defaultConfig.nodeStyle,
			height: 0,
			fontcolor: defaultConfig.nodeColor
		}, graphVizOptions.N),
        type: 'png',
	};
}

const getNodeId = (tree) => {
    let nodeId = tree.filename;
    if (tree.additionalInfo) {
        Object.keys(tree.additionalInfo).forEach(key => {
            nodeId += `\n${key}: ${tree.additionalInfo[key]}`
        })
    }
    return nodeId;
}

const createGraph = (g, tree, edges) => {
  const color = tree.dependencies.length > 0 ? "blue" : "green";
  const root = g.addNode(getNodeId(tree), { "color": color });
  tree.dependencies.forEach((dep) => {
    if (!edges.has(`${getNodeId(tree)}${getNodeId(dep)}`)) {
      // TODO: this logic needs to be cleaned up.
      // find a better way to avoid duplicate edges.
      edges.add(`${getNodeId(tree)}${getNodeId(dep)}`)
      let node = createGraph(g, dep, edges);
      g.addEdge(getNodeId(tree), getNodeId(dep));
    }
  });
  return root;
}

/**
 * Creates an image from the module dependency tree.
 * @param  {Object} tree
 * @param {String} outputPath
 */
 const image = (tree, outputPath) => {
  checkGraphvizInstalled();
  const options = createGraphvizOptions();
  options.type = path.extname(outputPath).replace('.', '') || 'png';
  const g = graphviz.digraph("G");
  const edges = new Set();
  const graph = createGraph(g, tree, edges);
  g.output(options, outputPath);
};

module.exports = image;

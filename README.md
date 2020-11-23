freemarker-visualizer
=====================

<p align="center">
    :construction: Work in Progress! :construction:
</p>

[![Version](https://img.shields.io/npm/v/freemarker-visualizer.svg)](https://npmjs.org/package/freemarker-visualizer)
[![Downloads/week](https://img.shields.io/npm/dw/freemarker-visualizer.svg)](https://npmjs.org/package/freemarker-visualizer)
[![License](https://img.shields.io/npm/l/freemarker-visualizer.svg)](https://github.com/colinfruit/freemarker-visualizer/blob/master/package.json)

<!-- introduction -->
# Introduction
A command-line utility to produce visual graphs of FreeMarker file trees.
It was inspired by [Madge](https://github.com/pahen/madge), a library that produces visual graphs of JavaScript dependencies.

- Files specified in `<#import />` and `<#include />` directives are graphed by default
- Plugins can be used to add additional information to the graph
<!-- introductionstop -->

<!-- setup -->
# Setup
```sh
npm install -g freemarker-visualizer
```
## Install `graphviz`:
```sh
# OS X:
brew install graphviz || port install graphviz
# Fedora:
dnf install graphviz
# Ubuntu:
apt-get install graphviz
```
<!-- setupstop -->

<!-- usage -->
# Usage
### Graph file tree:
```sh
freemarker-visualizer path/to/template.ftl --directories path/to/dir
```
This will display a visual graph.

### Save graph as an image:
```sh
freemarker-visualizer path/to/template.ftl --directories path/to/dir --image graph.svg
```
This will save `graph.svg` in the `cwd`.

### Specify multiple template directories:
```sh
freemarker-visualizer path/to/template.ftl --directories dir1 dir2
```
This is useful in a project that has multiple base template directories. To avoid difficulty using `freemarker-visualizer`, the directories may be set in a configuration file.

### Add additional template info:
```sh
freemarker-visualizer path/to/template.ftl --directories path/to/dir --plugins path/to/plugin.js
```
This will generate a graph with additional information about each processed template.
<!-- usagestop -->

<!-- config -->
# Configuration
Property | Type | Default | Description
--- | --- | --- | ---
`directories` | Array | null | paths of base directories to search for templates
`plugins` | Array | null | paths to plugins
`template` | String | null | path to template
`image` | String | `graph.png` | path for generated graph image


You can add a configuration file in `.config/freemarker-visualizer/config.js` in your home directory or provide it through the `--config` flag.
<!-- configstop -->

<!-- plugins -->
# Writing plugins
To generate additional information about each template, a plugin can be referenced through the cli or in the configuration.

Each plugin must:
- be a JavaScript file
- export a function with a data parameter
- return an object with the new information to be displayed

See [example plugins](https://github.com/colinfruit/freemarker-visualizer/tree/master/examples/plugins) for more information.
<!-- pluginsstop -->

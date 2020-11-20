  freemarker-visualizer
  =====================

  <p align="center">
      :construction: Work in Progress! :construction:
  </p>

  [![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
  [![Version](https://img.shields.io/npm/v/freemarker-visualizer.svg)](https://npmjs.org/package/freemarker-visualizer)
  [![Downloads/week](https://img.shields.io/npm/dw/freemarker-visualizer.svg)](https://npmjs.org/package/freemarker-visualizer)
  [![License](https://img.shields.io/npm/l/freemarker-visualizer.svg)](https://github.com/colinfruit/freemarker-visualizer/blob/master/package.json)

  <!-- introduction -->
  # Introduction
  A command-line utility to produce visual graphs of FreeMarker templates.
  It was inspired by [Madge](https://github.com/pahen/madge) and uses [freemarker-parser](https://github.com/armano2/freemarker-parser) for AST generation.

  - `<#import />` and `<#include />` directives are graphed by default
  - Plugins can be used to add additional information to the graph (see example plugins)
  <!-- introductionstop -->

  <!-- installation -->
  # Installation
  ```sh
  $ npm install -g freemarker-visualizer
  ```
  <!-- installationstop -->

  # Usage
  <!-- usage -->
  ```sh-session
  $ freemarker-visualizer (-v|--version|version)
  freemarker-visualizer/0.0.0 darwin-x64 node-v12.13.0
  $ freemarker-visualizer --help [COMMAND]
  $ freemarker-visualizer --template example.ftl --directories path/to/ftl/dirs,second/path/to/ftls --output graph.svg
  ```
  <!-- usagestop -->

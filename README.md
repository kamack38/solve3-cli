# Solve3-Cli

Command-line tool for interacting with [Solve3](https://solve.edu.pl/)

<div align="center">
  
  [![Latest version](https://img.shields.io/npm/v/solve3-cli?label=Latest%20verison&style=flat-square)](https://www.npmjs.com/package/solve3-cli)
  [![Dependencies](https://img.shields.io/librariesio/release/npm/solve3-cli?label=Dependencies&style=flat-square)](https://libraries.io/npm/solve3-cli)
  ![Downloads per week](https://img.shields.io/npm/dw/solve3-cli?style=flat-square)

</div>

## Installation

```shell
npm install -g solve3-cli
```

## Usage

```shell
Usage: solve3 [options] [command]

Awesome Solve3 Cli built using custom API

Options:
  -V, --version                          output the version number
  -h, --help                             display help for command

Commands:
  login [options] [username] [password]  Login in to Solve
  config [option] [value]                Change config option. If value is null prints current value
  contest [id]                           View contest
  send <parentId> [id] [filePath]        Send problem solution
  rank <id>                              Show ranking for a contest
  help [command]                         display help for command
```

### Reference

`[]` - optional argument

`<>` - required argument

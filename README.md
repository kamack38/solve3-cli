# Solve3-Cli

Command-line tool for interacting with [Solve3](https://solve.edu.pl/)

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
  help [command]                         display help for command
```

### Reference

`[]` - optional argument

`<>` - required argument

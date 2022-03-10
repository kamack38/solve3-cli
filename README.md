# Solve3-Cli

Command-line tool for interacting with [Solve3](https://solve.edu.pl/)

<div align="center">
  
  [![Latest version](https://img.shields.io/npm/v/solve3-cli?label=Latest%20verison&style=flat-square)](https://www.npmjs.com/package/solve3-cli)
  [![Dependencies](https://img.shields.io/librariesio/release/npm/solve3-cli?label=Dependencies&style=flat-square)](https://libraries.io/npm/solve3-cli)
  ![Downloads per week](https://img.shields.io/npm/dw/solve3-cli?style=flat-square)

</div>

## Installation

Installation requires [Node.js](https://nodejs.org/)

```shell
npm install -g solve3-cli
```

## Usage

```shell
Usage: solve3 [options] [command]

Awesome Solve3 Cli built using custom API

Options:
  -v, --version                               output the version number
  -h, --help                                  display help for command

Commands:
  login|auth [options] [username] [password]  Login in to Solve
  logout [options]                            Logout from Solve
  config|conf [option] [value]                Change config option. If value is null prints current value
  contest|cont [options] [id]                 View contest you have access to
  send <contestId> [id] [filePath]            Send problem solution
  description|desc <id>                       Show problem description
  ranking|rank [options] [id]                 Show ranking for a contest
  favorite|fav [options]                      Add, delete or show favorite contests
  submit|sub [options] [id]                   Show recent contest submits
  status [options] [query]                    Show recent submits
  task [options] [query]                      Show tasks
  help [command]                              display help for command
```

### login

```
Usage: solve3 login|auth [options] [username] [password]

Login in to Solve

Arguments:
  username      Solve3 username
  password      Solve3 password

Options:
  -c, --config  Login using credentials in config file
  -h, --help    display help for command
```

### logout

```
Usage: solve3 logout [options]

Logout from Solve

Options:
  -r, --remove  Remove login data saved in config
  -h, --help    display help for command
```

### config

```
Usage: solve3 config|conf [options] [option] [value]

Change config option. If value is null prints current value

Arguments:
  option      Config option name
  value       Config option value

Options:
  -h, --help  display help for command
```

### contest

```
Usage: solve3 contest|cont [options] [id]

View contest you have access to

Arguments:
  id          Contest ID

Options:
  -l, --last  View last contest
  -a, --all   Show all contests
  -h, --help  display help for command
```

### task

```
Usage: solve3 task [options] [query]

Show tasks

Arguments:
  query              Query to search tasks. If not provided shows all tasks

Options:
  -p, --page <page>  Show tasks on the specified page
  -h, --help         display help for command
```

### send

```
Usage: solve3 send [options] <contestId> [id] [filePath]

Send problem solution

Arguments:
  contestId   Contest ID
  id          Problem ID
  filePath    File path

Options:
  -h, --help  display help for command
```

### description

```
Usage: solve3 description|desc [options] <id>

Show problem description

Arguments:
  id          Problem ID

Options:
  -h, --help  display help for command
```

### ranking

```
Usage: solve3 ranking|rank [options] [id]

Show ranking for a contest

Arguments:
  id                Contest ID. If shows ranking in the last contest.

Options:
  -t, --after-time  Show after time
  -h, --help        display help for command
```

### favorite

```
Usage: solve3 favorite|fav [options]

Add, delete or show favorite contests

Options:
  -a, --add <contestId>     Add contest to favorites
  -d, --delete <contestId>  Delete contest from favorite contests
  -h, --help                display help for command
```

### submit

```
Usage: solve3 submit|sub [options] [id]

Show recent contest submits

Arguments:
  id            Contest ID. If not provided uses last contest ID

Options:
  -L, --latest  Show details of the latest submit in the contest
  -h, --help    display help for command
```

### status

```
Usage: solve3 status [options] [query]

Show recent submits

Arguments:
  query              Status query

Options:
  -p, --page <page>  Show submits on specified page
  -m, --my           Show only my submits
  -h, --help         display help for command
```

### Reference

`[]` - optional argument

`<>` - required argument

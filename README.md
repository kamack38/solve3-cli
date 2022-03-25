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

## Installation without node

Download prebuilt binaries for your OS from [GitHub Releases](https://github.com/kamack38/solve3-cli/releases)

> Note that showing problem description requires [OpenJDK](https://openjdk.java.net/) (Recommended) / [Java](https://www.java.com/) regardless of which installation option you chose.

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
  send|submit <contestId> [id] [filePath]     Send problem solution
  description|desc <id>                       Show problem description
  question|que [id]                           Show problem questions
  ranking|rank [options] [id]                 Show ranking for a contest
  favourite|fav [options]                     Add, delete or show favourite contests
  submission|sub [options] [id]               Show recent contest submissions
  status [options] [query]                    Show recent task submissions
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
Usage: solve3 send|submit [options] <contestId> [id] [filePath]

Send problem solution

Arguments:
  contestId   Contest ID. If equal to `last` or `l` selects last contest
  id          Problem ID or Problem short name
  filePath    File path

Options:
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
Usage: solve3 send|submit [options] <contestId> [id] [filePath]

Send problem solution

Arguments:
  contestId   Contest ID
  id          Problem ID
  filePath    File path

Options:
  -h, --help  display help for command
```

### description

> Note that this command **requires java to be installed**

```
Usage: solve3 description|desc [options] <id>

Show problem description

Arguments:
  id          Problem ID

Options:
  -h, --help  display help for command
```

### question

```
Usage: solve3 question|que [options] [id]

Show problem questions

Arguments:
  id          Contest ID. If none shows questions in the last contest.

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

### favourite

```
Usage: solve3 favourite|fav [options]

Add, delete or show favourite contests

Options:
  -a, --add <contestId>     Add contest to favourite
  -d, --delete <contestId>  Delete contest from favourite contests
  -h, --help                display help for command
```

### submission

```
Usage: solve3 submission|sub [options] [id]

Show recent contest submissions

Arguments:
  id            Contest ID. If not provided uses last contest ID

Options:
  -L, --latest  Show details of the latest submissions in the contest
  -h, --help    display help for command
```

### status

```
Usage: solve3 status [options] [query]

Show recent task submissions

Arguments:
  query              Status query

Options:
  -p, --page <page>  Show submissions on specified page
  -m, --my           Show only my submissions
  -h, --help         display help for command
```

### Reference

`[]` - optional argument

`<>` - required argument

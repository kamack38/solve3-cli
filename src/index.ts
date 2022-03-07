#!/usr/bin/env node

import Configstore from 'configstore'
import { Command } from 'commander'
import chalk from 'chalk'
import figures from 'figures'
import getSessionId from './utils/getSessionId.js'
import getLastContest from './utils/getLastContest.js'
import showProblems from './commands/send.js'
import authenticate from './commands/auth.js'
import selectContest from './commands/contest.js'
import showRanking from './commands/ranking.js'
import showSubmits, { showLatestSubmit } from './commands/submit.js'
import selectTask from './commands/tasks.js'
import changeConfig from './commands/config.js'
import { showFavoriteContests, addFavoriteContest, deleteFavoriteContest } from './commands/favorite.js'
import showProblemDescription from './commands/description.js'
import showStatus from './commands/status.js'

const config = new Configstore('solve3-cli', { username: '', password: '', authCookie: '', lastContest: '0', lastTask: '', favorites: {} })

const program = new Command()

program.name('solve3').description('Awesome Solve3 Cli built using custom API').version('0.5.1').showSuggestionAfterError()

program
    .command('login')
    .alias('auth')
    .description('Login in to Solve')
    .argument('[username]', 'Solve3 username')
    .argument('[password]', 'Solve3 password')
    .option('-c, --config', 'Login using credentials in config file')
    .action(async (username: string, password: string, { config: conf }: { config: boolean }) => {
        if (conf) {
            username = config.get('username')
            password = config.get('password')
        }
        config.set('authCookie', await authenticate(username, password))
    })

program
    .command('logout')
    .description('Logout from Solve')
    .option('-r, --remove', 'Remove login data saved in config')
    .action(({ remove }: { remove: boolean }) => {
        if (remove) {
            config.set('username', '')
            config.set('password', '')
        }
        config.set('authCookie', '')
    })

program
    .command('config')
    .alias('conf')
    .description('Change config option. If value is null prints current value')
    .argument('[option]', 'Config option name')
    .argument('[value]', 'Config option value')
    .action((option: string, value: string) => {
        changeConfig(option, value)
    })

program
    .command('contest')
    .alias('cont')
    .description('View contest')
    .argument('[id]', 'Contest ID')
    .option('-l, --last', 'View last contest')
    .action((contestId: string, { last }: { last: boolean }) => {
        const SessionId = getSessionId()
        if (last) {
            const lastContest = getLastContest()
            SessionId ? (lastContest ? selectContest(SessionId, lastContest) : null) : null
        } else {
            SessionId ? selectContest(SessionId, contestId) : null
        }
    })

program
    .command('send')
    .description('Send problem solution')
    .argument('<contestId>', 'Contest ID')
    .argument('[id]', 'Problem ID')
    .argument('[filePath]', 'File path')
    .action((contestId: string, id: string, filePath: string) => {
        const SessionId = getSessionId()
        SessionId ? showProblems(SessionId, contestId, id, filePath) : null
    })

program
    .command('description')
    .alias('desc')
    .description('Show problem description')
    .argument('<id>', 'Problem ID')
    .action((id: string) => {
        showProblemDescription(id)
    })

program
    .command('ranking')
    .alias('rank')
    .description('Show ranking for a contest')
    .argument('<id>', 'Contest ID')
    .action((id: string) => {
        const SessionId = getSessionId()
        SessionId ? showRanking(SessionId, id) : null
    })

program
    .command('favorite')
    .alias('fav')
    .description('Add, delete or show favorite contests')
    .option('-a, --add <contestId>', 'Add contest to favorites')
    .option('-d, --delete <contestId>', 'Delete contest from favorite contests')
    .action((options: { add: string; delete: string }) => {
        const SessionId = getSessionId()
        if (options.add) {
            addFavoriteContest(SessionId, options.add)
        } else if (options.delete) {
            deleteFavoriteContest(options.delete)
        } else {
            showFavoriteContests()
        }
    })

program
    .command('submit')
    .alias('sub')
    .description('Show recent contest submits')
    .argument('[id]', 'Contest ID. If not provided uses last contest ID')
    .option('-L, --latest', 'Show details of the latest submit in the contest')
    .action((id: string, { latest }: { latest: boolean }) => {
        const SessionId = getSessionId()
        if (SessionId) {
            if (id) {
                if (latest) {
                    showLatestSubmit(SessionId, id)
                } else {
                    showSubmits(SessionId, id)
                }
            } else {
                const lastContest = config.get('lastContest')
                if (latest) {
                    showLatestSubmit(SessionId, lastContest)
                } else {
                    showSubmits(SessionId, lastContest)
                }
            }
        }
    })

program
    .command('status')
    .description('Show recent submits')
    .argument('[query]', 'Status query')
    .option('-p, --page <page>', 'Show submits on specified page')
    .option('-m, --my', 'Show only my submits')
    .action((query: string, { page, my }: { page: number; my: boolean }) => {
        const SessionId = getSessionId()
        if (SessionId) {
            showStatus(SessionId, query, page, my)
        }
    })

program
    .command('task')
    .description('Show tasks')
    .argument('[query]', 'Query to search tasks. If not provided shows all tasks')
    .option('-p, --page <page>', 'Show tasks on the specified page')
    .action((query: string, { page }: { page: number }) => {
        const SessionId = getSessionId()
        if (SessionId) {
            if (query) {
                selectTask(SessionId, page, query)
            } else {
                selectTask(SessionId, page)
            }
        }
    })

program.configureOutput({
    writeOut: (str) => process.stdout.write(str),
    writeErr: (str) => process.stdout.write(`${chalk.red(figures.cross)} ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(chalk.redBright(str)),
})

await program.parseAsync()

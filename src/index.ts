#!/usr/bin/env node

import Configstore from 'configstore'
import { Command } from 'commander'
import chalk from 'chalk'
import figures from 'figures'
import getSessionId from './utils/getSessionId.js'
import getLastContest from './utils/getLastContest.js'
import toInt from './utils/toInt.js'
import showProblems from './commands/send.js'
import authenticate from './commands/auth.js'
import selectContest from './commands/contest.js'
import showRanking from './commands/ranking.js'
import showSubmissions, { showLatestSubmission } from './commands/submission.js'
import selectTask from './commands/tasks.js'
import changeConfig from './commands/config.js'
import { showFavouriteContests, addFavouriteContest, deleteFavouriteContest } from './commands/favourite.js'
import showProblemDescription from './commands/description.js'
import showStatus from './commands/status.js'
import logout from './commands/logout.js'

const config = new Configstore('solve3-cli', { username: '', password: '', authCookie: '', lastContest: '0', lastTask: '', favourites: {} })

const program = new Command()

program.name('solve3').description('Awesome Solve3 Cli built using custom API').version('1.4.8', '-v, --version').showSuggestionAfterError()

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
    .action(async ({ remove }: { remove: boolean }) => {
        if (remove) {
            config.set('username', '')
            config.set('password', '')
        }
        const SessionId = getSessionId()
        SessionId && (await logout(SessionId)) && config.set('authCookie', '')
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
    .description('View contest you have access to')
    .argument('[id]', 'Contest ID')
    .option('-l, --last', 'View last contest')
    .option('-a, --all', 'Show all contests')
    .option('-p, --page <number>', 'Show contests on page')
    .action((contestId: string, { last, all, page = '1' }: { last: boolean; all: boolean; page: string }) => {
        const SessionId = getSessionId()
        last && (contestId = getLastContest())
        SessionId && selectContest(SessionId, contestId, !all, toInt(page))
    })

program
    .command('send')
    .alias('submit')
    .description('Send problem solution')
    .argument('<contestId>', 'Contest ID. If equal to `last` or `l` selects last contest')
    .argument('[id]', 'Problem ID or Problem short name')
    .argument('[filePath]', 'File path')
    .action((contestId: string, id: string, filePath: string) => {
        const SessionId = getSessionId()
        if (contestId === 'last' || contestId === 'l') {
            contestId = getLastContest()
        }
        SessionId && showProblems(SessionId, contestId, id, filePath)
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
    .argument('[id]', 'Contest ID. If shows ranking in the last contest.')
    .option('-t, --after-time', 'Show after time')
    .action((id: string, { afterTime }: { afterTime: boolean }) => {
        const SessionId = getSessionId()
        !id && (id = getLastContest())
        SessionId && showRanking(SessionId, id, afterTime)
    })

program
    .command('favourite')
    .alias('fav')
    .description('Add, delete or show favourite contests')
    .option('-a, --add <contestId>', 'Add contest to favourite')
    .option('-d, --delete <contestId>', 'Delete contest from favourite contests')
    .action((options: { add: string; delete: string }) => {
        const SessionId = getSessionId()
        if (options.add) {
            addFavouriteContest(SessionId, options.add)
        } else if (options.delete) {
            deleteFavouriteContest(options.delete)
        } else {
            showFavouriteContests()
        }
    })

program
    .command('submission')
    .alias('sub')
    .description('Show recent contest submissions')
    .argument('[id]', 'Contest ID. If not provided uses last contest ID')
    .option('-L, --latest', 'Show details of the latest submissions in the contest')
    .action((id: string, { latest }: { latest: boolean }) => {
        const SessionId = getSessionId()
        if (SessionId) {
            !id && (id = config.get('lastContest'))
            if (latest) {
                showLatestSubmission(SessionId, id)
            } else {
                showSubmissions(SessionId, id)
            }
        }
    })

program
    .command('status')
    .description('Show recent task submissions')
    .argument('[query]', 'Status query')
    .option('-p, --page <page>', 'Show submissions on specified page')
    .option('-m, --my', 'Show only my submissions')
    .action((query: string, { page = '1', my }: { page: string; my: boolean }) => {
        const SessionId = getSessionId()
        SessionId && showStatus(SessionId, query, toInt(page), my)
    })

program
    .command('task')
    .description('Show tasks')
    .argument('[query]', 'Query to search tasks. If not provided shows all tasks')
    .option('-p, --page <page>', 'Show tasks on the specified page')
    .action((query: string = '', { page = '1' }: { page: string }) => {
        const SessionId = getSessionId()
        SessionId && selectTask(SessionId, toInt(page), query)
    })

program.configureOutput({
    writeOut: (str) => process.stdout.write(str),
    writeErr: (str) => process.stdout.write(`${chalk.red(figures.cross)} ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(chalk.redBright(str)),
})

await program.parseAsync()

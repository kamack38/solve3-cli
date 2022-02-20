#!/usr/bin/env node

import Configstore from 'configstore'
import { Command } from 'commander'
import getSessionId from './utils/getSessionId.js'
import getLastContest from './utils/getLastContest.js'
import showProblems from './commands/send.js'
import authenticate from './commands/auth.js'
import selectContest from './commands/contest.js'
import showRanking from './commands/ranking.js'
import showSubmits, { showLatestSubmit } from './commands/submit.js'
import changeConfig from './commands/config.js'
import { showFavoriteContests, addFavoriteContest, deleteFavoriteContest } from './commands/favorite.js'
import showProblemDescription from './commands/description.js'

const config = new Configstore('solve3-cli', { username: '', password: '', authCookie: '', lastContest: '', favorites: {} })

const program = new Command()

program.name('solve3').description('Awesome Solve3 Cli built using custom API').version('0.2.9')

program
    .command('login')
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
    .argument('<parentId>', 'Parent ID')
    .argument('[id]', 'Problem ID')
    .argument('[filePath]', 'File path')
    .action((parentId: string, id: string, filePath: string) => {
        const SessionId = getSessionId()
        SessionId ? showProblems(SessionId, parentId, filePath, id) : null
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
    .action(async (options: { add: string; delete: string }) => {
        const SessionId = getSessionId()
        if (options.add) {
            await addFavoriteContest(SessionId, options.add)
        } else if (options.delete) {
            await deleteFavoriteContest(options.delete)
        } else {
            await showFavoriteContests(SessionId)
        }
    })

program
    .command('submit')
    .alias('sub')
    .description('Show recent submits')
    .argument('<id>', 'Contest ID')
    .option('-l, --last', 'Show latest submit in contest')
    .action((id: string, { last }: { last: boolean }) => {
        const SessionId = getSessionId()
        if (last) {
            showLatestSubmit(SessionId, id)
        } else {
            SessionId ? showSubmits(SessionId, id) : null
        }
    })

program.parse()

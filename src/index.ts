#!/usr/bin/env node

import Configstore from 'configstore'
import { Command } from 'commander'
import chalk from 'chalk'
import figures from 'figures'
import showProblems from './send.js'
import authenticate from './auth.js'
import selectContest from './contest.js'

const config = new Configstore('solve3-cli')

const program = new Command()

const getSessionId = () => {
    const authCookie = config.get('authCookie')
    if (!authCookie) {
        console.log(chalk.red(figures.cross), chalk.redBright(`Authentication cookie was not found!`))
        console.log(chalk.blue(figures.info), chalk.cyan(`Use login command to authenticate`))
        return undefined
    } else {
        return authCookie
    }
}

program.name('solve3').description('Awesome Solve3 Cli built using custom API').version('0.1.6')

program
    .command('login')
    .description('Login in to Solve')
    .argument('[username]', 'Solve3 username')
    .argument('[password]', 'Solve3 password')
    .option('-c, --config', 'Login using credentials in config file')
    .action(async (username: string, password: string, { config: conf }: { config: boolean }) => {
        if (conf) {
            const username = config.get('username')
            const password = config.get('password')
            config.set('authCookie', await authenticate(username, password))
        } else {
            config.set('authCookie', await authenticate(username, password))
        }
    })

program
    .command('config')
    .description('Change config option. If value is null prints current value')
    .argument('[option]', 'Config option name')
    .argument('[value]', 'Config option value')
    .action((option: string, value: string) => {
        if (option) {
            if (config.has(option)) {
                if (value) {
                    config.set(option, value)
                    console.log(chalk.green(figures.tick), chalk.cyan(option), ':', chalk.green(value))
                } else {
                    const val = config.get(option)
                    console.log(chalk.blue(figures.info), chalk.cyan(option), ':', chalk.green(val))
                }
            } else {
                const availableOptions = Object.keys(config.all).toString().replace(/,/g, ', ')
                console.log(chalk.red(figures.cross), chalk.redBright(`No option with specified key ${option}`))
                console.log(chalk.blue(figures.info), chalk.cyan(`Available options: ${availableOptions}`))
            }
        } else {
            console.log(chalk.blue(figures.info), chalk.cyan(config.path))
        }
    })

program
    .command('contest')
    .description('View contest')
    .argument('[id]', 'Contest ID')
    .action((contestId: string) => {
        const SessionId = getSessionId()
        SessionId ? selectContest(SessionId, contestId) : null
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

program.parse()

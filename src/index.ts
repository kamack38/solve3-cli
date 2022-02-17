#!/usr/bin/env node

import Configstore from 'configstore'
import fs from 'fs'
import { Command } from 'commander'
import chalk from 'chalk'
import figures from 'figures'
import showProblems from './send.js'
import authenticate from './auth.js'
import selectContest from './contest.js'

const config = new Configstore('solve3-cli')

const program = new Command()

program.name('solve3-cli').description('Awesome Solve3 Cli built using custom API').version('0.1.3')

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
        const SessionId = config.get('authCookie')
        selectContest(SessionId, contestId)
    })

program
    .command('send')
    .description('Send problem solution')
    .argument('<parentId>', 'Parent ID')
    .argument('[id]', 'Problem ID')
    .argument('[filePath]', 'File path')
    .action((parentId: string, id: string, filePath: string) => {
        const SessionId = config.get('authCookie')
        showProblems(SessionId, parentId, filePath, id)
    })

program.parse()

import Configstore from 'configstore'
import inquirer from 'inquirer'
import { PathLike } from 'node:fs'
import showProblemDescription from './description.js'
import { selectFile } from './send.js'
import showStatus from './status.js'
import { send } from './send.js'
import getSolveData from '../utils/getSolveData.js'
import { printInfo, printTip } from '../utils/messages.js'
import { tasks, taskDescription, taskSubmit } from '../lib/routes.js'
import { descriptionOption, sendSolutionOption, submissionsOption, quitOption, nextPageOption, previousPageOption } from '../lib/options.js'
import { createTaskSubmitData } from '../utils/postSolveData.js'
import handlePagination from '../utils/handlePagination.js'
import tasksType from '../types/tasksType.js'

const config = new Configstore('solve3-cli')

const selectTask = async (SessionId: string, page = 1, query = '') => {
    const { records, total_pages }: tasksType = await getSolveData(SessionId, tasks, '', { page, query })
    const choices = records.map(({ id, name, short_name, level }) => {
        return { name, value: { name, id, short_name, level } }
    })
    choices.push(...handlePagination(page, total_pages - 1))
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
                loop: true,
                pageSize: 14,
            },
        ])
        .then(({ option }: { option: string | { name: string; id: string; short_name: string; level: string } }) => {
            switch (option) {
                case nextPageOption:
                    selectTask(SessionId, page + 1)
                    break
                case previousPageOption:
                    selectTask(SessionId, page - 1)
                    break
                case quitOption:
                    break
                default: {
                    if (typeof option !== 'string') {
                        const { id, name, short_name, level } = option
                        showTaskInfo(SessionId, id, name, short_name, level)
                    }
                }
            }
        })
}

const sendTaskSolution = async (SessionId: string, taskId: string, filePath: PathLike) => {
    const taskSendData = await createTaskSubmitData(SessionId, taskId, filePath)
    const resUrl = 'https://solve.edu.pl/status'
    send(SessionId, taskSubmit + taskId, taskSendData, resUrl)
}

export const showTaskInfo = async (SessionId: string, taskId: string, taskName: string, taskShortName: string, taskLevel: string) => {
    config.set('lastTask', taskId)
    printTip('Contest Info')
    printInfo('Name', taskName)
    printInfo('Short name', taskShortName)
    printInfo('Level', taskLevel)
    printInfo('ID', taskId)
    const choices = [descriptionOption, sendSolutionOption, submissionsOption, quitOption]
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
                loop: true,
            },
        ])
        .then(async ({ option }: { option: string }) => {
            switch (option) {
                case descriptionOption:
                    showProblemDescription(taskId, taskDescription)
                    break
                case sendSolutionOption: {
                    const filePath = await selectFile()
                    if (filePath) {
                        sendTaskSolution(SessionId, taskId, filePath)
                    }
                    break
                }
                case submissionsOption:
                    showStatus(SessionId, taskName, 1)
            }
        })
}

export default selectTask

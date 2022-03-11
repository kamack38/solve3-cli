import Configstore from 'configstore'
import inquirer from 'inquirer'
import showProblemDescription from './description.js'
import { selectFile } from './send.js'
import getSolveData from '../utils/getSolveData.js'
import { printError, printInfo, printSuccess, printTip } from '../utils/messages.js'
import { tasks, taskDescription, taskSubmit } from '../lib/routes.js'
import { descriptionOption, sendSolutionOption, submissionsOption, quitOption, nextPageOption, previousPageOption } from '../lib/options.js'
import postSolveData, { createTaskSubmitData } from '../utils/postSolveData.js'
import showStatus from './status.js'

const config = new Configstore('solve3-cli')

const selectTask = async (SessionId: string, page: number = 1, query: string = '') => {
    const { records, total_pages } = await getSolveData(SessionId, tasks, '', { page, query })
    const choices = [...records]
    const additionalOptions = [quitOption]
    let defaultOption = 1

    if (total_pages - page > 1) {
        additionalOptions.push(nextPageOption)
        defaultOption++
    }
    if (page > 1) {
        additionalOptions.push(previousPageOption)
        defaultOption++
    }
    choices.unshift(new inquirer.Separator(), ...additionalOptions, new inquirer.Separator())
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
                loop: false,
                pageSize: 14,
                default: defaultOption,
            },
        ])
        .then(({ option }) => {
            switch (option) {
                case nextPageOption:
                    selectTask(SessionId, page + 1)
                    break
                case previousPageOption:
                    selectTask(SessionId, page - 1)
                    break
                case quitOption:
                    break
                default:
                    const { id, name, short_name, level } = records.find(({ name }) => name === option)
                    showTaskInfo(SessionId, id, name, short_name, level)
            }
        })
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
        .then(async ({ option }) => {
            switch (option) {
                case descriptionOption:
                    showProblemDescription(taskId, taskDescription)
                    break
                case sendSolutionOption:
                    const filePath = await selectFile()
                    if (filePath) {
                        postSolveData(SessionId, taskSubmit + taskId, await createTaskSubmitData(SessionId, taskId, filePath))
                            .then((res) => {
                                const responseUrl = res.request.res.responseUrl
                                if (responseUrl === 'https://solve.edu.pl/status') {
                                    printSuccess('File has been successfully sent!')
                                } else {
                                    printError('Error while sending the file')
                                }
                            })
                            .catch((error) => {
                                printError(error)
                            })
                    }
                    break
                case submissionsOption:
                    showStatus(SessionId, taskName, 1)
            }
        })
}

export default selectTask

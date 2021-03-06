import chalk from 'chalk'
import inquirer from 'inquirer'
import { pageData, questionSubmit, questionToken } from '../lib/routes.js'
import contestType from '../types/contestType.js'
import getSolveData from '../utils/getSolveData.js'
import { printValue, printTip, printError, printSuccess } from '../utils/messages.js'

const showQuestions = async (SessionId: string, contestId: string) => {
    const { questions }: contestType = await getSolveData(SessionId, pageData, contestId + '/' + 1)
    if (!questions.length) {
        printError('No questions have been found!')
        return
    }
    questions.forEach(({ title, id, first_name, last_name, content, display_time }) => {
        printValue('Title', title)
        printValue('ID', id)
        printValue('Author', `${first_name} ${last_name}`)
        printTip(display_time)
        content = content.replace(/<br \/>/g, '')
        const matches = content.match(/&quot;.*&quot;/g)
        if (matches) {
            matches.forEach((el) => {
                content = content.replace(el, chalk.italic(el.replace(/&quot;/g, "'")))
            })
        }
        console.log(content)
    })
}

export const askQuestion = async (SessionId: string, contestId: string, title?: string, content?: string) => {
    const { token }: { token: string } = await getSolveData(SessionId, questionToken)
    if (!title) {
        await inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Title',
                    name: 'header',
                },
            ])
            .then(({ header }: { header: string }) => (title = header))
    }
    if (!content) {
        await inquirer
            .prompt([
                {
                    type: 'editor',
                    message: 'Content',
                    name: 'question',
                },
            ])
            .then(({ question }: { question: string }) => (content = question))
    }
    if (title && content) {
        try {
            await getSolveData(SessionId, `CSRF_TOKEN=${token}/${questionSubmit}`, contestId, { title, content })
            printSuccess('Question has been successfully sent!')
        } catch (error) {
            printError(error)
        }
    }
}

export default showQuestions

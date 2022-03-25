import chalk from 'chalk'
import { pageData } from '../lib/routes.js'
import contestData from '../types/contestData.js'
import getSolveData from '../utils/getSolveData.js'
import { printValue, printTip } from '../utils/messages.js'

const showQuestions = async (SessionId: string, contestId: string) => {
    const { questions }: contestData = await getSolveData(SessionId, pageData, contestId + '/' + 1)
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

export default showQuestions

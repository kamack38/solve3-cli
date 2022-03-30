import pdf2html from 'pdf2html'
import figures from 'figures'
import chalk from 'chalk'
import { contestDescription } from '../lib/routes.js'
import { printError } from '../utils/messages.js'

const showProblemDescription = async (problemId: string, route: string = contestDescription) => {
    return await pdf2html.text(`https://solve.edu.pl/${route}${problemId}`, (err: Error, pdfText: string) => {
        if (err) {
            printError('Conversion error: ' + err.message)
        } else {
            console.log(
                pdfText
                    .replace(/¬/g, figures.lessOrEqual)
                    .replace(/Zadanie/, chalk.cyan('Zadanie'))
                    .replace(/Limit pamięci/gi, chalk.cyan('Limit pamięci'))
                    .replace(/Limit czasu/gi, chalk.cyan('Limit czasu'))
                    .replace(/Wejście\n/gi, chalk.cyanBright('Wejście\n'))
                    .replace(/Wyjście\n/gi, chalk.cyanBright('Wyjście\n'))
                    .replace(/OGRANICZENIA\n/gi, chalk.cyan('Ograniczenia\n'))
                    .replace(/PRZYKŁAD\n/i, chalk.cyan('Przykłady\n'))
                    .replace(/ą/gi, 'ą')
                    .replace(/ę/gi, 'ę')
                    .replace(/ć/gi, 'ć')
                    .replace(/ń/g, 'ń')
                    .replace(/ś/gi, 'ś')
                    .replace(/ż/g, 'ż')
                    .replace(/ź/g, 'ź'),
            )
        }
    })
}

export default showProblemDescription

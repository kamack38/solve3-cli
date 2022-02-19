import pdf2html from 'pdf2html'
import figures from 'figures'
import chalk from 'chalk'

const showProblemDescription = async (problemId: string) => {
    pdf2html.text(`https://solve.edu.pl/contests/download_desc/${problemId}`, (err, pdfText) => {
        if (err) {
            console.error(chalk.red(figures.cross), chalk.redBright('Conversion error: ' + err))
        } else {
            console.log(
                pdfText
                    .replace(/¬/g, figures.lessOrEqual)
                    .replace(/Zadanie/, chalk.cyan('Zadanie'))
                    .replace(/Limit pamięci/gi, chalk.cyan('Limit pamięci'))
                    .replace(/Limit czasu/gi, chalk.cyan('Limit czasu'))
                    .replace(/Wejście/gi, chalk.cyanBright('Wejście'))
                    .replace(/Wyjście/gi, chalk.cyanBright('Wyjście'))
                    .replace(/OGRANICZENIA/gi, chalk.cyan('Ograniczenia'))
                    .replace(/PRZYKŁAD/i, chalk.cyan('Przykłady'))
                    .replace(/ę/gi, 'ę')
                    .replace(/ą/gi, 'ą')
                    .replace(/ć/gi, 'ć')
                    .replace(/ś/gi, 'ś')
                    .replace(/ż/gi, 'ż'),
            )
        }
    })
}

export default showProblemDescription

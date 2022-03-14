import chalk from 'chalk'
import { table } from 'table'
import { printError } from '../utils/messages.js'

export const handleSubmitStatus = (status: string) => {
    switch (status) {
        case '<span class="badge badge-success">OK</span>':
            return chalk.bgGreen.whiteBright(' OK ')
        case '<span class="badge badge-important">Błędna odpowiedź</span>':
            return chalk.bgRed.whiteBright(' WA ')
        case '<span class="badge badge-warning">Limit czasu przekroczony</span>':
            return chalk.bgHex('#ff7518').whiteBright(' TLE ')
        case '<span class="badge badge-inverse">Naruszenie bezpieczeństwa</span>':
            return chalk.bgBlack.whiteBright(' RV ')
        case '<span class="badge badge-inverse">Błąd kompilacji</span>':
            return chalk.bgBlackBright.whiteBright(' CE ')
        case '<span class="badge badge-info">Błąd wykonania</span>':
            return chalk.bgHex('#9954bb').whiteBright(' RE ')
        case '<span class="badge">?</span>':
            return chalk.bgYellow.blackBright(' ? ')
        case '':
            return ''
    }
    printError('Error no contest badge found with status: ' + status)
}

const printTable = (title: string, descriptionColumns: string[], data: object[], dataTemplate: string[], titleSuffix?: string) => {
    if (descriptionColumns.length != dataTemplate.length) {
        printError('Length of description columns and data template must match!')
        return null
    }
    const size = titleSuffix ? descriptionColumns.length - 2 : descriptionColumns.length - 1
    const tableTitle = [title]
    tableTitle.push(...new Array(size).fill(''))
    titleSuffix ? tableTitle.push(titleSuffix) : null

    const tableData = data.map((data) => {
        const row = []
        dataTemplate.forEach((el) => {
            switch (el) {
                case 'status':
                    row.push(handleSubmitStatus(data[el]))
                    break
                case 'time':
                    row.push(data[el].replace(/<.*?>/g, '').trim())
                    break
                case 'mem':
                    row.push(data['mem'] ? `${data['mem'].replace(/\s/g, '')}/${data['mem_limit']}MB` : '')
                    break
                case 'comment':
                    row.push(data['comment'].replace(/ +/g, ' ').replace('Å‚', 'ł').trim())
                    break
                default:
                    row.push(data[el])
            }
        })
        return row
    })
    tableData.unshift(tableTitle, descriptionColumns)
    const tableConfig = {
        spanningCells: [{ col: 0, row: 0, colSpan: size + 1 }],
    }
    console.log(table(tableData, tableConfig))
}

export default printTable

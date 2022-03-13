import inquirer from 'inquirer'
import { nextPageOption, previousPageOption, quitOption } from '../lib/options.js'

const handlePagination = (currentPage: number, totalPages: number) => {
    const arr = []
    arr.push(new inquirer.Separator())
    if (currentPage < totalPages) arr.push(nextPageOption)
    if (currentPage > 1) arr.push(previousPageOption)
    arr.push(quitOption, new inquirer.Separator())
    return arr
}

export default handlePagination

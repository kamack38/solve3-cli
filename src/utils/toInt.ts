import { printError } from './messages.js'

const toInt = (str: string) => {
    const num = Number(str)
    if (isNaN(num)) {
        printError('Provided value is not a number!')
        return 1
    }
    return num
}

export default toInt

import chalk from 'chalk'
import figures from 'figures'
import axios from 'axios'

const getSubmitDetails = async (PHPSessionId: string, submitId: string) => {
    return axios
        .get(`https://solve.edu.pl/contests/get_report/${submitId}`, {
            headers: {
                Cookie: `PHPSESSID=${PHPSessionId};`,
            },
        })
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            console.log(chalk.redBright(figures.cross), error)
        })
}

export default getSubmitDetails

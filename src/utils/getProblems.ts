import chalk from 'chalk'
import figures from 'figures'
import axios from 'axios'

const getProblems = async (PHPSessionId: string, contestId: string) => {
    return axios
        .get(`https://solve.edu.pl/contests/get_page/${contestId}/1/`, {
            headers: {
                Cookie: `PHPSESSID=${PHPSessionId};`,
            },
        })
        .then((res) => {
            return res.data.problems
        })
        .catch((error) => {
            console.log(chalk.redBright(figures.cross), error)
        })
}

export default getProblems

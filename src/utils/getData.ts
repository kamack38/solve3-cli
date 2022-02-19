import chalk from 'chalk'
import figures from 'figures'
import axios from 'axios'

const getData = async (PHPSessionId: string, contestId: string, page: number = 1) => {
    return axios
        .get(`https://solve.edu.pl/contests/get_page/${contestId}/${page}/`, {
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

export default getData

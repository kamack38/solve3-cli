import chalk from 'chalk';
import figures from 'figures';
import axios from 'axios';
const getContests = async (PHPSessionId, id) => {
    return axios
        .get(`https://solve.edu.pl/contests/get_page/${id}/1/`, {
        headers: {
            Cookie: `PHPSESSID=${PHPSessionId};`,
        },
    })
        .then((res) => {
        console.log(res.data.problems);
        return res.data.problems;
    })
        .catch((error) => {
        console.log(chalk.redBright(figures.cross), error);
    });
};
export default getContests;
//# sourceMappingURL=getProblem.js.map
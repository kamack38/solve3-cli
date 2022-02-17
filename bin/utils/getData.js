import chalk from 'chalk';
import figures from 'figures';
import axios from 'axios';
const getData = (route, PHPSessionId) => {
    return axios
        .get(`https://solve.edu.pl/${route}`, PHPSessionId
        ? {
            headers: {
                Cookie: `PHPSESSID=${PHPSessionId};`,
            },
        }
        : {})
        .then((res) => {
        return res.data.records;
    })
        .catch((error) => {
        console.log(chalk.redBright(figures.cross), error);
    });
};
export default getData;
//# sourceMappingURL=getData.js.map
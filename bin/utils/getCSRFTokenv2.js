import chalk from 'chalk';
import figures from 'figures';
import axios from 'axios';
const getCSRFTokenv2 = async (route, PHPSessionId) => {
    return await axios
        .get(`https://solve.edu.pl/${route}`, PHPSessionId
        ? {
            headers: {
                Cookie: `PHPSESSID=${PHPSessionId};`,
            },
        }
        : {})
        .then((res) => {
        console.log(res.data);
        // const dom = new JSDOM(res.data)
        // const token = dom.window.document.querySelector("input[name='csrf_token']")?.getAttribute('value')
        // if (!token) {
        //     console.error(chalk.red(figures.cross), chalk.redBright.bold('CSRF token could not be retrieved!'))
        // }
        // return token
    })
        .catch((error) => {
        console.log(chalk.redBright(figures.cross), error);
    });
};
export default getCSRFTokenv2;
//# sourceMappingURL=getCSRFTokenv2.js.map
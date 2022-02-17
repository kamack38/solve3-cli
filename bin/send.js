import chalk from 'chalk';
import axios from 'axios';
import figures from 'figures';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import { createReadStream, lstatSync } from 'fs';
import { extname } from 'path';
import FormData from 'form-data';
import getCSRFToken from './utils/getCSRFToken.js';
import getProblems from './utils/getProblems.js';
const send = async (SessionId, problemShortName, filePath, contestId) => {
    const formData = new FormData();
    formData.append('csrf_action', 'contest_submit');
    formData.append('csrf_token', await getCSRFToken(`contests/view/${contestId}`, 'contest_submit', SessionId));
    formData.append('contest_submit[problem]', problemShortName);
    formData.append('contest_submit[solution_file]', createReadStream(filePath, 'utf8'));
    return axios
        .post(`https://solve.edu.pl/contests/submit_solution/${contestId}`, formData, {
        headers: Object.assign(Object.assign({}, formData.getHeaders()), { Cookie: `PHPSESSID=${SessionId};` }),
    })
        .then((res) => {
        if (res.request.res.responseUrl === `https://solve.edu.pl/contests/view/${contestId}`) {
            console.log(chalk.green(figures.tick), chalk.greenBright('File has been successfully sent!'));
        }
        else {
            console.log(chalk.red(figures.cross), chalk.redBright('Error while sending the file'));
        }
    })
        .catch((error) => {
        console.log(chalk.red(figures.cross), error);
    });
};
const showProblems = async (SessionId, contestId, problemId, filePath) => {
    const problems = await getProblems(SessionId, contestId);
    if (problemId && filePath && contestId) {
        const problemShortName = problems.find(({ id }) => id === problemId).short_name;
        return await send(SessionId, problemShortName, filePath, contestId);
    }
    else {
        return await inquirer
            .prompt([
            {
                type: 'list',
                name: 'problem',
                message: 'Select problem',
                choices: problems,
            },
        ])
            .then(async ({ problem }) => await selectFile(SessionId, contestId, problems.find(({ name }) => name === problem).short_name));
    }
};
const isCppFile = (value) => {
    if (extname(value) === '.cpp' || extname(value) === '') {
        return true;
    }
};
const selectFile = async (SessionId, contestId, problemShortName) => {
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
    return await inquirer
        .prompt([
        {
            type: 'file-tree-selection',
            name: 'filePath',
            message: 'Select file',
            onlyShowValid: true,
            validate: isCppFile,
        },
    ])
        .then(async ({ filePath }) => {
        if (!lstatSync(filePath).isDirectory()) {
            await send(SessionId, problemShortName, filePath, contestId);
        }
        else {
            console.error(chalk.red(figures.cross), chalk.redBright("You can't select a directory"));
            console.log(chalk.blue(figures.info), chalk.cyan('Press <tab> to expand the directory and select a valid file'));
        }
    });
};
export default showProblems;
//# sourceMappingURL=send.js.map
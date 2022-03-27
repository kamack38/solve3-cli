import contestInfo from './contestInfo.js'
import rankingObject from './rankingObject.js'
import submitObject from './submitObject.js'
import ownResults from './ownResults.js'
import problemObject from './problemObject.js'
import questionObject from './questionObject.js'

type contestData = {
    contest: contestInfo
    questions: questionObject[]
    problems: problemObject[]
    submits: submitObject[]
    submits_count: string
    own_results: ownResults
    ranking: rankingObject[]
}

export default contestData

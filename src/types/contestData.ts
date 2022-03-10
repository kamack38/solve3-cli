import contestObject from './contestObject.js'
import rankingObject from './rankingObject.js'
import submitObject from './submitObject.js'
import ownResults from './ownResults.js'
import problemObject from './problemObject.js'

type contestData = {
    contest: contestObject
    problems: problemObject[]
    submits: submitObject[]
    submits_count: string
    own_results: ownResults
    ranking: rankingObject[]
}

export default contestData

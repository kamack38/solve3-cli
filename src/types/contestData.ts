import contestObject from './contestObject.js'
import rankingObject from './rankingObject.js'
import submitObject from './submitObject.js'

type contestData = {
    contest: contestObject
    ranking: rankingObject[]
    submits: submitObject[]
    submits_count: string
}

export default contestData

import rankDetailsRecord from './rankDetails.js'

type rankingObject = {
    name: string
    user_id: string
    rank_details: rankDetailsRecord
    result: number
    penalty: string
    virtual_result: number
    virtual_penalty: string
    virtual_last_submit: string
    after_result: number
    after_penalty: string
    after_last_submit: string
    _penalty: number
    _last_submit: number
    rank_result: number
    rank_last_submit: string
    rank_penalty: string
    _rank_last_submit: number
    _rank_penalty: number
}

export default rankingObject

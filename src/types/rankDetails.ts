export interface rankDetails {
    short_name: string
    multiplier: string
    submit_id: number
    status: string
    result: number
    count: number
    last_submit: number
    virtual_status: string
    virtual_result: number
    virtual_count: number
    virtual_last_submit: number
    after_status: string
    after_result: number
    after_count: number
    after_last_submit: number
    rank_status: string
    rank_result: number
    rank_count: number
    rank_last_submit: number
}

interface rankDetailsRecord {
    [key: number]: rankDetails
}

export default rankDetailsRecord

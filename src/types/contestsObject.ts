type contestsArray = {
    total_count: string
    total_pages: number
    records: contest[]
}

export type contest = {
    id: string
    short_name: string
    name: string
    type: string
    elo_affection: string
    start_time: string
    end_time: string
    permission: string
    _only_virtual: string
    _virtual_start_time: string
    _virtual_end_time: string
    _type: string
    _no_children: '0' | '1'
    _permission: boolean
}

export default contestsArray

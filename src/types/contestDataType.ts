type contestDataType = {
    id: string
    parent: string
    short_name: string
    name: string
    no_children: string
    display_time: string
    start_time: string
    end_time: string
    results_time: string
    ranking_time: string
    ranking_type: string
    also_virtual: string
    virtual_start_time: string
    virtual_end_time: string
    virtual_duration: string
    type: string
    user_password: string
    admin_password: string
    resubmit_penalty: string
    ranking_compare: string
    binary_score: string
    report_detail: string
    hide_ranking_problems: string
    all_submits: string
    _permission: null
    _elo_affection: string
    _elo_affection_made: boolean
    virtual_visible: {
        results: string
        ranking: string
    }
}

export default contestDataType

type contestInfo = {
    id: string
    parent: string
    short_name: string
    name: string
    no_children: string
    only_virtual: string
    elo_affection: string
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
    virtual_visible_results: string
    virtual_visible_ranking: string
    type: string
    user_password: string
    admin_password: string
    resubmit_penalty: string
    ranking_compare: string
    binary_score: string
    report_detail: string
    hide_ranking_problems: string
    all_submits: string
    _permission: boolean | string
}

export default contestInfo

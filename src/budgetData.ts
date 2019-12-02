export type RawBudgetEntry = {
    code: string
    parent: string | null
    title: string
    total_direction_expense: number
}

export type BudgetEntry = RawBudgetEntry & {
    code: string
    parentEntry: BudgetEntry | null
    children: BudgetEntry[]
}

export type Budget = {
    budget: {[code: string]: BudgetEntry}
    roots: BudgetEntry[]
    total: number
}
const getQuery = (offset: number) => 
    `https://next.obudget.org/api/query?query=${
        encodeURIComponent(`select code,parent,title,total_direction_expense from budget where year=${
            new Date().getFullYear()} and total_direction_expense is not null and total_direction_expense != 0 offset ${offset}`)}`

export function fixBudget(rawBudget: RawBudgetEntry[]): Budget {
    const budget = rawBudget.sort((a, b) => b.total_direction_expense - a.total_direction_expense).map(b => ({[b.code]: {...b}})).reduce((a, o) => Object.assign(a, o), {})  as any as {[code: string]: BudgetEntry}
    const budgetValues = Object.values(budget)
    for (const code in budget) {
        const e = budget[code]
        e.parentEntry = e.parent ? budget[e.parent] : null
        e.children = budgetValues.filter(({parent}) => parent === code)
    }

    const roots = budgetValues.filter(({parent}) => !parent)
    const t = roots.map(r => r.total_direction_expense).reduce((a, o) => a + o, 0)
    return {roots, budget, total: t}
}
export async function downloadBudget() : Promise<RawBudgetEntry[]> {
    let offset = 0
    let rawBudget : RawBudgetEntry[] = []
    let total = 0

    while (!rawBudget.length || rawBudget.length !== total) {
        const resp = await fetch(getQuery(offset))
        const raw = await resp.json()
        rawBudget = [...rawBudget, ...raw.rows]
        if (!raw.rows.length) {
            break;
        }
        offset += raw.rows.length
    }

    return rawBudget
}
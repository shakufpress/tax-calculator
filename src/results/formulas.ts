import { BudgetEntry } from '../budgetData'

export type TaxInput = {
    hasPartner: boolean
    sex: 'm' | 'f'
    numChildren: number
    income: number
    partnerIncome: number
    budget: BudgetEntry
}

export interface TreeNode {
    name: string;
    code: string;
    title: string;
    value: number;
    toggled: boolean;
    children: TreeNode[];
}

export default function caculateTax({hasPartner, sex, numChildren, partnerIncome, income, budget} : TaxInput) {
    const partnerIncomeForCalculation = hasPartner ? partnerIncome : 0
    const bonusPoints = 2.25 + (sex === 'f' ? 0.5 : 0) +
        ((sex === 'f' || !hasPartner) ? (numChildren || 0) : 0)

    const perBonusPoint = 2580
    const taxReduction = bonusPoints * perBonusPoint
    const annualIncome = (income || 0) * 12

    const taxStep = (income: number) => {
        const steps = [[0, 0], [74640, .1], [107040, .14], [171840, .2], [238800, .31], [496920, .35], [640000, .47], [Infinity, .5]]
        let total = 0
        for (let i = 0; i < steps.length; ++i) {
            const [value, rate] = steps[i]
            const [prev] = i ? steps[i - 1] : [0]
            if (income <= value) {
                return total + (income - prev) * rate
            } else if (i) {
                total += (value - prev) * rate
            }
        }

        return Math.max(0, total)
    }

    const taxWithoutReductions = taxStep(annualIncome)
    const annualPartnerIncome = partnerIncomeForCalculation * 12
    const incomeTax = Math.max(0, taxWithoutReductions - taxReduction)
    const partnerTax = Math.max(0, annualPartnerIncome ? taxStep(annualPartnerIncome) - 2.25 * perBonusPoint : 0)
    const netAnnualPartnerIncome = annualPartnerIncome ? annualPartnerIncome - partnerTax : 0
    const netIncome = annualIncome - incomeTax
    const householdIncome = netIncome + netAnnualPartnerIncome
    const netMonthlyHouseholdIncome = householdIncome / 12
    const decile = (() => {
        const deciles = [0, 4214, 6558, 8580, 11028, 13323, 16037, 19196, 23274, 29938, Infinity]
        for (let i = 0; i < deciles.length; ++i) {
            if (netMonthlyHouseholdIncome <= deciles[i]) {
                return i
            }
        }
    })()

    const vatPerDecile = [0, 1190, 1208, 1355, 1606, 1731, 1885, 2014, 2189, 2389, 2920];

    const monthlyVat = vatPerDecile[decile || 0];
    const householdAnnualVat = monthlyVat * 12;
    const myAnnualVat = householdAnnualVat / (hasPartner ? 2 : 1);
    const incomeBelow60 = Math.min(5804, income || 0)
    const ssBelow60PercMonthly = incomeBelow60 * 0.035
    const ssAbove60PercMonthly = Math.max(0, ((income || 0) - incomeBelow60) * .12)
    const totalSSAnnual = (ssBelow60PercMonthly + ssAbove60PercMonthly) * 12

    const totalAnnualTax = myAnnualVat + Math.max(0, incomeTax) + Math.max(0, totalSSAnnual);
    const totalBudget = budget ? budget.net_revised : 0;
    const personalBudgetFactor = totalAnnualTax / totalBudget;

    return {
        totalAnnualTax,
        annualIncome,
        netIncome,
        householdIncome,
        netMonthlyHouseholdIncome,
        decile,
        monthlyVat,
        myAnnualVat,
        taxWithoutReductions,
        householdAnnualVat,
        netAnnualPartnerIncome,
        partnerTax,
        incomeTax,
        annualPartnerIncome,
        bonusPoints,
        taxReduction,
        ssBelow60PercMonthly,
        ssAbove60PercMonthly,
        totalSSAnnual,
        personalBudgetFactor
    }
}
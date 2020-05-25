import React, { useMemo, useCallback } from 'react';
import { BudgetEntry } from '../budgetData'
import { TreeNode } from './formulas'

const shekel = (n: number) => `${Number(Math.floor(n)).toLocaleString()} ₪`;

export interface TaxData {
    annualIncome: number;
    netIncome:number;
    annualPartnerIncome: number;
    taxWithoutReductions: number;
    bonusPoints: number;
    taxReduction: number;
    incomeTax: number;
    partnerTax: number;
    netAnnualPartnerIncome: number;
    householdIncome: number;
    netMonthlyHouseholdIncome: number;
    decile: number | undefined;
    monthlyVat: number;
    householdAnnualVat: number;
    totalAnnualTax: number;
    myAnnualVat: number;
    personalBudgetFactor: number;
}


const Results = ({sex, tax, budget}: {sex: 'm' | 'f', tax: TaxData, budget: BudgetEntry}) => {
    const toTreeNode = useCallback((e: BudgetEntry) : TreeNode => ({
            name: `${e.title}: ${shekel(e.net_revised * tax.personalBudgetFactor)} בשנה`,
            code: e.code,
            title: e.title,
            value: Math.round(e.net_revised * tax.personalBudgetFactor),
            toggled: true,
            children: (e.children || []).map(toTreeNode)
        }), [tax.personalBudgetFactor])

    const treeBeardDataResult = useMemo(() => budget && toTreeNode(budget), [budget, toTreeNode])
    const male = (sex === 'm')

    return <div className="results">
        <div className="hero">
            <span>{male ? 'סכום המיסים שאתה משלם בשנה' : 'סכום המיסים שאת משלמת בשנה'}: {}
            &nbsp;</span>
            <span className="income">כ-{shekel(tax.totalAnnualTax)}</span>
        </div>
        {budget ? <div /> : <div className="loading-budget">טוען את התקציב...</div>}
    </div>

}

export default Results;
import React, { useMemo, useCallback } from 'react';
import calcTax, { TaxInput, TreeNode } from './formulas'
import { BudgetEntry } from '../budgetData';
import TaxBarChart from './TaxBarChartView';


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

export interface IncomeData {
    hasPartner: boolean;
    sex: 'm' | 'f';
    numChildren: number;
    partnerIncome: number;
    income: number;
    budget: BudgetEntry;
}

const Results = (incomeData: TaxInput) => {
    const tax: TaxData = useMemo(() => calcTax(incomeData), [
        incomeData
    ]);

    const toTreeNode = useCallback((e: BudgetEntry) : TreeNode => ({
            name: `${e.title}: ${shekel(e.total_direction_expense * tax.personalBudgetFactor)} בשנה`,
            code: e.code,
            title: e.title,
            value: Math.round(e.total_direction_expense * tax.personalBudgetFactor),
            toggled: true,
            children: (e.children || []).map(toTreeNode)
        }), [tax.personalBudgetFactor])

    const treeBeardDataResult = useMemo(() => incomeData.budget && toTreeNode(incomeData.budget), [incomeData, toTreeNode])

    if (!treeBeardDataResult)
        return <div className="loading-budget">טוען את התקציב...</div>

    return (<div>
                <TaxBarChart data={treeBeardDataResult}/>
            </div>);
}

export default Results;
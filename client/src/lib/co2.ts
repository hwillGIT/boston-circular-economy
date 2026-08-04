/**
 * Estimated CO2 emissions prevented (in lbs) for each type of action.
 * @category Client
 */
export const CO2_PER_ACTION: Record<string, number> = {
  repair: 5.2,
  donate: 3.8,
  swap: 4.1,
  recycle: 1.5,
  mend: 2.3,
  compost: 0.8,
  refurbish: 6.5,
};

/**
 * Credits awarded to a user for performing each type of action.
 * @category Client
 */
export const CREDITS_PER_ACTION: Record<string, number> = {
  repair: 50,
  donate: 30,
  swap: 40,
  recycle: 15,
  mend: 25,
  compost: 10,
  refurbish: 60,
};

/**
 * Converts a given amount of prevented CO2 into a relatable real-world metric.
 * @category Client
 * @param co2Lbs - The amount of CO2 prevented in lbs.
 * @returns A string describing the equivalency (e.g., phone charges).
 * @example
 * const desc = getEquivalency(5.2);
 */
export function getEquivalency(co2Lbs: number): string {
  const phoneCharges = Math.round(co2Lbs * 7.5);
  if (phoneCharges > 0) return `Like charging your phone ${phoneCharges} times`;
  return `Every bit helps!`;
}

/**
 * Estimates the environmental impact and credits for a single action type.
 * @category Client
 * @param actionType - The type of action performed (e.g., 'repair', 'donate').
 * @returns An object containing the estimated CO2 saved, credits earned, and a text equivalency.
 * @see getEquivalency
 * @example
 * const impact = estimateImpact('repair');
 */
export function estimateImpact(actionType: string) {
  const co2 = CO2_PER_ACTION[actionType] || 2.0;
  const credits = CREDITS_PER_ACTION[actionType] || 20;
  return { co2, credits, equivalency: getEquivalency(co2) };
}

/**
 * Estimates the combined environmental impact and credits for multiple actions.
 * @category Client
 * @param actionTypes - An array of action types performed.
 * @returns An object containing the aggregated CO2 saved, total credits, text equivalency, and count.
 * @see estimateImpact
 * @example
 * const totalImpact = estimateMultiImpact(['repair', 'donate']);
 */
export function estimateMultiImpact(actionTypes: string[]) {
  const co2 = actionTypes.reduce((sum, a) => sum + (CO2_PER_ACTION[a] || 2.0), 0);
  const credits = actionTypes.reduce((sum, a) => sum + (CREDITS_PER_ACTION[a] || 20), 0);
  return {
    co2: Math.round(co2 * 10) / 10,
    credits,
    equivalency: getEquivalency(co2),
    count: actionTypes.length,
  };
}

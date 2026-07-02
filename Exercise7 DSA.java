import java.util.HashMap;
import java.util.Map;

/**
 * Exercise 7: Financial Forecasting
 *
 * Recursion concept:
 * - A function solves a problem by calling itself on a smaller subproblem.
 * - Base case stops recursion.
 */
public class Exercise7 {

    /**
     * Recursive forecast:
     * future(year) = future(year - 1) * (1 + growthRate[year - 1])
     *
     * @param initialValue value at year 0
     * @param growthRates yearly growth rates (e.g., 0.10 for 10%)
     * @param year target year index (0..growthRates.length)
     */
    public static double forecastRecursive(double initialValue, double[] growthRates, int year) {
        if (year == 0) {
            return initialValue;
        }
        return forecastRecursive(initialValue, growthRates, year - 1) * (1 + growthRates[year - 1]);
    }

    /**
     * Optimized recursion with memoization to avoid repeated computation.
     */
    public static double forecastMemoized(double initialValue, double[] growthRates, int year, Map<Integer, Double> memo) {
        if (year == 0) {
            return initialValue;
        }
        if (memo.containsKey(year)) {
            return memo.get(year);
        }
        double result = forecastMemoized(initialValue, growthRates, year - 1, memo) * (1 + growthRates[year - 1]);
        memo.put(year, result);
        return result;
    }

    public static void main(String[] args) {
        double initialInvestment = 10000.0;
        double[] growthRates = {0.10, 0.08, 0.12, 0.07, 0.09};
        int targetYear = growthRates.length;

        double recursiveValue = forecastRecursive(initialInvestment, growthRates, targetYear);
        System.out.printf("Recursive forecast after %d years: %.2f%n", targetYear, recursiveValue);

        double memoizedValue = forecastMemoized(initialInvestment, growthRates, targetYear, new HashMap<>());
        System.out.printf("Memoized forecast after %d years: %.2f%n", targetYear, memoizedValue);

        /*
         * Complexity discussion:
         * - This direct recurrence computes each year once: O(n) time, O(n) call stack.
         * - In many recursive problems with overlapping subproblems, naive recursion can be exponential.
         * - Memoization optimizes repeated calls by caching results, typically reducing to O(n).
         *
         * Further optimization:
         * - Iterative DP loop also computes in O(n) time with O(1) extra space.
         */
    }
}

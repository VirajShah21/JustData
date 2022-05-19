/**
 * A set of utility functions for arrays.
 */
class ArrayUtils {
    /**
     * Creates an array which enumerated from a specified value to another
     * specified value.
     *
     * @param from - The starting value for the enumeration.
     * @param to - The ending value for the enumeration.
     * @returns An array of numbers from `from` to `to` (not including `to`).
     */
    static enumerate(from: number, to: number): number[] {
        const result: number[] = [];
        for (let i = from; i < to; i++) result.push(i);
        return result;
    }
}

export default ArrayUtils;

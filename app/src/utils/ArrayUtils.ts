class ArrayUtils {
    static enumerate(from: number, to: number): number[] {
        const result: number[] = [];
        for (let i = from; i < to; i++) result.push(i);
        return result;
    }
}

export default ArrayUtils;

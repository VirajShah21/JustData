/**
 * Sleeps the current thread for a specified number of milliseconds.
 *
 * It must be called by using one of the following methods:
 *
 * **Method 1:**
 *
 * ```
 * await sleep(1000); // Sleeps for 1 seconds
 * ```
 *
 * **Method 2:**
 *
 * ```
 * sleep(1000).then(() => {
 *   // Do something after 1 second
 * })
 * ```
 *
 * @param ms - The number of milliseconds to wait.
 * @returns A promise which resolves in the specified number of milliseconds.
 */
function sleep(ms: number) {
    // Simply resolve the promise once the timeout is triggered
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { sleep };

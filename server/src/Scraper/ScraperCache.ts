import fs from 'fs';
import path from 'path';

/**
 * A caching utility for caching data from a web scraper.
 */
abstract class ScraperCache {
    private static readonly cacheSavingInterval = 60000; // 1 Minute
    private static readonly cacheRoot = './caches';

    /**
     * Initialized the cache root directory.
     */
    private static initializeCacheRoot() {
        if (!fs.existsSync(ScraperCache.cacheRoot)) fs.mkdirSync(ScraperCache.cacheRoot);
    }

    /**
     * Initializes a cache variable.
     *
     * @param filename - The name of the file to store the cache in.
     * @param memoryAccessor - A function which returns the variable which
     * holds the cached data.
     * @returns The loaded cache data.
     */
    static initializeCache<T>(filename: string, memoryAccessor?: () => T): T | null {
        ScraperCache.initializeCacheRoot();

        const filePath = path.join(ScraperCache.cacheRoot, filename);
        let cache: T | null = null;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '{}');
        } else {
            cache = JSON.parse(fs.readFileSync(filePath).toString());
        }

        if (memoryAccessor) {
            setInterval(() => {
                fs.writeFileSync(filePath, JSON.stringify(memoryAccessor()));
            }, ScraperCache.cacheSavingInterval);
        }

        return cache;
    }
}

export default ScraperCache;

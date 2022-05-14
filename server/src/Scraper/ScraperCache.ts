import fs from 'fs';
import path from 'path';

abstract class ScraperCache {
    private static readonly cacheRoot = './caches';

    private static initializeCacheRoot() {
        if (!fs.existsSync(ScraperCache.cacheRoot)) fs.mkdirSync(ScraperCache.cacheRoot);
    }

    static initializeCache<T>(filename: string): T | null {
        ScraperCache.initializeCacheRoot();

        const filePath = path.join(ScraperCache.cacheRoot, filename);
        let cache: T | null = null;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '{}');
        } else {
            cache = JSON.parse(fs.readFileSync(filePath).toString());
        }

        setInterval(() => {
            fs.writeFileSync(filePath, JSON.stringify(cache));
        }, 60000);

        return cache;
    }
}

export default ScraperCache;

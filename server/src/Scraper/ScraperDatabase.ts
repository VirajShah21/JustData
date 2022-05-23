import { Db, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

type CloseMongoDbClientExecutor = () => void;

/**
 * A caching utility for caching data from a web scraper.
 */
class ScraperDatabase {
    private collection: string;

    constructor(collection: string) {
        this.collection = collection;
    }

    async get(id: ObjectId) {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne({ _id: id });
        close();
        return result;
    }

    async find(filter: Record<string, unknown>) {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).find(filter).toArray();
        close();
        return result;
    }

    async findAll(filter: Record<string, unknown>) {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).find(filter).toArray();
        close();
        return result;
    }

    async insert(...data: Record<string, unknown>[]) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).insertMany(data);
        close();
    }

    async update(id: ObjectId, data: Record<string, unknown>) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).updateOne({ _id: id }, { $set: data });
        close();
    }

    private static openDatabase(): Promise<[Db, CloseMongoDbClientExecutor]> {
        return new Promise((resolve, reject) => {
            const uri = process.env.JUST_DATA_SCRAPER_DB_URI;
            if (uri) {
                const client = new MongoClient(uri, {
                    serverApi: ServerApiVersion.v1,
                });
                client.connect(err => {
                    if (err) reject(err);
                    else resolve([client.db('scraped-data'), () => client.close()]);
                });
            }
        });
    }
}

export default ScraperDatabase;

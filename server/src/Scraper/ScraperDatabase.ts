import {
    Db,
    MongoClient,
    ObjectId,
    ServerApiVersion,
    Document as MongoDocument,
    WithId,
} from 'mongodb';

type CloseMongoDbClientExecutor = () => void;

interface ScrapedData<T> extends MongoDocument {
    url: string;
    timestamp: number;
    expires: number;
    data: T;
}

class ScraperDatabase<T> {
    private collection: string;

    constructor(collection: string) {
        this.collection = collection;
    }

    async get(id: ObjectId): Promise<WithId<ScrapedData<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne({ _id: id });
        close();
        return result as WithId<ScrapedData<T>> | null;
    }

    async find(filter: Record<string, unknown>): Promise<WithId<ScrapedData<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne(filter);
        close();
        return result as WithId<ScrapedData<T>> | null;
    }

    async findAll(filter: Record<string, unknown>): Promise<WithId<ScrapedData<T>>[]> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).find(filter).toArray();
        close();
        return result as unknown as WithId<ScrapedData<T>>[];
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

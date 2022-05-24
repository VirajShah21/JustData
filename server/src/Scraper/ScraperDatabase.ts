import {
    Db,
    MongoClient,
    ObjectId,
    ServerApiVersion,
    Document as MongoDocument,
    WithId,
} from 'mongodb';
import Logger from '../utils/Logger';

type CloseMongoDbClientExecutor = () => void;

interface ScrapedDocument<T> extends MongoDocument {
    url: string;
    timestamp: number;
    expires: number;
    data: T;
}

interface ScrapedDocumentExpiration {
    minutes: number;
}

interface ScrapedDocumentInsertionObject<T> {
    url: string;
    data: T;
    expiration: ScrapedDocumentExpiration;
}

class ScraperDatabase<T> {
    private collection: string;

    constructor(collection: string) {
        this.collection = collection;
    }

    async get(id: ObjectId): Promise<WithId<ScrapedDocument<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne({ _id: id });
        close();
        return result as WithId<ScrapedDocument<T>> | null;
    }

    async find(filter: Record<string, unknown>): Promise<WithId<ScrapedDocument<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne(filter);
        close();
        return result as WithId<ScrapedDocument<T>> | null;
    }

    async findAll(filter: Record<string, unknown>): Promise<WithId<ScrapedDocument<T>>[]> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).find(filter).toArray();
        close();
        return result as unknown as WithId<ScrapedDocument<T>>[];
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

    async delete(id: ObjectId) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).deleteOne({ _id: id });
        close();
    }

    async clear() {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).deleteMany({});
        close();
    }

    private static openDatabase(): Promise<[Db, CloseMongoDbClientExecutor]> {
        return new Promise((resolve, reject) => {
            const uri =
                'mongodb+srv://justdata-server:SwsY7crF2QornDcm@cluster0.uwko4cb.mongodb.net/?retryWrites=true&w=majority';
            console.log('Using URI', uri);
            if (uri) {
                Logger.info('Attempting to open connection to the scrapers database');
                const client = new MongoClient(uri, {
                    serverApi: ServerApiVersion.v1,
                });
                Logger.info('Connected to the scrapers database');
                client.connect(err => {
                    if (err) {
                        Logger.warn('Error connecting to the database');
                        Logger.error(err);
                        reject(err);
                    } else {
                        resolve([client.db('scraped-data'), () => client.close()]);
                    }
                });
            }
        });
    }

    static lifespan(expiration: ScrapedDocumentExpiration): [number, number] {
        const now = Date.now();
        return [now, now + expiration.minutes * 60 * 1000];
    }
}

export default ScraperDatabase;
export type { ScrapedDocument, ScrapedDocumentExpiration, ScrapedDocumentInsertionObject };

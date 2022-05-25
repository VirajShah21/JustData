import {
    Db,
    MongoClient,
    ObjectId,
    ServerApiVersion,
    Document as MongoDocument,
    WithId,
    Filter,
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
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
}

interface ScrapedDocumentInsertionObject<T> {
    url: string;
    data: T;
    expiration: ScrapedDocumentExpiration;
}

const SEC_TO_MS = 1000;
const MIN_TO_MS = 60000;
const HOUR_TO_MS = 3600000;
const DAY_TO_MS = 86400000;
const WEEK_TO_MS = 604800000;
const MONTH_TO_MS = 2592000000;
const YEAR_TO_MS = 31536000000;

class ScraperDatabase<T> {
    private readonly collection: string;

    constructor(collection: string) {
        this.collection = collection;
    }

    async get(id: ObjectId): Promise<WithId<ScrapedDocument<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne({ _id: id });
        close();

        if (result && result.expires < Date.now()) {
            this.delete(result._id);
            return null;
        }

        return result as WithId<ScrapedDocument<T>> | null;
    }

    async find(filter: Filter<ScrapedDocument<T>>): Promise<WithId<ScrapedDocument<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne(filter);
        close();

        if (result && result.expires < Date.now()) {
            this.delete(result._id);
            return null;
        }

        return result as WithId<ScrapedDocument<T>> | null;
    }

    async findAll(filter: Filter<ScrapedDocument<T>>): Promise<WithId<ScrapedDocument<T>>[]> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).find(filter).toArray();
        close();

        const now = Date.now();
        const toDelete = result.filter(item => item.expires < now);
        const toKeep = result.filter(item => item.expires >= now);

        this.delete(...toDelete.map(doc => doc._id));

        return toKeep as unknown as WithId<ScrapedDocument<T>>[];
    }

    async insert(...data: ScrapedDocument<T>[]) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).insertMany(data);
        close();
    }

    async update(id: ObjectId, data: ScrapedDocument<T>) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).updateOne({ _id: id }, { $set: data });
        close();
    }

    async delete(...ids: ObjectId[]) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).deleteMany({
            _id: {
                $in: ids,
            },
        });
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
            if (uri) {
                const client = new MongoClient(uri, {
                    serverApi: ServerApiVersion.v1,
                });
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
        let delta = 0; // Time frmo now to expiration

        if (expiration.seconds) delta += expiration.seconds * SEC_TO_MS;
        if (expiration.minutes) delta += expiration.minutes * MIN_TO_MS;
        if (expiration.hours) delta += expiration.hours * HOUR_TO_MS;
        if (expiration.days) delta += expiration.days * DAY_TO_MS;
        if (expiration.weeks) delta += expiration.weeks * WEEK_TO_MS;
        if (expiration.months) delta += expiration.months * MONTH_TO_MS;
        if (expiration.years) delta += expiration.years * YEAR_TO_MS;

        const now = Date.now();

        return [now, now + delta];
    }
}

export default ScraperDatabase;
export type { ScrapedDocument, ScrapedDocumentExpiration, ScrapedDocumentInsertionObject };

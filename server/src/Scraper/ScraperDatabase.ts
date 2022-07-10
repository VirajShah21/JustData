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

/**
 * An object for retrieving and storing information in the MongoDB database
 * for scraped data.
 */
class ScraperDatabase<T> {
    private readonly collection: string;

    /**
     * Constructs an instance of the `ScraperDatabase`.
     *
     * @param collection - The name of the collection to use for storing scraped data
     */
    constructor(collection: string) {
        this.collection = collection;
    }

    /**
     * Retrieves scraped data from the instantiated collection with the specified ID.
     *
     * @param id - The id of the document to retrieve.
     * @returns The scraped document with the specified ID.
     */
    async get(id: ObjectId): Promise<WithId<ScrapedDocument<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne({ _id: id });
        close();
        return result as WithId<ScrapedDocument<T>> | null;
    }

    /**
     * Finds a single document from the collection with the specified filter.
     *
     * @param filter - The Mongo query filter to find the document.
     * @returns A single `ScrapedData` object that matches the filter.
     */
    async find(filter: Filter<ScrapedDocument<T>>): Promise<WithId<ScrapedDocument<T>> | null> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).findOne(filter);
        close();
        return result as WithId<ScrapedDocument<T>> | null;
    }

    /**
     * Uses a Mongo query filter to find all matching documents from the collection.
     *
     * @param filter - The Mongo query filter to find the document.
     * @returns All documents in the collection matching the filter.
     */
    async findAll(filter: Filter<ScrapedDocument<T>>): Promise<WithId<ScrapedDocument<T>>[]> {
        const [db, close] = await ScraperDatabase.openDatabase();
        const result = await db.collection(this.collection).find(filter).toArray();
        close();
        return result as WithId<ScrapedDocument<T>>[];
    }

    /**
     * Inserts a scraped document into the database.
     *
     * @param data - The `ScrapedDocument` object to insert into the database.
     */
    async insert(...data: ScrapedDocument<T>[]) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).insertMany(data);
        close();
    }

    /**
     * Updates a document already in the database with new data.
     *
     * @param id - The id of the document to update.
     * @param data - The data to update the document with.
     */
    async update(id: ObjectId, data: ScrapedDocument<T>) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).updateOne({ _id: id }, { $set: data });
        close();
    }

    /**
     * Deletes one or more documents from the database with the specified IDs.
     *
     * @param ids - The ids of the documents to delete.
     */
    async delete(...ids: ObjectId[]) {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).deleteMany({
            _id: {
                $in: ids,
            },
        });
        close();
    }

    /**
     * Clears an entire collection from the database.
     *
     * ! ⚠️  This deletes all documents in the collection
     */
    async clear() {
        const [db, close] = await ScraperDatabase.openDatabase();
        await db.collection(this.collection).deleteMany({});
        close();
    }

    /**
     * Opens a connection to the database. Resolves with the `Db` object (MongoDB connection)
     * and a function that can be used to close the connection.
     *
     * @returns A promise that resolves to an array. The first element is an instance of the
     * MongoDB database. The second elemtent is a function that closes the database connection.
     */
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

    /**
     * Converts an expiration object to the EPOCH time in milliseconds for which data will expire
     * from the current time.
     *
     * @param expiration - An object containing information about the expiration of the scraped
     * data. Each key is a unit of time mapping to the number of units.
     * @returns The epoch time at which the data expires.
     */
    static lifespan(expiration: ScrapedDocumentExpiration): [number, number] {
        let delta = 0; // Time frmo now to expiration

        if (expiration.seconds) {
            delta += expiration.seconds * SEC_TO_MS;
        }

        if (expiration.minutes) {
            delta += expiration.minutes * MIN_TO_MS;
        }

        if (expiration.hours) {
            delta += expiration.hours * HOUR_TO_MS;
        }

        if (expiration.days) {
            delta += expiration.days * DAY_TO_MS;
        }

        if (expiration.weeks) {
            delta += expiration.weeks * WEEK_TO_MS;
        }

        if (expiration.months) {
            delta += expiration.months * MONTH_TO_MS;
        }

        if (expiration.years) {
            delta += expiration.years * YEAR_TO_MS;
        }

        const now = Date.now();

        return [now, now + delta];
    }
}

export default ScraperDatabase;
export type { ScrapedDocument, ScrapedDocumentExpiration, ScrapedDocumentInsertionObject };

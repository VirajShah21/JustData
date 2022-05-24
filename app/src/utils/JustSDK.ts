import axios from 'axios';

const httpSuccess = 200;

/**
 * An `Error` class designed to handle HTTP errors from the API.
 */
class HTTPError extends Error {
    /**
     *
     * @param status - The HTTP response status code. If the status is 200,
     * then no error was throw, and a resultant error will be thrown noting
     * that a `200` status code is a success code.
     */
    constructor(status: number) {
        super(`HTTP error: ${status}`);
        this.name = 'HTTPError';
        if (status === httpSuccess) {
            throw new Error('HTTPError: HTTP status code 200 is a success code.');
        }
    }
}

/**
 * A static utility class for JustSDK kits to use when making HTTP requests.
 */
class JustSDK {
    private static readonly DEV_DOMAIN = `http://localhost:3001`;

    private static readonly DEV_MODE = window.location.hostname === `localhost`;

    public static get hostname(): string {
        return JustSDK.DEV_MODE ? JustSDK.DEV_DOMAIN : '';
    }
}

/**
 * A utility kit for accessing the Just Data FBI API.
 */
class FBIKit {
    /**
     * @returns - A promise which resolves to a list of the ten most wanted fugitives.
     */
    static async requestTenMostWantedFugitives(): Promise<SimpleFugitiveData[]> {
        const response = await axios.get(`${JustSDK.hostname}/api/fbi/ten-most-wanted`);
        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }

    /**
     * @returns - A promise which resolves to a list of all fugitives on the FBI
     * most wanted site.
     */
    static async requestAllFugitives(): Promise<FullFugitiveData[]> {
        const response = await axios.get(`${JustSDK.hostname}/api/fbi/all-fugitives`);
        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

/**
 * A utility kit for accessing the Just Places API.
 */
class PlacesKit {
    /**
     * @param query - The query to search for.
     * @param location - The geographic location to search around.
     * @returns A promise which resolves to all the Yellow Pages listings
     * for the specified query and location.
     */
    static async search(query: string, location: string): Promise<YellowPagesSERP> {
        const response = await axios.get(
            `${JustSDK.hostname}/api/business/search?q=${query}&location=${location}`,
        );

        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

/**
 * A utility kit for accessing the Just Data Supreme Court API.
 */
class SCOTUSKit {
    /**
     * @param terms - A list of the supreme court terms to search for.
     * For example `[1969, 2000, 2017]` will return the cases for the
     * 1969-1970, 2000-2001, and 2017-2018 SCOTUS terms.
     * @returns A promise which resolves to a list of the cases for the
     * specified SCOTUS terms.
     */
    static async getCaseList(...terms: number[]) {
        const query =
            terms.length === 1 ? `term=${terms[0]}` : `terms=${encodeURI(JSON.stringify(terms))}`;
        const response = await axios.get(`${JustSDK.hostname}/api/supreme-court/cases?${query}`);

        if (response.status === httpSuccess) {
            return response.data;
        } else {
            throw new HTTPError(response.status);
        }
    }
}

/**
 * A utility kit for accessing the Just Securities API.
 */
class SecuritiesKit {
    /**
     * @param query - The query to search for. This can be either a partial/full ticker
     * symbol, company name, cryptocurrency, currency, etc.
     * @returns - A promise which resolves list of the securities matching the specified query.
     */
    static async searchTickerSymbols(query: string): Promise<StockTickerScraperResponse> {
        const response = await axios.get(
            `${JustSDK.hostname}/api/stocks/ticker-search?q=${encodeURI(query)}`,
        );

        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

/**
 * A utility kit for accessing the Just Data SERP API.
 */
class SERPKit {
    /**
     *
     * @param query - The Bing query to search for.
     * @returns - A promise which resolves to a list of the Bing SERP results
     * (`BingSearchResults`).
     */
    static async bing(query: string): Promise<BingSearchResults> {
        const response = await axios.get(`${JustSDK.hostname}/api/serp?q=${encodeURI(query)}`);
        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

export default JustSDK;
export { FBIKit, PlacesKit, SCOTUSKit, SERPKit, SecuritiesKit };

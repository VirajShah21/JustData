import axios from 'axios';

const httpSuccess = 200;

class HTTPError extends Error {
    constructor(status: number) {
        super(`HTTP error: ${status}`);
        this.name = 'HTTPError';
    }
}

class JustSDK {
    private static readonly DEV_DOMAIN = `http://localhost:3001`;

    private static readonly DEV_MODE = window.location.hostname === `localhost`;

    public static get hostname(): string {
        return JustSDK.DEV_MODE ? JustSDK.DEV_DOMAIN : '';
    }
}

class FBIKit {
    async requestTenMostWantedFugitives(): Promise<SimpleFugitiveData[]> {
        const response = await axios.get(`${JustSDK.hostname}/api/fbi/ten-most-wanted`);
        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }

    async requestAllFugitives(): Promise<FullFugitiveData[]> {
        const response = await axios.get(`${JustSDK.hostname}/api/fbi/all-fugitives`);
        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

class PlacesKit {
    async search(query: string, location: string): Promise<YellowPagesSearchResult[]> {
        const response = await axios.get(
            `${JustSDK.hostname}/api/business/search?q=${query}&location=${location}`,
        );

        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

class SCOTUSKit {
    async getCaseList(...terms: string[]) {
        const query =
            terms.length === 1 ? `term=${terms[0]}` : `terms=${encodeURI(terms.toString())}`;
        const response = await axios.get(`${JustSDK.hostname}/api/supreme-court/cases?${query}`);
        if (response.status === httpSuccess) {
            const arr = [];
            for (const term in response.data) {
                if (response.data.hasOwnProperty(term)) {
                    arr.push(...response.data[term]);
                }
            }
            return arr;
        } else {
            throw new HTTPError(response.status);
        }
    }
}

class SecuritiesKit {
    async searchTickerSymbols(query: string): Promise<StockTickerScraperResponse> {
        const response = await axios.get(
            `${JustSDK.hostname}/api/stocks/ticker-search?q=${encodeURI(query)}`,
        );

        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

class SERPKit {
    async bing(query: string): Promise<SERPItem[]> {
        const response = await axios.get(`${JustSDK.hostname}/api/serp?q=${encodeURI(query)}`);
        if (response.status === httpSuccess) return response.data;
        else throw new HTTPError(response.status);
    }
}

export default JustSDK;
export { FBIKit, PlacesKit, SCOTUSKit, SERPKit, SecuritiesKit };

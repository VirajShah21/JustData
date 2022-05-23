import axios from 'axios';

const httpSuccess = 200;

class JustSDK {
    private static readonly DEV_DOMAIN = `http://localhost:3001`;

    private static readonly DEV_MODE = window.location.hostname === `localhost`;

    public static get hostname(): string {
        return JustSDK.DEV_MODE ? JustSDK.DEV_DOMAIN : '';
    }
}

class FBIKit {
    async requestTenMostWantedFugitives(): Promise<SimpleFugitiveData[]> {
        return new Promise((resolve, reject) => {
            axios.get(`${JustSDK.hostname}/api/fbi/ten-most-wanted`).then(response => {
                if (response.status === httpSuccess) resolve(response.data);
                else reject(response.status);
            });
        });
    }

    async requestAllFugitives(): Promise<FullFugitiveData[]> {
        return new Promise((resolve, reject) => {
            axios.get(`${JustSDK.hostname}/api/fbi/all-fugitives`).then(response => {
                if (response.status === httpSuccess) resolve(response.data);
                else reject(response.status);
            });
        });
    }
}

class PlacesKit {
    async search(query: string, location: string): Promise<YellowPagesSearchResult[]> {
        return new Promise((resolve, reject) => {
            axios
                .get(`${JustSDK.hostname}/api/business/search?q=${query}&location=${location}`)
                .then(response => {
                    if (response.status === httpSuccess) resolve(response.data);
                    else reject(response.status);
                });
        });
    }
}

class SCOTUSKit {
    async getCaseList(...terms: string[]) {
        return new Promise((resolve, reject) => {
            const query =
                terms.length === 1 ? `term=${terms[0]}` : `terms=${encodeURI(terms.toString())}`;
            axios.get(`${JustSDK.hostname}/api/supreme-court/cases?${query}`).then(response => {
                if (response.status === httpSuccess) {
                    const arr = [];
                    for (const term in response.data) {
                        if (response.data.hasOwnProperty(term)) {
                            arr.push(...response.data[term]);
                        }
                    }
                    resolve(arr);
                } else {
                    reject(response.status);
                }
            });
        });
    }
}

class SecuritiesKit {
    async searchTickerSymbols(query: string): Promise<StockTickerScraperResponse> {
        return new Promise((resolve, reject) => {
            axios
                .get(`${JustSDK.hostname}/api/stocks/ticker-search?q=${encodeURI(query)}`)
                .then(response => {
                    if (response.status === httpSuccess) resolve(response.data);
                    else reject(response.status);
                });
        });
    }
}

class SERPKit {
    async bing(query: string): Promise<SERPItem[]> {
        return new Promise((resolve, reject) => {
            axios.get(`${JustSDK.hostname}/api/serp?q=${encodeURI(query)}`).then(response => {
                if (response.status === httpSuccess) resolve(response.data);
                else reject();
            });
        });
    }
}

export default JustSDK;
export { FBIKit, PlacesKit, SCOTUSKit, SERPKit, SecuritiesKit };

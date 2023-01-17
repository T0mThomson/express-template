import debug from "debug";
import fetch from 'node-fetch';

const log: debug.IDebugger = debug('app:http-service');

class HTTPService {

    /**
     * New HTTP POST Request
     * @param url 
     * @param data 
     */
    async post(url: string, data: {}, authToken?: string) {
        let count = 0;

        const postWithRetry = async () => {
            try {

                log(`POST Request to ${url} with data: 
                ${JSON.stringify(data)}`);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': (authToken) ? 'Bearer ' + authToken : ''
                    },
                    redirect: 'follow',
                    body: JSON.stringify(data)
                });

                log(`POST to ${url} succesful`)

                return response;
    
            } catch(err) {
                if(count < 6) {

                    const retrySeconds = 5;
                    log(
                        `POST to ${url} unsuccessful (will retry #${++count} after ${retrySeconds} seconds):`,
                        err
                    );
                    setTimeout(postWithRetry, retrySeconds * 1000);

                }
                else {
                    log(
                        `POST to ${url} unsuccessful:`,
                        err
                    );
                }
            }
        }

        return await postWithRetry();

    }


    /**
     * New HTTP GET Request
     * @param url 
     * @param data 
     */
    async get(url: string, authToken?: string) {
        let count = 0;

        const getWithRetry = async () => {
            try {

                log(`GET Request to ${url}.`);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': (authToken) ? 'Bearer ' + authToken : ''
                    }
                });

                log(`GET to ${url} succesful`)

                return response;
    
            } catch(err) {
                if(count < 6) {

                    const retrySeconds = 5;
                    log(
                        `GET to ${url} unsuccessful (will retry #${++count} after ${retrySeconds} seconds):`,
                        err
                    );
                    setTimeout(getWithRetry, retrySeconds * 1000);

                }
                else {
                    log(
                        `GET to ${url} unsuccessful:`,
                        err
                    );
                }
            }
        }

        return await getWithRetry()

    }

}

export default new HTTPService()
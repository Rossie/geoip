const url = 'http://ip-api.com';
const http = require('http');

const ipApi = {
    lookup: function (format, ip) {
        return new Promise((resolve, reject) => {

            // code from here:
            // https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_http_get_options_callback
            const uri = url + `/${format}/${ip}`;
            console.log('uri', uri);
            http.get(uri, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                }

                if (error) {
                    // consume response data to free up memory
                    res.resume();
                    reject(error.message);
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        resolve(rawData);
                        // const parsedData = JSON.parse(rawData);
                        // resolve(parsedData);
                    } catch (e) {
                        reject(e.message);
                    }
                });
            }).on('error', (e) => {
                reject(`Got error: ${e.message}`);
            });

        });

    }
};

module.exports = ipApi;
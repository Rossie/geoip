const url = 'http://ip-api.com'; // http://ip-api.com/docs/
const http = require('http');

const ipApi = {
    lookup: function (format, ip) {
        return new Promise((resolve, reject) => {

            // code from here:
            // https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_http_get_options_callback
            const uri = url + `/${format}/${ip}`;

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
                    resolve(rawData);
                    // const parsedData = JSON.parse(rawData); // parse later outside
                    // resolve(parsedData);
                });
            }).on('error', (e) => {
                reject(`Got error: ${e.message}`);
            });

        });

    }
};

module.exports = ipApi;
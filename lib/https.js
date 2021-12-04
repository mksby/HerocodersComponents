const https = require('https');

const get = (url) => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, res => {
            let data = '';

            res.on('data', stream => {
                data += stream;
            });

            res.on('end', () => resolve(JSON.parse(data)));
        })

        req.on('error', e => reject(e.message));
    })
}

module.exports = {
    get
}

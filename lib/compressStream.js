const { Transform } = require('stream');
let zlib = require('zlib')

class CompressStream extends Transform {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.compress = options.compress;
    }
    _transform(msg, encoding, callback) {
        console.debug('compress', msg);
        let buffer = new Buffer(JSON.stringify(msg))
        if (this.compress){
            zlib.gzip(buffer, callback);
        } else {
            callback(null, buffer);
        }
    }
}

module.exports = CompressStream;
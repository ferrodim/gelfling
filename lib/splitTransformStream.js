const { Transform } = require('stream');
const crypto = require('crypto');
const GELF_ID = [0x1e, 0x0f];

class SplitTransformStream extends Transform {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.maxChunkSize = this._getMaxChunkSize(options.maxChunkSize);
    }
    _transform(data, encoding, callback) {
        console.debug('split', data);
        let chunkSize = this.maxChunkSize;
        if (data.length <= chunkSize){
            callback(null, data);
            return;
        }

        var msgId = [].slice.call(crypto.randomBytes(8)),
            numChunks = Math.ceil(data.length / chunkSize),
            chunks = new Array(numChunks), chunkIx, dataSlice, dataStart

        for (chunkIx = 0; chunkIx < numChunks; chunkIx++) {
            dataStart = chunkIx * chunkSize
            dataSlice = [].slice.call(data, dataStart, dataStart + chunkSize)
            chunks[chunkIx] = new Buffer(GELF_ID.concat(msgId, chunkIx, numChunks, dataSlice))
        }

        callback(null, chunks);
    }

    _getMaxChunkSize(size) {
        if (size == null) size = 'wan'
        switch (size.toLowerCase()) {
            case 'wan': return 1420
            case 'lan': return 8154
            default: return parseInt(size, 10)
        }
    }
}

module.exports = SplitTransformStream;
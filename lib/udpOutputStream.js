const { Writable } = require('stream');
const dgram = require('dgram');
// var GELF_ID = [0x1e, 0x0f]
// TODO: implement keepalives

class UdpOutputStream extends Writable {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.host = options.host || 'localhost';
        this.port = options.port || 12201;
        this.udpClient = dgram.createSocket('udp4');
        this.udpClient.on('error', options.errorHandler || console.error);
    }
    _write(data, encoding, callback) {
        console.debug('write', data);
        this.udpClient.send(data, this.port, this.host, callback);
        // new Buffer(GELF_ID.concat(msgId, chunkIx, numChunks, dataSlice))
    }
    _destroy(err, callback){
        this.udpClient.close();
        callback();
    }
}

module.exports = UdpOutputStream;
const { Readable } = require('stream');
const GELF_KEYS = ['version', 'host', 'short_message', 'full_message', 'timestamp', 'level', 'facility', 'line', 'file'];
const ILLEGAL_KEYS = ['_id'];
const HOSTNAME = require('os').hostname();

class ConvertTransformStream extends Readable {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.defaults = options.defaults;
    }
    _read(size){

    }
    send(msg){
        console.debug('convert', msg);
        if (typeof msg !== 'object') msg = {short_message: msg}

        let gelfMsg = {}, defaults = this.defaults, key, val

        for (key in defaults) {
            if (!defaults.hasOwnProperty(key)) continue
            val = defaults[key]
            gelfMsg[key] = typeof val === 'function' ? val(msg) : val
        }

        for (key in msg) {
            if (!msg.hasOwnProperty(key)) continue
            val = msg[key]
            if (GELF_KEYS.indexOf(key) < 0) key = '_' + key
            if (ILLEGAL_KEYS.indexOf(key) >= 0) key = '_' + key
            gelfMsg[key] = val
        }

        if (gelfMsg.version == null) gelfMsg.version = '1.0'
        if (gelfMsg.host == null) gelfMsg.host = HOSTNAME;
        if (gelfMsg.timestamp == null) gelfMsg.timestamp = +(new Date) / 1000
        if (gelfMsg.short_message == null) gelfMsg.short_message = JSON.stringify(msg)

        this.push(gelfMsg);
    }
}

module.exports = ConvertTransformStream;
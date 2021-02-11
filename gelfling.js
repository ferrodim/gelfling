let CompressStream = require('./lib/compressStream');
let UdpOutputStream = require('./lib/udpOutputStream');
let SplitTransformStream = require('./lib/splitTransformStream');
let ConvertStream = require('./lib/convertStream');
// const { pipeline } = require('stream');

function GelfStream(host='localhost', port=12201, options = {}) {
  let {maxChunkSize, defaults, errorHandler, keepAlive} = options;
  let compress = options.compress == null ? true : options.compress;

  let convertStream = new ConvertStream({defaults});
  let compressStream = new CompressStream({compress});
  let splitStream = new SplitTransformStream({maxChunkSize});
  let outputStream = new UdpOutputStream({host, port, keepAlive, errorHandler});

  convertStream
      .pipe(compressStream)
      .pipe(splitStream)
      .pipe(outputStream);

  /*
  pipeline(
    [convertStream, compressStream, splitStream, outputStream, errorHandler],
    (err) =>{
      console.log('done', err);
    }
  )*/
  this.convertStream = convertStream;
}

GelfStream.prototype.send = function(data, callback) {
  this.convertStream.write(data, callback);
}

module.exports = function(host, port, options) {
  return new GelfStream(host, port, options)
}

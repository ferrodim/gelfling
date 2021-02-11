let CompressStream = require('./lib/compressStream');
let UdpOutputStream = require('./lib/udpOutputStream');
let SplitTransformStream = require('./lib/splitTransformStream');
let ConvertStream = require('./lib/convertStream');


let defaults = {a: 1};
//let compress = false;
let maxChunkSize = 'wan';
let keepAlive=true, errorHandler = console.error;


let convert = new ConvertStream({defaults});
let compress = new CompressStream({compress: false});
let split = new SplitTransformStream({maxChunkSize});
let output = new UdpOutputStream({keepAlive, errorHandler});

convert.pipe(compress).pipe(split).pipe(output);

setInterval(()=>{
    convert.send({b: 123});
}, 1000);
// These lines make "require" available
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

import stringify from 'json-stable-stringify'
// var stringify = require('json-stable-stringify')
// import sodium from 'chloride'
import { sha256 } from 'crypto-hash';
// const sodium = require("chloride")


export async function getId (msg) {
    return '%' + await sha256(stringify(msg))
}



// export function getId (msg) {
//     return '%' + hash(stringify(msg))
// }

// // from ssb-keys
// // https://github.com/ssb-js/ssb-keys/blob/2342a85c5bd4a1cf8739b7b09eb2f667f735bd08/util.js#L4
// export function hash (data:any, enc?:BufferEncoding) {
//     data = (typeof data === 'string' && enc == null) ?
//         Buffer.from(data, "binary") :
//         Buffer.from(data, enc);
//     return sodium.crypto_hash_sha256(data).toString("base64") + ".sha256"
// }

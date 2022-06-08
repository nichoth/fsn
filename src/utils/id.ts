import stringify from 'json-stable-stringify'
import { sha256 } from 'crypto-hash';

export async function getId (msg) {
    return '%' + await sha256(stringify(msg))
}

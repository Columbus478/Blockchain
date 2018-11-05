const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const keypair = ec.genKeyPair();
const privateKey = keypair.getPrivate('hex');
const publicKey = keypair.getPublic('hex');

console.log("\nPrivate key: "+privateKey);
console.log("\nPublic key: "+publicKey);
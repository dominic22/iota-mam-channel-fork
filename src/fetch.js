const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'public'
// secret always upper case!
const secretKey = 'SECRETBIG'
const provider = 'https://nodes.devnet.iota.org'

const root = 'EILEFZRMNTVSZNYBTSGLHPVCSYQJEXPFVZJMVDZSXZIKYJULXUGIZFHPWURP99PGTBWJMNMVSSRVDQYGS';

let mamState = Mam.init(provider)

mamState = Mam.changeMode(mamState, mode, secretKey)
console.log('MAM STATE', mamState);

// Callback used to pass data out of the fetch
const logData = data => {  
  console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
}

 Mam.fetch(root, mode, secretKey, logData).then(() => {
   console.log('FINISHED');
 });
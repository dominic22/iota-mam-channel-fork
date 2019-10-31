const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'public'
// secret always upper case!
const secretKey = 'SECRETBIG'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${secretKey.padEnd(81, '9')}&root=`

let mamState = Mam.init(provider)

const TREE_COUNT = 2;
mamState.channel.count = TREE_COUNT;
mamState.channel.next_count = TREE_COUNT;
mamState = Mam.changeMode(mamState, mode, secretKey)

let counter0 = 0;
const publish = async data => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(data))

    mamState.channel.count = TREE_COUNT;
    mamState.channel.next_count = TREE_COUNT;
    // mamState.channel.index = 0;
    // mamState.channel.start = counter0;
    // counter0 = counter0 + TREE_COUNT;

   
    console.log('MESSAGE: ', data.message)
    console.log('curr start : ', mamState.channel.start);
    console.log('curr index: ', mamState.channel.index);

    const message = Mam.create(mamState, trytes)

    if(counter0 === TREE_COUNT) {
      console.log('MAM STATE : ', mamState)
    }

    // Save new mamState
    mamState = message.state

    console.log('Published', data, '\n');
    console.log('new start : ', mamState.channel.start)
    console.log('new index: ', mamState.channel.index);

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9)

    return message.root
}

const publishAll = async () => {
  const root = await publish({
    message: 'Hello...',
    timestamp: (new Date()).toLocaleString()
  })
  console.log('initial root', root);

  const root1 =  await publish({
    message: 'This is our open chat',
    timestamp: (new Date()).toLocaleString()
  })

  console.log('ROOT1', root1);

  const root2 = await publish({
    message: 'another message.',
    timestamp: (new Date()).toLocaleString()
  })

  console.log('ROOT2 ', root2);

  const root3 = await publish({
    message: 'this message is only visible on fork',
    timestamp: (new Date()).toLocaleString()
  })
  
  console.log('ROOT3 ', root3);

  const root4 = await publish({
    message: 'and this is the 4th message.',
    timestamp: (new Date()).toLocaleString()
  })
  
  console.log('ROOT4 ', root4);

  const root5 = await publish({
    message: 'and this is the last message.',
    timestamp: (new Date()).toLocaleString()
  })
  
  console.log('ROOT5 ', root5);

  return root
}

// Callback used to pass data out of the fetch
const logData = data => {  
  console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
}

publishAll()
  .then(async root => {

    // Output asyncronously using "logData" callback function
    await Mam.fetch(root, mode, secretKey, logData)
    
    
    // Output syncronously once fetch is completed
    //const result = await Mam.fetch(root, mode, secretKey)
    
    //result.messages.forEach(message => {
    //  console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n')
    //})

    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
  })
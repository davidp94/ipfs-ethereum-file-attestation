const express = require('express')
const app = express()

app.get('/', (req, res) => {
    // TODO: return parameter of attestor (address, smart contract FileRegistry)
    return res.send('Hi guys!');
})


const ipfsHashUtil = require('./ipfshash-bytes32');

app.get('/verify/:hash', (req, res) => {
    let hash = req.params.hash;
    console.log(`verify hash ${hash}`);

    if (hash.length != 66 && hash.substring(0,2) != '0x') {
        return res.status(500).send(`not a hash, valid is "0x68371d7e884c168ae2022c82bd837d51837718a7f7dfb7aa3f753074a35e1d87"`);
    }

    let ipfsHash = ipfsHashUtil.getIpfsHashFromBytes32(hash);
    //TODO : ipfs api get and pin
    //TODO: broadcast blockchain tx to FilesRegistry

    return res.send(`verify hash ${hash}`);
});

app.listen(4242, () => {
    console.log('Example app listening on port 4242!')
})
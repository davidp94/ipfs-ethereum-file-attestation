const express = require('express')
const app = express()

app.get('/', (req, res) => {
    // TODO: return parameter of attestor (address, smart contract FileRegistry)
    return res.send('Hi guys!');
})


const IPFS_HOST = process.env.IPFS_HOST || 'localhost';
const IPFS_PORT = process.env.IPFS_PORT || '5001';
const IPFS_PROTOCOL = process.env.IPFS_PROTOCOL || 'http';


const ipfsHashUtil = require('./ipfshash-bytes32');
const ipfsAPI = require('ipfs-api')


const ipfsInstance = ipfsAPI(IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL);


app.get('/verify/:hash', (req, res) => {
    let hash = req.params.hash;
    console.log(`verify hash ${hash}`);

    if (hash.length != 66 && hash.substring(0, 2) != '0x') {
        return res.status(500).send(`not a hash, valid is "0x68371d7e884c168ae2022c82bd837d51837718a7f7dfb7aa3f753074a35e1d87"`);
    }

    let ipfsHash = ipfsHashUtil.getIpfsHashFromBytes32(hash);
    return ipfsInstance.files.pin(ipfsHash, (err) => {
        if (err) {
            return res.status(500).send(`Could not pin this hash, ${err}`);
        }
        //TODO: broadcast blockchain tx to FilesRegistry

        return res.send(`attested hash ${hash}`);
    });
});

app.listen(4242, () => {
    console.log('Example app listening on port 4242!')
})
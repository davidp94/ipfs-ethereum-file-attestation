const express = require('express')
const app = express()

const IPFS_HOST = process.env.IPFS_HOST || 'localhost';
const IPFS_PORT = process.env.IPFS_PORT || '5001';
const IPFS_PROTOCOL = process.env.IPFS_PROTOCOL || 'http';
const WEB3_HTTP_URL = process.env.WEB3_HTTP_URL || 'http://127.0.0.1:7545/';

const ipfsHashUtil = require('./ipfshash-bytes32');
const ipfsAPI = require('ipfs-api')
const Web3 = require('web3');
const fs = require('fs');

const ipfsInstance = ipfsAPI(IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL);
const web3Instance = new Web3(WEB3_HTTP_URL);
const FILE_REGISTRY_ABI = JSON.parse(fs.readFileSync('../ethereum/build/contracts/FilesRegistry.json', 'utf8')).abi;
const FILE_REGISTRY_ADDRESS = process.env.FILE_REGISTRY_ADDRESS || '0xd74eea748091481a710a03295b739cda1e60e78f';
let FILE_REGISTRY_SENDER = process.env.FILE_REGISTRY_SENDER;
if (!FILE_REGISTRY_SENDER) {
    web3Instance.eth.getAccounts()
        .then((accounts) => {
            FILE_REGISTRY_SENDER = accounts[0];
        });
}

var fileRegistryInstance = new web3Instance.eth.Contract(FILE_REGISTRY_ABI, FILE_REGISTRY_ADDRESS);

app.get('/', (req, res) => {
    var config = {
        IPFS_HOST: IPFS_HOST,
        IPFS_PORT: IPFS_PORT,
        IPFS_PROTOCOL: IPFS_PROTOCOL,
        FILE_REGISTRY_ADDRESS: FILE_REGISTRY_ADDRESS,
        FILE_REGISTRY_SENDER: FILE_REGISTRY_SENDER
    };
    return res.send(`<pre>${JSON.stringify(config, null, 4)}</pre>`);
})

app.get('/verify/:hash', (req, res) => {
    var forcePin = req.query.forcePin || false;    
    let hash = req.params.hash;
    let ipfsHash;
    if (hash.substring(0,2) == 'Qm') {
        ipfsHash = hash;
        hash = ipfsHashUtil.getBytes32FromIpfsHash(hash);
    }
    else {
        ipfsHash = ipfsHashUtil.getIpfsHashFromBytes32(hash);
    }

    console.log(`verify hash ${hash} ${ipfsHash}`);

    return fileRegistryInstance.methods.fileLastVerifiedTime(hash).call((err, result)=> {
        if (err) {
            return res.status(500).send(`Could not pin this hash, ${err}`);
        }
        if(forcePin || result == 0) {
            return ipfsInstance.pin.add(ipfsHash, {
                recursive: true
            }, (err) => {
                if (err) {
                    return res.status(500).send(`Could not pin this hash, ${err}`);
                }
                return fileRegistryInstance.methods.attestFile(hash).send({
                        from: FILE_REGISTRY_SENDER
                    })
                    .then((receipt) => {
                        console.log(`Receipt is here: ${JSON.stringify(receipt)}`);
                        return res.send(`attested hash ${hash}`);
                    });
            });
        }
        else {
            return res.status(500).send(`Could not pin this hash because it is already pinned since timestamp ${result}`);
        }
    })
});

app.get('/convert-qm-to-hash/:h', (req, res) => {
    let ipfsHash = ipfsHashUtil.getBytes32FromIpfsHash(req.params.h);
    return res.send(`${ipfsHash}`);
});

app.get('/convert-hash-to-qm/:h', (req, res) => {
    let ipfsQm = ipfsHashUtil.getIpfsHashFromBytes32(req.params.h);
    return res.send(`${ipfsQm}`);
});

app.listen(4242, () => {
    console.log('Attester app listening on port 4242!')
})
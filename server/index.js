const express = require('express')
const app = express()

app.get('/', (req, res) => {
    // TODO: return parameter of attestor (address, smart contract FileRegistry)
    return res.send('Hi guys!');
})

app.get('/verify/:hash', (req, res) => {
    let hash = req.params.hash;
    console.log(`verify hash ${hash}`);

    //TODO: convert hash to multihash
    //TODO : ipfs api get and pin
    //TODO: broadcast blockchain tx to FilesRegistry

    return res.send(`verify hash ${hash}`);
});

app.listen(4242, () => {
    console.log('Example app listening on port 4242!')
})
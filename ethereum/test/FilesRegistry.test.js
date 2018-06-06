const FilesRegistry = artifacts.require('FilesRegistry');
const AttestorsRegistry = artifacts.require('AttestorsRegistry');

const assertRevert = require('./helpers/assertRevert');


contract('FilesRegistry', function(accounts) {

    var version = web3.version.node
    console.log('Ethereum Client: ' + version)
    
    beforeEach(async function() {
        //client
        if (version.includes('TestRPC'))
            this.nodeVersion = 'testrpc'
        else if (version.includes('Geth'))
            this.nodeVersion = 'geth'
        else if (version.includes('Parity'))
            this.nodeVersion = 'parity'

        fr = await FilesRegistry.new();
        ar = await AttestorsRegistry.new();

        setRegistryTx = await fr.setAttestorRegistryAddress(ar.address);
        console.log(setRegistryTx.receipt.gasUsed);

        attestTx = await ar.addAttestor(accounts[1]);
        console.log(attestTx.receipt.gasUsed);
        attestTx = await ar.addAttestor(accounts[2]);
        console.log(attestTx.receipt.gasUsed);        
        
    })


    it("would attest a file", async function () {
        hashFile = web3.sha3('someblob');

        fileExists = await fr.isFileStored(hashFile);

        assert.equal(fileExists, false);

        attestFileTx = await fr.attestFile(hashFile, {from: accounts[1]});
        console.log(attestFileTx.receipt.gasUsed);

        fileExists = await fr.isFileStored(hashFile);
        assert.equal(fileExists, true);
    });

    it("would not let a non attestor to attest a file", async function () {
        hashFile = web3.sha3('someblob');

        fileExists = await fr.isFileStored(hashFile);

        assert.equal(fileExists, false);

        await assertRevert(fr.attestFile(hashFile, {from: accounts[4]}));

        fileExists = await fr.isFileStored(hashFile);
        assert.equal(fileExists, false);
    });


});
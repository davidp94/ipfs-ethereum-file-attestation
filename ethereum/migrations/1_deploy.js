var AttestorsRegistry = artifacts.require("./AttestorsRegistry.sol");
var FilesRegistry = artifacts.require("./FilesRegistry.sol");

module.exports = function (deployer, network, accounts) {
  deployer
    .deploy(AttestorsRegistry);
  deployer
    .deploy(FilesRegistry);

  deployer
    .then(() => {
      return Promise.all([
        AttestorsRegistry.deployed(),
        FilesRegistry.deployed()
      ])
    })
    .then((res) => {
      var ar = res[0];
      var fr = res[1];

      console.log('------------------------------------');
      console.log(`AttestationRegistry: ${ar.address}, FilesRegistry: ${fr.address}`);
      console.log('------------------------------------');

      return fr.setAttestorRegistryAddress(ar.address)
        .then(ar.addAttestor(accounts[0]))
        .then(() => {
          console.log('------------------------------------');
          console.log(`added Attestor ${accounts[0]}`);
          console.log('------------------------------------');
        });

    });
};
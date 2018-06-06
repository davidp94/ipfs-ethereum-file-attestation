//https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/helpers/assertRevert.js
module.exports = async promise => {
    try {
      await promise;
      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }
  };
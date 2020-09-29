# Bug in GasToken's *ERC-20* `approve` function

[ProjectChicago's](https://github.com/projectchicago) fantastic [gastokens](https://gastoken.io/) have a **non-critical** bug in their
`approve` function.

This repo provides a test case to prove the presence of the bug in the
`GST1.sol` contract as well as a test case to provide a workaround.

However the `GST2_ETH.sol` and the `GST2_ETC.sol` contracts have the exact same
semantics for the `approve` functions and are therefore affected the same way.

## Description of the bug

Every *ERC-20* token has to implement an `approve` function to allow an address
(the *spender*) to withdraw a specified amount (the *value*) of tokens from the
senders balance.

The documentation of the `approve` function in `GST1.sol` says:
```
// Spec: Allow `spender` to withdraw from your account, multiple times, up
// to the `value` amount. If this function is called again it overwrites the
// current allowance with `value`.
```

As the tests show it is not possible to overwrite the current allowance with a
new value unequal to zero if the allowance before the transaction was unequal to
zero too.

This complicates the use-case in which a false amount of allowance was set and
a transaction wants to update the allowance to the intended amount unequal to
zero.

However there exists a workaround which needs two transaction. This is
especially ironic as the purpose of the gastokens is to save gas :)

For more informations check out the tests in the `test/approve.js` file.

## Setup

To execute and check the tests locally run
```
$ npm install --save-dev @nomiclabs/buidler
$ npm install --save-dev @nomiclabs/buidler-ethers ethers
$ npm install --save-dev @nomiclabs/buidler-waffle ethereum-waffle chai
```
in the project directory.

After installation execute the tests with `$ npx buidler test`.

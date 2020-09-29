const { expect } = require("chai");

// Shows a *non-critical* bug in the GST1 token's ERC20 approve function.

describe("Approve function has a bug", function() {

  it("Does not overwrite the current allowance with value", async function() {
    const [addr1, addr2, ...addrs] = await ethers.getSigners();
    const GST1 = await ethers.getContractFactory("GasToken1");

    const token = await GST1.deploy();
    await token.deployed();

    const owner = await addr1.getAddress();
    const spender = await addr2.getAddress();

    // Send an approve of 100 tokens
    const oldApprove = await token.approve(spender, 100);
    expect(await token.allowance(owner, spender)).to.equal(100);

    // Upps, noticed we want an approve of 10, not 100...
    const newApprove = await token.approve(spender, 10);
    expect(await token.allowance(owner, spender)).to.equal(10);

    // Shit, doesn't work... Eventhough the docs say:
    //   If this function is called again it overwrites the
    //   current allowance with `value`.
  });

  // But...
  it("Has a workaround which needs two transactions", async function() {
    const [addr1, addr2, ...addrs] = await ethers.getSigners();
    const GST1 = await ethers.getContractFactory("GasToken1");

    const token = await GST1.deploy();
    await token.deployed();

    const owner = await addr1.getAddress();
    const spender = await addr2.getAddress();

    // Send an approve of 100 tokens
    const oldApprove = await token.approve(spender, 100);
    expect(await token.allowance(owner, spender)).to.equal(100);

    // Workaround, but this needs more gas as we have to send two transactions...
    const tx1 = await token.approve(spender, 0);
    expect(await token.allowance(owner, spender)).to.equal(0);

    const tx2 = await token.approve(spender, 10);
    expect(await token.allowance(owner, spender)).to.equal(10);
  });
});

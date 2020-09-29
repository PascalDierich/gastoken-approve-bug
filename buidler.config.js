usePlugin("@nomiclabs/buidler-waffle");

module.exports = {
  solc: {
    version: "0.4.10",
  },
  paths: {
    sources: "./contract",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};


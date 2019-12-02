const asyncRequire = async (id, version) => {
  if(require.resolve(id)) return require(id);
  // TODO install package
};

module.exports = asyncRequire;
import { Blockchain, GENESIS_BLOCK_BODY, createNewUtcDate, hashBlock } from "../index";

// const clonedBlockToVerify = Object.assign({}, blockToVerify);


describe("Simple Private Blockchain", () => {
  it("The blockchain creation works.", () => {
    const newBlockchain = new Blockchain();
    const genesisBlock = newBlockchain.chain[0];
    const dateNow = createNewUtcDate();
    
    // Check if the new block contains all the elements neccessary
    expect(genesisBlock).toEqual(
      expect.objectContaining({
        height: 0,
        body: GENESIS_BLOCK_BODY
      })
    );

    // Make sure the timestamp is not happening before the blockchain creation
    expect(Number(genesisBlock.timestamp)).toBeGreaterThanOrEqual(Number(dateNow))
    
    
    // Check if the hashing function works (Clone the object + resetting the hash to an empty srring)
    let clonedGenesisBlock = Object.assign({}, genesisBlock);
    clonedGenesisBlock.hash = "";
    const clonedBlockHash = hashBlock(clonedGenesisBlock);
    expect(genesisBlock.hash).toEqual(clonedBlockHash);
  });
});
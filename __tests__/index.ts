import { Blockchain, Block, GENESIS_BLOCK_BODY, createNewUtcDate, hashBlock } from "../index";

// Simple function that create a new block with the block number as body
// const newBlock = () => new Block(`Block #${myBlockchain.chain.length + 1}`);

describe("Simple Private Blockchain", () => {
  it('Block creating works', () => {
    const NEW_BLOCK_BODY = "Hello world!";
    const newBlock = new Block(NEW_BLOCK_BODY);
    expect(newBlock).toEqual({
      hash: '',
      height: 0,
      body: NEW_BLOCK_BODY,
      timestamp: '0',
      previousBlockHash: ''
    });
  });

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
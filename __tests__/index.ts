import { Blockchain, Block, GENESIS_BLOCK_BODY, createNewUtcDate, hashBlock } from "../index";

/** Helper to create block body */
const newBlockBodyFormatter = (blockNumber: number) => `New Block #${blockNumber}`;

/**
 * Simple test suite to make sure the blockchain works as expected.
 * This could be refactored but it's 🆒 for now.
 */
describe("Simple Private Blockchain", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

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
    // Make sure the chain has created the genesis block
    expect(newBlockchain.chain.length).toEqual(1);

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

  it('Adding blocks to the blockchain works', () => {
    const newBlockchain = new Blockchain();
    // Adding 1 block to the chain
    newBlockchain.addNewBlock(newBlockBodyFormatter(newBlockchain.chain.length));
    // Checking that the chain is the correct length and the new block contains the right body data
    expect(newBlockchain.chain.length).toEqual(2);
    expect(newBlockchain.chain[1].body).toEqual(newBlockBodyFormatter(1));

    // Adding 10 more blocks
    for(let i = 0; i < 10; i++){
      newBlockchain.addNewBlock(newBlockBodyFormatter(newBlockchain.chain.length));
    };
    // Now, the blockchain should contains 12 blocks (11 newly created blocks + the genesis block)
    expect(newBlockchain.chain.length).toEqual(12);
    // Check if the last block has the right body data
    expect(newBlockchain.chain[11].body).toEqual(newBlockBodyFormatter(11));
  });

  it('Validating blocks works', () => {
    const newBlockchain = new Blockchain();
    // A newly created blockchain should be valid
    expect(newBlockchain.chain.length).toEqual(1);
    expect(newBlockchain.validateChain()).toBeTruthy();

    // Adding 10 new blocks and checking if the blockchain is still valid
    for(let i = 0; i < 10; i++){
      newBlockchain.addNewBlock(newBlockBodyFormatter(newBlockchain.chain.length));
    };
    expect(newBlockchain.chain.length).toEqual(11);
    expect(newBlockchain.validateChain()).toBeTruthy();
  });

  it("Invalidate the chain if some chain data is being changed", () => {
    const newBlockchain = new Blockchain();
    // Adding 5 new blocks and checking if the blockchain is still valid
    for(let i = 0; i < 5; i++){
      newBlockchain.addNewBlock(newBlockBodyFormatter(newBlockchain.chain.length));
    };
    expect(newBlockchain.chain.length).toEqual(6);
    expect(newBlockchain.validateChain()).toBeTruthy();

    const NEW_BLOCK_VALUE = "Corrupted data";
    newBlockchain.chain[3].body = NEW_BLOCK_VALUE;
    
    // Make sure the chain is no longer valid if a block is corrupted
    expect(newBlockchain.chain[3].body).toEqual(NEW_BLOCK_VALUE);
    expect(newBlockchain.validateChain()).toBeFalsy();

    expect(console.error).toHaveBeenNthCalledWith(1, "❌ INVALID BLOCK FOUND:");
    expect(console.error).toHaveBeenNthCalledWith(2, newBlockchain.chain[3]);
  });

  it("Invalidate the chain if some previousBlockHash are being corrupted", () => {
    // Here we're going to corrupt the data by changing the previous block hash of the 5th block with the hash of the 2nd block.
    // Whatever the data changed in a block, it'll invalidate the blockbecause the hashed value won't be valid anymore
    const newBlockchain = new Blockchain();
    // Adding 5 new blocks and checking if the blockchain xis still valid
    for(let i = 0; i < 5; i++){
      newBlockchain.addNewBlock(newBlockBodyFormatter(newBlockchain.chain.length));
    };
    expect(newBlockchain.chain.length).toEqual(6);
    expect(newBlockchain.validateChain()).toBeTruthy();

    newBlockchain.chain[4].previousBlockHash = newBlockchain.chain[1].hash;
    // Make sure the chain is no longer valid if a block is corrupted
    expect(newBlockchain.chain[4].previousBlockHash).toEqual(newBlockchain.chain[1].hash);
    expect(newBlockchain.validateChain()).toBeFalsy();

    expect(console.error).toHaveBeenNthCalledWith(1, "❌ INVALID BLOCK FOUND:");
    expect(console.error).toHaveBeenNthCalledWith(2, newBlockchain.chain[4]);
  });
});
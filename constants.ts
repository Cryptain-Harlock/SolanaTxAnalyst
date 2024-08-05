import * as web3 from '@solana/web3.js';

// OpenBook AMM
const v4LiquidityProgramId = new web3.PublicKey(
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
);

const v4LiquidityProgramIdDevNet = new web3.PublicKey(
  'HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8',
);

const CLLMProgramId = new web3.PublicKey(
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
);

// StableSwap AMM
const v5LiquidityProgramId = new web3.PublicKey(
  '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h',
);

const v5LiquidityProgramIdDevnet = new web3.PublicKey(
  'DDg4VmQaJV9ogWce7LpcjBA9bv22wRp5uaTPa5pGjijF',
);

const solMint = new web3.PublicKey(
  'So11111111111111111111111111111111111111112',
);


export default {
  solMint,
  v4LiquidityProgramId,
  v5LiquidityProgramId,
  v4LiquidityProgramIdDevNet,
  CLLMProgramId,
  v5LiquidityProgramIdDevnet,
};

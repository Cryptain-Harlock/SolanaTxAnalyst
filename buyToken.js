//@ts-nocheck

const {
  Liquidity,
  LiquidityPoolKeys,
  jsonInfo2PoolKeys,
  LiquidityPoolJsonInfo,
  TokenAccount,
} = require("@raydium-io/raydium-sdk");

const { getTokenAccountsByOwner, calcAmountOut } = require('./utils/index.js');

const { Connection, PublicKey, sendAndConfirmTransaction } = require("@solana/web3.js");
const SOL_IMG = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';

const RAY_IMG = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png';

const RAY_SOL_LP_V4_POOL_KEY = '89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip'; // https://solscan.io/token/89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip

const RAYDIUM_LIQUIDITY_JSON = 'https://api.raydium.io/v2/sdk/liquidity/mainnet.json';

const RAY_TOKEN_MINT = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';
const publicKey = new PublicKey("GJhw87ZLzCESa8Z7i87KLMqV4HcjM849Vk5uaCWXnBqe");
const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=446f90b5-7443-4ab1-a81f-6777218002b2", "confirmed");

const main = async () => {
  const liquidityJsonResp = await fetch(RAYDIUM_LIQUIDITY_JSON);
  if (!(await liquidityJsonResp).ok) {
    throw "liquidity json fetch failed";
  }
  const liquidityJson = await liquidityJsonResp.json();
  const allPoolKeysJson = [
    ...(liquidityJson?.official ?? []),
    ...(liquidityJson?.unOfficial ?? []),
  ];
  const poolKeysRaySolJson =
    allPoolKeysJson.filter(
      (item) => item.lpMint === RAY_SOL_LP_V4_POOL_KEY
    )?.[0] || null;
  const raySolPoolKey = jsonInfo2PoolKeys(poolKeysRaySolJson);

  const inputNumber = 0.1;
  if (raySolPoolKey && publicKey) {
    try {
      const { amountIn, minAmountOut } = await calcAmountOut(
        connection,
        raySolPoolKey,
        inputNumber,
        false
      );
      const tokenAccounts = await getTokenAccountsByOwner(connection, publicKey);
      const { transaction, signers } = await Liquidity.makeSwapTransaction({
        connection,
        poolKeys: raySolPoolKey,
        userKeys: {
          tokenAccounts,
          owner: publicKey,
        },
        amountIn,
        amountOut: minAmountOut,
        fixedSide: "in",
      });
      const txid = await sendAndConfirmTransaction(connection, transaction, signers, {
        skipPreflight: true,
      });

      console.log("Transaction sent");
      console.log(`Check it at https://solscan.io/tx/${txid}`);
      console.log("success");
      console.log(true);
    } catch (err) {
      console.error("tx failed => ", err);
      console.log("Something went wrong");
      if (err?.code && err?.message) {
        console.log(`${err.code}: ${err.message}`);
      } else {
        console.log(JSON.stringify(err));
      }
      console.log("danger");
      console.log(true);
    }
  }
};

main();
//@ts-nocheck
import * as web3 from "@solana/web3.js";
import { TokenListProvider } from "solana-token-list";
import { Metaplex } from "@metaplex-foundation/js";

const connection = new web3.Connection(
  "https://mainnet.helius-rpc.com/?api-key=446f90b5-7443-4ab1-a81f-6777218002b2",
  // "https://lb.drpc.org/ogrpc?network=solana-mainnet&dkey=AuXshV6uWEv6q0EkHmZJSEXEScAlIyMR74ij9iG1-8Kb",
  "confirmed"
);

const url =
  "https://api.helius.xyz/v0/token-metadata?api-key=3516f33e-cd41-487c-99c5-4f9f570cc6ea";

const getMetadata = async (mintAddress: []) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mintAccounts: mintAddress,
      includeOffChain: true,
      disableCache: false,
    }),
  });

  const data = await response.json();
  let tokens = [];
  for(let i = 0; i < data.length; i ++) {
    const symbol = data[i].onChainMetadata.metadata.data.symbol;
    tokens.push({ [data[i].account]: symbol });
  }
  return tokens.reduce((prev, current) => ({ ...prev, ...current }), {});
}

const getDexRouter = (accountAddresses: []) => {
  const sourceAddresses = {
    JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: "Jupiter V6",
    JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB: "Jupiter V4",
    CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK:
      "Raydium Concentrated Liquidity",
    CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C: "Raydium CPMM",
    "5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h":
      "Raydium Liquidity Pool AMM",
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium Liquidity Pool V4",
    "27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv": "Raydium Liquidity Pool V3",
    RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr: "Raydium Liquidity Pool V2",
    whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc: "Orca Whirlpool",
    "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": "Orca Swap V2",
    DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1: "Orca Swap V1",
    LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo: "Meteora DLMM Program",
    Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB: "Meteora Pools Program",
    PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY: "Phoenix",
    "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c": "Lifinity Swap V2",
    EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S: "Lifinity Swap",
    SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ: "Saber Stable Swap",
    DecZY86MU5Gj7kppfUCEmd4LbXXuyZH1yHaP2NTqdiZB: "Saber Decimal Wrapper",
    HyaB3W9q6XdA5xwpU4XnSZV94htfmbmqJXZcEbRaJutt: "Invariant Swap",
    stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq: "Sanctum Router",
    "5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx": "Sanctum S Controller",
    opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb: "Openbook V2",
    BSwp6bEBihVLdqJRKGgzjcGLHkcTuzmSo1TQkHepzH8p: "BonkSwap",
    MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD: "Marinade Finance",
    FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X: "Fluxbeam Program",
    GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn: "GooseFX V2",
    MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky: "Mercurial Stable Swap",
    Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j: "Dooar Swap",
    CLMM9tUoggJu2wagPkkqs9eFG4BWhVBZWkP1qv3Sp7tR: "Crema Finance",
    DSwpgjMvXhtGn6BsbqmacdBZyfLj6jSWf3HJpdJtmg6N: "Dexlab Swap",
    SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr: "Saros AMM",
    CURVGoZn8zycx6FXwwevgBTB2gVvdbGTEpvMJDbgs2t4: "Aldrin AMM V2",
    AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6: "Aldrin AMM",
    H8W3ctz92svYg6mkn1UtGfu2aQr2fnUFHM1RhScEtQDt: "Cropper Whirlpool",
    CTMAxxk34HjKWxQ3QLZK1HpaLXmBveao3ESePXbiyfzh: "Cropper Finance",
    SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8: "Token Swap Program",
    treaf4wWBBty3fHdyBpo35Mz84M8k3heKXmjmi9vFt5: "Helium Treasury Management",
    PSwapMdSai8tjrEXcxFeQth87xC4rRsa4VA5mhGhXkP: "Penguin Finance",
    SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1: "Step Finance Swap Program",
    MFLQPPPPjNinkdKoy2odNFBhvpY43XtCDZjBwG2fwn5: "Marginfi",
    MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA: "Marginfi V2",
    KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD: "Kamino Lending",
    "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc": "Kamino",
    FqGg2Y1FNxMiGd51Q6UETixQWkF5fB92MysbYogRJb3P: "Hawksight",
    "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P": "Pump.fun",
    "6m2CDdhRgxpH4WjvdzxAYbGxwdGUz5MziiL5jek2kBma": "6M",
  };

  return accountAddresses
    .filter((item) => sourceAddresses[item])
    .map((item) => sourceAddresses[item]);
};
async function getMetadataWithMetaPlex(mintAddresses: []) {
  try {
    const metaplex = Metaplex.make(connection);

    const data = [];
    for (let i = 0; i < mintAddresses.length; i++) {
      const mintAddress = new web3.PublicKey(mintAddresses[i]);

      const metadataAccount = metaplex
        .nfts()
        .pdas()
        .metadata({ mint: mintAddress });

      const metadataAccountInfo = await connection.getAccountInfo(
        metadataAccount
      );

      if (metadataAccountInfo) {
        const token = await metaplex
          .nfts()
          .findByMint({ mintAddress: mintAddress });
        data.push({ [mintAddresses[i]]: token.symbol });
      }
    }
    return data.reduce((prev, current) => ({ ...prev, ...current }), {});
  } catch (err) {
    console.error("Error: ", err);
  }
}

async function fetchAccountsForSignature(signature: string): Promise<void> {
  try {
    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      console.log("Transaction not found");
      return;
    }

    // console.log(JSON.stringify(tx));

    const staticAccountKeys = tx?.transaction?.message?.staticAccountKeys || [];
    const preTokenBalances = tx?.meta?.preTokenBalances || [];
    const postTokenBalances = tx?.meta?.postTokenBalances || [];
    const preSolBalances = tx?.meta?.preBalances || [];
    const postSolBalances = tx?.meta?.postBalances || [];
    const fee = tx.meta?.fee || 0;

    if (preTokenBalances.length === 0 || postTokenBalances.length === 0) {
      console.log("No token balances found");
      return;
    }

    const accountAddresses = staticAccountKeys.map((accountKey) =>
      accountKey.toBase58()
    );
    console.log("Account Addresses:", accountAddresses);
    const mainAccountAddress = accountAddresses[0];

    const deltaSolAmounts = preSolBalances.map((preBalance, index) => {
      const postBalance = postSolBalances[index];
      const deltaAmount = postBalance - preBalance;
      return deltaAmount;
    });

    // console.log("Sol balance Changes", deltaSolAmounts);

    const ownerTokenChange = {};
    let addressOfToken = "";

    postTokenBalances.map((postBalance, index) => {
      if (postBalance.owner === mainAccountAddress) {
        ownerTokenChange[postBalance.mint] = postBalance.uiTokenAmount.uiAmount;
        addressOfToken = postBalance.mint;
      }
    });

    console.log("owner token change : ", ownerTokenChange);
    preTokenBalances.map((preBalance, index) => {
      if (preBalance.owner === mainAccountAddress) {
        if (!ownerTokenChange[preBalance.mint]) {
          ownerTokenChange[preBalance.mint] = 0;
        }
        ownerTokenChange[preBalance.mint] -= preBalance.uiTokenAmount.uiAmount;
        addressOfToken = preBalance.mint;
      }
    });

    console.log("owner token change : ", ownerTokenChange);
    const tokenMintAddresses = Object.keys(ownerTokenChange);
    console.log(tokenMintAddresses);
    const tokenNames = await getMetadata(tokenMintAddresses);

    console.log(tokenNames);

    // const tokenNames = tokenMetadatas
    //   .map((metadata: { account: any; legacyMetadata: { symbol: any } }) => ({
    //     [metadata.account]: metadata.legacyMetadata.symbol,
    //   }))
    //   .reduce((prev, current) => ({ ...prev, ...current }), {});

    // console.log("metas", tokenMetadatas);

    if (Math.abs(Math.abs(deltaSolAmounts[0]) - fee) < 300000) {
      // TODO : needs update with SOL check
      console.log("SOL is not related in the swap");
      if (tokenMintAddresses.length === 2) {
        const dexRouter = getDexRouter(accountAddresses);
        console.log("swap info : ", ownerTokenChange);
        const result = tokenMintAddresses.reduce(
          (prev, current) =>
            ownerTokenChange[current] > 0
              ? `${prev}to ${ownerTokenChange[current]} ${tokenNames[current]}`
              : `${Math.abs(ownerTokenChange[current])} ${
                  tokenNames[current]
                } ${prev}`,
          ""
        );
        console.log(`swapped ${result} on ${dexRouter.length > 0 ? dexRouter[0] : 'unknown exchange'}`);
      } else {
        console.log("Not a swap !!!!!!");
      }
    } else {
      console.log("SOL is related in the swap");
      if (ownerTokenChange.length === 0) {
        console.log("Not a swap !!!!!!");
      } else {
        
        const dexRouter = getDexRouter(accountAddresses);
        const isPump = dexRouter[0] === 'Pump.fun'
        const tokenName = (isPump ? "💊 " : "") + tokenNames[addressOfToken];
        const swappedSolAmount =
          Math.abs(deltaSolAmounts[0] + fee) / web3.LAMPORTS_PER_SOL;
        const direction = postSolBalances[0] + fee < preSolBalances[0]; // sol -> token
        console.log(
          `swapped ${
            direction === true
              ? swappedSolAmount + " SOL"
              : Math.abs(ownerTokenChange[addressOfToken]) + " " + tokenName
          } to ${
            direction === true
              ? Math.abs(ownerTokenChange[addressOfToken]) + " " + tokenName
              : swappedSolAmount + " SOL"
          } on ${dexRouter.length > 0 ? dexRouter[0] : 'unknown exchange'}`
        );
      }
    }

    // const deltaAmounts = preTokenBalances.map((preBalance, index) => {
    //     const postBalance = postTokenBalances[index];
    //     const deltaAmount =
    //         postBalance.uiTokenAmount.uiAmount -
    //         preBalance.uiTokenAmount.uiAmount;
    //     return deltaAmount;
    // });

    // console.log("Token Balance Changes:", deltaAmounts);

    // const fromSol = deltaAmounts[0] > 0;
    // const swapDirection = fromSol ? "WSOL to Token" : "Token to WSOL";

    // console.log(`Swapped ${Math.abs(deltaAmounts[0])} in the direction of ${swapDirection}`);

    // const tokensDeltaArray = deltaAmounts.map((delta, index) => {
    //     return {
    //         account: staticAccountKeys[preTokenBalances[index].accountIndex].toBase58(),
    //         delta,
    //     };
    // });

    // console.log("Tokens Delta Array:", tokensDeltaArray);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}
async function listenToSwapEvent(address) {
  connection.onLogs(new web3.PublicKey(address), ({ logs, err, signature }) => {
    if (signature) {
      // console.log("logs : ", logs);
      console.log("transaction created : ", signature);
      fetchAccountsForSignature(signature);
    }
  });
}

const userAddress = "GJhw87ZLzCESa8Z7i87KLMqV4HcjM849Vk5uaCWXnBqe";
listenToSwapEvent(userAddress);

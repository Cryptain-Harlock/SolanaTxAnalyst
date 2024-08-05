//@ts-nocheck
import * as web3 from "@solana/web3.js";

const main = () => {
    const connection = new web3.Connection("https://devnet.helius-rpc.com/?api-key=446f90b5-7443-4ab1-a81f-6777218002b2", "processed");
    connection.onLogs(new web3.PublicKey("E4hz7qDnoudMXub8E6qWB9b2eSL5mVPEwtZewdV4nLb6"), async ({logs, err, signature}) => {
        console.log("ctx", ctx);
    })
}

main();
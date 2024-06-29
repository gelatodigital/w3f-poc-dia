// web3-functions/oraclesigned_multipleasset/index.ts
import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { BigNumber, Contract } from "ethers";
import { BigNumber as BN } from "bignumber.js";
import ky from "ky";
import { ORACLE_ABI } from "./ocale_abi";

Web3Function.onRun(async (context:Web3FunctionContext) => {
  const { userArgs, multiChainProvider, storage } = context;
  let isHeartBeat = false;
  const lastRunTime = +(await storage.get("lastRunTime") ?? "0")  as number;
  console.log("lastRunTime", lastRunTime);
  const lastRunTimeDate = new Date(lastRunTime);
  const now = /* @__PURE__ */ new Date();
  const timeDifference = now.getTime() - lastRunTimeDate.getTime();
  const twelveHoursInMilliseconds = 12 * 60 * 60 * 1e3;
  if (timeDifference > twelveHoursInMilliseconds) {
    isHeartBeat = true;
    await storage.set("lastRunTime", now.toISOString());
    console.log("greater than 12");
  }
  const provider = multiChainProvider.default();
  const oracleAddress:string =  userArgs.oracle as string ?? "0x764210f5C07FBb9147897eA6D6d4625883951dc0";
  const assets:string[] = userArgs.assets as string[];
  const assetAddress =
    userArgs.assetAddress ?? "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419";
  let oracle;
  try {
    oracle = new Contract(oracleAddress, ORACLE_ABI, provider);
  } catch (err) {
    return { canExec: false, message: `Rpc call failed` };
  }
  let price;
  let symbol;
  let address;
  let time;
  let signature;
  let blockchain;
  let rounded;
  let intPrice;
  let calldata = [];
  for (var asset of assets) {
    let priceData:any;
    let lastValue;
    let assetInfo = asset.split("-");
    let blockchain2 = assetInfo[0];
    let symbol2 = assetInfo[1];
    let assetAddress2 = assetInfo[2];
    try {
      const diaApi =
        `https://api.diadata.org/v1/assetQuotation/` +
        blockchain2 +
        `/` +
        assetAddress2;
      priceData = await ky.get(diaApi, { timeout: 5e3, retry: 0 }).json();
    } catch (err) {
      console.log(err);
      return { canExec: false, message: `diadata call failed` };
    }
    price = new BN(priceData.Price).multipliedBy(new BN(10).pow(8)).toFixed(8);
    intPrice = Math.floor(Number(price));
    symbol2 = priceData.Symbol;
    address = priceData.Address;
    time = priceData.Time;
    signature = priceData.Signature;
    blockchain2 = priceData.Blockchain;
    time = Math.floor(new Date(time).getTime() / 1e3);
    if (!isHeartBeat) {
      try {
        console.log("Getting last value of ", symbol2);
        lastValue = await oracle.getValue(symbol2);
        console.log(
          "Getting last value of prive",
          new BN(lastValue.Price, 16).toString()
        );
        const isdeviate = isDeviationMoreThanTwoPercent(
          new BN(priceData.Price).multipliedBy(new BN(10).pow(8)),
          new BN(lastValue.Price, 16)
        );
        if (!isdeviate) {
          console.log("isdeviate isdeviate", isdeviate);
          continue;
        }
      } catch (error) {
        console.log("lastValue error", error);
        continue;
      }
    }

    calldata.push({
      Symbol: symbol2,
      Address: address,
      Blockchain: blockchain2,
      Price: intPrice,
      Time: time,
      Signature: signature,
    });
  }
  return {
    canExec: true,
    callData: [
      {
        to: oracleAddress,
        data: oracle.interface.encodeFunctionData("setValues", [calldata]),
      },
    ],
  };
});
function isDeviationMoreThanTwoPercent(originalValue:BN, newValue:BN) {
  console.log("originalValue", originalValue.toString());
  console.log("newValue", newValue.toString());
  const difference = originalValue.minus(newValue).abs();
  const twoPercent = originalValue.multipliedBy(0.02);
  return difference.isGreaterThan(twoPercent);
}

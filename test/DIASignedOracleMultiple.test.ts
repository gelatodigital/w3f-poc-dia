import hre from "hardhat";
import { expect } from "chai";
import { DIASignedOracleMultiple } from "../typechain";
import { before } from "mocha";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  Web3FunctionUserArgs,
  Web3FunctionResultV2,
} from "@gelatonetwork/web3-functions-sdk";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
const { ethers, deployments, w3f } = hre;

describe("DIASignedOracleMultiple Tests", function () {
  this.timeout(0);

  let owner: SignerWithAddress;
  let oracle: DIASignedOracleMultiple;
  let simpleW3f: Web3FunctionHardhat;
  let userArgs: {assets:string[],oracle:string };

  before(async function () {
    await deployments.fixture();

    [owner] = await hre.ethers.getSigners();

    oracle = await ethers.getContract("DIASignedOracleMultiple");

   await oracle.updateSigner("0x97d93ef533e72d4a49e28923898157498c379016")

    simpleW3f = w3f.get("dia");


    userArgs = {
      assets: ["Ethereum-USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7"],
      oracle: oracle.address,
    };
  });

  it("canExec: true - First execution", async () => {
    let { result } = await simpleW3f.run("onRun",{ userArgs });
    result = result as Web3FunctionResultV2;
  
    expect(result.canExec).to.equal(true);
    if (!result.canExec) throw new Error("!result.canExec");

    let key:string = "USDT";
    const priceBefore = await oracle.getValue(key)

    const calldataPrice = result.callData[0];
    await owner.sendTransaction({
      to: calldataPrice.to,
      data: calldataPrice.data,
    });

    const priceAfter = await oracle.getValue(key)

    expect(priceAfter.Price).to.gt(priceBefore.Price);

  });
});

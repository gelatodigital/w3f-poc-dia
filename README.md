How to use web3 Functions to update On-Chain prices with Dia
===============

Gelato Web3 Functions together with Dia offer the ability to create fine-tuned customized oracles getting and pushing prices on-chain following predefined logic within the Web3 Function and verifying prices on-chain.

In this repository, you will find the following demo here:

[W3F to Dia](https://github.com/gelatodigital/w3f-poc-Dia/tree/main/web3-functions/dia): this demo directly interacts with the Dia network.


> [!NOTE]
> The gelato fees are payed with [1Balance](https://docs.gelato.network/developer-services/1balance). 
> 1Balance allows to deposit USDC on polygon and run the transactions on every network.

Dia: Logic
---------------

The first step involves retrieving information from the DIA API. In this example, we will extract data related to USDT on the Ethereum network. The required parameters for executing this function are provided in the `userArgs.json` file:

```json
{
  "assets": ["Ethereum-USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7"],
  "oracle": "0xe3798F8f0273D18EbF516B1f09b37C199Bc1C2a8"
}
```

We also utilize the storage.json file to set the lastRunTime variable. By default, this is set to 0 and is updated when a threshold is reached:

```ts
const lastRunTime = +(await storage.get("lastRunTime") ?? "0") as number;
...
if (timeDifference > twelveHoursInMilliseconds) {
  isHeartBeat = true;
  await storage.set("lastRunTime", now.toISOString());
  console.log("greater than 12");
}
```

In the example, `assets` is an array, which is why we use a loop to iterate through all the assets and retrieve their information using the following code:

```ts
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
```

In our case, the URL would be: `https://api.diadata.org/v1/assetQuotation/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7`.

Here is an example of the expected output from this API call:
```json
{
  "Symbol": "USDT",
  "Name": "Tether USD",
  "Address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "Blockchain": "Ethereum",
  "Price": 0.99965,
  "PriceYesterday": 0.99982434987863,
  "VolumeYesterdayUSD": 384845260.68563,
  "Time": "2024-07-08T14:03:59Z",
  "Source": "diadata.org",
  "Signature": "0xbd2336471dfd3f08e3607aca39fcccb895e7bce335b8fbf15ae9dec86ae459e632b8d18b96c51a5725a2488f393f9cbf9fce29adf526d4b4a163c8d2cd94d6e701"
}
```

Once the information is retrieved, it is processed and returned via the `setValues` function:

```ts
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
```
This setup ensures that the required data is fetched, processed, and correctly formatted for further use.


Demo W3F: Dia Contract
---------------

- Live on Arbitrum Blueberry
https://app.gelato.network/functions/task/0x4f69b30ba2e26253fd1595e2974e84be91e5f49fc6b7527aadd40aae2ef42a1e:88153591557

Development
---------------

### Testing

> [!WARNING]
> Contracts are not audited by a third-party. Please use at your own discretion.

1. Install project dependencies:
```
yarn install
```

2. Create a `.env` file with your private config:
```
cp .env.example .env
```
You will need to input your `PROVIDER_URL`, your RPC.


3. Test the  web3 function

```
npx hardhat w3f-run Dia --logs
```

### Deployment

1. Deploy the web3 function on IPFS

```
npx hardhat w3f-deploy Dia
```

2. Create the task following the link provided when deploying the web3 to IPFS in our case:

```
 ✓ Web3Function deployed to ipfs.
 ✓ CID: QmV9jDUK7fqfv7iVxybTiskC8Fxjqs93YbFni5ZUAQajap

To create a task that runs your Web3 Function every minute, visit:
> https://app.gelato.network/new-task?cid=QmV9jDUK7fqfv7iVxybTiskC8Fxjqs93YbFni5ZUAQajap
```


### W3F command options

- `--logs` Show internal Web3Function logs
- `--runtime=thread|docker` Use thread if you don't have dockerset up locally (default: thread)
- `--debug` Show Runtime debug messages
- `--chain-id=number` Specify the chainId (default is Sepolia: 11155111)

Example: `npx hardhat w3f-run Dia --logs --debug`
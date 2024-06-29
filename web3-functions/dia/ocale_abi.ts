export const  ORACLE_ABI = [
    {
      inputs: [
        {
          components: [
            { internalType: "string", name: "Symbol", type: "string" },
            { internalType: "address", name: "Address", type: "address" },
            { internalType: "string", name: "Blockchain", type: "string" },
            { internalType: "uint256", name: "Price", type: "uint256" },
            { internalType: "uint256", name: "Time", type: "uint256" },
            { internalType: "bytes", name: "Signature", type: "bytes" },
          ],
          internalType: "struct DIASignedOracleMultiple.Message[]",
          name: "vs",
          type: "tuple[]",
        },
      ],
      name: "setValues",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "", type: "string" }],
      name: "values",
      outputs: [
        { internalType: "string", name: "Symbol", type: "string" },
        { internalType: "address", name: "Address", type: "address" },
        { internalType: "string", name: "Blockchain", type: "string" },
        { internalType: "uint256", name: "Price", type: "uint256" },
        { internalType: "uint256", name: "Time", type: "uint256" },
        { internalType: "bytes", name: "Signature", type: "bytes" },
        { internalType: "uint256", name: "TimeRequest", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            { internalType: "string", name: "Symbol", type: "string" },
            { internalType: "address", name: "Address", type: "address" },
            { internalType: "string", name: "Blockchain", type: "string" },
            { internalType: "uint256", name: "Price", type: "uint256" },
            { internalType: "uint256", name: "Time", type: "uint256" },
            { internalType: "bytes", name: "Signature", type: "bytes" },
          ],
          internalType: "struct DIASignedOracle.Message",
          name: "value",
          type: "tuple",
        },
      ],
      name: "setValue",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "key", type: "string" }],
      name: "getValue",
      outputs: [
        {
          components: [
            { internalType: "string", name: "Symbol", type: "string" },
            { internalType: "address", name: "Address", type: "address" },
            { internalType: "string", name: "Blockchain", type: "string" },
            { internalType: "uint256", name: "Price", type: "uint256" },
            { internalType: "uint256", name: "Time", type: "uint256" },
            { internalType: "bytes", name: "Signature", type: "bytes" },
            { internalType: "uint256", name: "TimeRequest", type: "uint256" },
          ],
          internalType: "struct DIARequestBaseOracle.Message",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
import 'dotenv/config';
import { expect } from '@playwright/test';

// dApp under test
const dAppURL = 'localhost:3000';

// Custom network under test
const networkConfiguration = {
  networkName: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/',
  chainId: '11155111',
  symbol: 'SepoliaETH',
  isTestnet: true
}

Object.assign(global, {
  expect: expect,
  BASE_URL: dAppURL,
  NETWORK: networkConfiguration.networkName,
  SECRET: process.env.secretWordsOrPrivateKey,
  PASSWORD: process.env.password
});

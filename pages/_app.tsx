import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  goerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { siberiumTest } from "../constants";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    goerli,
    siberiumTest
  ],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Full support',
    wallets: [
      metaMaskWallet({ chains, projectId: "479a4bf5d6b096785ccb64db4763b6b1" }),
    ],
  },
]);


const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

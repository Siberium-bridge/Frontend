import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAccount, useNetwork } from 'wagmi'
import {Deposit} from "./Deposit"
import {Withdrawal} from "./Withdrawal"
 

const Home: NextPage = () => {
  // disable ssr
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, [])

  const {isConnected} = useAccount();
  const {chain} = useNetwork();

  if (!hasMounted) return null;
  return (
    <div style={{padding: "10px"}}>
      <Head>
        <title>Siberium Bridge</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <h1>{chain?.id === 5 ? "Goerli ➡️ Siberium Test" : chain?.id === 111000 ? "Siberium Test ➡️ Goerli" : "Siberium Bridge"}</h1><ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      <p>💡 To switch direction change network</p>
      {isConnected ?
        (chain?.id === 5 ? <>
          <Deposit />
        </> : <>
          <Withdrawal />
        </>) : <></>
      }
      </div>
    </div>
  );
};

export default Home;

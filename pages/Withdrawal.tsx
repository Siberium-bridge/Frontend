import { useState } from "react"
import { useAccount } from 'wagmi'
import { erc20ABI, useContractReads, useWaitForTransaction, useContractWrite } from 'wagmi';
import {SUPPORTED_TOKENS, SIBERIUM_TEST_BRIDGE } from "../constants";
import { ABI as siberiumBridgeAbi } from "../abis/siberiumBridge";
import { formatUnits, parseUnits } from 'viem'
import styles from '../styles/Utils.module.css';

export const Withdrawal = () => {
    const { address } = useAccount()
    if (!address) return;

    const supportedTokens = SUPPORTED_TOKENS.siberiumTest;
    const bridgeAddress = SIBERIUM_TEST_BRIDGE;

    const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0)
    const selectedToken = supportedTokens[selectedTokenIdx]

    const [tokenAmount, setTokenAmount] = useState<bigint>(BigInt(0))  
  
    const balances: bigint[] = []
    const {data: balancesData} = useContractReads({
      contracts: supportedTokens.map(token => ({
        address: token.address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address]
      })),
      watch: true,
    })
    const { data: withdrawalData, write: sendWithdrawal } = useContractWrite({
      address: bridgeAddress,
      abi: siberiumBridgeAbi,
      functionName: 'startWithdrawal',
      args: [selectedToken.address, tokenAmount, address]
    })
    const { isLoading: withdrawalIsLoading, isSuccess: withdrawalIsSuccess } = useWaitForTransaction({
      hash: withdrawalData?.hash
    })

    supportedTokens.forEach((token, i) => {
      if (balancesData && balancesData[i].status === "success") {
        balances.push(balancesData[i].result as bigint)
      }
    })

    const couldWithdraw =
      tokenAmount > 0 
      && balances[selectedTokenIdx] >= tokenAmount
      && !withdrawalIsLoading

      return <div>
        <p style={{fontSize: 30}}>I want withdraw 
        <input
          size={formatUnits(tokenAmount, selectedToken.decimals).length}
          autoFocus
          style={{border: "none", textAlign: "right", outline: "none", fontSize: 30}}
            onChange={(e) => setTokenAmount(parseUnits(e.target.value, selectedToken.decimals))}
            value={formatUnits(tokenAmount, selectedToken.decimals)}
          ></input>  
        <select style={{border: "none", fontSize: 30, textDecoration: "underline"}} onChange={(e) => setSelectedTokenIdx(e.target.value as any)} value={selectedTokenIdx}>
            {supportedTokens.map((token, idx) => (
                <option key={token.address} value={idx}>{token.symbol}</option>
            ))}
        </select> from Siberium Testnet</p>
        {balances[selectedTokenIdx] !== undefined ? 
          <div>
            <p style={{fontSize: 30}}>My current {selectedToken.symbol} balance: {formatUnits(balances[selectedTokenIdx], selectedToken.decimals)}</p>
          </div>
        : <></>}
        <div style={{display: "flex"}}>
          <button 
          style={{
            marginRight: "10px",
            marginBottom: "10px",
            backgroundColor: "white",
            width: "200px",
            height: "50px",
            fontSize: 25
          }}
            disabled={!couldWithdraw} onClick={() => sendWithdrawal()}>Withdraw</button>
          {withdrawalIsLoading ? <div className={styles.blink}>🔄</div>: <></>}
        </div>
        {withdrawalIsSuccess ? `TX hash: ${withdrawalData?.hash}` : ""}
        </div>
}
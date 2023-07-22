import { useState, useMemo } from "react"
import { useAccount } from 'wagmi'
import { erc20ABI, useContractReads, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import {SUPPORTED_TOKENS, GOERLI_BRIDGE } from "../constants";
import { ABI as externalBridgeAbi } from "../abis/externalBridge";
import { formatUnits, parseUnits } from 'viem'
import styles from '../styles/Utils.module.css';

export const Deposit = () => {
    const { address } = useAccount()
    if (!address) return;

    const supportedTokens = SUPPORTED_TOKENS.goerli;
    const bridgeAddress = GOERLI_BRIDGE;

    const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0)
    const selectedToken = supportedTokens[selectedTokenIdx]

    const [tokenAmount, setTokenAmount] = useState<bigint>(parseUnits("10", selectedToken.decimals))  
  
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
    const {data: allowance} = useContractRead({
      address: selectedToken.address,
      abi: erc20ABI,
      functionName: "allowance",
      args: [address, bridgeAddress],
      watch: true,
    })
    const { data: approveData,  write: sendApprove } = useContractWrite({
      address: selectedToken.address,
      abi: erc20ABI,
      functionName: 'approve',
      args: [bridgeAddress, tokenAmount]
    })
    const { data: depositData, write: sendDeposit } = useContractWrite({
      address: bridgeAddress,
      abi: externalBridgeAbi,
      functionName: 'startDeposit',
      args: [selectedToken.address, tokenAmount, address]
    })
    const { isLoading: approveIsLoading, isSuccess: approveIsSuccess } = useWaitForTransaction({
      hash: approveData?.hash
    })
    const { isLoading: depositIsLoading, isSuccess: depositIsSuccess } = useWaitForTransaction({
      hash: depositData?.hash
    })

    supportedTokens.forEach((token, i) => {
      if (balancesData && balancesData[i].status === "success") {
        balances.push(balancesData[i].result as bigint)
      }
    })

    const needToApprove = 
      tokenAmount > 0 
      && allowance !== undefined
      && tokenAmount > allowance
      && !approveIsLoading
      && !approveIsSuccess

    const couldDeposit =
      tokenAmount > 0 
      && ((allowance && (allowance >= tokenAmount)) || approveIsSuccess)
      && balances[selectedTokenIdx] >= tokenAmount
      && !depositIsLoading

    return <div>
        <p style={{fontSize: 30}}>I want deposit 
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
        </select> to Siberium Testnet</p>
        {balances[selectedTokenIdx] !== undefined ? 
          <div>
            <p style={{fontSize: 30}}>My current {selectedToken.symbol} balance: {formatUnits(balances[selectedTokenIdx], selectedToken.decimals)}</p>
          </div>
        : <></>}
        <div style={{display: "flex"}}>
          <button style={{
            marginRight: "10px",
            marginBottom: "10px",
            backgroundColor: "white",
            width: "200px",
            height: "50px",
            fontSize: 25
          }} disabled={!needToApprove} onClick={() => sendApprove()}>Approve {selectedToken.symbol}</button> 
          <button 
          style={{
            marginRight: "10px",
            marginBottom: "10px",
            backgroundColor: "white",
            width: "200px",
            height: "50px",
            fontSize: 25
          }}
            disabled={!couldDeposit} onClick={() => sendDeposit()}>Deposit</button>
          {approveIsLoading || depositIsLoading ? <div className={styles.blink}>🔄</div>: <></>}
        </div>
        {depositIsSuccess ? `TX hash: ${depositData?.hash}` : ""}
        </div>
}
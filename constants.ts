import { Chain, Address } from '@wagmi/core'

export const siberiumTest: Chain = {
    id: 111000,
    iconUrl: 'https://raw.githubusercontent.com/Siberium-bridge/Media-kit/main/siberium-logo.webp',
    iconBackground: '#fff',
    name: 'Siberium Testnet',
    network: 'siberium',
    nativeCurrency: {
        decimals: 18,
        name: 'Siberium Coin',
        symbol: 'SIBR',
    },
    rpcUrls: {
        public: { http: ['https://rpc.test.siberium.net'] },
        default: { http: ['https://rpc.test.siberium.net'] },
    },
    blockExplorers: {
        default: { name: 'SnowTrace', url: 'https://siberium.net' },
    },
    testnet: true
}

export interface TokenInfo {
    address: Address;
    decimals: number;
    symbol: string;
}


export const SUPPORTED_TOKENS: {
    [key: string]: TokenInfo[];
} = {
    goerli: [
        {
            address: "0x2E8D98fd126a32362F2Bd8aA427E59a1ec63F780",
            decimals: 6,
            symbol: "USDT"
        },
        {
            address: "0x45AC379F019E48ca5dAC02E54F406F99F5088099",
            decimals: 8,
            symbol: "WBTC"
        },
        {
            address: "0xCCB14936C2E000ED8393A571D15A2672537838Ad",
            decimals: 18,
            symbol: "WETH"
        }
    ],
    siberiumTest: [
        {
            address: "0x3715B40a95DFC12B787194031d575A7790cE36f8",
            decimals: 6,
            symbol: "USDT.e"
        },
        {
            address: "0x7BB176B9E1a1614603968003CE7a6322D62c4632",
            decimals: 8,
            symbol: "WBTC.e"
        },
        {
            address: "0x671e75147afeCaC91c40754044316bAcA98b5b49",
            decimals: 18,
            symbol: "WETH.e"
        }
    ]
}

export const GOERLI_BRIDGE: Address = "0x239eB04C217d63bf4B7cD42C4DeDC64254FD9475"
export const SIBERIUM_TEST_BRIDGE: Address = "0xcDE134ca3dA2a4bf50fe97a5512933A85D0B1Db3"
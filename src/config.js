const dev = {
    network: {
        protocol:'http',
        blockchain:'eos',
        host:'88.99.193.44',
        port: 8888,
        chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        broadcast: true
    },
    tokenName: 'dacccoin',
    accountToName: 'dacccoin',
    userTable: 'accounts',
    gamesTable: 'games',
    abi: [{"constant":false,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"add","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    address: '0x4a706efd42c254f8407712dbbfea668758fe652f'
}

const product = {
    network: {
        protocol:'https', // Defaults to https
        blockchain:'eos',
        host:'nodes.get-scatter.com', // ( or null if endorsed chainId )
        port: 443, // ( or null if defaulting to 80 )
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        broadcast: true
    },
    tokenName: 'dacccoin',
    accountToName: 'dacccoin',
    userTable: 'accounts',
    gamesTable: 'games'
}

export default dev

const exchanges = {

    supported_exchanges: ['NASDAQ', 'NYSE', 'TSX', 'TSX-V'],
    
    supported: (exchange) => supported_exchanges.includes(exchange)
}
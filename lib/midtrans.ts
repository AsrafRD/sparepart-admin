const midtransClient = require('midtrans-client');
// Create Snap API instance
const snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : process.env.NEXT_PUBLIC_ACCESS_SERVER_KEY,
        clientKey : process.env.NEXT_PUBLIC_ACCESS_CLIENT_KEY,
    });

export default snap
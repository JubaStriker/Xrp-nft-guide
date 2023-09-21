const { XummSdk } = require('xumm-sdk')
const Sdk = new XummSdk('2a97b0b3-cc30-48be-8129-45c7f5985721', 'f7952171-6134-4dca-b6e6-19f7e60dc406')
const xrpl = require("xrpl")

const accept = async () => {
    const request = {
        "Account": "rNzHuiEJetmercrQ33UZi5BLA1pNo2cykx",
        "NFTokenSellOffer": "D0043EF8EB309EB1D479E36664D51DBC8AE2ACA668060F6F9F8C2C14A8CCCFC8",
        "TransactionType": "NFTokenAcceptOffer"
    }

    const subscription = await Sdk.payload.createAndSubscribe(request, event => {
        // console.log('New payload event',event.data)  
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }
    })
    console.log('sign request URL', subscription.created.next.always)
    console.log('Pushed ', subscription.created.pushed ? 'Yes' : 'No')

    const resolveData = await subscription.resolved
    if (resolveData.signed == false) {
        console.log('The sign request was rejected!')
    }
    else {
        console.log('The sign request was Signed!!')
        const result = await Sdk.payload.get(resolveData.payload_uuidv4)
        // console.log('User_token: ', result.application)
        // console.log("Result", result);
        // console.log("txid", resolveData);
        txid = resolveData.txid;

        if (txid) {
            try {
                console.log(String(txid));
                // const result = await txInfo(txid);
                // console.log(result.meta.nftoken_id);

                const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
                await client.connect();

                const response = await client.request({
                    "id": 1,
                    "command": "tx",
                    "transaction": String(txid),
                    "binary": false
                })
                console.log(response.result.meta)
                return response;
            }
            catch (e) {
                console.log(e);
            }

        }
    }
}

accept();
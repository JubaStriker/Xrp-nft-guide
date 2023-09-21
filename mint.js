const { XummSdk } = require('xumm-sdk')
const Sdk = new XummSdk('2a97b0b3-cc30-48be-8129-45c7f5985721', 'f7952171-6134-4dca-b6e6-19f7e60dc406')
const xrpl = require("xrpl")

const mint = async () => {
    let txid;
    const request = {
        "TransactionType": "NFTokenMint",
        "Account": "rNPPJe3wEoHxxfmxSRgcuVe8Hu2AFhRzfe",
        "TransferFee": 1,
        "NFTokenTaxon": 0,
        "Flags": 8,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "Destination": "rNzHuiEJetmercrQ33UZi5BLA1pNo2cykx",
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

// const txInfo = async () => {
//     const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
//     await client.connect();

//     const response = await client.request({
//         "id": 1,
//         "command": "tx",
//         "transaction": "5BA4CA77EDEC6A560FC325B23746BCC55C177CFDBF56980D8FC8DB41F4436C59",
//         "binary": false
//     })
//     console.log(response)
//     return response;
// }

mint();

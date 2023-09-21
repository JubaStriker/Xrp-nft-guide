const { XummSdk } = require('xumm-sdk')
const Sdk = new XummSdk('2a97b0b3-cc30-48be-8129-45c7f5985721', 'f7952171-6134-4dca-b6e6-19f7e60dc406')
const xrpl = require("xrpl")

const mint = async () => {

    // const request = {
    //     "TransactionType": "NFTokenMint",
    //     "Account": "rNPPJe3wEoHxxfmxSRgcuVe8Hu2AFhRzfe",
    //     "TransferFee": 314,
    //     "NFTokenTaxon": 0,
    //     "Flags": 8,
    //     "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
    //     "Destination": "rNzHuiEJetmercrQ33UZi5BLA1pNo2cykx",
    // }



    // const request = {
    //     "TransactionType": "NFTokenCreateOffer",
    //     "Account": "rNPPJe3wEoHxxfmxSRgcuVe8Hu2AFhRzfe",
    //     "NFTokenID": "0008013A92D567A7EC38CEF1870F7B844255ABF07C30603ECE1462A400000009",
    //     "Amount": "0",
    //     "Flags": 1
    // }


    const request = {
        "Account": "rNzHuiEJetmercrQ33UZi5BLA1pNo2cykx",
        "NFTokenSellOffer": "7A86293B34826EBD0884629F3AB88433B3D98F7C00181AE1A44C47C216DC35BC",
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
        console.log('User_token: ', result.application)
        console.log("Result", result);
        console.log("Resolved", resolveData);
    }
}

const txInfo = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect();

    // 
    // 672059B179C4CAA802BFE083EC86738A03FFDE43ECEB3E32F0ECB0E18CE702D6
    const response = await client.request({
        "id": 1,
        "command": "tx",
        "transaction": "EB4374EF7D7E597D6AFD17B149F032EB329401C232E8854FC14933482DDDC27B",
        "binary": false
    })
    console.log(response)
    return response.result.meta.nftoken_id;
}


mint()
// txInfo();


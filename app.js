const express = require('express')
const engines = require('consolidate')
const app = express()
const paypal = require('paypal-rest-sdk')
const url = require('url');
app.engine("ejs", engines.ejs)
app.set("views", "./views")
app.set('view engine', "ejs")

// app.use(express.bodyParser())


paypal.configure({
    // mode: "live", //sandbox or live
    mode: "sandbox", //sandbox or live
    // sandbox
    // client_id:
    //     "AcNrbRLHkjIC1DAGVtsuLtfFv98xDGmwSR3qcXGa8CNZmk6B1xVR5xVRU7GlgdWra2dlGMaxaqUu7WtZ",
    // client_secret:
    //     "EEnM-jFF9GBo2DYEfB5k8pQ9rPvcvb8KEWsIHKKPBPRACQGvQJqVWdR7rl-iiqllzrHepGFCN_MmMuCd"
    // client_id:
    //     "ATtpX_XcKokVxQcJ4A7qJDPZOHNJ3Ubutk1FdffDwoxfePRDSySAWqNFJfzSslKXbD5jXlAe2OU1hXfK",
    // client_secret:
    //     "EF6bng4PWforLh5hvUE1w0yYCJeHY18G0Jnsr0ngXIgCAk3yOlaRPYBRkZQSfGlr9lw9qJmKN7RvsZow"
    // //osamamostafa2@hotmail.com
    // client_id:
    //     "AbKourJdVJI4_0K4c9JnGJVjDgkI8xdSDZPN6jZSX14skT-m6AuBnitA8fYm2OuRmVg9p6Ehn6F2pPUJ",
    // client_secret:
    //     "EOA-22hMkZp5MGfqmQmJ8C_XIsHKA3UxvoxkVfIhjXWYyep9Z6ukxm52V-8Dxt6oRtxunQa9bak5aGOB"

    //talabat elsokhna@gmail.com  live
    // client_id:
    //     "AQNW60heH6q0o0xiWXi1258k1lD7WoyFBObsY7T31zxRoWsWN580PPTE3HWCjycIlLKnSRhdWH2EFgYS",
    // client_secret:
    //     "ENyb-RIswDw4J_rifoUyoIUgx0B1rR0QnFUIioRl2vd5ntRVuCUw27M55Rde6wMnGZtEfHNauFXLWjwP"

    // talabat elsokhna@gmail.com  sandbox
    client_id:
        // "AXEw8jxEyZCFxAVRSCRlogsY0EV6sNB2JzfrGcO_Dbxn1LWGGlvmT9e9qYmw9ZtcjZ5NxEiXKa58wUk3",
        "ARtr60ewUOBJTJikSSBn-eB9GrJDfd4UHOJGlUx0mBzM7LHD77cP2BloTCSrpKYtSjfGC7mWbqmNRbU8",
    client_secret:
        "EPfx4GGO44iSvaZypq-fx0wF10xoQRTZAWEkfsftufYre37D12WmBRUjzunUUmXe3lgB-ByAMX-tWLvz"
        // "EGR4UNqWgc6HWU_F6SQNm0FnF7ZMiHzXjTWw_Rz02_BQcUvFNOJ4lj6HgJjCBUcWxhXSZPjC-9hWKhwg"


});

app.get("/", (req, res) => {
    res.render("index");
})

app.get('/osama',async(req,res) => {
    console.log('hello')
    let page = req.query.page;
    console.log(page)
    res.send('success')
})
app.post("/paypal", (req, res) => {
    console.log('paypal router')
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: ".20",
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: ".20"
                },
                description: "123456789",
                // greeting:"hello worldddddddddddd",
            }
        ]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
            // for(let i = 0;i<payment.links.length;i++){
            //     if(payment.links[i].rel === 'approval_url'){
            //         res.redirect(payment.links[i].href)
            //     }
            // }
        }
    });
});

app.get("/success", (req, res) => {
    console.log('success router ++++++++++++++++++++++++++++++++++++++++++++++++++++')
    // res.send("Success");
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: ".20"
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("successfully");
        }
    });
});

app.get("cancel", (req, res) => {
    res.render("cancel");
});

app.listen(3000,() => {
    console.log('start server')
})  
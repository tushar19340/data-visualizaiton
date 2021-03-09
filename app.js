var express = require("express"),
app 	        = express(),
ejs             = require("ejs");
const request   = require('request'),
bodyParser 		= require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){

    var data;
    request("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=30&page=1&sparkline=false", {json: true}, function(error, response, body){
        if(error){
            console.log(error);
            res.redirect("back");
        }else{
            if(response && response.statusCode){
                console.log(body);
                data = body;
                res.render("index", {data: data});
            }
        }
    });


});

app.get("/graphs/:currency", function(req, res){
    var data;
    var currency = req.params.currency.toLowerCase();
    console.log(currency);

    request("https://api.coingecko.com/api/v3/coins/" + currency + "/market_chart?vs_currency=inr&days=90&interval=daily", {json: true}, function(error, response, body){
        if(error){
            console.log(error);
            res.redirect("back");
        }else{
            if(response && response.statusCode){
                data = body;
                // console.log(body.prices);
                var prices = [];
                var market_caps = [];
                for(let i = 0; i < data.prices.length; i++){
                    prices.push(data.prices[i][1]);
                }
                console.log(prices);
                prices = prices.reverse();
                // for(let i = 0; i < data.market_caps.length; i++){
                //     market_caps.push(data.market_caps[i][0]);
                // }
                // console.log("market cap");
                // console.log(market_caps);
                res.render("graphs", {currency: currency, prices: prices});
            }
        }
    });


});






var server = app.listen(process.env.PORT || 3000, function(){
    var port = server.address().port;
    console.log("The server has started on port " + port);
})
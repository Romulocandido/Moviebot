// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var unirest = require("unirest");
let errorResposne = {
    results: []
};
var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/getMovies',function (request,response)  {
    if(request.body.queryResult.parameters['top-rated']) {
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/top_rated");
            req.query({
                "page": "1",
                "language": "pt-BR",
                "api_key": "95af1e4cfe2cfa63a452d0a8545ff5a2"
            });
            req.send("{}");
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "source": "EchoService",
                        "fulfillmentText" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.results.length > 0) {
                    let result = res.body.results;
                    let output = '';
                    for(let i = 0; i<result.length;i++) {
                        output += result[i].title;
                        output+="\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "source": "EchoService",
                        "fulfillmentText" : output
                    })); 
                }
            });
    } else if(request.body.queryResult.parameters['movie-name']) {
     //   console.log('popular-movies param found');
        let movie = request.body.queryResult.parameters['movie-name'];
        var req = unirest("GET", "https://api.themoviedb.org/3/search/movie");
            req.query({
                "include_adult": "false",
                "page": "1",
                "query":movie,
                "language": "pt-BR",
                "api_key": "95af1e4cfe2cfa63a452d0a8545ff5a2"
            });
            req.send("{}");
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "source": "EchoService",
                        "fulfillmentText" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.results.length > 0) {
                let result = res.body.results[0];
                let output = "Average Rating : " + result.vote_average + 
                "\n Plot : " + result.overview + "url" + result.poster_path
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "source": "EchoService",
                        "fulfillmentText" : output
                    }));
                } else {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "source": "EchoService",
                        "fulfillmentText" : "Couldn't find any deatails. :(  "
                    }));
                }
            });

    } else if(request.body.queryResult.parameters['popular-movies']) {    
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/popular");
            req.query({
                "page": "1",
                "language": "pt-BR",
                "api_key": "95af1e4cfe2cfa63a452d0a8545ff5a2"
            });
            req.send("{}");
            req.end(function(res){
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "source": "EchoService",
                        "fulfillmentText" : "Error. Can you try it again ? "
                    }));
                } else {
                    let result = res.body.results;
                    let output = '';
                    for(let i = 0; i < result.length;i++) {
                        output += result[i].title;
                        output+="\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                         "source": "EchoService",
                        "fulfillmentText" : output
                    })); 
                }
            });
    }
});
server.get('/getName',function (req,res){
    res.send('Swarup Bam');
});
server.listen(port, function () {
    console.log("Server is up and running...");
});
const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const {register, login} = require("./functions")
http.createServer((req, res) => {
    if(req.url === "/" && req.method === "GET") {
        res.writeHead(200, {"Content-Type" : "text/html"});
        fs.readFile("index.html", (error, data) => {
            if(error) {
                res.writeHead(503, {"Content-Type" : "text/plain"});
                return res.end("Can't read file!")
            }else{
                res.writeHead(200, {"Content-Type" : "text/html"});
                res.end(data);
            }
        })
    }else if(req.url === "/register" && req.method === "POST") {
        let body = '';

        req.on("data", chunks => {
            body += chunks;
        })

        req.on("end", () => {
            const formData = qs.parse(body);
            const username = formData.username;
            const password = formData.password;
            const user = register(username, password);
            if(user.error) {
                res.writeHead(503, {"Content-Type" : "text/plain"});
                return res.end(user.error);
            }else{
                // console.log(username, password);
                const date = new Date();
                let message = `${user.user.username} has been registered at ${date.toLocaleString('en-US', {hour12:false, timeZone: 'Asia/Kolkata'})} \n`;
                fs.appendFile("logs.txt", message, (error) => {
                    if(error) console.log(error);
                })
                res.writeHead(200, {"Content-Type" : "text/html"});
                return res.end("Registered!");
            }

        })

    }else if(req.url === "/login" && req.method === "POST") {
        let body = "";
        req.on("data", chunks => {
            body += chunks;
        })

        req.on("end", () => {
            const formData = qs.parse(body);
            const username = formData.username;
            const password = formData.password;
            const user = login(username, password);
            if(user.error) {
                res.writeHead(503, {"Content-Type" : "text/plain"});
                return res.end(user.error);
            }else{
                const date = new Date();
                let message =  `${user.user.username} logged in at ${date.toLocaleString('en-US', {hour12:false, timeZone:'Asia/Kolkata'})} \n`;
                fs.appendFile("logs.txt", message, function(error){
                    if(error) console.log(error);
                });
                res.writeHead(200, {"Content-Type" : "text/plain"});
                return res.end(user.user.username);
            }
        })
    }
    else{
        res.writeHead(404, {"Content-Type" : "text/plain"});
        return res.end("Invalid route!")
    }
}).listen(3000, () => console.log("Server running on 3000 port"));
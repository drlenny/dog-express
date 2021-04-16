const http = require('http');
const express = require('express');
const app = express();
const es6Renderer = require('express-es6-template-engine');

const db = require('./db');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);

app.get('/', (req, res) => {
    console.log(req.url);
    res.render('home', {
        locals: {
            title: "Home Page"
        },
        partials: {
            head: '/partials/head'
        }
    });
});

app.get('/dogs', (req, res) => {
    // console.log('request path is: ' + req.path);
    res.render('dogs', {
        locals: {
            dogs: db,
            path: req.path,
            title: "Dogs List"
        },
        partials: {
            head: '/partials/head'
        }
    })
    // res.send("Testing Dogs")
});

app.get('/dogs/:breed', (req, res) => {
    console.log(req.params.breed);
    var {breed} = req.params;
    var dog = db.find(thisDog => thisDog.breed === breed);

    if (dog){
        console.log(dog);

        res.render('dog', {
            locals: {
                dog,
                title: "Dog",
            },
            partials: {
                head: '/partials/head',
                image: '/partials/image'
            }
        })
    }
})


server.listen(3000, () => {
    console.log(`Server running on localhost 3000`);
})
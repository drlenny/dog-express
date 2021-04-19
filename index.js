const http = require('http');
const express = require('express');
const app = express();
const es6Renderer = require('express-es6-template-engine');

const db = require('./db');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const morgan = require('morgan');
const logger = morgan('tiny');
app.use(logger);

const fetch = require('node-fetch');

const server = http.createServer(app);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

const helmet = require('helmet');
app.use(helmet());

app.use(express.static('public'));

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

app.get('/dogs/:breed', async (req, res) => {
    console.log(req.params.breed);
    var { breed } = req.params;
    var dog = db.find((thisDog) => thisDog.breed === breed);

    if (dog) {
        console.log(dog);

        var pic = await fetch(`https://dog.ceo/api/breed/${dog.breed}/images/random`)
            .then(res => res.json());

        console.log(pic.message);

        dog.image = pic.message

        res.render('dog.html', {
            locals: {
                dog,
                title: "Dog",
            },
            partials: {
                head: '/partials/head',
                image: '/partials/image'
            }
        })
    } else {
        res.status(404)
            .send(`No dog found`)
    }

})


server.listen(3000, () => {
    console.log(`Server running on localhost 3000`);
})
import React from 'react';
import path from "path";
//import {StaticRouter} from "react-router";
//import {routes} from "../index";
import VoteController from 'vote-ssr-react/src/components/VoteController';
import ReactDOMServer from 'react-dom/server';
//import { renderRoute } from './renderRoutes';
const express = require('express');
//const cors = require('cors');
//const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 4000;
let voteId = 2;

const allVotes = [
    {
        id: 'vote_1',
        title: 'How is your day?',
        description: 'Tell me: how has your day been so far?',
        choices: [
            {id: 'choice_1', title: 'Good', count: 7},
            {id: 'choice_2', title: 'Bad', count: 12},
            {id: 'choice_3', title: 'Not sure yet', count: 1}
        ]
    },
    {
        id: 'vote_2',
        title: 'Programming languages',
        description: 'What is your preferred language?',
        choices: [
            {id: 'choice_1', title: 'JavaScript', count: 4},
            {id: 'choice_2', title: 'C++', count: 5},
            {id: 'choice_3', title: 'Plain english', count: 11}
        ]
    }
];

function renderFullPage(html, initialData) {
    return `
    <html lang="en">
      <head>
        <link rel="stylesheet" href="tetra.css" />
        <title>Server Site</title>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialData)}
      </script>
      <!--<script type="text/javascript" src="dist/bundle.js"></script>-->
    </html>`;
}


//app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'vote-ssr-react/src')));

app.get('/api/votes', (req, res, next) => {
    res.send(allVotes);
    next();
});

app.get('/api/votes/:voteId', (req, res, next) => {
    const voteId = req.params['voteId'].toString();
    const index = allVotes.findIndex(elem => {
        return elem.id === voteId;
    });
    //console.log(voteId);
    //console.log(allVotes[index]);
    res.send(allVotes[index]);
    next();
});

app.put('/api/votes/:voteId/choices/:choiceId/vote', (req, res, next) => {
    const voteId = req.params['voteId'].toString();
    const choiceId = req.params['choiceId'].toString();
    let vote = {};
    allVotes.forEach(elem => {
        if (elem.id === voteId) {
            elem.choices.forEach(choice => {
                if (choice.id === choiceId) {
                    choice.count += 1;
                    vote = choice;
                    // forEach no break available
                }
            });
        }
    });
    next();
});

app.post('/api/votes/:vote', (req, res, next) => {
    let voteWithoutId = req.body;
    voteId++;
    const vote = {id: `vote_${voteId}`, ...voteWithoutId};
    allVotes.push(vote);
    next();
});


app.get('/votes', (req, res) => {
    //renderRoute(req,res);

    const html = ReactDOMServer.renderToString(<VoteController />);
    console.log(html);
    res.send(renderFullPage(html));

});

app.get('/votes/{voteId}', (req, res) => {
    //renderRoute(req, res);
});


app.listen(PORT, () => {
    console.log('Server is listening');
});

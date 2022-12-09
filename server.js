const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public.index.html'))
})

app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, './public.index.css'))
})

app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, './public.index.js'))
})

// const { drawBtn } = require('./public')
// const { choicesDiv } = require('./public/main.js')
// const { compDuoDiv } = require('./public/main.js')
// const { playerDuoDiv } = require('./public/main.js')
// const { seeAllBtn } = require('./public/main.js')
// const { allBotsDiv } = require('./public/main.js')
// const { duelBtn } = require('./public/main.js')
// const { resultsText } = require('./public/main.js')
// const { playAgainBtn } = require('./public/main.js')
// const { winsText } = require('./public/main.js')
// const { lossesTest } = require('./public/main.js')
// const { chooseHeader } = require('./public/main.js')

// app.get("/api/drawButton", drawBtn)
// app.get("/api/choices", choicesDiv)
// app.get("/api/compDuo", compDuoDiv)
// app.get("/api/playerDuo", playerDuoDiv)
// app.get("/api/seeAll", seeAllBtn)
// app.get("/api/allBots", allBotsDiv)
// app.get("/api/duelBtn", duelBtn)
// app.get("/api/resultsText", resultsText)
// app.get("/api/playAgain", playAgainBtn)
// app.get("/api/winsText", winsText)
// app.get("/api/lossesTest", lossesTest)
// app.get("/api/chooseHeader", chooseHeader)

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

app.listen(4000, () => {
  console.log(`Listening on 4000`)
})
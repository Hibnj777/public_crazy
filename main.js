const { vk, getVkNameById, questionManager, idByDomain } = require('./VK')

const { mainMenu, persMenu, check, exchange, profile } = require('./keyboard')

const { User, Game } = require('./db')

const { api } = vk

const { commandManager } = require('./crazytime')
const { lsmanager } = require('./lsbota')

vk.updates.use(questionManager.middleware);

setInterval(async () => {
    let date = new Date()
    console.log(`${date.getDate()}:${date.getHours()}:${date.getMinutes()}`)
    if (`${date.getDate()}:${date.getHours()}:${date.getMinutes()}` == `1:21:35`) {
        console.log(`${date.getDate()}:${date.getHours()}:${date.getMinutes()}`)
        const toppers = await User.find({ topmonth: { $gt: 0 } }).sort({ topmonth: -1 })

        if (toppers[0]) {
            toppers[0].money += 10000000
            await toppers[0].save()
        }
        if (toppers[1]) {
            toppers[1].money += 5000000
            await toppers[1].save()
        }
        if (toppers[2]) {
            toppers[2].money += 2500000
            await toppers[2].save()
        }
        if (toppers[3]) {
            toppers[3].money += 1500000
            await toppers[3].save()
        }
        if (toppers[4]) {
            toppers[4].money += 1000000
            await toppers[4].save()
        }
        if (toppers[5]) {
            toppers[5].money += 750000
            await toppers[5].save()
        }
        if (toppers[6]) {
            toppers[6].money += 500000
            await toppers[6].save()
        }
        if (toppers[7]) {
            toppers[7].money += 250000
            await toppers[7].save()
        }
        if (toppers[8]) {
            toppers[8].money += 100000
            await toppers[8].save()
        }
        if (toppers[9]) {
            toppers[9].money += 50000
            toppers[9].save()
        }

        for (i in toppers) {
            toppers[i].topmonth = 0
            await toppers[i].save()
        }
    }
}, 60000);

setInterval(async () => {
    let date = new Date()
    console.log(`${date.getHours()}:${date.getMinutes()}`)
    if (`${date.getHours()}:${date.getMinutes()}` == `21:35`) {
        console.log(`${date.getHours()}:${date.getMinutes()}`)
        const toppers = await User.find({ topday: { $gt: 0 } }).sort({ topday: -1 })

        if (toppers[0]) {
            toppers[0].money += 1000000
            await toppers[0].save()
        }
        if (toppers[1]) {
            toppers[1].money += 750000
            await toppers[1].save()
        }
        if (toppers[2]) {
            toppers[2].money += 500000
            await toppers[2].save()
        }
        if (toppers[3]) {
            toppers[3].money += 250000
            await toppers[3].save()
        }
        if (toppers[4]) {
            toppers[4].money += 100000
            await toppers[4].save()
        }
        if (toppers[5]) {
            toppers[5].money += 50000
            await toppers[5].save()
        }
        if (toppers[6]) {
            toppers[6].money += 30000
            await toppers[6].save()
        }
        if (toppers[7]) {
            toppers[7].money += 25000
            await toppers[7].save()
        }
        if (toppers[8]) {
            toppers[8].money += 15000
            await toppers[8].save()
        }
        if (toppers[9]) {
            toppers[9].money += 5000
            toppers[9].save()
        }

        for (i in toppers) {
            toppers[i].topday = 0
            toppers[i].save()
        }
    }
}, 60000);

vk.updates.on('message_new', async (msg) => {
    const name = await getVkNameById(msg.senderId)
    const findUser = await User.findOne({ id: msg.senderId });
    if (msg.isChat && !findUser) {
        msg.send(`Эй, новенький, вот клавиатура:`,
            {
                keyboard: mainMenu
            })

        const newUser = new User({
            id: msg.senderId,
            nick: name,
            money: 200,
        })

        newUser.save((error) => {

            if (error) {
                return res.statusCode(500).send('Internal Server Error');
            }

        });
    }
    if (msg.isChat && findUser) {
        if (msg.text.includes('/клавиатура')) {
            return msg.send(`клавиатура включена!`,
                {
                    keyboard: mainMenu
                })
        }
        if (msg.text.includes('/создать игру')) {
            if (findUser.owner > 3) {
                const newGame = new Game({
                    id: 1,
                    bank: 0,
                    players: 0,
                    x1: 0,
                    x2: 0,
                    x5: 0,
                    x10: 0,
                    coinfl: 0,
                    pachi: 0,
                    cash: 0,
                    plays: 6,
                    crazy: 0
                })

                newGame.save((error) => {

                    if (error) {
                        return res.statusCode(500).send('Internal Server Error');
                    }

                });

                return msg.send(`игра создана.`)
            }
        }
        else {
            commandManager(msg)
        }
    }
    if (!msg.isChat && !findUser) {
        const newUser = new User({
            id: msg.senderId,
            nick: name,
            money: 200,
        })

        newUser.save((error) => {

            if (error) {
                return res.statusCode(500).send('Internal Server Error');
            }

        });

        return msg.send(`Привет, ${name}, вот мои функции:`,
            {
                keyboard: persMenu
            })
    }
    if(!msg.isChat && findUser) {
        if (msg.text.includes('/клавиатура')) {
            return msg.send('клавиатура включена!',
                {
                    keyboard: persMenu
                })
        }
        else {
            lsmanager(msg)
        }
    }
})

console.log('Бот был запущен!');
vk.updates.start().catch(console.error);
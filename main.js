const { vk, getVkNameById, questionManager, idByDomain } = require('./VK')

const { mainMenu, persMenu, admpanel } = require('./keyboard')

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

        const award = [10000000, 5000000, 2500000, 1500000, 1000000, 750000, 500000, 250000, 100000, 50000]

        for (let pos = 0; pos <= toppers.length; pos++) {
            toppers[pos].money += award[pos]
            toppers[pos].save()
        }

        const sbros = await User.updateMany({ topmonth: { $gt: 0 } }, { topmonth: 0 })
    }
}, 60000);

setInterval(async () => {
    let date = new Date()
    console.log(`${date.getHours()}:${date.getMinutes()}`)
    if (`${date.getHours()}:${date.getMinutes()}` == `21:35`) {
        console.log(`${date.getHours()}:${date.getMinutes()}`)
        const toppers = await User.find({ topday: { $gt: 0 } }).sort({ topday: -1 })

        const award = [1000000, 750000, 500000, 250000, 100000, 50000, 30000, 25000, 15000, 5000]

        for (let pos = 0; pos <= toppers.length; pos++) {
            toppers[pos].money += award[pos]
            toppers[pos].save()
        }

        const sbros = await User.updateMany({ topday: { $gt: 0 } }, { topday: 0 })

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
    if (!msg.isChat && findUser) {
        if (msg.text.includes('/клавиатура')) {
            return msg.send('клавиатура включена!',
                {
                    keyboard: persMenu
                })
        }
        if (msg.text == '/админ-панель') {
            if (findUser.owner > 0) {
                return msg.send('админ-панель:', {
                    keyboard: admpanel
                })
            } else {
                return msg.send(`доступ запрещён`)
            }
        }
        else {
            if(msg.messagePayload.command == 'checkct' || msg.messagePayload.command == 'givemoney' || msg.messagePayload.command == 'tozero') {
                commandManager(msg)
            }
            lsmanager(msg)
        }
    }
})

console.log('Бот был запущен!');
vk.updates.start().catch(console.error);
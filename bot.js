const { vk, getVkNameById, questionManager, idByDomain } = require('./VK')

const { mainMenu } = require('./keyboard')

const { User, Game } = require('./db')

const { api } = vk

const { isNumeric } = require('./tools')

const md5 = require('md5');

vk.updates.use(questionManager.middleware);

const ishods = ['x1', 'x2', 'x5', 'x10', 'coinfl', 'pachi', 'cash', 'crazy']

const low = ['x1', 'x2']

const medium = ['x5', 'coinfl', 'pachi']

const high = ['cash', 'crazy', 'x10']

const dopishods = ['x2', 'x5', 'x10', 'x3', 'x4', 'x7', 'x15', 'x20', 'x25', 'x100', 'x50', 'x200']

const cf = [1, 2, 3, 4, 5, 6, 7, 10, 20, 30, 40, 50]

const pachi = [3, 4, 60, 2, 5, 10, 30, 70, 40, 25, 15, 50, 100, 7, 1, 20]

const crazy = [100, 1000, 50, 20, 10, 3, 2, 5, 7, 12, 25, 30, 40, 60, 75, 11, 8, 120, 500]

let ishod = 'none'

let dopishod = 'none'

let kudadopishod = 'none'

var winners = []

let kf = 0

vk.updates.on('message_new', async (msg) => {
    const name = await getVkNameById(msg.senderId)
    const findUser = await User.findOne({ id: msg.senderId });
    console.log(msg)
    if (msg.isChat) {
        if (!findUser) { // ТУТ ДО КОМАНДЫ ПОПОЛНИТЬ ИДЁТ ИГРА КРЕЙЗИТАЙМ
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

        } else if (msg.text.includes('/клавиатура')) {
            return msg.send(`клавиатура включена!`,
                {
                    keyboard: mainMenu
                })
        } else if (msg.text.includes('/создать игру')) {
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

                setInterval(() => {
                    let random = Math.floor(Math.random() * 10)

                    if (random < 6) {
                        ishod = low[Math.floor(Math.random() * low.length)]
                    }
                    else if (random > 5 && random < 10) {
                        ishod = medium[Math.floor(Math.random() * medium.length)]
                    }
                    else if (random > 9) {
                        ishod = high[Math.floor(Math.random() * high.length)]
                    }
                }, 30000);

                return msg.send(`игра создана.`)
            }
        } else if (msg.messagePayload.command == 'balance') {
            if (findUser.stavka == 'none') {
                return msg.send(`💰 ${name}, Ваш баланс: ${new Intl.NumberFormat('ru-RU').format(findUser.money)} MK`)
            } else {
                return msg.send(`У вас стоит ставка, просмотр баланса недоступен.`)
            }
        } else if (msg.messagePayload.command == 'bank') {
            const game = await Game.findOne({ id: 1 })
            const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
            let x1 = []
            let x2 = []
            let x5 = []
            let x10 = []
            let coinfl = []
            let pachi = []
            let cash = []
            let crazy = []
            for (i in user_x1) {
                if (!x1.includes(`[id${user_x1[i].id}|${user_x1[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x1[i].razmer_stavka)} MK`)) {
                    x1.push(`[id${user_x1[i].id}|${user_x1[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x1[i].razmer_stavka)} MK`)
                }
            }
            for (i in user_x2) {
                if (!x2.includes(`[id${user_x2[i].id}|${user_x2[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x2[i].razmer_stavka)} MK`)) {
                    x2.push(`[id${user_x2[i].id}|${user_x2[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x2[i].razmer_stavka)} MK`)
                }
            }
            for (i in user_x5) {
                if (!x5.includes(`[id${user_x5[i].id}|${user_x5[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x5[i].razmer_stavka)} MK`)) {
                    x5.push(`[id${user_x5[i].id}|${user_x5[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x5[i].razmer_stavka)} MK`)
                }
            }
            for (i in user_x10) {
                if (!x10.includes(`[id${user_x10[i].id}|${user_x10[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x10[i].razmer_stavka)} MK`)) {
                    x10.push(`[id${user_x10[i].id}|${user_x10[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_x10[i].razmer_stavka)} MK`)
                }
            }
            for (i in user_coinfl) {
                if (!coinfl.includes(`[id${user_coinfl[i].id}|${user_coinfl[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_coinfl[i].razmer_stavka)} MK`)) {
                    coinfl.push(`[id${user_coinfl[i].id}|${user_coinfl[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_coinfl[i].razmer_stavka)} MK`)
                }
            }
            for (i in user_pachi) {
                if (!pachi.includes(`[id${user_pachi[i].id}|${user_pachi[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_pachi[i].razmer_stavka)} MK`)) {
                    pachi.push(`[id${user_pachi[i].id}|${user_pachi[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_pachi[i].razmer_stavka)} MK`)
                }
            }
            for (i in user_cash) {
                if (!cash.includes(`[id${user_cash[i].id}|${user_cash[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_cash[i].razmer_stavka)} MK`)) {
                    cash.push(`[id${user_cash[i].id}|${user_cash[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_cash[i].razmer_stavka)} MK`)
                }
            }
            for (i in user_crazy) {
                if (!crazy.includes(`[id${user_crazy[i].id}|${user_crazy[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_crazy[i].razmer_stavka)} MK`)) {
                    crazy.push(`[id${user_crazy[i].id}|${user_crazy[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(user_crazy[i].razmer_stavka)} MK`)
                }
            }

            let private = md5(`${msg.peerId}|${game.plays}`)

            if (game.players == 0) {
                return msg.send(`Ни одной ставки не обнаружено.`)
            } else {
                return msg.send(`Всего поставлено: ${new Intl.NumberFormat('ru-RU').format(game.bank)} MK\n\n${(game.x1 > 0 && x1.length > 0) ? 'Ставки на x1:' : ''}\n${x1.join('\n')}\n\n${(game.x2 > 0 && x2.length > 0) ? 'Ставки на x2:' : ''}\n${x2.join('\n')}\n\n${(game.x5 > 0 && x5.length > 0) ? 'Ставки на x5:' : ''}\n${x5.join('\n')}\n\n${(game.x10 > 0 && x10.length > 0) ? 'Ставки на x10:' : ''}\n${x10.join('\n')}\n\n${(game.coinfl > 0 && coinfl.length > 0) ? 'Ставки на COINFLIP:' : ''}\n${coinfl.join('\n')}\n\n${(game.pachi > 0 && pachi.length > 0) ? 'Ставки на PACHINKO:' : ''}\n${pachi.join('\n')}\n\n${(game.cash > 0 && cash.length > 0) ? 'Ставки на CASHHUNT:' : ''}\n${cash.join('\n')}\n\n${(game.crazy > 0 && crazy.length > 0) ? 'Ставки на CRAZYTIME:' : ''}\n${crazy.join('\n')}\n\nДо конца раунда: ${(Math.trunc((game.dater - Date.now()) / 1000) > 0) ? `${Math.trunc((game.dater - Date.now()) / 1000)}` : ''} сек.\n\n${game.dater != 0 ? `hash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}` : ''}`)
            }
        } else if (msg.messagePayload.command == 'x1') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на x1:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.x1 += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }

                    }


                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }
                    console.log(kf)
                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]
                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {
                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            winners = []
                            kf = 0
                            return ishod = 'none'
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'x1'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на x1.`)
                }
            }
        } else if (msg.messagePayload.command == 'x2') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на x2:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.x2 += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }


                    }


                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }
                    console.log(kf)

                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]

                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {
                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            ishod = 'none'
                            kf = 0
                            return winners = []
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'x2'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на x2.`)
                }
            }
        } else if (msg.messagePayload.command == 'x5') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на x5:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.x5 += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }

                    }


                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }
                    console.log(kf)

                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]

                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {

                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            ishod = 'none'
                            kf = 0
                            return winners = []
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'x5'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на x5.`)
                }
            }
        } else if (msg.messagePayload.command == 'x10') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на x10:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.x10 += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }


                    }


                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }

                    console.log(kf)

                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]

                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {
                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            ishod = 'none'
                            kf = 0
                            return winners = []
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'x10'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на x10.`)
                }
            }
        } else if (msg.messagePayload.command == 'cf') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на COINFLIP:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.coinfl += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }


                    }

                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }

                    console.log(kf)

                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]

                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {
                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            ishod = 'none'
                            kf = 0
                            return winners = []
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'coinfl'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на COINFLIP.`)
                }
            }
        } else if (msg.messagePayload.command == 'pach') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на PACHINKO:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.pachi += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }


                    }

                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }

                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]

                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {
                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            ishod = 'none'
                            kf = 0
                            return winners = []
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'pachi'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на PACHINKO.`)
                }
            }
        } else if (msg.messagePayload.command == 'ch') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на CASHHUNT:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.cash += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }


                    }



                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }

                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]

                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {
                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            ishod = 'none'
                            kf = 0
                            return winners = []
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'cash'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на CASHHUNT.`)
                }
            }
        } else if (msg.messagePayload.command == 'ct') {
            const razmer_stavka = await msg.question(`✏ ${name}, введите ставку на CRAZYTIME:`)
            const answerIsNumeric = isNumeric(razmer_stavka.text)
            if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
            if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
            if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
            if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
            else {
                if (answerIsNumeric) {
                    const game = await Game.findOne({ id: 1 })

                    game.bank += Number(razmer_stavka.text)

                    game.crazy += 1

                    await game.save()

                    if (ishod == 'none') {
                        let random = Math.floor(Math.random() * 10)

                        if (random < 6) {
                            ishod = low[Math.floor(Math.random() * low.length)]
                        }
                        else if (random > 5 && random < 9) {
                            ishod = medium[Math.floor(Math.random() * medium.length)]
                        }
                        else if (random > 8) {
                            ishod = high[Math.floor(Math.random() * high.length)]
                        }


                    }


                    if (kf == 0) {
                        let kof = (ishod == 'coinfl') ? cf[Math.floor(Math.random() * cf.length)] : (ishod == 'pachi') ? pachi[Math.floor(Math.random() * pachi.length)] : (ishod == 'cash') ? crazy[Math.floor(Math.random() * crazy.length)] : (ishod == 'crazy') ? crazy[Math.floor(Math.random() * crazy.length)] : ''
                        kf = kof
                    }
                    console.log(kf)

                    if (game.players == 0) {

                        game.players += 1
                        game.dater = Date.now() + 30000

                        await game.save()

                        kudadopishod = ishods[Math.floor(Math.random() * ishods.length)]
                        dopishod = dopishods[Math.floor(Math.random() * dopishods.length)]

                        console.log(ishod)


                        let id = setInterval(async () => {
                            if (game.dater <= Date.now()) {
                                clearInterval(id)

                                game.bank = 0
                                game.dater = 0
                                game.players = 0
                                game.x1 = 0
                                game.x2 = 0
                                game.x5 = 0
                                game.x10 = 0
                                game.coinfl = 0
                                game.pachi = 0
                                game.cash = 0
                                game.crazy = 0
                                game.plays += 1
                                game.save()

                                const user_x1 = await User.find({ stavka: 'x1' }); const user_x2 = await User.find({ stavka: 'x2' }); const user_x5 = await User.find({ stavka: 'x5' }); const user_x10 = await User.find({ stavka: 'x10' }); const user_coinfl = await User.find({ stavka: 'coinfl' }); const user_pachi = await User.find({ stavka: 'pachi' }); const user_cash = await User.find({ stavka: 'cash' }); const user_crazy = await User.find({ stavka: 'crazy' })
                                for (i in user_x1) {
                                    if (user_x1[i].stavka != 'none') {
                                        user_x1[i].stavka = 'none'
                                        user_x1[i].save()
                                    }
                                }
                                for (i in user_x2) {
                                    if (user_x2[i].stavka != 'none') {
                                        user_x2[i].stavka = 'none'
                                        user_x2[i].save()
                                    }
                                }
                                for (i in user_x5) {
                                    if (user_x5[i].stavka != 'none') {
                                        user_x5[i].stavka = 'none'
                                        user_x5[i].save()
                                    }
                                }
                                for (i in user_x10) {
                                    if (user_x10[i].stavka != 'none') {
                                        user_x10[i].stavka = 'none'
                                        user_x10[i].save()
                                    }
                                }
                                for (i in user_coinfl) {
                                    if (user_coinfl[i].stavka != 'none') {
                                        user_coinfl[i].stavka = 'none'
                                        user_coinfl[i].save()
                                    }
                                }
                                for (i in user_pachi) {
                                    if (user_pachi[i].stavka != 'none') {
                                        user_pachi[i].stavka = 'none'
                                        user_pachi[i].save()
                                    }
                                }
                                for (i in user_cash) {
                                    if (user_cash[i].stavka != 'none') {
                                        user_cash[i].stavka = 'none'
                                        user_cash[i].save()
                                    }
                                }
                                for (i in user_crazy) {
                                    if (user_crazy[i].stavka != 'none') {
                                        user_crazy[i].stavka = 'none'
                                        user_crazy[i].save()
                                    }
                                }
                            }
                        }, 1000)

                        setTimeout(() => {
                            msg.send(`Выпал дополнительный бонус на ${(kudadopishod) == 'pachi' ? 'PACHINKO' : (kudadopishod) == 'coinfl' ? 'COINFLIP' : (kudadopishod) == 'cash' ? 'CASHHUNT' : (kudadopishod) == 'crazy' ? 'CRAZYTIME' : kudadopishod} с коэффициентом ${dopishod} `)

                            let private = md5(`${msg.peerId}|${game.plays}`)
                            msg.send(`${(ishod) == 'pachi' ? `Выпала бонусная игра PACHINKO\n\nВыпавший коэффициент: x${kf}` : (ishod) == 'coinfl' ? 'Выпала бонусная игра COINFLIP\nВыпавший коэффициент: x' + kf : (ishod) == 'cash' ? 'Выпала бонусная игра CASHHUNT\n\nВыпавший коэффициент: x' + kf : (ishod) == 'crazy' ? 'Выпала бонусная игра CRAZYTIME\n\nВыпавший коэффициент: x' + kf : `Выпавший коэффициент: ${ishod}`}\n\n${winners.join('\n')}\n\nhash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка на честность: ${ishod},${kudadopishod},${dopishod}|${private}`, {
                                attachment: (ishod == 'x1') ? 'photo-213048360_457239018' : (ishod == 'x2') ? 'photo-213048360_457239019' : (ishod == 'x5') ? 'photo-213048360_457239020' : (ishod == 'x10') ? 'photo-213048360_457239021' : (ishod == 'coinfl') ? 'photo-213048360_457239023' : (ishod == 'pachi') ? 'photo-213048360_457239025' : (ishod == 'cash') ? 'photo-213048360_457239022' : (ishod == 'crazy') ? 'photo-213048360_457239024' : ''
                            })

                            ishod = 'none'
                            kf = 0
                            return winners = []
                        }, game.dater - Date.now());
                    }
                    findUser.stavka = 'crazy'
                    findUser.razmer_stavka = Number(razmer_stavka.text)

                    findUser.money -= Number(razmer_stavka.text)

                    if (findUser.stavka === ishod) {
                        console.log('1')
                        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
                        let win = Number(razmer_stavka.text) * wini
                        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
                        console.log(win)
                        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
                        console.log(winners)
                        if (kudadopishod == ishod) {
                            let lucky = win * dopish
                            findUser.money += lucky
                            findUser.profit += lucky
                            findUser.topday += lucky
                            findUser.topmonth += lucky
                            await findUser.save()
                        } else {
                            findUser.money += win
                            findUser.profit += win
                            findUser.topday += win
                            findUser.topmonth += win
                            await findUser.save()
                        }
                    }
                    await findUser.save()
                    return msg.send(`✅ ${name}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на CRAZYTIME.`)
                }
            }
        }
    }
})

console.log('Бот был запущен!');
vk.updates.start().catch(console.error);
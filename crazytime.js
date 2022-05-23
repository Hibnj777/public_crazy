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

async function crazytime(msg, stavka) {
    const findUser = await User.findOne({ id: msg.senderId });
    const razmer_stavka = await msg.question(`✏ ${findUser.nick}, введите ставку на ${stavka == 'cf' ? 'COINFLIP' : stavka == 'pach' ? 'PACHINKO' : stavka == 'ch' ? 'CASHHUNT' : stavka == 'ct' ? 'CRAZYTIME' : stavka}:`)
    const answerIsNumeric = isNumeric(razmer_stavka.text)
    if (Number(razmer_stavka.text) > findUser.money) return msg.send(`У вас не хватает денег!`)
    if (Number(razmer_stavka.text) < 0) return msg.send(`Ставка не может быть меньше 0!`)
    if (findUser.money < Number(razmer_stavka.text)) return msg.send(`Недостаточно средств.`)
    if (findUser.stavka != 'none') return msg.send(`Нельзя ставить несколько ставок подряд!`)
    if (!answerIsNumeric) return
    const game = await Game.findOne({ id: 1 })

    game.bank += Number(razmer_stavka.text)

    switch (stavka) {
        case 'x1':
            game.x1 += 1
            await game.save()
            break;
        case 'x2':
            game.x2 += 1
            await game.save()
            break;
        case 'x5':
            game.x5 += 1
            await game.save()
            break;
        case 'x10':
            game.x10 += 1
            await game.save()
            break;
        case 'cf':
            game.coinfl += 1
            await game.save()
            break;
        case 'pach':
            game.pachi += 1
            await game.save()
            break;
        case 'ch':
            game.cash += 1
            await game.save()
            break;
        case 'ct':
            game.crazy += 1
            await game.save()
            break;
    }

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

                await User.updateMany({ stavka: 'x1' }, { stavka: 'none' }); await User.updateMany({ stavka: 'x2' }, { stavka: 'none' }); await User.updateMany({ stavka: 'x5' }, { stavka: 'none' }); await User.updateMany({ stavka: 'x10' }, { stavka: 'none' }); await User.updateMany({ stavka: 'coinfl' }, { stavka: 'none' }); await User.updateMany({ stavka: 'pachi' }, { stavka: 'none' }); await User.updateMany({ stavka: 'cash' }, { stavka: 'none' }); await User.updateMany({ stavka: 'crazy' }, { stavka: 'none' })
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
    findUser.stavka = stavka == 'cf' ? 'coinfl' : stavka == 'pach' ? 'pachi' : stavka == 'ch' ? 'cash' : stavka == 'ct' ? 'crazy' : stavka
    findUser.razmer_stavka = Number(razmer_stavka.text)

    findUser.money -= Number(razmer_stavka.text)

    if (findUser.stavka === ishod) {
        let wini = Number(razmer_stavka.text) * (ishod == "x1") ? 1 : (ishod == "x2") ? 2 : (ishod == "x5") ? 5 : (ishod == "x10") ? 10 : (ishod == "coinfl") ? kf : (ishod == "pachi") ? kf : (ishod == "cash") ? kf : (ishod == "crazy") ? kf : ''
        let win = Number(razmer_stavka.text) * wini
        let dopish = (dopishod == "x5") ? 5 : (dopishod == "x2") ? 2 : (dopishod == "x10") ? 10 : (dopishod == "x100") ? 100 : (dopishod == "x50") ? 2 : (dopishod == "x200") ? 200 : (dopishod == "x3") ? 3 : (dopishod == "x4") ? 4 : (dopishod == "x7") ? 7 : (dopishod == "x15") ? 15 : (dopishod == "x20") ? 20 : (dopishod == "x25") ? 25 : ''
        winners.push(`✅ ${findUser.nick}, ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${findUser.stavka} выиграла (приз ${(ishod != kudadopishod) ? `${new Intl.NumberFormat('ru-RU').format(win)}` : `${new Intl.NumberFormat('ru-RU').format(win * dopish)}`} МК)`)
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
    return msg.send(`✅ ${findUser.nick}, успешная ставка ${new Intl.NumberFormat('ru-RU').format(razmer_stavka.text)} MK на ${stavka == 'cf' ? 'COINFLIP' : stavka == 'pach' ? 'PACHINKO' : stavka == 'ch' ? 'CASHHUNT' : stavka == 'ct' ? 'CRAZYTIME' : stavka}.`)
}

function commandManager(msg) {
    const commands = {
        balance: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            if (findUser.stavka == 'none') {
                return msg.send(`💰 ${findUser.nick}, Ваш баланс: ${new Intl.NumberFormat('ru-RU').format(findUser.money)} MK`)
            } else {
                return msg.send(`У вас стоит ставка, просмотр баланса недоступен.`)
            }
        },
        bank: async () => {
            const game = await Game.findOne({ id: 1 })

            const list = {
                x1: [],
                x2: [],
                x5: [],
                x10: [],
                coinfl: [],
                pachi: [],
                cash: [],
                crazy: []
            }

            const stavochnik = await User.find({ stavka: { $ne: 'none' } })
            const text = (nick, id, stavka, razmer_stavka) => {
                list[stavka].push(`[id${id}|${nick}] - ${new Intl.NumberFormat('ru-RU').format(razmer_stavka)} MK`)
            }

            stavochnik.map(({ nick, id, stavka, razmer_stavka }) => text(nick, id, stavka, razmer_stavka))

            let private = md5(`${msg.peerId}|${game.plays}`)

            if (game.players == 0) {
                return msg.send(`Ни одной ставки не обнаружено.`)
            } else {
                return msg.send(`Всего поставлено: ${new Intl.NumberFormat('ru-RU').format(game.bank)} MK\n\n${(game.x1 > 0 && list["x1"].length > 0) ? 'Ставки на x1:' : ''}\n${list["x1"].join('\n')}\n\n${(game.x2 > 0 && list["x2"].length > 0) ? 'Ставки на x2:' : ''}\n${list["x2"].join('\n')}\n\n${(game.x5 > 0 && list["x5"].length > 0) ? 'Ставки на x5:' : ''}\n${list["x5"].join('\n')}\n\n${(game.x10 > 0 && list["x10"].length > 0) ? 'Ставки на x10:' : ''}\n${list["x10"].join('\n')}\n\n${(game.coinfl > 0 && list["coinfl"].length > 0) ? 'Ставки на COINFLIP:' : ''}\n${list["coinfl"].join('\n')}\n\n${(game.pachi > 0 && list["pachi"].length > 0) ? 'Ставки на PACHINKO:' : ''}\n${list["pachi"].join('\n')}\n\n${(game.cash > 0 && list["cash"].length > 0) ? 'Ставки на CASHHUNT:' : ''}\n${list["cash"].join('\n')}\n\n${(game.crazy > 0 && list["crazy"].length > 0) ? 'Ставки на CRAZYTIME:' : ''}\n${list["crazy"].join('\n')}\n\nДо конца раунда: ${(Math.trunc((game.dater - Date.now()) / 1000) > 0) ? `${Math.trunc((game.dater - Date.now()) / 1000)}` : ''} сек.\n\n${game.dater != 0 ? `hash: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}` : ''}`)
            }
        },
        x1: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        x2: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        x5: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        x10: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        cf: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        pach: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        ch: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        ct: async () => {
            crazytime(msg, msg.messagePayload.command)
        },
        checkct: async () => {
            const game = await Game.findOne({ id: 1 })
            let private = md5(`${msg.peerId}|${game.plays}`)

            const list = {
                x1: [],
                x2: [],
                x5: [],
                x10: [],
                coinfl: [],
                pachi: [],
                cash: [],
                crazy: []
            }

            const stavochnik = await User.find({ stavka: { $ne: 'none' } })
            const text = (nick, id, stavka, razmer_stavka) => {
                list[stavka].push(`[id${id}|${nick}] - ${new Intl.NumberFormat('ru-RU').format(razmer_stavka)} MK`)
            }
            stavochnik.map(({ nick, id, stavka, razmer_stavka }) => text(nick, id, stavka, razmer_stavka))

            return msg.send(`Данные о текущей игре CRAZYTIME:\n\nБанк: ${new Intl.NumberFormat('ru-RU').format(game.bank)} МК\nХэш: ${md5(`${ishod},${kudadopishod},${dopishod}|${private}`)}\nПроверка честности хэша: ${ishod},${kudadopishod},${dopishod}|${private}\n\n${(game.x1 > 0 && list["x1"].length > 0) ? 'Ставки на x1:' : ''}\n${list["x1"].join('\n')}\n\n${(game.x2 > 0 && list["x2"].length > 0) ? 'Ставки на x2:' : ''}\n${list["x2"].join('\n')}\n\n${(game.x5 > 0 && list["x5"].length > 0) ? 'Ставки на x5:' : ''}\n${list["x5"].join('\n')}\n\n${(game.x10 > 0 && list["x10"].length > 0) ? 'Ставки на x10:' : ''}\n${list["x10"].join('\n')}\n\n${(game.coinfl > 0 && list["coinfl"].length > 0) ? 'Ставки на COINFLIP:' : ''}\n${list["coinfl"].join('\n')}\n\n${(game.pachi > 0 && list["pachi"].length > 0) ? 'Ставки на PACHINKO:' : ''}\n${list["pachi"].join('\n')}\n\n${(game.cash > 0 && list["cash"].length > 0) ? 'Ставки на CASHHUNT:' : ''}\n${list["cash"].join('\n')}\n\n${(game.crazy > 0 && list["crazy"].length > 0) ? 'Ставки на CRAZYTIME:' : ''}\n${list["crazy"].join('\n')}\n\nДо конца раунда: ${(Math.trunc((game.dater - Date.now()) / 1000) > 0) ? `${Math.trunc((game.dater - Date.now()) / 1000)}` : ''} сек.`)
        }
    }
    try {
        commands[msg.messagePayload.command]();
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    commandManager
}
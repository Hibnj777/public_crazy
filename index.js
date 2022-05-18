const { vk, getVkNameById, questionManager } = require('./VK')

const { persMenu, check, exchange, donateMenu, profile } = require('./keyboard')

const { User } = require('./db')

const { isNumeric, compareNumeric } = require('./tools')

vk.updates.use(questionManager.middleware);

const QIWI = require("@qiwi/bill-payments-node-js-sdk");
const { api_token } = require('./qiwi')

const { API, resolveResource } = require('vk-io');

const qiwiApi = new QIWI(api_token)

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
        if(toppers[2]) {
            toppers[2].money += 2500000
            await toppers[2].save()
        }
        if(toppers[3]) {
            toppers[3].money += 1500000
            await toppers[3].save()
        }
        if(toppers[4]) {
            toppers[4].money += 1000000
            await toppers[4].save()
        }
        if(toppers[5]) {
            toppers[5].money += 750000
            await toppers[5].save()
        }
        if(toppers[6]) {
            toppers[6].money += 500000
            await toppers[6].save()
        }
        if(toppers[7]) {
            toppers[7].money += 250000
            await toppers[7].save()
        }
        if(toppers[8]) {
            toppers[8].money += 100000
            await toppers[8].save()
        }
        if(toppers[9]) {
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
        if(toppers[2]) {
            toppers[2].money += 500000
            await toppers[2].save()
        }
        if(toppers[3]) {
            toppers[3].money += 250000
            await toppers[3].save()
        }
        if(toppers[4]) {
            toppers[4].money += 100000
            await toppers[4].save()
        }
        if(toppers[5]) {
            toppers[5].money += 50000
            await toppers[5].save()
        }
        if(toppers[6]) {
            toppers[6].money += 30000
            await toppers[6].save()
        }
        if(toppers[7]) {
            toppers[7].money += 25000
            await toppers[7].save()
        }
        if(toppers[8]) {
            toppers[8].money += 15000
            await toppers[8].save()
        }
        if(toppers[9]) {
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

    const QIWISettings = {
        amount: 0, // Сумма, пока оставим null
        billId: "0", // Идентификатор платежа (он у каждого будет уникальный)
        comment: "0", // Комментарий
        currency: "RUB" // Валюта
    }
    
    if (!msg.isChat) {
        if (!findUser) {

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
        } else if (findUser) {
            if (msg.text.includes('/клавиатура')) {
                return msg.send('клавиатура включена!',
                    {
                        keyboard: persMenu
                    })
            }
            if (msg.messagePayload.command == 'depositing') { // донат
                let summ = await msg.question(`Введите сумму платежа:`)
                const answerIsNumeric = isNumeric(summ.text)
                if (Number(summ.text) < 0) return msg.send(`Пополнение не может быть меньше 0!`)

                if (answerIsNumeric) {
                    QIWISettings.amount = summ.text
                    QIWISettings.billId = qiwiApi.generateId()
                    QIWISettings.comment = "клубничка"
                    findUser.billId = QIWISettings.billId
                    findUser.save()

                    qiwiApi.createBill(QIWISettings.billId, QIWISettings)
                        .then(data => { // Выставляем счет, передаем billId и другие данные
                            console.log(QIWISettings.billId)
                            msg.send(`💸 Сумма: ${QIWISettings.amount}\n👉 Для оплаты перейдите по ссылке: ${data.payUrl}\n👇 Для проверки поступления средств нажмите "Проверить"`,
                                {
                                    keyboard: check
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            return msg.send(`Произошла ошибка.`)
                        })
                }
            }
            if (msg.messagePayload.command == 'check') {
                qiwiApi.getBillInfo(findUser.billId)
                    .then(data => { // получаем данные о счете
                        if (data.status.value == "PAID") {
                            findUser.donate += Number(data.amount.value)
                            findUser.billId = '0'
                            findUser.save()
                            return msg.send(`Ваш донат-счёт попoлнен на ${data.amount.value}₽`,
                                {
                                    keyboard: persMenu
                                })
                        } else {
                            return msg.send(`Счёт не оплачен.`)
                        }
                    }
                    )
                    .catch(err => {
                        console.log(QIWISettings.billId)
                        return msg.send(`Произошла ошибка!`)
                    })
            }
            if (msg.messagePayload.command == 'exit') { // главное меню
                findUser.billId = '0'
                findUser.save()
                return msg.send(`Вы успешно вернулись в главное меню!`,
                    {
                        keyboard: persMenu
                    })
            }
            if (msg.messagePayload.command == 'myprofile') { // профиль
                return msg.send(`Ваш профиль:\n\nНик: ${findUser.nick}\nВыиграно: ${new Intl.NumberFormat('ru-RU').format(findUser.profit)} МК\nИгровой баланс: ${(findUser.stavka == 'none') ? `${new Intl.NumberFormat('ru-RU').format(findUser.money)} МК` : `Просмотр баланса недоступен, так как вы сейчас играете.`}\nДонат-счёт: ${new Intl.NumberFormat('ru-RU').format(findUser.donate)}₽`,
                    {
                        keyboard: profile
                    })
            }
            if (msg.messagePayload.command == 'changenick') { // смена ника
                const answer = await msg.question(`✏ ${name}, введите новый ник:`)
                const check = await User.findOne({ nick: answer.text })
                console.log(check)
                if (check) {
                    return msg.send(`Данный ник уже занят!`)
                }
                findUser.nick = answer.text
                findUser.save()
                return msg.send(`Ваш ник изменён на ${answer.text}!`)
            }
            if (msg.messagePayload.command == 'donate') { // донат меню
                return msg.send(`Рад приветствовать Вас в донат магазине!\n\nВаш счёт на данный момент: ${findUser.donate}₽`,
                    {
                        keyboard: exchange
                    })
            }
            if (msg.messagePayload.command == 'exchange') { // обмен доната на бабки
                let answer = await msg.question(`Курс обмена донат-монет на валюту на данный момент составляет (1₽ = 1000 МК)\n\nВведите сумму, которую хотите обменять:`)
                const answerIsNumeric = isNumeric(answer.text)
                if (Number(answer.text) < 0) return msg.send(`Обмен не может быть меньше 0!`)

                if (answerIsNumeric) {
                    if (Number(answer.text) > findUser.donate) return msg.send(`На донат-счёте недостаточно средств!`)

                    findUser.money += answer.text * 1000
                    findUser.donate -= answer.text
                    findUser.save()
                    return msg.send(`Вы успешно обменяли ${answer.text}₽ на ${new Intl.NumberFormat('ru-RU').format(answer.text * 1000)} МК`)
                }
            }
            if (msg.messagePayload.command == 'topday') { // топ дня по выигрышам
                const toppers = await User.find({ topday: { $gt: 0 } }).sort({ topday: -1 }).limit(10)
                let visual = []
                let pos = 0

                for (i in toppers) {
                    if (!visual.includes(`${toppers[i].nick} - ${toppers[i].topday} МК`)) {
                        visual.push(`${pos += 1}. [vk.com/id${toppers[i].id}|${toppers[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(toppers[i].topday)} МК ${(pos == 1) ? `(приз - 1.000.000 МК).` : (pos == 2) ? `(приз - 750.000 МК).` : (pos == 3) ? `(приз - 500.000 МК).` : (pos == 4) ? `(приз - 250.000 МК).` : (pos == 5) ? `(приз - 100.000 МК).` : (pos == 6) ? `(приз - 50.000 МК).` : (pos == 7) ? `(приз - 30.000 МК).` : (pos == 8) ? `(приз - 25.000 МК).` : (pos == 9) ? `(приз - 15.000 МК).` : (pos == 10) ? `(приз - 5.000 МК).` : ''}`)
                    }
                }

                return msg.send(`Ежедневный топ игроков:\n\n${visual.join(`\n`)}\n\nВаш выигрыш за сегодня: ${new Intl.NumberFormat('ru-RU').format(findUser.topday)} МК`)
            }
            if (msg.messagePayload.command == 'topmonth') { // топ месяца по выигрышам
                const toppers = await User.find({ topmonth: { $gt: 0 } }).sort({ topmonth: -1 }).limit(10)
                let visual = []
                let pos = 0

                for (i in toppers) {
                    if (!visual.includes(`${toppers[i].nick} - ${toppers[i].topmonth} МК`)) {
                        visual.push(`${pos += 1}. [vk.com/id${toppers[i].id}|${toppers[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(toppers[i].topmonth)} МК ${(pos == 1) ? `(приз - 10.000.000 МК).` : (pos == 2) ? `(приз - 5.000.000 МК).` : (pos == 3) ? `(приз - 2.500.000 МК).` : (pos == 4) ? `(приз - 1.500.000 МК).` : (pos == 5) ? `(приз - 1.000.000 МК).` : (pos == 6) ? `(приз - 750.000 МК).` : (pos == 7) ? `(приз - 500.000 МК).` : (pos == 8) ? `(приз - 250.000 МК).` : (pos == 9) ? `(приз - 100.000 МК).` : (pos == 10) ? `(приз - 50.000 МК).` : ''}`)
                    }
                }

                return msg.send(`Ежемесячный топ игроков:\n\n${visual.join(`\n`)}\n\nВаш выигрыш за месяц: ${new Intl.NumberFormat('ru-RU').format(findUser.topmonth)} МК.`)
            }
            if (msg.messagePayload.command == 'transfer') { // перевод денег
                const id = await msg.question(`✏ ${name}, введите ссылку на пользователя, которому хотите сделать перевод:`)

                const resource = await resolveResource({
                    api: vk.api,
                    resource: id.text
                })
                    .then(async function (res) {
                        const getter = await User.findOne({ id: res.id })
                        if (!getter) {
                            return msg.send(`Данный пользователь не зарегистрирован в боте!`)
                        } else {
                            const sum = await msg.question(`✏ Введите сумму, которую хотите перевести:`)
                            const answerIsNumeric = isNumeric(sum.text)
                            if (Number(sum.text) < 0) return msg.send(`Перевод не может быть меньше 0!`)
                            if (Number(sum.text) > findUser.money) return msg.send(`У вас не хватает денег для совершения такого перевода!`)

                            else if (answerIsNumeric) {
                                getter.money += Number(sum.text)
                                getter.save()
                                findUser.money -= Number(sum.text)
                                findUser.save()

                                msg.send(`Вам поступил перевод от [vk.com/id${findUser.id}|${findUser.nick}] в размере ${new Intl.NumberFormat('ru-RU').format(sum.text)} МК.`, { user_id: res.id })
                                return msg.send(`Вы успешно перевели ${new Intl.NumberFormat('ru-RU').format(sum.text)} МК пользователю [vk.com/id${getter.id}|${getter.nick}].`)
                            }

                        }
                    })
                    .catch(err => {
                        console.log(err)
                        return msg.send(`Произошла ошибка! Возможно, вы ввели некорректный айди.`)
                    })
            }
        }
    }
})

console.log('Бот был запущен!');
vk.updates.start().catch(console.error);
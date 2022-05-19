const { vk, getVkNameById, questionManager } = require('./VK')

const { persMenu, check, exchange, donateMenu, profile } = require('./keyboard')

const { User } = require('./db')

const { isNumeric, compareNumeric } = require('./tools')

vk.updates.use(questionManager.middleware);

const QIWI = require("@qiwi/bill-payments-node-js-sdk");
const { api_token } = require('./qiwi')

const { API, resolveResource } = require('vk-io');

const qiwiApi = new QIWI(api_token)

function lsmanager(msg) {
    const commands = {
        depositing: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            let summ = await msg.question(`Введите сумму платежа:`)
            const answerIsNumeric = isNumeric(summ.text)
            if (Number(summ.text) < 0) return msg.send(`Пополнение не может быть меньше 0!`)
            if (!answerIsNumeric) return

            const QIWISettings = {
                amount: 0, // Сумма, пока оставим null
                billId: "0", // Идентификатор платежа (он у каждого будет уникальный)
                comment: "0", // Комментарий
                currency: "RUB" // Валюта
            }
            QIWISettings.amount = summ.text
            QIWISettings.billId = qiwiApi.generateId()
            QIWISettings.comment = "клубничка"
            findUser.billId = QIWISettings.billId
            findUser.save()

            qiwiApi.createBill(QIWISettings.billId, QIWISettings)
                .then(data => { // Выставляем счет, передаем billId и другие данные
                    console.log(QIWISettings.billId)
                    msg.send(`💸 Сумма: ${QIWISettings.amount}₽\n👉 Для оплаты перейдите по ссылке: ${data.payUrl}\n👇 Для проверки поступления средств нажмите "Проверить"`,
                        {
                            keyboard: check
                        })
                })
                .catch(err => {
                    console.log(err)
                    return msg.send(`Произошла ошибка.`)
                })
        },
        check: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
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
        },
        exit: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            findUser.billId = '0'
            findUser.save()
            return msg.send(`Вы успешно вернулись в главное меню!`,
                {
                    keyboard: persMenu
                })
        },
        myprofile: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            return msg.send(`Ваш профиль:\n\nНик: ${findUser.nick}\nВыиграно: ${new Intl.NumberFormat('ru-RU').format(findUser.profit)} МК\nИгровой баланс: ${(findUser.stavka == 'none') ? `${new Intl.NumberFormat('ru-RU').format(findUser.money)} МК` : `Просмотр баланса недоступен, так как вы сейчас играете.`}\nДонат-счёт: ${new Intl.NumberFormat('ru-RU').format(findUser.donate)}₽`,
                {
                    keyboard: profile
                })
        },
        changenick: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            const answer = await msg.question(`✏ ${name}, введите новый ник:`)
            const check = await User.findOne({ nick: answer.text })
            console.log(check)
            if (check) {
                return msg.send(`Данный ник уже занят!`)
            }
            findUser.nick = answer.text
            findUser.save()
            return msg.send(`Ваш ник изменён на ${answer.text}!`)
        },
        donate: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            return msg.send(`Рад приветствовать Вас в донат магазине!\n\nВаш счёт на данный момент: ${findUser.donate}₽`,
                {
                    keyboard: exchange
                })
        },
        exchange: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            let answer = await msg.question(`Курс обмена донат-монет на валюту на данный момент составляет (1₽ = 1000 МК)\n\nВведите сумму, которую хотите обменять:`)
            const answerIsNumeric = isNumeric(answer.text)
            if (Number(answer.text) < 0) return msg.send(`Обмен не может быть меньше 0!`)
            if (!answerIsNumeric) return
            if (Number(answer.text) > findUser.donate) return msg.send(`На донат-счёте недостаточно средств!`)

            findUser.money += answer.text * 1000
            findUser.donate -= answer.text
            findUser.save()
            return msg.send(`Вы успешно обменяли ${answer.text}₽ на ${new Intl.NumberFormat('ru-RU').format(answer.text * 1000)} МК`)
        },
        topday: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            const toppers = await User.find({ topday: { $gt: 0 } }).sort({ topday: -1 }).limit(10)
            let visual = []
            let pos = 0

            for (i in toppers) {
                if (!visual.includes(`${toppers[i].nick} - ${toppers[i].topday} МК`)) {
                    visual.push(`${pos += 1}. [vk.com/id${toppers[i].id}|${toppers[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(toppers[i].topday)} МК ${(pos == 1) ? `(приз - 1.000.000 МК).` : (pos == 2) ? `(приз - 750.000 МК).` : (pos == 3) ? `(приз - 500.000 МК).` : (pos == 4) ? `(приз - 250.000 МК).` : (pos == 5) ? `(приз - 100.000 МК).` : (pos == 6) ? `(приз - 50.000 МК).` : (pos == 7) ? `(приз - 30.000 МК).` : (pos == 8) ? `(приз - 25.000 МК).` : (pos == 9) ? `(приз - 15.000 МК).` : (pos == 10) ? `(приз - 5.000 МК).` : ''}`)
                }
            }

            return msg.send(`Ежедневный топ игроков:\n\n${visual.join(`\n`)}\n\nВаш выигрыш за сегодня: ${new Intl.NumberFormat('ru-RU').format(findUser.topday)} МК`)
        },
        topmonth: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            const toppers = await User.find({ topmonth: { $gt: 0 } }).sort({ topmonth: -1 }).limit(10)
            let visual = []
            let pos = 0

            for (i in toppers) {
                if (!visual.includes(`${toppers[i].nick} - ${toppers[i].topmonth} МК`)) {
                    visual.push(`${pos += 1}. [vk.com/id${toppers[i].id}|${toppers[i].nick}] - ${new Intl.NumberFormat('ru-RU').format(toppers[i].topmonth)} МК ${(pos == 1) ? `(приз - 10.000.000 МК).` : (pos == 2) ? `(приз - 5.000.000 МК).` : (pos == 3) ? `(приз - 2.500.000 МК).` : (pos == 4) ? `(приз - 1.500.000 МК).` : (pos == 5) ? `(приз - 1.000.000 МК).` : (pos == 6) ? `(приз - 750.000 МК).` : (pos == 7) ? `(приз - 500.000 МК).` : (pos == 8) ? `(приз - 250.000 МК).` : (pos == 9) ? `(приз - 100.000 МК).` : (pos == 10) ? `(приз - 50.000 МК).` : ''}`)
                }
            }

            return msg.send(`Ежемесячный топ игроков:\n\n${visual.join(`\n`)}\n\nВаш выигрыш за месяц: ${new Intl.NumberFormat('ru-RU').format(findUser.topmonth)} МК.`)
        },
        transfer: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
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
                        if (!answerIsNumeric) return

                        getter.money += Number(sum.text)
                        getter.save()
                        findUser.money -= Number(sum.text)
                        findUser.save()

                        msg.send(`Вам поступил перевод от [vk.com/id${findUser.id}|${findUser.nick}] в размере ${new Intl.NumberFormat('ru-RU').format(sum.text)} МК.`, { user_id: res.id })
                        return msg.send(`Вы успешно перевели ${new Intl.NumberFormat('ru-RU').format(sum.text)} МК пользователю [vk.com/id${getter.id}|${getter.nick}].`)


                    }
                })
                .catch(err => {
                    console.log(err)
                    return msg.send(`Произошла ошибка! Возможно, вы ввели некорректный айди.`)
                })
        }
    }
    try {
        commands[msg.messagePayload.command]();
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    lsmanager
}
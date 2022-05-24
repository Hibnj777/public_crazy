const { vk, getVkNameById, questionManager } = require('./VK')

const { exchange, profile } = require('./keyboard')

const { User, Promo, Use } = require('./db')

const { isNumeric } = require('./tools')

vk.updates.use(questionManager.middleware);

const { API, resolveResource } = require('vk-io');

function lsmanager(msg) {
    const commands = {
        myprofile: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            return msg.send(`👀 Ваш профиль:\n\n😼 Ник: ${findUser.nick}\n💸 Выиграно за всё время: ${new Intl.NumberFormat('ru-RU').format(findUser.profit)} МК\n💰 Игровой баланс: ${(findUser.stavka == 'none') ? `${new Intl.NumberFormat('ru-RU').format(findUser.money)} МК` : `Просмотр баланса недоступен, так как вы сейчас играете.`}\n💳 Донат-счёт: ${new Intl.NumberFormat('ru-RU').format(findUser.donate)}₽`,
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
                return msg.send(`❌ Данный ник уже занят!`)
            }
            findUser.nick = answer.text
            findUser.save()
            return msg.send(`✅ Ваш ник изменён на ${answer.text}!`)
        },
        donate: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            return msg.send(`⭐️ Рад приветствовать Вас в донат магазине!\n\n💳 Ваш счёт на данный момент: ${findUser.donate}₽`,
                {
                    keyboard: exchange
                })
        },
        exchange: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            let answer = await msg.question(`🤝 Курс обмена донат-монет на валюту на данный момент составляет (1₽ = 1000 МК)\n\n✏ Введите сумму, которую хотите обменять:`)
            const answerIsNumeric = isNumeric(answer.text)
            if (Number(answer.text) < 0) return msg.send(`❌ Обмен не может быть меньше 0!`)
            if (!answerIsNumeric) return
            if (Number(answer.text) > findUser.donate) return msg.send(`❌ На донат-счёте недостаточно средств!`)

            findUser.money += answer.text * 1000
            findUser.donate -= answer.text
            findUser.save()
            return msg.send(`✅ Вы успешно обменяли ${answer.text}₽ на ${new Intl.NumberFormat('ru-RU').format(answer.text * 1000)} МК`)
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

            return msg.send(`📆 Ежедневный топ игроков:\n\n${visual.join(`\n`)}\n\n💸 Ваш выигрыш за сегодня: ${new Intl.NumberFormat('ru-RU').format(findUser.topday)} МК`)
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

            return msg.send(`📆 Ежемесячный топ игроков:\n\n${visual.join(`\n`)}\n\n💸 Ваш выигрыш за месяц: ${new Intl.NumberFormat('ru-RU').format(findUser.topmonth)} МК.`)
        },
        transfer: async () => {
            const name = await getVkNameById(msg.senderId)
            const findUser = await User.findOne({ id: msg.senderId });
            const id = await msg.question(`✏ ${findUser.nick}, введите ссылку на пользователя, которому хотите сделать перевод:`)

            const resource = await resolveResource({
                api: vk.api,
                resource: id.text
            })
                .then(async function (res) {
                    const getter = await User.findOne({ id: res.id })
                    if (!getter) {
                        return msg.send(`❌ Данный пользователь не зарегистрирован в боте!`)
                    } else {
                        const sum = await msg.question(`✏ Введите сумму, которую хотите перевести:`)
                        const answerIsNumeric = isNumeric(sum.text)
                        if (Number(sum.text) < 0) return msg.send(`❌ Перевод не может быть меньше 0!`)
                        if (Number(sum.text) > findUser.money) return msg.send(`❌ У вас не хватает денег для совершения такого перевода!`)
                        if (!answerIsNumeric) return

                        getter.money += Number(sum.text)
                        getter.save()
                        findUser.money -= Number(sum.text)
                        findUser.save()

                        msg.send(`😀 Вам поступил перевод от [vk.com/id${findUser.id}|${findUser.nick}] в размере ${new Intl.NumberFormat('ru-RU').format(sum.text)} МК.`, { user_id: res.id })
                        return msg.send(`✔️ Вы успешно перевели ${new Intl.NumberFormat('ru-RU').format(sum.text)} МК пользователю [vk.com/id${getter.id}|${getter.nick}].`)


                    }
                })
                .catch(err => {
                    console.log(err)
                    return msg.send(`❌ Произошла ошибка! Возможно, вы ввели некорректный айди.`)
                })
        },
        usepromo: async() => {
            const findUser = await User.findOne({ id: msg.senderId });
            const name = await msg.question(`✏ Введи название промокода:`)
            const promo = await Promo.findOne({ name: name.text })
            const check = await Use.findOne({ id: msg.senderId, name: name.text })

            if(check) return msg.send(`❌ Вы уже использовали данный промокод!`)
            if(!promo) return msg.send(`❌ Такого промокода не существует!`)
            if(promo.maxactivations <= promo.activations) return msg.send(`❌ Превышен лимит на использование промокода!`)

            findUser.money += promo.bonus;
            await findUser.save()
            promo.activations += 1
            await promo.save()

            const newUse = new Use({
                id: msg.senderId,
                name: name.text
            })
    
            newUse.save((error) => {
    
                if (error) {
                    console.log(error)
                    return 'Internal Server Error'
                }
    
            });

            return msg.send(`✔️ Вы успешно использовали промокод ${name.text} и получили ${new Intl.NumberFormat('ru-RU').format(promo.bonus)} МК на свой баланс.`)
        },
        createpromo: async() => {
            const name = await msg.question(`✏ введи название промокода:`)
            const check = await Promo.findOne({ name: name.text })
            if(check) return msg.send(`такой промокод уже существует`)

            const activations = await msg.question(`✏ введи число активаций:`)
            const answerIsNumeric = isNumeric(activations.text)
            if(!answerIsNumeric) return

            const bonus = await msg.question(`✏ введи приз за активацию промокода:`)
            const answersNumeric = isNumeric(bonus.text)
            if(!answersNumeric) return

            const newPromo = new Promo({
                name: name.text,
                maxactivations: Number(activations.text),
                bonus: Number(bonus.text),
                activations: 0
            })
    
            newPromo.save((error) => {
    
                if (error) {
                    console.log(error)
                    return 'Internal Server Error'
                }
    
            });

            return msg.send(`промокод ${name.text} успешно создан на ${activations.text} активаций с бонусом ${bonus.text} МК.`)
        },
        deletepromo: async() => {
            const name = await msg.question(`✏ введи название промокода:`)

            const check = await Promo.findOne({ name: name.text })
            if(!check) return msg.send(`такого промокода не существует`)

            await Promo.deleteOne({ name: name.text })

            return msg.send(`вы успешно удалили промокод ${name.text}.`)
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
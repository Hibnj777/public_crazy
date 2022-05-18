const { Keyboard } = require("vk-io");

const urlButton = (label, url) =>
  Keyboard.urlButton({
    label,
    url,
  });

const textButton = (label, command = label, color = Keyboard.SECONDARY_COLOR) =>
  Keyboard.textButton({
    label,
    payload: { command },
    color,
  });

const callBackButton = (label, command = label, color = Keyboard.SECONDARY_COLOR) =>
  Keyboard.callbackButton({
    label,
    eventPayload: { command },
    color,
  })

const mainMenu = Keyboard.keyboard([
  [
    textButton('Банк', 'bank', Keyboard.POSITIVE_COLOR), textButton('Баланс', 'balance', Keyboard.POSITIVE_COLOR)
  ],
  [
    textButton('x1', 'x1', Keyboard.SECONDARY_COLOR), textButton('x2', 'x2', Keyboard.SECONDARY_COLOR), textButton('x5', 'x5', Keyboard.SECONDARY_COLOR), textButton('x10', 'x10', Keyboard.SECONDARY_COLOR)
  ],
  [
    textButton('COINFLIP', 'cf', Keyboard.POSITIVE_COLOR), textButton('PACHINKO', 'pach', Keyboard.POSITIVE_COLOR)
  ],
  [
    textButton('CASHHUNT', 'ch', Keyboard.POSITIVE_COLOR), textButton('CRAZYTIME', 'ct', Keyboard.POSITIVE_COLOR)
  ],
  [
    urlButton('Пополнить', 'https://vk.com/im?sel=-213048360')
  ]
])
const persMenu = Keyboard.keyboard([
  [
    textButton('Мой профиль', 'myprofile', Keyboard.PRIMARY_COLOR), textButton('Перевести МК', 'transfer', Keyboard.PRIMARY_COLOR)
  ],
  [
    textButton('Донат-меню', 'donate', Keyboard.SECONDARY_COLOR)
  ],
  [
    textButton('Топ дня', 'topday', Keyboard.POSITIVE_COLOR), textButton('Топ месяца', 'topmonth', Keyboard.POSITIVE_COLOR)
  ]
])
const check = Keyboard.keyboard([
  [
    textButton('Проверить платёж', 'check', Keyboard.POSITIVE_COLOR)
  ],
  [
    textButton('В главное меню', 'exit', Keyboard.NEGATIVE_COLOR)
  ]
])
const exchange = Keyboard.keyboard([
  [
    textButton('Обменять донат на МК', 'exchange', Keyboard.POSITIVE_COLOR)
  ],
  [
    textButton('Пополнить донат-счёт', 'depositing', Keyboard.SECONDARY_COLOR)
  ]
]).inline()
const profile = Keyboard.keyboard([
  [
    textButton('Сменить ник', 'changenick', Keyboard.POSITIVE_COLOR)
  ]
]).inline()


module.exports = {
  mainMenu,
  persMenu,
  check,
  exchange,
  profile
}
import { Bot, GrammyError, HttpError, InlineKeyboard, InputFile } from "grammy";
import 'dotenv/config'
import { mixes } from "./mixData.js";
import { findMixByIng, getIngredients } from "./functions.js";

const bot = new Bot(process.env.BOT_TOKEN); 
const commands = [
    {
        command: 'start',
        description: 'Старт'
    }, 
    // {
    //     command: 'mix',
    //     description: 'Подобрать микс'
    // }
]
bot.api.setMyCommands(commands);

// let form = new FormData();
// form.append('menuLogo', fs.createReadStream('./img/menu.jpg'))


// start menu
const menuKeyboard = new InlineKeyboard()
    .text('По категории', 'category').row()
    .text('По вкусу', 'taste').row()
    .text('Ингредиенты', 'ingredient').row()
    .url('Канал о кальянах', 'https://t.me/hookah_test01').row()

const goToMixKeyboard = new InlineKeyboard().text('Перейти к миксам', 'mix')


bot.command('start', async (ctx) => {
    console.log(ctx.from, 'вызваная команда: ', ctx.update.message.text);
    const id = ctx.from.id;
    const chatId = ctx.msg.chat.id
    const msgId = ctx.msgId
    try {
        let pass = await bot.api.getChatMember('@hookah_test01', id);        
        if (pass.status == 'member' || pass.status == 'administrator' || pass.status == 'creator') {
            console.log(`Пользователь с id: ${id} подписан на канал`);
            await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/menu.jpg'), {
                reply_markup: goToMixKeyboard,
                caption: 'Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a>',
                parse_mode: 'HTML'
            })
        } else {
            console.log(`Пользователь с id: ${id} не подписан на канал, выпоняем блок ELSE`);
            await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/menu.jpg'), {
                reply_markup: new InlineKeyboard()
                    .url('Канал о кальянах', 'https://t.me/hookah_test01').row()
                    .text('Проверить подписку', 'start'),
                caption: 'Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a> для продолжения необходимо подписаться на канал',
                parse_mode: 'HTML'
            })
        }
    } catch (error) {
        await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/menu.jpg'), {
            reply_markup: new InlineKeyboard()
                .url('Канал о кальянах', 'https://t.me/hookah_test01').row()
                .text('Проверить подписку', 'start'),
            caption: 'Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a> для продолжения необходимо подписаться на канал',
            parse_mode: 'HTML'
        })
    }
})

bot.command('mix').filter(async (ctx) => {
    const id = ctx.from.id;
    let user = await bot.api.getChatMember('@hookah_test01', id);
    return user.status === "creator" || user.status === "administrator" || user.status === 'member'
  }, async (ctx) => {
        const chatId = ctx.chatId
        const msgId = ctx.msgId
        await ctx.answerCallbackQuery()
        // await ctx.api.editMessageText(chatId, msgId, 'Подобрать микс', {
        // parse_mode: HTML,    
        // reply_markup: menuKeyboard
        // })
    await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/menu.jpg'), {
        reply_markup: menuKeyboard,
        caption: 'Подобрать микс'
        })
    }
)

bot.command('try', async (ctx) => {
    // await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/menu.jpg'))
    await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/menu.jpg'), {
        reply_markup: goToMixKeyboard,
        caption: 'Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a> для продолжения необходимо подписаться на канал',
        parse_mode: 'HTML'
    })
})

bot.callbackQuery('start', async (ctx) => {
        const id = ctx.from.id;
        const chatId = ctx.chatId
        const msgId = ctx.msgId
        try {
        let pass = await bot.api.getChatMember('@hookah_test01', id);        
        if (pass.status == 'member' || pass.status == 'administrator' || pass.status == 'creator') {
            console.log(`Теперь пользователь с id: ${id} подписался на канал!`);
            await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/bar.jpg'), {
                reply_markup: goToMixKeyboard,
                caption: 'Отлично, спасибо за подписку, теперь ты можешь продолжить',
            })
            // await ctx.api.editMessageText(chatId, msgId, 'Отлично, спасибо за подписку, теперь ты можешь продолжить', {
            //     reply_markup: goToMixKeyboard
            // })
            await ctx.answerCallbackQuery()
        } else {
            console.log('Настырный пользователь не подписывается');
            await bot.api.deleteMessage(chatId, msgId)
            await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/menu.jpg'), {
                reply_markup: new InlineKeyboard()
                    .url('Канал о кальянах', 'https://t.me/hookah_test01').row()
                    .text('Проверить подписку', 'start'),
                caption: 'Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a> для продолжения необходимо подписаться на канал',
                parse_mode: 'HTML'
            })
            // await ctx.api.editMessageText(chatId, msgId, 'Вы не подписались на канал. Для продолжения необходимо подписаться', {
            //     reply_markup: new InlineKeyboard()
            //         .url('Канал о кальянах', 'https://t.me/hookah_test01').row()
            //         .text('Проверить подписку', 'start')
            // })
            await ctx.answerCallbackQuery()
        }
        } catch (error) {
            console.log('Ошибка!!! Изучить ошибку: => ', error);
            await ctx.answerCallbackQuery()
        }
    }
)

bot.callbackQuery('mix').filter(async (ctx) => {
    const id = ctx.from.id;
    let user = await bot.api.getChatMember('@hookah_test01', id);
    return user.status === "creator" || user.status === "administrator" || user.status === 'member'
  }, async (ctx) => {
        const chatId = ctx.chatId
        const msgId = ctx.msgId
        await ctx.answerCallbackQuery()
        // await ctx.api.editMessageText(chatId, msgId, 'Подобрать микс', {
        // reply_markup: menuKeyboard
    // })
        await bot.api.deleteMessage(ctx.chatId, ctx.msgId)
        await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/bar.jpg'), {
            reply_markup: menuKeyboard,
            caption: 'Подобрать микс',
        })
    }
)

bot.callbackQuery('category', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    await bot.api.deleteMessage(chatId, msgId)
    await bot.api.sendPhoto(chatId, new InputFile('./img/bar.jpg'), {
        reply_markup: new InlineKeyboard()
            .text('Фруктовый', 'fruit').row()
            .text('Ягодный', 'berries').row()
            .text('Десертно-сливочный', 'dessert and cream').row()
            .text('Десертно-шоколадный', 'dessert and chocolate').row()
            .text('Цитрусовый', 'citrus').row()
            .text('Цветочно-травянистый', 'floral-herbaceous').row()
            .text('Лимонадный', 'lemonade').row()
            .text('Чайный', 'tea').row()
            .text('Алкогольный', 'alcoholic').row()
            .text('Пряный', 'spicy').row()
            .text('Тропический', 'tropical').row()
            .text('Свежий', 'fresh').row()
            .text('Гаструха', 'gastro').row()
            .text('Назад в меню', 'backToMenu'),
        caption: 'Выберите основу микса'
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('taste', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    await bot.api.sendPhoto(chatId, new InputFile('./img/bar.jpg'), {
        reply_markup: new InlineKeyboard()
            .text('Сладкий', 'sweet').row()
            .text('Кислый', 'sour').row()
            .text('Кисло-сладкий', 'sweet and sour').row()
            .text('Горький', 'bitter').row()
            .text('Солёный', 'salty').row()
            .text('Острый', 'spicy').row()
            .text('Назад в меню', 'backToMenu'),
        caption: 'Выберите основу микса'
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('ingredient', async (ctx) => {
    await ctx.reply('Для продолжения воспользуйтесь полем ввода и введите интересующий вас ингредиент'
    )
    await ctx.answerCallbackQuery()
})


bot.callbackQuery('backToMenu', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    await ctx.api.deleteMessage(chatId, msgId)
    // await ctx.api.editMessageText(chatId, msgId, 'Подобрать микс', {
    //     reply_markup: menuKeyboard
    // })
    await bot.api.sendPhoto(ctx.chatId, new InputFile('./img/bar.jpg'), {
        reply_markup: menuKeyboard,
        caption: 'Подобрать микс',
    })
    await ctx.answerCallbackQuery()
})

bot.on('message:text', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    const requiredIng = ctx.message.text.toLowerCase().trim()
    await ctx.api.sendMessage(ctx.chatId, 'Обработка запроса...')
    let result = findMixByIng(mixes, requiredIng)
    result = getIngredients(result)
    if (Boolean(result.length)) {
        if (result.length > 1) {
            setTimeout(async () => {
                await bot.api.deleteMessage(chatId, msgId+1)
                await bot.api.sendPhoto(chatId, new InputFile('./img/hookahTime.jpg'), {
                reply_markup: menuKeyboard,
                caption: `Попробуйте следующие миксы:\n${result}`
                })
            }, 1000)
            
            // await ctx.reply(`Попробуйте следующие миксы:\n${result}`, {
            //     reply_markup: menuKeyboard
            // })
        } else {
            // await ctx.reply(`Попробуйте следующий микс:\n${result}`, {
            //     reply_markup: menuKeyboard
            // })
            setTimeout(async () => {
                await bot.api.deleteMessage(chatId, msgId+1)
                await bot.api.sendPhoto(chatId, new InputFile('./img/hookahTime.jpg'), {
                reply_markup: menuKeyboard,
                caption: `Попробуйте следующие миксы:\n${result}`
                })
            }, 1000)
            // await bot.api.deleteMessage(chatId, msgId+1)
            // await bot.api.sendPhoto(chatId, new InputFile('./img/hookahTime.jpg'), {
            //     reply_markup: menuKeyboard,
            //     caption: `Попробуйте следующие миксы:\n${result}`
            // })
        }
        
    } else {
        // await ctx.api.deleteMessage(ctx.msgId+1)
        // await ctx.reply('Вы могли бы получить список охуенно вкусных миксочков, но дядька Зил пока занят, поэтому можешь пока забить вишню с колой и завилить еблет', {
        //     reply_markup: menuKeyboard
        // })
        setTimeout(async () => {
            await bot.api.deleteMessage(chatId, msgId+1)
            await bot.api.sendPhoto(chatId, new InputFile('./img/work.jpg'), {
                reply_markup: new InlineKeyboard().text('Назад в меню', 'backToMenu'),
                caption: `Вы могли бы получить список охуенно вкусных миксочков, но дядька Зил пока занят, поэтому можешь пока забить вишню с колой и завилить еблет`
                })
        }, 1000)
    }
})


// bot.on('message').filter(
//     async (ctx) => {
//       const user = await ctx.getAuthor();
//       return user.status === "creator" || user.status === "administrator";
//     },
//     (ctx) => {
//         // Обрабатывает сообщения от создателей и админов.
//         console.log(ctx);
        
//     },
// );
  
bot.on('callback_query:data', async (ctx) => {
    const data = ctx.update.callback_query.data
    const chatId = ctx.chatId
    if (Boolean(data.length) && Boolean(Object.keys(mixes).length)) {
        let relevantMixes = []
        for (let name in mixes) {   
            if (mixes[name].category.includes(data)) {                
                if (!relevantMixes.includes(mixes[name])) {
                    relevantMixes.push(mixes[name])
                }
            } else if (mixes[name].taste.includes(data)) {
                if (!relevantMixes.includes(mixes[name])) {
                    relevantMixes.push(mixes[name])
                }
            }
        }
        let result = relevantMixes.map((mix) => {
            const ings = Object.keys(mix.ingredients)
            let resultArr = []
            for (let ing of ings) {
                let response = `${ing} ${mix.ingredients[ing].percentage}%`
                resultArr.push(response)
            }        
            return resultArr.join(' + ')
        })
        let resp = ''        
        for (let i = 0; i < result.length; i++) {
            resp = `${resp}\n${i + 1}. ${result[i]}`
        }  
        if (Boolean(resp)) {
            // await ctx.api.sendMessage(ctx.chatId, resp, {
            //     reply_markup: new InlineKeyboard().text('Назад в меню', 'backToMenu')
            // })
            await bot.api.sendPhoto(chatId, new InputFile('./img/hookahTime.jpg'), {
                reply_markup: new InlineKeyboard().text('Назад в меню', 'backToMenu'),
                caption: `Попробуйте следующие миксы:\n${resp}`
                })
        } else {
            // await ctx.api.sendMessage(ctx.chatId, 'Вы могли бы получить список охуенно вкусных миксочков, но дядька Зил пока занят, поэтому можешь пока забить вишню с колой и завилить еблет', {
            //     reply_markup: menuKeyboard
            // })
            await bot.api.sendPhoto(chatId, new InputFile('./img/work.jpg'), {
                reply_markup: new InlineKeyboard().text('Назад в меню', 'backToMenu'),
                caption: `Вы могли бы получить список охуенно вкусных миксочков, но дядька Зил пока занят, поэтому можешь пока забить вишню с колой и завилить еблет`
                })
        }
        await ctx.answerCallbackQuery();
    }
   
   
})


bot.catch((err) => {
	const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    console.error(ctx.from, 'вызваная команда: ', ctx.update.message.text);
	const e = err.error;

	if (e instanceof GrammyError) {
		console.error("Error in request:", e);
	} else if (e instanceof HttpError) {
		console.error("Could not connect to Telegram", e);
	} else {
		console.error('Unknown error:', e);
	}
})
bot.start();
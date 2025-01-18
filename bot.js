import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
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


// start menu
const menuKeyboard = new InlineKeyboard()
    .text('По категории', 'category').row()
    .text('По вкусу', 'taste').row()
    .text('Ингредиенты', 'ingredient').row()
    .url('Канал о кальянах', 'https://t.me/hookah_test01').row()

const goToMixKeyboard = new InlineKeyboard().text('Перейти к миксам', 'mix')


bot.command('start', async (ctx) => {
    const id = ctx.from.id;
    const chatId = ctx.msg.chat.id
    const msgId = ctx.msgId
    try {
        let pass = await bot.api.getChatMember('@hookah_test01', id);        
        if (pass.status == 'member' || pass.status == 'administrator' || pass.status == 'creator') {
            console.log(`Пользователь с id: ${id} подписан на канал`);
            await ctx.reply(`Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a>`, {
                parse_mode: 'HTML',
                reply_markup: goToMixKeyboard
        })
        } else {
            console.log(`Пользователь с id: ${id} не подписан на канал, выпоняем блок ELSE`);
            await ctx.reply(`Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a> для продолжения необходимо подписаться на канал`, {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard()
                    .url('Канал о кальянах', 'https://t.me/hookah_test01').row()
                    .text('Проверить подписку', 'start')
        })
        }
    } catch (error) {
        await ctx.reply(`Привет, я - бот тг-канала: <a href="https://t.me/hookah_test01">hookah_test01_channel</a> для продолжения необходимо подписаться на канал`, {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard()
                .url('Канал о кальянах', 'https://t.me/hookah_test01').row()
                .text('Проверить подписку', 'start')
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
        await ctx.api.editMessageText(chatId, msgId, 'Подобрать микс', {
        parse_mode: HTML,    
        reply_markup: menuKeyboard
        })
    }
)

bot.callbackQuery('start', async (ctx) => {
        const id = ctx.from.id;
        const chatId = ctx.chatId
        const msgId = ctx.msgId
        try {
        let pass = await bot.api.getChatMember('@hookah_test01', id);        
        if (pass.status == 'member' || pass.status == 'administrator' || pass.status == 'creator') {
            console.log(`Теперь пользователь с id: ${id} подписался на канал!`);
            await ctx.api.editMessageText(chatId, msgId, 'Отлично, спасибо за подписку, теперь ты можешь продолжить', {
                reply_markup: goToMixKeyboard
            })
            await ctx.answerCallbackQuery()
        } else {
            console.log('Настырный пользователь не подписывается');
            await ctx.api.editMessageText(chatId, msgId, 'Вы не подписались на канал. Для продолжения необходимо подписаться', {
                reply_markup: new InlineKeyboard()
                    .url('Канал о кальянах', 'https://t.me/hookah_test01').row()
                    .text('Проверить подписку', 'start')
            })
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
        await ctx.api.editMessageText(chatId, msgId, 'Подобрать микс', {
        reply_markup: menuKeyboard
        })
    }
)

bot.callbackQuery('category', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    await ctx.answerCallbackQuery()
    await ctx.api.editMessageText(chatId, msgId, 'Выберите основу микса', {
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
            .text('Назад в меню', 'backToMenu')
    })
})

bot.callbackQuery('taste', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    await ctx.answerCallbackQuery()
    await ctx.api.editMessageText(chatId, msgId, 'Выберите вкус микса', {
        reply_markup: new InlineKeyboard()
            .text('Сладкий', 'sweet').row()
            .text('Кислый', 'sour').row()
            .text('Кисло-сладкий', 'sweet and sour').row()
            .text('Горький', 'bitter').row()
            .text('Солёный', 'salty').row()
            .text('Острый', 'spicy').row()
            .text('Назад в меню', 'backToMenu')
    })
})

bot.callbackQuery('ingredient', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    await ctx.reply('Для продолжения воспользуйтесь полем ввода и введите интересующий вас ингредиент'
    )
    await ctx.answerCallbackQuery()
})


bot.callbackQuery('backToMenu', async (ctx) => {
    const chatId = ctx.chatId
    const msgId = ctx.msgId
    await ctx.answerCallbackQuery()
    await ctx.api.editMessageText(chatId, msgId, 'Подобрать микс', {
        reply_markup: menuKeyboard
    })
})

bot.on('message:text', async (ctx) => {
    console.log(ctx);
    const requiredIng = ctx.message.text.toLowerCase().trim()
    await ctx.api.sendMessage(ctx.chatId, 'Обработка запроса...')
    let result = findMixByIng(mixes, requiredIng)
    result = getIngredients(result)
    if (Boolean(result.length)) {
        // await ctx.api.deleteMessage(ctx.update.message.message_id)
        if (result.length > 1) {
            await ctx.reply(`Попробуйте следующие миксы:\n${result}`, {
                reply_markup: menuKeyboard
            })
        } else {
            await ctx.reply(`Попробуйте следующий микс:\n${result}`, {
                reply_markup: menuKeyboard
            })
        }
        
    } else {
        // await ctx.api.deleteMessage(ctx.msgId+1)
        await ctx.reply('Вы могли бы получить список охуенно вкусных миксочков, но дядька Зил пока занят, поэтому можешь пока забить вишню с колой и завилить еблет', {
            reply_markup: menuKeyboard
        })
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
            await ctx.api.sendMessage(ctx.chatId, resp, {
                reply_markup: new InlineKeyboard().text('Назад в меню', 'backToMenu')
            })
        } else {
            await ctx.api.sendMessage(ctx.chatId, 'Вы могли бы получить список охуенно вкусных миксочков, но дядька Зил пока занят, поэтому можешь пока забить вишню с колой и завилить еблет', {
                reply_markup: menuKeyboard
            })
        }
        await ctx.answerCallbackQuery();
    }
   
   
})


bot.catch((err) => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}:`);
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
import { Bot, Keyboard } from '@maxhub/max-bot-api';

const bot = new Bot(TOKEN);

const register_keyboard = Keyboard.inlineKeyboard([
  [Keyboard.button.link('Открыть миниапп', 'https://vik0t.github.io/maxui-app.io/')],
]);


// Добавьте слушатели обновлений
// MAX Bot API будет вызывать их, когда пользователи взаимодействуют с ботом

function is_registred(user) {
    if (true) {             // make some checks
        return false;
    }
}

async function start(ctx) {
    if (is_registred(ctx.user)) {
        await ctx.reply('Доступные команды:');
    } else {
        await ctx.reply('Вы еще не зарегистрированы! \
            Чтобы войти в аккаунт запустите миниприложение и войдите в свой кабинет.',
        {attachments: [register_keyboard]});
    }
}

// Обработчик для команды '/start'
bot.command('start', start);
bot.on('bot_started', start);

// Теперь можно запустить бота, чтобы он подключился к серверам MAX и ждал обновлений
bot.start();

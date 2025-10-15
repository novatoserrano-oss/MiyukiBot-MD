let handler = async (m, { conn, usedPrefix, command, args }) => {
  let chat = global.db.data.chats[m.chat];
  if (!(m.chat in global.db.data.chats)) {
    return conn.reply(m.chat, `🌸 *¡Este lugar aún no pertenece a MiyukiBot-MD!* 💕`, m);
  }

  if (command === 'bot') {
    if (args.length === 0) {
      const estado = chat.isBanned ? '✘ 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊 🌙' : '✔ 𝘼𝘾𝙏𝙄𝙑𝙊 🌸';
      const info = `
╭───🌸 〘 *MiyukiBot-MD Control Center* 〙 🌸───╮
│
│ 💫 *Solo los administradores pueden controlar a Miyuki.*
│
│ 🎀 *Comandos Disponibles:*
│    ◦ ${usedPrefix}bot on  ➜ *Activar a Miyuki*
│    ◦ ${usedPrefix}bot off ➜ *Descansar a Miyuki*
│
│ 🌷 *Estado Actual:* ${estado}
│
│ 🩵 *Miyuki siempre cuidando de su servidor con amor~* 💌
│
╰───❀ 〘 *MiyukiBot-MD* 〙❀───╯`;
      return conn.reply(m.chat, info, fkontak, fake);
    }

    if (args[0] === 'off') {
      if (chat.isBanned) {
        return conn.reply(m.chat, `😴 *Miyuki ya está descansando en este grupo...* 🌙`, m);
      }
      chat.isBanned = true;
      return conn.reply(m.chat, `💤 *Miyuki entra en modo descanso... el grupo queda en calma.* 💤`, m);
    } else if (args[0] === 'on') {
      if (!chat.isBanned) {
        return conn.reply(m.chat, `🌸 *Miyuki ya está despierta y lista para ayudarte!* 💖`, m);
      }
      chat.isBanned = false;
      return conn.reply(m.chat, `✨ *Miyuki vuelve al grupo con energía y ternura~* 💕`, m);
    }
  }
};

handler.help = ['bot'];
handler.tags = ['grupo'];
handler.command = ['bot'];
handler.admin = true;

export default handler;
import ws from 'ws'

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const subBots = [
      ...new Set(
        global.conns
          .filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)
          .map(c => c.user.jid)
      ),
    ]

    if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
      subBots.push(global.conn.user.jid)
    }

    const chat = global.db.data.chats[m.chat]
    const mentionedJid = m.mentionedJid || []
    const who = mentionedJid[0]
      ? mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : false

    if (!who)
      return conn.reply(
        m.chat,
        `❀ Por favor, menciona a un *Socket* para hacerlo Bot principal del grupo.\n\nEjemplo:\n${usedPrefix}setprimary @usuario`,
        m
      )

    if (!subBots.includes(who))
      return conn.reply(
        m.chat,
        `ꕥ El usuario mencionado no es un *Socket activo* de ${botname || 'este sistema'}.`,
        m
      )

    if (chat.primaryBot === who)
      return conn.reply(
        m.chat,
        `ꕥ @${who.split('@')[0]} ya está establecido como Bot primario en este grupo.`,
        m,
        { mentions: [who] }
      )

    chat.primaryBot = who

    await conn.reply(
      m.chat,
      `❀ Se ha establecido a @${who.split('@')[0]} como *Bot primario* de este grupo.\n\n> A partir de ahora, todos los comandos serán ejecutados por @${who.split('@')[0]}.`,
      m,
      { mentions: [who] }
    )

  } catch (e) {
    conn.reply(
      m.chat,
      `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`,
      m
    )
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler
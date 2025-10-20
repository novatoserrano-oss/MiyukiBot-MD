import ws from 'ws'

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return

  const chat = global.db.data.chats[m.chat]

  const subBots = [
    ...new Set([
      ...global.conns
        .filter(c => c?.user && c?.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
        .map(c => c.user.jid)
    ])
  ]

  if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
    subBots.push(global.conn.user.jid)
  }

  if (
    chat?.primaryBot &&
    chat.primaryBot !== conn.user.jid &&
    command !== 'setprimary' &&
    command !== 'delprimary'
  ) {
    return
  }

  if (command === 'setprimary') {
    const mentionedJid = m.mentionedJid || []
    const who = mentionedJid[0]
      ? mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : false

    if (!who)
      return conn.reply(
        m.chat,
        `✿ Menciona a un *subbot* para establecerlo como principal.`,
        m
      )

    if (!subBots.includes(who))
      return conn.reply(
        m.chat,
        `⚠️ El usuario mencionado no es un *Socket/Subbot* válido.`,
        m
      )

    if (chat.primaryBot === who)
      return conn.reply(
        m.chat,
        `✿ @${who.split('@')[0]} ya es el *bot principal* del grupo.`,
        m,
        { mentions: [who] }
      )

    chat.primaryBot = who
    conn.reply(
      m.chat,
      `✿ Se ha establecido a @${who.split('@')[0]} como *Bot Principal*.\n✿ Solo él responderá los comandos en este grupo.`,
      m,
      { mentions: [who] }
    )
  }

  if (command === 'delprimary') {
    if (!chat.primaryBot)
      return conn.reply(
        m.chat,
        `⚠️ Este grupo no tiene bot principal asignado.`,
        m
      )

    delete chat.primaryBot
    conn.reply(
      m.chat,
      `✿ Se ha eliminado el bot principal.\n✿ Ahora todos los subbots pueden responder.`,
      m
    )
  }
}

handler.help = ['setprimary', 'delprimary']
handler.tags = ['grupo']
handler.command = ['setprimary', 'delprimary']
handler.group = true
handler.admin = true

export default handler
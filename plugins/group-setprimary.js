import ws from 'ws'

let handler = async (m, { conn, usedPrefix, command }) => {
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

  if (command === 'setprimary') {
    const mentionedJid = m.mentionedJid || []
    const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? m.quoted.sender : false

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

handler.before = async function (m, { conn }) {
  try {
    if (!m.isGroup) return !0

    const chat = global.db.data.chats[m.chat]
    const esteBot = conn.user.jid
    const texto = m.text?.toLowerCase() || ''

    if (texto.startsWith('.setprimary') || texto.startsWith('.delprimary')) return !0

    if (chat?.primaryBot) {
      const botPrincipal = chat.primaryBot
      if (botPrincipal !== esteBot) return !1
    }
  } catch (e) {
    console.error('Error en filtro primaryBot:', e)
  }
  return !0
}

handler.help = ['setprimary', 'delprimary']
handler.tags = ['grupo']
handler.command = ['setprimary', 'delprimary']
handler.group = true
handler.admin = true

export default handler
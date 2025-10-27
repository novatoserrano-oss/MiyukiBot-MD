import ws from 'ws'

const handler = async (m, { conn, usedPrefix }) => {
  try {
    // 🧩 Obtener los bots activos
    const subBots = [
      ...new Set([
        ...global.conns
          .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
          .map(c => c.user.jid)
      ])
    ]

    // Asegurar que el bot principal esté en la lista
    if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
      subBots.push(global.conn.user.jid)
    }

    // 🧠 Obtener el chat actual
    const chat = global.db.data.chats[m.chat]
    const mentionedJid = m.mentionedJid || []
    const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? m.quoted.sender : null

    // 🚫 Validaciones
    if (!who)
      return conn.reply(
        m.chat,
        `❀ Por favor, *menciona al Socket/SubBot* que deseas establecer como *Bot Principal* del grupo.`,
        m
      )

    if (!subBots.includes(who))
      return conn.reply(
        m.chat,
        `⚠️ El usuario mencionado no es un Socket activo de *${global.botname || 'este sistema'}*.`,
        m
      )

    if (chat.primaryBot === who) {
      return conn.reply(
        m.chat,
        `⚙️ @${who.split('@')[0]} ya está configurado como *Bot Primario* en este grupo.`,
        m,
        { mentions: [who] }
      )
    }

    // 🧾 Guardar nuevo bot principal
    chat.primaryBot = who

    // 💬 Mensaje visual mejorado
    const message = `
╔═══〔 *⚙️ BOT PRINCIPAL CONFIGURADO* 〕═══╗

🧠 *Nuevo Bot Primario del Grupo:*
> @${who.split('@')[0]}

📡 *Estado:* Activo y en línea  
⚙️ *Modo:* Solo el bot principal ejecutará comandos aquí.  

━━━━━━━━━━━━━━━━━━
💡 *Información:*
Los SubBots conectados seguirán activos en la red,
pero no responderán a comandos dentro de este grupo.
╚═════════════════════════════════╝
`

    await conn.reply(m.chat, message, m, { mentions: [who] })
  } catch (e) {
    console.error(e)
    conn.reply(
      m.chat,
      `⚠️ Se ha producido un error.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`,
      m
    )
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary', 'setbotprincipal', 'setmain']
handler.group = true
handler.admin = true

export default handler
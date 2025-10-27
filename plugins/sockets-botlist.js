import ws from "ws"

const handler = async (m, { conn, usedPrefix, participants }) => {
  try {
    // Asegurar existencia de global.conns
    global.conns = global.conns || []

    // Lista de bots activos (principal + subbots con conexión abierta)
    const users = [
      global.conn.user.jid,
      ...new Set(
        global.conns
          .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
          .map(c => c.user.jid)
      )
    ]

    // Función para convertir milisegundos a formato legible
    const convertirMsADiasHorasMinutosSegundos = (ms) => {
      const segundos = Math.floor(ms / 1000)
      const minutos = Math.floor(segundos / 60)
      const horas = Math.floor(minutos / 60)
      const días = Math.floor(horas / 24)
      const segRest = segundos % 60
      const minRest = minutos % 60
      const horasRest = horas % 24
      let resultado = ""
      if (días) resultado += `${días} días, `
      if (horasRest) resultado += `${horasRest} horas, `
      if (minRest) resultado += `${minRest} minutos, `
      if (segRest) resultado += `${segRest} segundos`
      return resultado.trim() || "Hace poco"
    }

    // Bots presentes en el grupo actual
    let groupBots = users.filter(bot => participants.some(p => p.id === bot))
    if (!groupBots.includes(global.conn.user.jid)) groupBots.push(global.conn.user.jid)

    // Si no hay bots en el grupo
    if (!groupBots.length) {
      await conn.sendMessage(m.chat, { text: "✧ No hay bots activos en este grupo." }, { quoted: m })
      return
    }

    // Construir mensaje con detalles de cada bot
    const botsGroup = groupBots.map((bot, index) => {
      const isMain = bot === global.conn.user.jid
      const subConn = global.conns.find(c => c.user?.jid === bot)
      const uptime = isMain
        ? convertirMsADiasHorasMinutosSegundos(Date.now() - (global.conn.startTime || global.conn.uptime || 0))
        : subConn?.uptime
          ? convertirMsADiasHorasMinutosSegundos(Date.now() - subConn.uptime)
          : "Activo recientemente"
      const numero = bot.replace(/[^0-9]/g, '')
      return `🟢 *${isMain ? "BOT PRINCIPAL" : `SUBBOT #${index}`}*
✦ Número: +${numero}
✦ Tipo: ${isMain ? "Principal" : "Sub-Bot"}
✦ Uptime: ${uptime}`
    }).join("\n\n")

    const message = `*「 ✦ LISTA DE BOTS ACTIVOS 」*\n
🧩 *Principal:* 1
🤖 *Sub-Bots:* ${users.length - 1}
💬 *En este grupo:* ${groupBots.length}\n
───────────────────────
${botsGroup}
───────────────────────`

    const mentionList = groupBots.map(bot =>
      bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`
    )

    // Envío del mensaje final
    await conn.sendMessage(
      m.chat,
      {
        text: message,
        contextInfo: { mentionedJid: mentionList }
      },
      { quoted: m }
    )

  } catch (error) {
    console.error(error)
    m.reply(`⚠️ Ocurrió un error.\nUsa *${usedPrefix}report* para informarlo.\n\n> ${error.message}`)
  }
}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = ["botlist", "listbots", "listbot", "bots", "sockets", "socket"]

export default handler
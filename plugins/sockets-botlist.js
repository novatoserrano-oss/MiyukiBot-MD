import ws from "ws"

const handler = async (m, { conn, usedPrefix, participants }) => {
  try {
    // Asegurar que global.conns exista
    global.conns = global.conns || []

    // Todos los bots activos (Principal + SubBots)
    const allBots = [
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

    // Determinar bots presentes en el grupo actual
    let groupBots = allBots.filter(bot => participants.some(p => p.id === bot))
    if (!groupBots.includes(global.conn.user.jid)) groupBots.push(global.conn.user.jid)

    // Datos del BOT PRINCIPAL
    const mainBotNumber = global.conn.user.jid.replace(/[^0-9]/g, '')
    const mainUptime = convertirMsADiasHorasMinutosSegundos(Date.now() - (global.conn.startTime || global.conn.uptime || 0))

    // Datos de los SUBBOTS conectados
    const subBots = global.conns
      .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
      .map((c, i) => {
        const numero = c.user.jid.replace(/[^0-9]/g, '')
        const uptime = c.uptime
          ? convertirMsADiasHorasMinutosSegundos(Date.now() - c.uptime)
          : "Activo recientemente"
        return `🤖 *SubBot #${i + 1}*
✦ Número: +${numero}
✦ Uptime: ${uptime}`
      })

    // Si no hay subbots
    const subBotsText = subBots.length > 0 ? subBots.join("\n\n") : "✧ No hay SubBots conectados actualmente."

    // Bots dentro del grupo
    const groupBotsText = groupBots.map(bot => `• +${bot.replace(/[^0-9]/g, '')}`).join("\n") || "Ninguno"

    // Mensaje final
    const message = `*「 ✦ LISTA DE BOTS ACTIVOS 」*\n
🧩 *Bot Principal:*
✦ Número: +${mainBotNumber}
✦ Uptime: ${mainUptime}\n
────────────────────────────
🤖 *SubBots Conectados:* ${subBots.length}
${subBotsText}
────────────────────────────
💬 *Bots en este grupo:* ${groupBots.length}
${groupBotsText}
────────────────────────────`

    // Menciones
    const mentionList = allBots.map(bot =>
      bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`
    )

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
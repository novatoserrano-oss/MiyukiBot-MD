import ws from "ws"

const handler = async (m, { conn, usedPrefix, participants }) => {
  try {
    // Asegurar que global.conns exista
    global.conns = global.conns || []

    // Definir el máximo de subbots permitidos
    const MAX_SUBBOTS = 3

    // Función auxiliar: detectar país según el prefijo
    const detectarPais = (numero) => {
      const prefijo = numero.slice(0, 2)
      const codigos = {
        "52": "🇲🇽 México",
        "54": "🇦🇷 Argentina",
        "56": "🇨🇱 Chile",
        "57": "🇨🇴 Colombia",
        "58": "🇻🇪 Venezuela",
        "591": "🇧🇴 Bolivia",
        "593": "🇪🇨 Ecuador",
        "595": "🇵🇾 Paraguay",
        "598": "🇺🇾 Uruguay",
        "505": "🇳🇮 Nicaragua",
        "507": "🇵🇦 Panamá",
        "591": "🇧🇴 Bolivia",
        "34": "🇪🇸 España",
        "1": "🇺🇸 Estados Unidos",
      }
      for (const code in codigos) {
        if (numero.startsWith(code)) return codigos[code]
      }
      return "🌎 Desconocido"
    }

    // Función para convertir ms a texto legible
    const convertirMsADiasHorasMinutosSegundos = (ms) => {
      const segundos = Math.floor(ms / 1000)
      const minutos = Math.floor(segundos / 60)
      const horas = Math.floor(minutos / 60)
      const días = Math.floor(horas / 24)
      const segRest = segundos % 60
      const minRest = minutos % 60
      const horasRest = horas % 24
      let resultado = ""
      if (días) resultado += `${días}d `
      if (horasRest) resultado += `${horasRest}h `
      if (minRest) resultado += `${minRest}m `
      if (segRest) resultado += `${segRest}s`
      return resultado.trim() || "recién iniciado"
    }

    // Lista de todos los bots activos (Principal + SubBots)
    const allBots = [
      global.conn.user.jid,
      ...new Set(
        global.conns
          .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
          .map(c => c.user.jid)
      )
    ]

    // --- Información del BOT PRINCIPAL ---
    const mainNumber = global.conn.user.jid.replace(/[^0-9]/g, '')
    const mainName = global.conn.user.name || "Bot Principal"
    const mainCountry = detectarPais(mainNumber)
    const mainUptime = convertirMsADiasHorasMinutosSegundos(Date.now() - (global.conn.startTime || global.conn.uptime || 0))

    // --- Información de los SUBBOTS ---
    const subBots = global.conns
      .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
      .map((c, i) => {
        const numero = c.user.jid.replace(/[^0-9]/g, '')
        const nombre = c.user.name || `SubBot #${i + 1}`
        const pais = detectarPais(numero)
        const uptime = c.uptime
          ? convertirMsADiasHorasMinutosSegundos(Date.now() - c.uptime)
          : "Activo recientemente"
        return `┌───『 🤖 SubBot #${i + 1} 』
│ 👤 Nombre: *${nombre}*
│ 📞 Número: +${numero}
│ 🌍 País: ${pais}
│ ⏱ Uptime: ${uptime}
└───────────────`
      })

    // Cálculo de cupos
    const usados = subBots.length
    const libres = Math.max(0, MAX_SUBBOTS - usados)

    // --- Bots en el grupo actual ---
    let groupBots = allBots.filter(bot => participants.some(p => p.id === bot))
    if (!groupBots.includes(global.conn.user.jid)) groupBots.push(global.conn.user.jid)
    const groupBotsText = groupBots.map(bot => `• +${bot.replace(/[^0-9]/g, '')}`).join("\n") || "Ninguno"

    // --- Mensaje final ---
    const message = `
╭─〔 *📋 PANEL DE BOTS ACTIVOS* 〕─╮
│
│ 🤖 *BOT PRINCIPAL*
│ 👤 Nombre: *${mainName}*
│ 📞 Número: +${mainNumber}
│ 🌍 País: ${mainCountry}
│ ⏱ Uptime: ${mainUptime}
│
├─〔 *CUPOS DE SUBBOTS* 〕
│ 🔹 Cupos Activos: ${MAX_SUBBOTS}
│ 🔸 Cupos Usados: ${usados}
│ ⚪ Cupos Libres: ${libres}
│
├─〔 *LISTA DE SUBBOTS CONECTADOS* 〕
${subBots.length > 0 ? subBots.join("\n\n") : "✧ No hay SubBots conectados actualmente."}
│
├─〔 *BOTS EN ESTE GRUPO* 〕
${groupBotsText}
│
╰────────────────────────────╯
`

    // Menciones
    const mentionList = allBots.map(bot =>
      bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`
    )

    await conn.sendMessage(
      m.chat,
      {
        text: message.trim(),
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
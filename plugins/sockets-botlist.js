import ws from "ws"

const handler = async (m, { conn, usedPrefix, participants }) => {
  try {
    global.conns = global.conns || []
    const MAX_SUBBOTS = 3

    // 🌍 Detección de país por prefijo telefónico
    const detectarPais = (numero) => {
      const codigos = {
        "1": "🇺🇸 Estados Unidos / 🇨🇦 Canadá",
        "7": "🇷🇺 Rusia / 🇰🇿 Kazajistán",
        "20": "🇪🇬 Egipto",
        "27": "🇿🇦 Sudáfrica",
        "30": "🇬🇷 Grecia",
        "31": "🇳🇱 Países Bajos",
        "32": "🇧🇪 Bélgica",
        "33": "🇫🇷 Francia",
        "34": "🇪🇸 España",
        "36": "🇭🇺 Hungría",
        "39": "🇮🇹 Italia",
        "40": "🇷🇴 Rumania",
        "41": "🇨🇭 Suiza",
        "43": "🇦🇹 Austria",
        "44": "🇬🇧 Reino Unido",
        "45": "🇩🇰 Dinamarca",
        "46": "🇸🇪 Suecia",
        "47": "🇳🇴 Noruega",
        "48": "🇵🇱 Polonia",
        "49": "🇩🇪 Alemania",
        "51": "🇵🇪 Perú",
        "52": "🇲🇽 México",
        "53": "🇨🇺 Cuba",
        "54": "🇦🇷 Argentina",
        "55": "🇧🇷 Brasil",
        "56": "🇨🇱 Chile",
        "57": "🇨🇴 Colombia",
        "58": "🇻🇪 Venezuela",
        "60": "🇲🇾 Malasia",
        "61": "🇦🇺 Australia",
        "62": "🇮🇩 Indonesia",
        "63": "🇵🇭 Filipinas",
        "64": "🇳🇿 Nueva Zelanda",
        "65": "🇸🇬 Singapur",
        "66": "🇹🇭 Tailandia",
        "81": "🇯🇵 Japón",
        "82": "🇰🇷 Corea del Sur",
        "84": "🇻🇳 Vietnam",
        "86": "🇨🇳 China",
        "90": "🇹🇷 Turquía",
        "91": "🇮🇳 India",
        "92": "🇵🇰 Pakistán",
        "93": "🇦🇫 Afganistán",
        "94": "🇱🇰 Sri Lanka",
        "95": "🇲🇲 Myanmar",
        "98": "🇮🇷 Irán",
        "212": "🇲🇦 Marruecos",
        "213": "🇩🇿 Argelia",
        "216": "🇹🇳 Túnez",
        "218": "🇱🇾 Libia",
        "220": "🇬🇲 Gambia",
        "221": "🇸🇳 Senegal",
        "222": "🇲🇷 Mauritania",
        "223": "🇲🇱 Mali",
        "224": "🇬🇳 Guinea",
        "225": "🇨🇮 Costa de Marfil",
        "226": "🇧🇫 Burkina Faso",
        "227": "🇳🇪 Níger",
        "228": "🇹🇬 Togo",
        "229": "🇧🇯 Benín",
        "230": "🇲🇺 Mauricio",
        "231": "🇱🇷 Liberia",
        "232": "🇸🇱 Sierra Leona",
        "233": "🇬🇭 Ghana",
        "234": "🇳🇬 Nigeria",
        "235": "🇹🇩 Chad",
        "236": "🇨🇫 República Centroafricana",
        "237": "🇨🇲 Camerún",
        "238": "🇨🇻 Cabo Verde",
        "239": "🇸🇹 Santo Tomé y Príncipe",
        "240": "🇬🇶 Guinea Ecuatorial",
        "241": "🇬🇦 Gabón",
        "242": "🇨🇬 Congo",
        "243": "🇨🇩 R.D. del Congo",
        "244": "🇦🇴 Angola",
        "245": "🇬🇼 Guinea-Bisáu",
        "248": "🇸🇨 Seychelles",
        "249": "🇸🇩 Sudán",
        "250": "🇷🇼 Ruanda",
        "251": "🇪🇹 Etiopía",
        "252": "🇸🇴 Somalia",
        "253": "🇩🇯 Yibuti",
        "254": "🇰🇪 Kenia",
        "255": "🇹🇿 Tanzania",
        "256": "🇺🇬 Uganda",
        "257": "🇧🇮 Burundi",
        "258": "🇲🇿 Mozambique",
        "260": "🇿🇲 Zambia",
        "261": "🇲🇬 Madagascar",
        "263": "🇿🇼 Zimbabue",
        "264": "🇳🇦 Namibia",
        "265": "🇲🇼 Malaui",
        "266": "🇱🇸 Lesoto",
        "267": "🇧🇼 Botsuana",
        "268": "🇸🇿 Suazilandia",
        "269": "🇰🇲 Comoras",
        "290": "🇸🇭 Santa Helena",
        "291": "🇪🇷 Eritrea",
        "297": "🇦🇼 Aruba",
        "298": "🇫🇴 Islas Feroe",
        "299": "🇬🇱 Groenlandia",
        "350": "🇬🇮 Gibraltar",
        "351": "🇵🇹 Portugal",
        "352": "🇱🇺 Luxemburgo",
        "353": "🇮🇪 Irlanda",
        "354": "🇮🇸 Islandia",
        "355": "🇦🇱 Albania",
        "356": "🇲🇹 Malta",
        "357": "🇨🇾 Chipre",
        "358": "🇫🇮 Finlandia",
        "359": "🇧🇬 Bulgaria",
        "370": "🇱🇹 Lituania",
        "371": "🇱🇻 Letonia",
        "372": "🇪🇪 Estonia",
        "373": "🇲🇩 Moldavia",
        "374": "🇦🇲 Armenia",
        "375": "🇧🇾 Bielorrusia",
        "376": "🇦🇩 Andorra",
        "377": "🇲🇨 Mónaco",
        "380": "🇺🇦 Ucrania",
        "381": "🇷🇸 Serbia",
        "382": "🇲🇪 Montenegro",
        "385": "🇭🇷 Croacia",
        "386": "🇸🇮 Eslovenia",
        "387": "🇧🇦 Bosnia y Herzegovina",
        "389": "🇲🇰 Macedonia del Norte",
        "420": "🇨🇿 República Checa",
        "421": "🇸🇰 Eslovaquia",
        "423": "🇱🇮 Liechtenstein",
        "500": "🇫🇰 Islas Malvinas",
        "501": "🇧🇿 Belice",
        "502": "🇬🇹 Guatemala",
        "503": "🇸🇻 El Salvador",
        "504": "🇭🇳 Honduras",
        "505": "🇳🇮 Nicaragua",
        "506": "🇨🇷 Costa Rica",
        "507": "🇵🇦 Panamá",
        "509": "🇭🇹 Haití",
        "51": "🇵🇪 Perú",
        "591": "🇧🇴 Bolivia",
        "592": "🇬🇾 Guyana",
        "593": "🇪🇨 Ecuador",
        "595": "🇵🇾 Paraguay",
        "597": "🇸🇷 Surinam",
        "598": "🇺🇾 Uruguay"
      }

      // Buscar el país según prefijo
      for (const code in codigos) {
        if (numero.startsWith(code)) return codigos[code]
      }
      return "🌎 Desconocido"
    }

    // 🕒 Conversor de tiempo
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

    // 🧩 Lista total de bots activos
    const allBots = [
      global.conn.user.jid,
      ...new Set(
        global.conns
          .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
          .map(c => c.user.jid)
      )
    ]

    // Información del BOT PRINCIPAL
    const mainNumber = global.conn.user.jid.replace(/[^0-9]/g, '')
    const mainName = global.conn.user.name || "Bot Principal"
    const mainCountry = detectarPais(mainNumber)
    const mainUptime = convertirMsADiasHorasMinutosSegundos(Date.now() - (global.conn.startTime || global.conn.uptime || 0))

    // Información de los SubBots
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

    // Cupos
    const usados = subBots.length
    const libres = Math.max(0, MAX_SUBBOTS - usados)

    // Bots en el grupo
    let groupBots = allBots.filter(bot => participants.some(p => p.id === bot))
    if (!groupBots.includes(global.conn.user.jid)) groupBots.push(global.conn.user.jid)
    const groupBotsText = groupBots.map(bot => `• +${bot.replace(/[^0-9]/g, '')}`).join("\n") || "Ninguno"

    // ✨ Mensaje final
    const message = `
╭─〔 *🌐 PANEL GLOBAL DE BOTS* 〕─╮
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
    m.reply(`⚠️ Error: ${error.message}`)
  }
}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = ["botlist", "listbots", "listbot", "bots", "sockets", "socket"]

export default handler
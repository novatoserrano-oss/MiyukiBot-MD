/*import ws from "ws"

const handler = async (m, { conn, usedPrefix, participants, rcanal }) => {
  try {
    global.conns = global.conns || []
    const MAX_SUBBOTS = 3

    // 🌍 Detección de país
    const detectarPais = (numero) => {
      const codigos = {
        "1": "🇺🇸 EE.UU / 🇨🇦 Canadá",
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
        "44": "🇬🇧 Reino Unido",
        "49": "🇩🇪 Alemania",
        "51": "🇵🇪 Perú",
        "52": "🇲🇽 México",
        "53": "🇨🇺 Cuba",
        "54": "🇦🇷 Argentina",
        "55": "🇧🇷 Brasil",
        "56": "🇨🇱 Chile",
        "57": "🇨🇴 Colombia",
        "58": "🇻🇪 Venezuela",
        "591": "🇧🇴 Bolivia",
        "593": "🇪🇨 Ecuador",
        "595": "🇵🇾 Paraguay",
        "598": "🇺🇾 Uruguay",
        "502": "🇬🇹 Guatemala",
        "503": "🇸🇻 El Salvador",
        "504": "🇭🇳 Honduras",
        "505": "🇳🇮 Nicaragua",
        "506": "🇨🇷 Costa Rica",
        "507": "🇵🇦 Panamá",
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
        "212": "🇲🇦 Marruecos",
        "213": "🇩🇿 Argelia",
        "216": "🇹🇳 Túnez",
        "218": "🇱🇾 Libia",
        "234": "🇳🇬 Nigeria",
        "254": "🇰🇪 Kenia",
        "255": "🇹🇿 Tanzania",
        "256": "🇺🇬 Uganda",
        "258": "🇲🇿 Mozambique",
        "260": "🇿🇲 Zambia",
        "263": "🇿🇼 Zimbabue"
      }
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

    // 📡 Todos los bots activos
    const allBots = [
      global.conn.user.jid,
      ...new Set(
        global.conns
          .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
          .map(c => c.user.jid)
      )
    ]

    // 👑 Bot principal
    const mainNumber = global.conn.user.jid.replace(/[^0-9]/g, '')
    const mainName = global.conn.user.name || "Bot Principal"
    const mainCountry = detectarPais(mainNumber)
    const mainUptime = convertirMsADiasHorasMinutosSegundos(Date.now() - (global.conn.startTime || global.conn.uptime || 0))

    // 🤖 SubBots activos
    const subBots = global.conns
      .filter(c => c.user && c.ws?.socket && c.ws.socket.readyState !== ws.CLOSED)
      .map((c, i) => {
        const numero = c.user.jid.replace(/[^0-9]/g, '')
        const nombre = c.user.name || `SubBot #${i + 1}`
        const pais = detectarPais(numero)
        const uptime = c.uptime
          ? convertirMsADiasHorasMinutosSegundos(Date.now() - c.uptime)
          : "Activo recientemente"
        return `
╭─『 🤖 SubBot #${i + 1} 』
│ 👤 *${nombre}*
│ 📞 +${numero}
│ 🌍 ${pais}
│ ⏱ ${uptime}
╰───────────────`
      })

    // 📊 Cupos
    const usados = subBots.length
    const libres = Math.max(0, MAX_SUBBOTS - usados)

    // 💬 Bots en el grupo
    let groupBots = allBots.filter(bot => participants.some(p => p.id === bot))
    if (!groupBots.includes(global.conn.user.jid)) groupBots.push(global.conn.user.jid)
    const groupBotsText = groupBots.map(bot => `• +${bot.replace(/[^0-9]/g, '')}`).join("\n") || "Ninguno"

    // ✨ Mensaje visual
    const message = `
⚜️ *PANEL DE BOTS ACTIVOS* ⚜️

👑 *BOT PRINCIPAL*
━━━━━━━━━━━━━━━━━━
👤 Nombre: *${mainName}*
📞 Número: +${mainNumber}
🌍 País: ${mainCountry}
⏱ Uptime: ${mainUptime}

━━━━━━━━━━━━━━━━━━
📊 *ESTADO DE CUPOS*
━━━━━━━━━━━━━━━━━━
🔹 Cupos Activos: ${MAX_SUBBOTS}
🔸 Cupos Usados: ${usados}
⚪ Cupos Libres: ${libres}

━━━━━━━━━━━━━━━━━━
🤖 *SUBBOTS CONECTADOS*
━━━━━━━━━━━━━━━━━━
${subBots.length > 0 ? subBots.join("\n") : "✧ No hay SubBots conectados actualmente."}

━━━━━━━━━━━━━━━━━━
💬 *BOTS EN ESTE GRUPO*
━━━━━━━━━━━━━━━━━━
${groupBotsText}

`

    // 🧩 Menciones y RCANAL extendido
    const mentionList = allBots.map(bot =>
      bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`
    )

    if (!rcanal) rcanal = {}
    rcanal.contextInfo = {
      mentionedJid: mentionList,
      externalAdReply: {
        title: "𝙈𝙞𝙮𝙪𝙠𝙞𝘽𝙤𝙩-𝙈𝘿 🌸",
        body: "Sistema MultiBot Activo ⚡",
        thumbnailUrl: "https://qu.ax/gRJso.jpg", // 🔹 Imagen de vista previa
        sourceUrl: "https://whatsapp.com/channel/0029Vb6wMPa8kyyTpjBG9C2H" // 🔹 Tu canal o link oficial
      }
    }

    await conn.sendMessage(
      m.chat,
      {
        text: message.trim(),
        ...rcanal
      },
      { quoted: m }
    )

  } catch (error) {
    console.error(error)
    m.reply(`⚠️ Se ha producido un error.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`)
  }
}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = ["botlist", "listbots", "listbot", "bots", "sockets", "socket"]

export default handler*/

import ws from "ws"

const handler = async (m, { conn, command, usedPrefix, participants }) => {
try {
await m.react('🌸')

const mainBot = global.conn
const subBots = global.conns.filter(bot => bot.user && bot.ws?.socket && bot.ws.socket.readyState !== ws.CLOSED)

const allBots = [mainBot, ...subBots]
const activos = allBots.filter(bot => bot?.user?.jid)

const _muptime = process.uptime() * 1000
const uptime = clockString(_muptime)

function convertirMsADiasHorasMinutosSegundos(ms) {
  let segundos = Math.floor(ms / 1000);
  let minutos = Math.floor(segundos / 60);
  let horas = Math.floor(minutos / 60);
  let dias = Math.floor(horas / 24);
  segundos %= 60;
  minutos %= 60;
  horas %= 24;
  let resultado = '';
  if (dias) resultado += `${dias} dias, `;
  if (horas) resultado += `${horas} horas, `;
  if (minutos) resultado += `${minutos} minutos, `;
  if (segundos) resultado += `${segundos} segundos`;
  return resultado.trim();
}

const botsEnGrupo = activos.filter(bot => participants.some(p => p.id === bot.user.jid))

const listaBots = botsEnGrupo.length > 0 ? botsEnGrupo.map((bot, i) => {
  const esPrincipal = bot === mainBot
  const nombre = bot.user?.name || (esPrincipal ? 'Bot Principal' : `Sub-Bot #${i + 1}`)
  const jid = bot.user?.jid || ''
  const link = `wa.me/${jid.replace(/[^0-9]/g, '')}`
  const tiempo = bot.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - bot.uptime) : 'Desde ahora'
  return `╭══✦ ${esPrincipal ? '🌸' : '🍃'} *${nombre}*
│ 🍃 𝙏𝙞𝙥𝙤: ${esPrincipal ? '𝙋𝙧𝙞𝙣𝙘𝙞𝙥𝙖𝙡' : '𝙎𝙪𝙗-𝘽𝙤𝙩'}
│ 🌾 𝙇𝙞𝙣𝙠: ${link}
│ 🚀 𝙊𝙣𝙡𝙞𝙣𝙚: ${tiempo}
╰━━━━━━━━━━━━━━━⪼`
}).join('\n\n') : '✧ No hay bots activos en este grupo. 🌙'

const texto = `╭━━━〔 𝙎𝙊𝘾𝙆𝙀𝙏𝙎 𝘾𝙊𝙉𝙀𝘾𝙏𝘼𝘿𝙊𝙎 🏮 〕━━⬣
│ ❀ Principal: *1*
│ ⌛ 𝙏𝙞𝙚𝙢𝙥𝙤 𝙖𝙘𝙩𝙞𝙫𝙤: *${uptime}*
│ 💫 Subs en group: *${botsEnGrupo.length}*
│ ⚙️ Subs: *${activos.length}*
╰━━━━━━━━━━━━━━━━━━━━⬣


${listaBots}
> 🩵 *Socket Link Online:* https://wa.me/${mainBot.user.jid.replace(/[^0-9]/g, '')}
`

const mentionList = groupBots.map(bot => bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`)
rcanal.contextInfo.mentionedJid = mentionList
await conn.sendMessage(m.chat, { text: message, ...rcanal }, { quoted: m })
} catch (error) {
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`)
}}

handler.help = ['botlist', 'sockets', 'listbots']
handler.tags = ['serbot']
handler.command = ['sockets', 'botlist', 'listbots', 'bots', 'socket']

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
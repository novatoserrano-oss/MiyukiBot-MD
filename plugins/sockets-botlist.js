import ws from 'ws'
import axios from 'axios'

let handler = async (m, { conn, command }) => {
  try {
    const connsActivas = global.conns.filter(conn =>
      conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED
    )

    const vistos = new Set()
    const subbotsUnicos = connsActivas.filter(conn => {
      const jid = conn.user?.jid
      if (vistos.has(jid)) return false
      vistos.add(jid)
      return true
    })

    const convertirTiempo = (ms) => {
      const segundos = Math.floor(ms / 1000)
      const minutos = Math.floor(segundos / 60)
      const horas = Math.floor(minutos / 60)
      const dias = Math.floor(horas / 24)
      const seg = segundos % 60
      const min = minutos % 60
      const h = horas % 24
      const partes = []
      if (dias) partes.push(`${dias}d`)
      if (h) partes.push(`${h}h`)
      if (min) partes.push(`${min}m`)
      if (seg) partes.push(`${seg}s`)
      return partes.join(' ')
    }

    const total = subbotsUnicos.length
    const uptime = convertirTiempo(process.uptime() * 1000)

    const lista = subbotsUnicos.map((bot, i) => {
      const tiempo = bot.uptime
        ? convertirTiempo(Date.now() - bot.uptime)
        : 'Recién iniciado'
      return `
╭━━━━━━━━━━━━━━━⬣
┃ 🧩 *Socket:* ${i + 1}
┃ 👤 *Nombre:* ${bot.user?.name || 'Miyuki SubBot'}
┃ 📞 *Número:* wa.me/${(bot.user?.jid || '').replace(/[^0-9]/g, '')}
┃ ⏱️ *Activo desde:* ${tiempo}
╰━━━━━━━━━━━━━━━⬣`
    }).join('\n\n')

    const thumb = 'https://files.catbox.moe/cut28l.jpg'

    const mensaje = `
╭─⬣「 *MiyukiBot-MD* 」⬣
│🌸 *Panel de SubBots Activos*
│━━━━━━━━━━━━━━━━━━━
│ 📡 *Total conectados:* ${total}
│ 🕒 *Uptime:* ${uptime}
╰━━━━━━━━━━━━━━━━━━⬣

${lista || '🌙 No hay SubBots conectados actualmente.'}

╭━━━━━━━━━━━━━━━━━━⬣
│ ⚙️ *Sistema:* MiyukiBot-MD
│ 💎 *Canal Oficial:* ${channel}
│ 🔗 *Potenciado por:* OmarGranda
╰━━━━━━━━━━━━━━━━━━⬣
`

    await conn.sendMessage(m.chat, {
      text: mensaje,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: '💠 MiyukiBot-MD • SubBots Online',
          body: `Actualmente activos: ${total}`,
          thumbnailUrl: thumb,
          sourceUrl: 'https://whatsapp.com/channel/0029VaBL0X07Ef9e9pIY0F2Y',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`⚠️ Error al mostrar los SubBots.\n> ${e.message}`)
  }
}

handler.help = ['sockets', 'bots', 'socket']
handler.tags = ['jadibot']
handler.command = ['sockets', 'bots', 'socket']

export default handler
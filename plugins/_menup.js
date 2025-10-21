import fetch from "node-fetch"
import moment from "moment-timezone"

let handler = async (m, { conn, usedPrefix, command }) => {

  let fecha = moment.tz('America/Lima').format('DD/MM/YYYY')
  let hora = moment.tz('America/Lima').format('HH:mm:ss')
  let uptime = clockString(process.uptime())
  let grupos = Object.keys(await conn.groupFetchAllParticipating?.() || {}).length
  let botname = "🌸 MiyukiBot-MD"
  let prefijo = usedPrefix

  let menu = `
╭━━━〔 ${botname} 〕━━⬣
┃💫 *Menú Principal*
┃
┃📅 *Fecha:* ${fecha}
┃🕒 *Hora:* ${hora}
┃⚙️ *Uptime:* ${uptime}
┃💬 *Prefijo:* ${prefijo}
┃👥 *Grupos:* ${grupos}
┃
┃      *Menús Disponibles:*
┃       no ay jsjsjs
╰━━━━━━━━━━━━━━━━━━⬣
`

  await conn.sendMessage(
    m.chat,
    {
      image: { url: icono },
      caption: menu,
      footer: `${botname} • Sistema Multifuncional 🌸 XD`,
    },
    { quoted: fkontak }
  )
}

function clockString(ms) {
  let h = Math.floor(ms / 3600)
  let m = Math.floor(ms / 60) % 60
  let s = Math.floor(ms % 60)
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

handler.help = ['menup']
handler.tags = ['main']
handler.command = ['menup']

export default handler
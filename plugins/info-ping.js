import speed from 'performance-now'
import { exec } from 'child_process'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  // 🔹 Reacción inicial
  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  let timestamp = speed()
  let latensi = speed() - timestamp

  const start = new Date().getTime()
  await conn.sendMessage(m.chat, { text: `🕒 *Midiendo latencia...*` }, { quoted: m })
  const end = new Date().getTime()
  const latency = end - start

  const uptime = process.uptime()
  const hours = Math.floor(uptime / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  const secondsUp = Math.floor(uptime % 60)
  const uptimeFormatted = `${hours}h ${minutes}m ${secondsUp}s`

  const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
  const fechaHora = moment().tz('America/Lima').format('YYYY/MM/DD, h:mm A')

  // 🔹 Coloca tu imagen aquí 👇
  const imgUrl = '' // Ejemplo: 'https://tuservidor.com/miimagen.jpg'

  // Si no hay imagen personalizada, usa una por defecto
  const thumbBuffer = Buffer.from(await (await fetch(imgUrl || 'https://i.ibb.co/mJQvP9K/miyuki-bot-banner.jpg')).arrayBuffer())

  exec(`neofetch --stdout`, async (error, stdout) => {
    let sysInfo = stdout.toString("utf-8").replace(/Memory:/, "Ram:")

    let response = 
`╭─❖ ⚙️ *Estado del Bot*
│ 📶 *Ping:* ${latency} ms
│ ⚡ *Latencia:* ${latensi.toFixed(4)} ms
│ 💽 *RAM usada:* ${usedRAM} MB
│ ⏱️ *Uptime:* ${uptimeFormatted}
│ 🗓️ *Fecha / Hora:* ${fechaHora}
╰─❖ *MiyukiBot-MD 🌸*

\`\`\`${sysInfo.trim()}\`\`\``

    // 🔹 Enviar imagen + texto (sin externalAdReply)
    await conn.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: response,
      mentions: [m.sender]
    }, { quoted: m })

    // 🔹 Reacción final
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  })
}

handler.help = ['ping', 'p']
handler.tags = ['info']
handler.command = ['ping', 'p']
handler.register = true

export default handler
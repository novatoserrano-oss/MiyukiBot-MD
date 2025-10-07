import speed from 'performance-now'
import { exec } from 'child_process'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // Reacción de inicio
    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    let timestamp = speed()
    let latensi = speed() - timestamp

    const start = new Date().getTime()
    await conn.sendMessage(m.chat, { text: `*⚙️ 𝘊𝘢𝘭𝘤𝘶𝘭𝘢𝘯𝘥𝘰 𝘱𝘪𝘯𝘨...*` }, { quoted: m })
    const end = new Date().getTime()
    const latency = end - start

    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const secondsUp = Math.floor(uptime % 60)
    const uptimeFormatted = `${hours}h ${minutes}m ${secondsUp}s`

    const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    const fechaHora = moment().tz('America/Lima').format('YYYY/MM/DD, h:mm A')

    const thumbBuffer = Buffer.from(await (await fetch('https://files.catbox.moe/sy0zzb.png')).arrayBuffer())

    exec(`neofetch --stdout`, async (error, stdout) => {
      let sysInfo = stdout.toString("utf-8").replace(/Memory:/, "Ram:")

      // Nuevo diseño con emojis
      let response = 
`\`⚡ 𝗦 𝗧 𝗔 𝗧 𝗨 𝗦 • 𝗣 𝗜 𝗡 𝗚 🌿\`

🌟 *Ping:* ⚡ ${latency} ms
📡 *Latency:* ⏱️ ${latensi.toFixed(4)} ms
💻 *RAM Usage:* 🖥️ ${usedRAM} MB
⏳ *Uptime:* 🕒 ${uptimeFormatted}
🗓️ *Date/Time:* 📅 ${fechaHora}
\`\`\`${sysInfo.trim()}\`\`\`
> ☄︎ кαиєкι вσт ν3 | 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙷𝙰𝙳𝙾𝚆-𝚇𝚈𝚉
      `

      await conn.sendMessage(m.chat, {
        text: response,
        mentions: [m.sender],
        contextInfo: {
          externalAdReply: {
            title: '🍄 Rɪɴ Iᴛᴏsʜɪ ᴍᴅ 🌹 | 🪾 ʙʏ ᴅᴠ.sʜᴀᴅᴏᴡ 🪴',
            body: '',
            thumbnail: thumbBuffer,
            sourceUrl: redes, // Asegúrate de que la variable 'redes' exista
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: fkontak })

      // Reacción final
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    })
  } catch (error) {
    console.log(error)
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al calcular el ping.' }, { quoted: m })
  }
}

handler.help = ['ping', 'p']
handler.tags = ['info']
handler.command = ['ping', 'p']
handler.register = true

export default handler
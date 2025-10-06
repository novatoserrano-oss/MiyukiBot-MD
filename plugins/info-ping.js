import speed from 'performance-now'
import { exec } from 'child_process'
import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
  let timestamp = speed();
  let latensi = speed() - timestamp;

  const start = new Date().getTime();
  const { key } = await conn.sendMessage(m.chat, { text: `🕒 *Midiendo latencia...*` }, { quoted: m });
  const end = new Date().getTime();
  const latency = end - start;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const secondsUp = Math.floor(uptime % 60);
  const uptimeFormatted = `${hours}h ${minutes}m ${secondsUp}s`;

  const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const fechaHora = moment().tz('America/Lima').format('YYYY/MM/DD, h:mm A');

  exec(`neofetch --stdout`, async (error, stdout) => {
    let child = stdout.toString("utf-8");
    let sysInfo = child.replace(/Memory:/, "RAM:");

    let response = 
`╭━〔 ⚙️ 𝙀𝙨𝙩𝙖𝙙𝙤 𝙙𝙚𝙡 𝘽𝙤𝙩 🛰️ 〕━⬣
│ 📡 *Ping:* ${latency} ms
│ ⚡ *Latencia:* ${latensi.toFixed(4)} ms
│ 💾 *RAM usada:* ${usedRAM} MB
│ ⏳ *Uptime:* ${uptimeFormatted}
│ 🕰️ *Fecha / Hora:* ${fechaHora}
╰━〔 🌸 𝙍𝙞𝙣 𝙄𝙩𝙤𝙨𝙝𝙞 〕━⬣
\`\`\`
${sysInfo.trim()}
\`\`\``

    await conn.sendMessage(m.chat, {
      text: response,
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          title: '🌺 Rɪɴ Iᴛᴏsʜɪ ᴍᴅ ⚙️ | 🌼 ʙʏ ᴅᴠ.sʜᴀᴅᴏᴡ 💫',
          body: club,
          thumbnailUrl: await (await fetch('https://n.uguu.se/vqJnHBPm.jpg')).buffer(),
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  })
}

handler.help = ['ping', 'p']
handler.tags = ['info']
handler.command = ['ping', 'p']
handler.register = true

export default handler
import speed from 'performance-now'
import { exec } from 'child_process'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const start = new Date().getTime();
  await conn.sendMessage(m.chat, { text: `🕒 *Midiendo latencia...*` }, { quoted: m });
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
    let sysInfo = stdout ? stdout.toString("utf-8").replace(/Memory:/, "RAM:") : 'No se pudo obtener info del sistema';
    
    let redes = 'https://wa.me';

    const thumb = await fetch('https://files.catbox.moe/sy0zzb.jpg');
    const bufferThumb = await thumb.arrayBuffer();

    let response = 
`╭─❖ ⚙️ 𝙀𝙨𝙩𝙖𝙙𝙤 𝙙𝙚𝙡 𝘽𝙤𝙩
│ 📶 Ping: ${latency} ms
│ ⚡ Latencia: ${latency.toFixed(4)} ms
│ 💽 RAM usada: ${usedRAM} MB
│ ⏱️ Uptime: ${uptimeFormatted}
│ 🗓️ Fecha / Hora: ${fechaHora}
╰─❖ 𝙈𝙞𝙮𝙪𝙠𝙞𝘽𝙤𝙩-𝙈𝘿 🌸`

    await conn.sendMessage(m.chat, {
      text: response,
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          title: 'MiyukiBot-MD 🌸',
          body: dev,
          thumbnail: Buffer.from(bufferThumb),
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  });
}

handler.help = ['ping', 'p']
handler.tags = ['info']
handler.command = ['ping', 'p']
handler.register = true

export default handler
import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {

    if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en *grupos*.', m)

    const target = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender)
    if (!target) return conn.reply(m.chat, `Menciona a quien quieres asustar.\nEjemplo: ${usedPrefix}${command} @usuario`, m)

    const username = target.split('@')[0]
    const fakeName = `SECRETO_${username}_100GB.docx`
    const FAKE_SIZE_BYTES = 100n * 1024n * 1024n * 1024n
    const smallContent = `Esto es una broma 😜\nNo es un archivo real de 100 GB.\nGenerado por el bot.`
    const buffer = Buffer.from(smallContent, 'utf8')

    const notif = `@${username} 😏`
    await conn.sendMessage(m.chat, { text: notif, mentions: [target] }, { quoted: m })

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileName: fakeName,
        fileLength: Number(FAKE_SIZE_BYTES > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : FAKE_SIZE_BYTES), 
 
        caption: `🔒 ${fakeName} — abierto bajo tu propio riesgo 😂`
      },
      { quoted: m }
    )

    try {
      await conn.sendMessage(m.chat, { delete: m.key })
    } catch (err) {
      console.error('No se pudo borrar el mensaje del comando:', err)
    }

  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, 'Ocurrió un error al enviar el pack 😅', m)
  }
}

handler.command = /^(pack)$/i
handler.group = true
export default handler
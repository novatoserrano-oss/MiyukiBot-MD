import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en *grupos*.', m)

    const target = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender)
    if (!target) return conn.reply(m.chat, `Menciona a quien quieres asustar.\nEjemplo: ${usedPrefix}${command} @usuario`, m)

    const username = target.split('@')[0]

    const FAKE_SIZE_BYTES = 100n * 1024n * 1024n * 1024n
    const fakeSizeNumber = (FAKE_SIZE_BYTES <= BigInt(Number.MAX_SAFE_INTEGER))
      ? Number(FAKE_SIZE_BYTES)
      : Number.MAX_SAFE_INTEGER

   const omarpack = [
'https://files.catbox.moe/tjagl8.png',
'https://files.catbox.moe/u4ttpm.jpg' ,
'https://files.catbox.moe/0cijoq.jpg'
  ]
  const imageUrl = omarpack[Math.floor(Math.random() * omarpack.length)]



    let buffer
    const smallContent = `😏🥰🥵🥵🥵🥵🥵`
    try {
      const res = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 15000 })
      buffer = Buffer.from(res.data)
    } catch (err) {
      console.warn('No se pudo descargar la imagen remoto, usando fallback pequeño:', err?.message || err)
      buffer = Buffer.from(smallContent, 'utf8')
    }

    const fakeImageName = 'pack.jpg'
    const fakeDocName = 'pack.jpg'

    const notif = `@${username} 😏 ¡Cuidado con lo que descargas!`
    await conn.sendMessage(m.chat, { text: notif, mentions: [target] }, { quoted: m })

    try {
      await conn.sendMessage(
        m.chat,
        {
          image: buffer,
          mimetype: 'image/jpeg',
          fileName: fakeImageName,
          fileLength: fakeSizeNumber,
          caption: `🖼️ ${fakeImageName}`
        },
        { quoted: m }
      )
    } catch (errImage) {
      console.warn('Envio imagen con fileLength falló, reintentando sin fileLength:', errImage?.message || errImage)
      await conn.sendMessage(
        m.chat,
        {
          image: buffer,
          mimetype: 'image/jpeg',
          caption: `🖼️ ${fakeImageName}`
        },
        { quoted: m }
      )
    }

    try {
      await conn.sendMessage(
        m.chat,
        {
          document: buffer,
          mimetype: 'image/jpeg',
          fileName: fakeDocName,
          fileLength: fakeSizeNumber,
          caption: `📁 ${fakeDocName}`
        },
        { quoted: m }
      )
    } catch (errDoc) {
      console.warn('Envio documento con fileLength falló, reintentando sin fileLength:', errDoc?.message || errDoc)
      await conn.sendMessage(
        m.chat,
        {
          document: buffer,
          mimetype: 'image/jpeg',
          fileName: fakeDocName,
          caption: `📁 ${fakeDocName}`
        },
        { quoted: m }
      )
    }

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

handler.command = ['pack']
handler.group = true
export default handler
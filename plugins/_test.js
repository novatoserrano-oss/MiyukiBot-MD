// 🌿 Creador: Shadow-xyz

import Jimp from 'jimp'

let handler = async (m, { conn, text, args, quoted }) => {
  try {
    await m.react('🪷')

    const SIZE = 96

    let imgBuffer
    if (quoted && quoted.download) {
      imgBuffer = await quoted.download()
    } else if (/^data:image\/[a-zA-Z]+;base64,/.test(text || args[0] || '')) {
      const b64 = (text || args[0]).split(',')[1]
      imgBuffer = Buffer.from(b64, 'base64')
    } else {
      return conn.reply(m.chat, '🌸 Responde una imagen o envía una en base64.', m)
    }

    const image = await Jimp.read(imgBuffer)
    image.cover(SIZE, SIZE)
    const thumbBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)


    const displayName = 'Shadow_xyz'
    const number = '5191919199620'
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${displayName};;;
FN:${displayName}
TEL;type=CELL;type=VOICE;waid=${number}:${number}
END:VCARD`

    const contactMessage = {
      key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
      message: {
        contactMessage: {
          displayName,
          vcard,
          jpegThumbnail: thumbBuffer,
          thumbnail: thumbBuffer,
        },
      },
    }

    await conn.sendMessage(m.chat, { text: '✅ Miniatura reducida', mentions: [m.sender] }, { quoted: contactMessage })
    await m.react('✅')

  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, '❌ Error al procesar la imagen.\n' + err.message, m)
  }
}

handler.help = ['mine']
handler.tags = ['tools']
handler.command = /^mine$/i

export default handler
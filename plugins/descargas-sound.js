import scdl from 'soundcloud-downloader'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `🌸 *Ingresa el enlace de una canción de SoundCloud para descargarla.*\n\n` +
      `💡 *Ejemplo:* \n> ${usedPrefix + command} https://soundcloud.com/ckfeine/brazilian-phonk`,
      m
    )
  }

  await m.react('⏳')

  try {
    if (!text.includes('soundcloud.com')) {
      return conn.reply(m.chat, '⚠️ *Por favor proporciona un enlace válido de SoundCloud.*', m)
    }

    // Obtener información de la canción
    const info = await scdl.getInfo(text).catch(() => null)
    if (!info) {
      await m.react('❌')
      return conn.reply(m.chat, '❌ *No se pudo obtener información de la pista.*', m)
    }

    const title = info.title?.replace(/[\\/:*?"<>|]/g, '') || 'Sin título'
    const artist = info.user?.username || 'Desconocido'
    const thumbnail = info.artwork_url?.replace('-large', '-t500x500') || info.user?.avatar_url || null

    // Descargar audio
    const filePath = path.join(__dirname, `../tmp/${title}.mp3`)
    const stream = await scdl.download(text).catch(() => null)
    if (!stream) {
      await m.react('❌')
      return conn.reply(m.chat, '❌ *No se pudo descargar el audio.*', m)
    }

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath)
      stream.pipe(writeStream)
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    // Enviar información + portada
    const caption = `
╭──────────────────────────────╮
│ 🎧 *SOUNDCLOUD DOWNLOADER* 🎶
╰──────────────────────────────╯
🎵 *Título:* ${title}
👤 *Artista:* ${artist}
🔗 *Enlace:* ${text}

💠 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢
    `.trim()

    if (thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    }

    // Leer el archivo MP3 y enviarlo
    const audioBuffer = fs.readFileSync(filePath)
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m })

    fs.unlinkSync(filePath)
    await m.react('✅')

  } catch (err) {
    console.error('Error al descargar pista SoundCloud:', err)
    await m.react('💥')
    conn.reply(m.chat, '❌ *Error al descargar la canción. Verifica el enlace o inténtalo más tarde.*', m)
  }
}

handler.help = ['sound <enlace>']
handler.tags = ['descargas']
handler.command = ['sound', 'scdl']
handler.register = true

export default handler
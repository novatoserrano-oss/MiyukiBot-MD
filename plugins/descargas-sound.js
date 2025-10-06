import axios from 'axios'
import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(
    m.chat,
    `🌸 *Ingresa el enlace o nombre de una canción de SoundCloud para descargarla.*\n\n💡 *Ejemplo:* \n> ${usedPrefix + command} https://soundcloud.com/ckfeine/brazilian-phonk`,
    m
  )

  await m.react('⏳')

  try {
    // Si el usuario envía solo el nombre, hacemos una búsqueda primero
    let url = text
    if (!text.includes('soundcloud.com')) {
      const search = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/soundcloud-search?text=${encodeURIComponent(text)}`)
      if (!Array.isArray(search.data) || search.data.length === 0) {
        await m.react('❌')
        return conn.reply(m.chat, '⚠️ *No se encontraron resultados para esa búsqueda.*', m)
      }
      url = search.data[0].url // toma el primer resultado
    }

    // Descarga directa desde SoundCloud
    const api = `https://apis-starlights-team.koyeb.app/starlight/soundcloud-down?url=${encodeURIComponent(url)}`
    const res = await axios.get(api)
    const data = res.data

    if (!data || !data.url) {
      await m.react('⚠️')
      return conn.reply(m.chat, '❌ *No se pudo obtener la información de la canción.*', m)
    }

    const title = data.title || 'Sin título'
    const artist = data.artist || 'Desconocido'
    const thumb = data.thumb || 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
    const audioUrl = data.url

    // Enviar información primero
    await conn.sendMessage(m.chat, {
      image: { url: thumb },
      caption: `
🎧 *SoundCloud Downloader* 🎶

🎵 *Título:* ${title}
👤 *Artista:* ${artist}
🔗 *Enlace:* ${url}

💠 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢
      `.trim()
    }, { quoted: m })

    await m.react('🎵')

    // Descargar audio MP3
    const audioRes = await fetch(audioUrl)
    const buffer = await audioRes.arrayBuffer()
    const filePath = './tmp/soundcloud.mp3'
    fs.writeFileSync(filePath, Buffer.from(buffer))

    // Enviar el audio al chat
    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(filePath),
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m })

    fs.unlinkSync(filePath)
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('💥')
    conn.reply(m.chat, '❌ *Error al descargar la canción. Verifica el enlace o inténtalo más tarde.*', m)
  }
}

handler.help = ['sound <texto o enlace>']
handler.tags = ['descargas']
handler.command = ['sound', 'soundcloud', 'scdl']
handler.register = true

export default handler
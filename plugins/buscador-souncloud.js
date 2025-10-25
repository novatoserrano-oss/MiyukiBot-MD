import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(
    m.chat,
    `🎵 *Ingresa el nombre de una canción o artista para buscar en SoundCloud.*\n\n💡 *Ejemplo:* \n> ${usedPrefix + command} Tokyo Nights`,
    m
  )

  await m.react('🎧')

  try {
    const response = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/soundcloud-search?text=${encodeURIComponent(text)}`)
    const results = response.data

    if (Array.isArray(results) && results.length > 0) {
      await m.react('⏳')
      await conn.sendMessage(m.chat, {
        text: `✨ *Resultados de búsqueda para:* _${text}_\n📀 *Se encontraron ${results.length} resultados*\n\n🎶 *SoundCloud – Search*`,
      }, { quoted: m })

      for (let i = 0; i < results.length && i < 10; i++) {
        const track = results[i]
        const title = track.title || 'Sin título'
        const artist = track.artist || 'Desconocido'
        const repro = track.repro || 'N/A'
        const duration = track.duration || 'N/A'
        const creator = track.creator || 'Desconocido'
        const url = track.url
        const image = track.image || 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'

        const caption = `
🎧 *SOUNDCLOUD – RESULTADO*

🎶 *Título:* ${title}
🎤 *Artista:* ${artist}
👁‍🗨 *Reproducciones:* ${repro}
⏱️ *Duración:* ${duration}
💫 *Creador:* ${creator}
🔗 *Enlace:* ${url}

💠 *𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢*
        `.trim()

        await conn.sendMessage(m.chat, {
          text: caption,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: `${artist} | SoundCloud`,
              thumbnailUrl: image, // portada directa del tema
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: url // abre SoundCloud directamente
            }
          }
        }, { quoted: m })
      }

      await m.react('✅')
    } else {
      await m.react('❌')
      await conn.reply(m.chat, '🌙 *No se encontraron resultados en SoundCloud.*', m)
    }

  } catch (error) {
    console.error(error)
    await m.react('💥')
    await conn.reply(m.chat, '❌ *Hubo un error al procesar la solicitud. Intenta nuevamente más tarde.*', m)
  }
}

handler.tags = ['buscador']
handler.help = ['soundcloudsearch <texto>']
handler.command = ['soundcloudsearch', 'scsearch']
handler.register = true
handler.coin = 5

export default handler
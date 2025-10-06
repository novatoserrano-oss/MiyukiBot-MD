import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(
    m.chat,
    `🌸 *Ingresa el nombre de una canción o artista para buscar en SoundCloud.*\n\n💡 *Ejemplo:* \n> ${usedPrefix + command} Tokyo Nights`,
    m
  )

  await m.react('🎧')

  try {
    const response = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/soundcloud-search?text=${encodeURIComponent(text)}`)
    const results = response.data

    if (Array.isArray(results) && results.length > 0) {
      const carousel = []

      for (let i = 0; i < results.length; i++) {
        const track = results[i]
        carousel.push({
          body: `
🎵 *${track.title || 'Sin título'}*
👤 *Artista:* ${track.artist || 'Desconocido'}
⏱️ *Duración:* ${track.duration || 'N/A'}
🎧 *Reproducciones:* ${track.repro || 'N/A'}
🪶 *Creador:* ${track.creator || 'Desconocido'}
🌐 *URL:* ${track.url}

💠 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢
          `.trim(),
          footer: '🎧 Pulsa el botón para descargar 🎶',
          buttons: [
            {
              buttonId: `.sound ${track.url}`,
              buttonText: { displayText: '⬇️ Descargar Audio' },
              type: 1
            }
          ],
          header: {
            title: `🎶 Resultado ${i + 1}`,
            subtitle: track.artist || 'SoundCloud',
            image: { url: track.image || 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
            mediaType: 1
          }
        })
      }

      await conn.sendCarousel(
        m.chat,
        `🔍 *Resultados para:* ${text}`,
        `🎧 *SoundCloud Search* — ${results.length} resultados encontrados.\n💠 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢`,
        carousel
      )

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
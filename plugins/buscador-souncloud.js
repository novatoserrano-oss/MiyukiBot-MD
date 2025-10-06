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

    if (response.data && Array.isArray(response.data)) {
      const results = response.data

      if (results.length > 0) {
        const sections = []
        let count = 0

        for (let track of results.slice(0, 10)) { // límite de 10 resultados por carrusel
          count++
          sections.push({
            title: `🎵 ${count}. ${track.title || 'Sin título'}`,
            rows: [
              {
                header: `${track.artist || 'Artista desconocido'} | ⏱ ${track.duration || 'N/A'}`,
                title: `🎧 Reproducir o descargar`,
                description: `Toca para descargar el audio en MP3`,
                id: `.sound ${track.url}`
              }
            ]
          })
        }

        // Enviar carrusel
        await conn.sendMessage(m.chat, {
          text: `🎶 *Resultados de búsqueda en SoundCloud*\n🔍 *${text}*\n\nSelecciona una canción para descargar.`,
          footer: `𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢`,
          title: `💿 𝙈𝙞𝙮𝙪𝙠𝙞 𝙎𝙤𝙪𝙣𝙙𝘾𝙡𝙤𝙪𝙙 🎶`,
          buttonText: '📜 Ver resultados',
          sections
        }, { quoted: m })

        // Además, mostrar la primera canción destacada con su imagen e info
        const top = results[0]
        await conn.sendMessage(m.chat, {
          image: { url: top.image },
          caption: `
╭───〔 💿 *SoundCloud - Miyuki Edition* 💿 〕───╮
🎼 *Título:* ${top.title || 'Sin título'}
👤 *Artista:* ${top.artist || 'Desconocido'}
🎧 *Reproducciones:* ${top.repro || 'N/A'}
⏱️ *Duración:* ${top.duration || 'N/A'}
🪶 *Creador:* ${top.creator || 'N/A'}
🌐 *Enlace:* ${top.url}
╰──────────────────────────────╯

💠 *𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢*
          `,
          buttons: [
            {
              buttonId: `.sound ${top.url}`,
              buttonText: { displayText: '⬇️ Descargar Audio' },
              type: 1
            }
          ],
          headerType: 4
        }, { quoted: m })

        await m.react('✅')
      } else {
        await m.react('❌')
        await conn.reply(m.chat, '🌙 *No se encontraron resultados en SoundCloud.*', m)
      }
    } else {
      await m.react('⚠️')
      await conn.reply(m.chat, '🚧 *Error al obtener datos de la API de SoundCloud.*', m)
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
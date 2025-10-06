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
      await m.react('⏳')
      await conn.sendMessage(m.chat, {
        text: `📀 *Buscando en SoundCloud...*\nPor favor espera mientras preparo los resultados 🎶\n\n💠 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢`
      })

      for (let i = 0; i < results.length && i < 10; i++) {
        const track = results[i]
        const title = track.title || 'Sin título'
        const artist = track.artist || 'Desconocido'
        const duration = track.duration || 'N/A'
        const creator = track.creator || 'Desconocido'
        const url = track.url
        const image = track.image || 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'

        const textInfo = `
╭───❖ 🌸 *Resultado ${i + 1}* ❖───╮
🎶 *${title}*
👤 *Artista:* ${artist}
🪶 *Creador:* ${creator}
⏱️ *Duración:* ${duration}
🌐 *URL:* ${url}
╰────────────────────╯

💠 *𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢*
        `.trim()

        await conn.sendMessage(m.chat, {
          image: { url: image },
          caption: textInfo,
          footer: '🎧 Pulsa el botón para descargar 🎵',
          buttons: [
            {
              buttonId: `.sound ${url}`,
              buttonText: { displayText: '⬇️ Descargar Audio' },
              type: 1
            }
          ],
          headerType: 4
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
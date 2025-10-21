// - codigo creado x Shadow.xyz 🌿
// - https://github.com/Shadow-mex
// - https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U
// - no quitar creditos xD
/// - 🏳️‍🌈 gay si tocas el codigo o editas algo 

import acrcloud from 'acrcloud'
import ytsearch from 'yt-search'

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''

    if (!/video|audio/.test(mime)) {
      return conn.reply(
        m.chat,
        `🎵 *Usa el comando así:*\n\nEtiqueta un audio o video corto con: *${usedPrefix + command}* para intentar reconocer la canción.`,
        m
      )
    }

    let msg = await conn.reply(m.chat, '🍏 *Detectando canción...*\n\n▰▱▱▱▱▱▱▱▱▱ 10%', m)

    const etapas = [
      '▰▰▱▱▱▱▱▱▱▱ 20%',
      '▰▰▰▱▱▱▱▱▱▱ 30%',
      '▰▰▰▰▱▱▱▱▱▱ 40%',
      '▰▰▰▰▰▱▱▱▱▱ 50%',
      '▰▰▰▰▰▰▱▱▱▱ 60%',
      '▰▰▰▰▰▰▰▱▱▱ 70%',
      '▰▰▰▰▰▰▰▰▱▱ 80%',
      '▰▰▰▰▰▰▰▰▰▱ 90%',
      '▰▰▰▰▰▰▰▰▰▰ 100%\n\n🌸 *Analizando coincidencias...*'
    ]

    for (const barra of etapas) {
      await new Promise(res => setTimeout(res, 600))
      await conn.sendMessage(m.chat, {
        edit: msg.key,
        text: `🍏 *Detectando canción...*\n\n${barra}`
      })
    }

    const buffer = await q.download()
    if (!buffer) throw '❌ No se pudo descargar el archivo. Intenta nuevamente.'

    const result = await acr.identify(buffer)
    const { status, metadata } = result

    if (status.code !== 0) throw status.msg || '❌ No se pudo identificar la canción.'

    const music = metadata.music?.[0]
    if (!music) throw '❌ No se encontró información de la canción.'

    const title = music.title || 'Desconocido'
    const artist = music.artists?.map(v => v.name).join(', ') || 'Desconocido'
    const album = music.album?.name || 'Desconocido'
    const release = music.release_date || 'Desconocida'

    const yt = await ytsearch(`${title} ${artist}`)
    const video = yt.videos.length > 0 ? yt.videos[0] : null

    let info = `
╭━━〔 𝙈𝙞𝙮𝙪𝙠𝙞𝘽𝙤𝙩-𝙈𝘿 〕━⬣
┃ ✧ 𝐂𝐚𝐧𝐜𝐢ó𝐧 𝐃𝐞𝐭𝐞𝐜𝐭𝐚𝐝𝐚 ✧  
┃───────────────────
┃ 🎶 *𝐓𝐢𝐭𝐮𝐥𝐨:* ${title}
┃ 👤 *𝐀𝐫𝐭𝐢𝐬𝐭𝐚:* ${artist}
┃ 💿 *𝐀𝐥𝐛𝐮𝐦:* ${album}
┃ 📅 *𝐋𝐚𝐧𝐳𝐚𝐦𝐢𝐞𝐧𝐭𝐨:* ${release}
┃───────────────────
${video ? `┃ 🔎 *𝐄𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐨 𝐞𝐧 𝐘𝐨𝐮𝐓𝐮𝐛𝐞:*  
┃ 🎥 Título: ${video.title}
┃ ⏱ Duracion: ${video.timestamp}
┃ 👁 vistas: ${video.views.toLocaleString()} vistas
┃ 📺 canal: ${video.author.name}
┃ 🔗 link: ${video.url}` : '┃ ❌ No se encontró en YouTube'}
╰━━━━━━━━━━━━━━⬣
`.trim()

    await conn.sendMessage(m.chat, { delete: msg.key })

    if (video) {
      await conn.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption: info
      }, { quoted: m })
    } else {
      await conn.reply(m.chat, info, m)
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✔️', key: m.key }
    })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Error al identificar la música:\n${e}`, m)
  }
}

handler.help = ['whatmusic <audio/video>']
handler.tags = ['tools']
handler.command = ['shazam', 'whatmusic']

export default handler
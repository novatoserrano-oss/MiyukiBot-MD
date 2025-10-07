import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
        `🎵 *Ingresa el nombre de la canción o un enlace de YouTube*.
> 💡 Ejemplo: ${usedPrefix + command} DJ Malam Pagi`,
        m
      )
    }

    // Reacción inicial
    await conn.sendMessage(m.chat, { react: { text: "⏰", key: m.key } })

    // Buscar video
    let search = await yts(text)
    let video = search.videos[0]
    if (!video) return conn.reply(m.chat, '⚠️ *No se encontró ningún resultado.*', m)

    // APIs para descarga
    const apis = [
      { 
        api: 'ZenzzXD v2', 
        endpoint: `https://api.zenzxz.my.id/downloader/ytmp3v2?url=${encodeURIComponent(video.url)}`, 
        extractor: res => res.download_url 
      },
      { 
        api: 'Vreden', 
        endpoint: `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(video.url)}&quality=128`, 
        extractor: res => res.result?.download?.url 
      },
      { 
        api: 'Xyro', 
        endpoint: `https://xyro.site/download/youtubemp3?url=${encodeURIComponent(video.url)}`, 
        extractor: res => res.result?.dl 
      }
    ]

    // Obtener enlace válido
    const { url: downloadUrl, servidor } = await fetchFromApis(apis)
    if (!downloadUrl) return conn.reply(m.chat, '❌ *No fue posible obtener el audio.*', m)

        const size = await getSize(downloadUrl)
    const sizeStr = size ? formatSize(size) : 'Desconocido'

    const meta = {
      title: video.title,
      duration: video.timestamp,
      url: video.url,
      author: video.author?.name || "Desconocido",
      views: video.views?.toLocaleString('es-PE') || "0",
      ago: video.ago || "Desconocido",
      thumbnail: video.thumbnail,
      size: sizeStr,
      servidor
    }

    const textoInfo = `🎶 *ＹＯＵＴＵＢＥ • ＭＰ3* ☁️
────────────────────
> °𓃉𐇽ܳ𓏸🎋ᮬᩬִּ〫᪲۟. 𝐓𝐈𝐓𝐔𝐋𝐎: *${meta.title}*
> °𓃉𐇽ܳ𓏸🌿ᮬᩬִּ〫᪲۟. 𝐃𝐔𝐑𝐀𝐂𝐈𝐎𝐍: *${meta.duration}*
> °𓃉𐇽ܳ𓏸🍏ᮬᩬִּ〫᪲۟. 𝐂𝐀𝐍𝐀𝐋: *${meta.author}*
> °𓃉𐇽ܳ𓏸🍄ᮬᩬִּ〫᪲۟. 𝐕𝐈𝐒𝐓𝐀𝐒: *${meta.views}*
> °𓃉𐇽ܳ𓏸⚽ᮬᩬִּ〫᪲۟. 𝐓𝐀𝐌𝐀𝐍̃𝐎: *${meta.size}*
> °𓃉𐇽ܳ𓏸☁️ᮬᩬִּ〫᪲۟. 𝐂𝐀𝐋𝐈𝐃𝐀𝐃: *128kbps*
> °𓃉𐇽ܳ𓏸🌷ᮬᩬִּ〫᪲۟. 𝐏𝐔𝐁𝐈𝐂𝐀𝐃𝐎: *${meta.ago}*
> °𓃉𐇽ܳ𓏸🕸️ᮬᩬִּ〫᪲۟. 𝐋𝐈𝐍𝐊: *${meta.url}*
> °𓃉𐇽ܳ𓏸⚙️ᮬᩬִּ〫᪲۟. 𝐒𝐄𝐑𝐕𝐈𝐃𝐎𝐑: *${meta.servidor}*
────────────────────

> *≡ Enviando, espera un momento...*`


    // Obtener tamaño
    const size = await getSize(downloadUrl)
    const sizeStr = size ? formatSize(size) : 'Desconocido'

    // Descargar y enviar
    const audioBuffer = await (await fetch(downloadUrl)).buffer()
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      fileName: `${video.title}.mp3`,
      mimetype: "audio/mpeg",
      ptt: false,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: '🎶 YouTube Music',
          body: `${video.title}\n⏱️ Duración: ${video.timestamp} | 🎧 Calidad: 128kbps | 💾 Tamaño: ${sizeStr}`,
          thumbnailUrl: video.thumbnail,
          mediaType: 2,
          renderLargerThumbnail: true,
          mediaUrl: video.url,
          sourceUrl: video.url
        }
      }
    }, { quoted: m })

    // Reacción final
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `⚠️ *Error:* ${e.message}`, m)
  }
}

handler.command = ['ytmp3', 'song']
handler.tags = ['descargas']
handler.help = ['ytmp3 <texto o link>', 'song <texto>']

export default handler

// Intentar descargar desde varias APIs
async function fetchFromApis(apis) {
  for (const api of apis) {
    try {
      const res = await fetch(api.endpoint)
      const json = await res.json()
      const url = api.extractor(json)
      if (url) return { url, servidor: api.api }
    } catch {}
  }
  return { url: null, servidor: "Ninguno" }
}

// Obtener tamaño del archivo
async function getSize(url) {
  try {
    const response = await axios.head(url)
    const length = response.headers['content-length']
    return length ? parseInt(length, 10) : null
  } catch {
    return null
  }
}

// Formatear tamaño del archivo
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  if (!bytes || isNaN(bytes)) return 'Desconocido'
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}
import fetch from "node-fetch"
import yts from "yt-search"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim())
      return conn.reply(m.chat, `☃️ Ingresa el nombre o enlace del video.\n\nEjemplo:\n> ${usedPrefix + command} The Weeknd - Blinding Lights`, m)

    await m.react('🕒')

    const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
    const query = videoMatch ? `https://youtu.be/${videoMatch[1]}` : text
    const search = await yts(query)
    const result = videoMatch
      ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0]
      : search.all[0]

    if (!result) throw '⚠ No se encontraron resultados.'

    const { title, thumbnail, timestamp, views, ago, url, author, seconds } = result
    if (seconds > 600) throw '⚠ El video supera el límite de duración (10 minutos).'

    const vistas = formatViews(views)
    const caption = `
ＹＯＵＴＵＢＥ - ＰＬＡＹ

⏳ Descargando : *${title}*

Canal 🎬: *${author.name}*
Vistas 👀: *${vistas}*
Duración 🕑 : *${timestamp}*
Publicado 🗓️ : *${ago}*
Link 🔗 : *${url}*
`

    const thumb = (await conn.getFile(thumbnail)).data
    await conn.sendMessage(m.chat, { image: thumb, caption, ...rcanal }, { quoted: fkontak })

    if (['play', 'playaudio'].includes(command)) {
      const audio = await getAud(url)
      if (!audio?.url) throw '⚠ No se pudo obtener el audio.'
      await conn.sendMessage(
        m.chat,
        { audio: { url: audio.url }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' },
        { quoted: m }
      )
      await m.react('✔️')
 
    } else if (['play2', 'mp4'].includes(command)) {
      const video = await getVid(url)
      if (!video?.url) throw '⚠ No se pudo obtener el video.'
      await conn.sendFile(m.chat, video.url, `${title}.mp4`, `🎬 *${title}*`, m)
      await m.react('✔️')
    }

  } catch (e) {
    console.error(e)
    return conn.reply(
      m.chat,
      typeof e === 'string'
        ? e
        : '⚠︎ Se produjo un error inesperado.\n> Usa *' + usedPrefix + 'report* para informarlo.\n\n' + e.message,
      m
    )
  }
}

handler.command = handler.help = ['play', 'play2', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

async function getAud(url) {
  const apis = [
    { name: 'ZenzzXD', url: `${global.APIs.zenzxz.url}/downloader/ytmp3?url=${encodeURIComponent(url)}`, key: res => res.download_url },
    { name: 'Yupra', url: `${global.APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, key: res => res.resultado?.enlace },
    { name: 'Vreden', url: `${global.APIs.vreden.url}/api/ytmp3?url=${encodeURIComponent(url)}`, key: res => res.result?.download?.url }
  ]
  return await fetchFromApis(apis)
}

async function getVid(url) {
  const apis = [
    { name: 'ZenzzXD', url: `${global.APIs.zenzxz.url}/downloader/ytmp4?url=${encodeURIComponent(url)}`, key: res => res.download_url },
    { name: 'Yupra', url: `${global.APIs.yupra.url}/api/downloader/ytmp4?url=${encodeURIComponent(url)}`, key: res => res.resultado?.formatos?.[0]?.url },
    { name: 'Vreden', url: `${global.APIs.vreden.url}/api/ytmp4?url=${encodeURIComponent(url)}`, key: res => res.result?.download?.url }
  ]
  return await fetchFromApis(apis)
}

async function fetchFromApis(apis) {
  for (const api of apis) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      const res = await fetch(api.url, { signal: controller.signal }).then(r => r.json())
      clearTimeout(timeout)
      const link = api.key(res)
      if (link) return { url: link, api: api.name }
    } catch {}
    await new Promise(r => setTimeout(r, 300))
  }
  return null
}

function formatViews(views) {
  if (!views) return "Desconocido"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}
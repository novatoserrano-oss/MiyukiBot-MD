import fetch from "node-fetch"
import fs from "fs"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, `🍂 *Ingresa el enlace del video de YouTube*`, m)

    const api = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(text)}&quality=360`
    const res = await fetch(api)
    if (!res.ok) throw new Error(`Error al obtener datos de la API.`)
    const json = await res.json()

    if (!json.status || !json.result?.download?.url) throw new Error(`No se pudo descargar el video.`)

    const video = json.result
    const { title, duration } = video.metadata
    const downloadUrl = video.download.url

    const head = await fetch(downloadUrl, { method: "HEAD" })
    const fileSize = head.headers.get("content-length")
    const fileMB = fileSize ? (Number(fileSize) / 1024 / 1024).toFixed(2) : 0

    const caption = `🌿 *${title}*\n🍉 \`Duracion:\` ${duration.timestamp}`

    await m.react('📥')

    if (fileMB > 70) {
      await conn.sendMessage(m.chat, {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${title}.mp4`,
        caption
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        caption
      }, { quoted: m })
    }

    await m.react('✔️')
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `*Ocurrió un error al procesar el video.*\nVerifica el enlace o inténtalo más tarde.`, m)
  }
}

handler.help = ['ytmp4 <url>']
handler.tags = ['descargas']
handler.command =  ['ytmp4']

export default handler
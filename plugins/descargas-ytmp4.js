import axios from "axios"
import fetch from "node-fetch"
import { sizeFormatter } from "human-readable"

let calidadPredeterminada = "720"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {

    if (command === "ytmp4") {
      if (!text)
        return conn.reply(
          m.chat,
          `📌 *Ingresa el enlace de YouTube para descargar en MP4.*\nEjemplo:\n${usedPrefix + command} https://youtu.be/HWjCStB6k4o`,
          m
        )

      await conn.reply(
        m.chat,
        `⏳ *DESCARGANDO*
> Por favor espero en lo que envió su archivo`,
        m
      )

      const apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(text)}&quality=${calidadPredeterminada}`
      const res = await axios.get(apiUrl)

      if (!res.data?.status) throw new Error("No se pudo obtener información del video.")

      const result = res.data.result
      const meta = result.metadata
      const dl = result.download

      const head = await fetch(dl.url, { method: "HEAD" })
      const size = head.headers.get("content-length")
      const formatSize = sizeFormatter({ std: "JEDEC", decimalPlaces: 2 })
      const fileSize = size ? formatSize(parseInt(size)) : "Desconocido"
      const sizeMB = size ? parseInt(size) / 1024 / 1024 : 0

      const info = `🎬 *YOUTUBE MP4*
────────────────────
> 📌 *Título:* ${meta.title}
> ⏱️ *Duración:* ${meta.duration?.timestamp || meta.timestamp}
> 📺 *Canal:* ${meta.author?.name || "-"}
> 👁️ *Vistas:* $> {meta.views?.toLocaleString() || "-"}
> 💾 *Tamaño:* ${fileSize}
> ⚡ *Calidad:* ${dl.quality}
> 📅 *Publicado:* ${meta.ago}
> 🔗 *Link:* ${meta.url}
────────────────────
> *≡ Enviando, espera un momento...*`

      await conn.sendMessage(m.chat, {
        image: { url: meta.thumbnail },
        caption: info,
      })

      if (sizeMB > 100) {
        await conn.sendMessage(
          m.chat,
          {
            document: { url: dl.url },
            mimetype: "video/mp4",
            fileName: dl.filename,
            caption: `🎬 *${meta.title}*\n💾 Tamaño: ${fileSize}\n⚡ Calidad: ${dl.quality}\n> Enviado como documento (más de 100 MB).`,
          },
          { quoted: m }
        )
      } else {
        await conn.sendMessage(
          m.chat,
          {
            video: { url: dl.url },
            mimetype: "video/mp4",
            fileName: dl.filename,
            caption: `🎬 *${meta.title}*\n💾 Tamaño: ${fileSize}\n⚡ Calidad: ${dl.quality}`,
          },
          { quoted: m }
        )
      }
    }
  } catch (err) {
    console.error(err)
    conn.reply(
      m.chat,
      "❌ *Ocurrió un error al procesar tu solicitud.*\nVerifica el enlace o intenta con otro video.",
      m
    )
  }
}

handler.help = ["ytmp4 <url>"] 
handler.tags = ["descargas"]
handler.command = ["ytmp4"]

export default handler
import fetch from 'node-fetch'
import Jimp from 'jimp'
import axios from 'axios'
import crypto from 'crypto'

const savetube = { /* ... el mismo objeto savetube que ya tienes ... */ }

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let q = args.join(" ").trim()
  if (!q) {
    return conn.sendMessage(m.chat, {
      text: `✏️ *Por favor, ingresa el nombre del video a descargar.*`
    }, { quoted: m })
  }

  // Reacción inicial antes de descargar
  await conn.sendMessage(m.chat, {
    text: `⚡ *Preparando tu video...*\n⏳ Esto puede tardar unos segundos.`
  }, { quoted: m })
  
  try {
    // 🔍 Buscar en YT
    let res = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(q)}`)
    let json = await res.json()
    if (!json.status || !json.data || !json.data.length) {
      return conn.sendMessage(m.chat, { text: `❌ No encontré resultados para *${q}*.` }, { quoted: m })
    }

    let vid = json.data[0]

    let info = await savetube.download(vid.url, '360')
    if (!info.status) {
      return conn.sendMessage(m.chat, { text: `⚠️ No se pudo obtener el video de *${vid.title}*.` }, { quoted: m })
    }

    let { result } = info

    // Diseño bonito con emojis
    let caption = `
🎬 *Título:* ${result.title}
⏱️ *Duración:* ${vid.duration}
📺 *Canal:* ${vid.author?.name || "Desconocido"}
⚡ *Calidad:* ${result.quality}p
🔗 *Link:* ${vid.url}
💎 ¡Disfruta tu video!
`.trim()

    // Miniatura
    let thumb = null
    try {
      const img = await Jimp.read(result.thumbnail)
      img.resize(300, Jimp.AUTO)
      thumb = await img.getBufferAsync(Jimp.MIME_JPEG)
    } catch (err) {
      console.log("Error al procesar miniatura:", err)
    }

    // Reacción antes de enviar el archivo
    await conn.sendMessage(m.chat, { text: "✨ *Enviando tu video...*" }, { quoted: m })

    await conn.sendMessage(m.chat, {
      document: { url: result.download },
      mimetype: "video/mp4",
      fileName: `${result.title}.mp4`,
      caption,
      ...(thumb ? { jpegThumbnail: thumb } : {}),
      contextInfo: {
        externalAdReply: {
          title: result.title,
          body: "🚀 YouTube Video 💖",
          mediaUrl: vid.url,
          sourceUrl: vid.url,
          thumbnailUrl: result.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    // Reacción después de enviar
    await conn.sendMessage(m.chat, { text: "✅ *Video enviado con éxito!* 🎉" }, { quoted: m })

  } catch (err) {
    console.error("[Error en ytmp4doc:]", err)
    conn.sendMessage(m.chat, { text: `💔 Error: ${err.message}` }, { quoted: m })
  }
}

handler.command = ['ytmp4doc', 'ytvdoc', 'ytdoc']
handler.help = ['ytmp4doc']
handler.tags = ['descargas']

export default handler
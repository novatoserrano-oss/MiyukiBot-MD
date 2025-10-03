import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `🍂 Ingresa un enlace de YouTube.\n\n☁️ Ejemplo:\n${usedPrefix + command} https://youtube.com/watch?v=03pkdhqOEdY`, m)
  }

  const apis = [
    async (url) => {
      let api = `https://api.stellarwa.xyz/dow/ytmp4v2?url=${encodeURIComponent(url)}&apikey=Shadow-xyz`
      let res = await fetch(api)
      let json = await res.json()
      if (!json.status) throw new Error("❌ Stellar falló")
      return {
        title: json.data.title,
        thumbnail: json.data.thumbnail,
        dl: json.data.dl,
        duration: json.data.duration
      }
    },
    async (url) => {
      let api = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`
      let res = await fetch(api)
      let json = await res.json()
      if (!json.title) throw new Error("❌ Yupra falló")
      return {
        title: json.title,
        thumbnail: `https://i.ytimg.com/vi/${url.split("v=")[1]}/maxresdefault.jpg`,
        dl: json.url || json.result?.[0]?.url,
        duration: Math.floor((json.result?.[0]?.approxDurationMs || 0) / 1000)
      }
    },
    async (url) => {
      let api = `https://xyro.site/download/youtubemp4?url=${encodeURIComponent(url)}&quality=480`
      let res = await fetch(api)
      let json = await res.json()
      if (!json.status) throw new Error("❌ Xyro falló")
      return {
        title: json.result.title,
        thumbnail: json.result.thumb,
        dl: json.result.dl,
        duration: json.result.duration
      }
    }
  ]

  let video
  for (let i = 0; i < apis.length; i++) {
    try {
      let pick = apis.sort(() => Math.random() - 0.5)[0]
      video = await pick(text)
      if (video) break
    } catch (e) {
      console.log(`⚠️ API ${i+1} falló:`, e.message)
    }
  }

  if (!video) return conn.reply(m.chat, "❌ No se pudo descargar el video con ninguna API.", m)

  let caption = `
🎬 *Título:* ${video.title}
⏱️ *Duración:* ${video.duration ? video.duration + " seg" : "N/A"}
`.trim()

  await conn.sendMessage(m.chat, {
    video: { url: video.dl },
    mimetype: "video/mp4",
    fileName: video.title + ".mp4",
    caption,
    thumbnail: await (await fetch(video.thumbnail)).buffer()
  }, { quoted: m })
}

handler.help = ["ytmp4"]
handler.tags = ["downloader"]
handler.command = ["ytmp4", "ytvideo"]

export default handler
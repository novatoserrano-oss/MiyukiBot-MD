
import Jimp from 'jimp'
import axios from 'axios'
import crypto from 'crypto'

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'MiyukiBot/1.0.0'
  },
  crypto: {
    hexToBuffer: (hexString) => {
      const matches = hexString.match(/.{1,2}/g);
      return Buffer.from(matches.join(''), 'hex');
    },
    decrypt: async (enc) => {
      const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      const key = savetube.crypto.hexToBuffer(secretKey);
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString());
    }
  },
  isUrl: str => { try { new URL(str); return true } catch { return false } },
  youtube: url => {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let regex of patterns) {
      if (regex.test(url)) return url.match(regex)[1];
    }
    return null;
  },
  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, code: 200, data: response };
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        error: error.message
      };
    }
  },
  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    if (!response.status) return response;
    return { status: true, code: 200, data: response.data.cdn };
  },
  download: async (link) => {
    if (!link) return { status: false, code: 400, error: "Falta el enlace de YouTube." };
    if (!savetube.isUrl(link)) return { status: false, code: 400, error: "URL inválida de YouTube." };

    const id = savetube.youtube(link);
    if (!id) return { status: false, code: 400, error: "No se pudo extraer el ID del video." };

    try {
      const cdnRes = await savetube.getCDN();
      if (!cdnRes.status) return cdnRes;
      const cdn = cdnRes.data;

      const infoRes = await savetube.request(`https://${cdn}${savetube.api.info}`, {
        url: `https://www.youtube.com/watch?v=${id}`
      });
      if (!infoRes.status) return infoRes;

      const decrypted = await savetube.crypto.decrypt(infoRes.data.data);

      const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id: id,
        downloadType: 'audio',
        quality: '128',
        key: decrypted.key
      });

      return {
        status: true,
        code: 200,
        result: {
          title: decrypted.title || "Desconocido",
          thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          download: dl.data.data.downloadUrl,
          duration: decrypted.duration,
          quality: '128',
          id
        }
      };

    } catch (error) {
      return { status: false, code: 500, error: error.message };
    }
  }
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let q = args.join(" ").trim()
  if (!q) {
    return conn.sendMessage(m.chat, {
      text: `💥 *Por favor, ingresa el nombre del audio o video que deseas descargar.*`
    }, { quoted: m })
  }

  // Reacción inicial con emoji de estrella brillante
  await conn.sendMessage(m.chat, { react: { text: '🌟', key: m.key } })

  // Progreso visual (puedes personalizar si quieres)
  await conn.sendMessage(m.chat, {
    text: `✨✨✨ *Descargando tu contenido...* ✨✨✨`
  }, { quoted: m })

  try {
    // 🔍 Buscar en YouTube
    let res = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(q)}`)
    let json = await res.json()
    if (!json.status || !json.data || !json.data.length) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return conn.sendMessage(m.chat, { text: `❌ *No encontré resultados para "${q}"*.` }, { quoted: m })
    }

    let vid = json.data[0]

    // Descargar el audio
    let info = await savetube.download(vid.url)
    if (!info.status) {
      await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
      return conn.sendMessage(m.chat, { text: `⚠️ *No se pudo obtener el audio de "${vid.title}"*.` }, { quoted: m })
    }

    let { result } = info

    // Miniatura
    let thumb = null
    try {
      const img = await Jimp.read(result.thumbnail)
      img.resize(300, Jimp.AUTO)
      thumb = await img.getBufferAsync(Jimp.MIME_JPEG)
    } catch (err) {
      console.log('⚠️ Error al procesar miniatura:', err)
    }

    // Enviar archivo
    await conn.sendMessage(m.chat, {
      document: { url: result.download },
      mimetype: 'audio/mpeg',
      fileName: `${result.title}.mp3`,
      caption: `
🎶 *${result.title}*
🕒 Duración: ${vid.duration}
🎤 Canal: ${vid.author?.name || "Desconocido"}
🔊 Calidad: ${result.quality}
🔗 Link: ${vid.url}
      `.trim(),
      ...(thumb ? { jpegThumbnail: thumb } : {}),
      contextInfo: {
        externalAdReply: {
          title: result.title,
          body: "𝙈𝙞𝙮𝙪𝙠𝙞𝘽𝙤𝙩-𝙈𝘿 🌸",
          mediaUrl: vid.url,
          sourceUrl: vid.url,
          thumbnailUrl: result.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    // Reacción final con emoji de estrella brillante
    await conn.sendMessage(m.chat, { react: { text: '🌈', key: m.key } })

  } catch (e) {
    console.error("[Error en ytmp3doc]", e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return conn.reply(m.chat, `🚨 ¡Oops! Algo salió mal:\n${e.message}\n\nPor favor, reporta este error con *${usedPrefix}report*`, m)
  }
}

handler.command = ['ytmp3doc', 'ytadoc']
handler.help = ['ytmp3doc <nombre>']
handler.tags = ['descargas']

export default handler

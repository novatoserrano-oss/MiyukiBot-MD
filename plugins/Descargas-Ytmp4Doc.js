
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
    'user-agent': 'Postify/1.0.0'
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
  isUrl: str => { 
    try { new URL(str); return true } catch { return false } 
  },
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
  download: async (link, quality = '360') => {
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
        downloadType: 'video',
        quality: quality,
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
          quality: quality,
          id
        }
      };

    } catch (error) {
      return { status: false, code: 500, error: error.message };
    }
  }
};

// Función principal del handler
let handler = async (m, { conn, args, usedPrefix, command }) => {
  const query = args.join(" ").trim();
  if (!query) {
    return conn.sendMessage(m.chat, {
      text: `*✍️ Ingresa el nombre del video a descargar.*`
    }, { quoted: m });
  }

  // Emoji reacción al inicio
  await conn.sendMessage(m.chat, { react: { text: '🎥', key: m.key } });

  // Procesar opción de calidad (velocidad)
  let quality = '360'; // valor por default
  const qualityArgIndex = args.findIndex(arg => arg.toLowerCase() === 'velocidad');
  if (qualityArgIndex !== -1 && args[qualityArgIndex + 1]) {
    const v = args[qualityArgIndex + 1];
    if (['144','240','360','480','720','1080'].includes(v)) {
      quality = v;
    }
  }

  try {
    // Buscar en YouTube
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(query)}`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.length) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return conn.sendMessage(m.chat, { text: `❌ No encontré resultados para *${query}*.` }, { quoted: m });
    }

    const video = json.data[0];

    // Descargar video con calidad seleccionada
    const info = await savetube.download(video.url, quality);
    if (!info.status) {
      await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
      return conn.sendMessage(m.chat, { text: `⚠️ No se pudo obtener el video de *${video.title}*.` }, { quoted: m });
    }

    const { result } = info;

    // Crear miniatura
    let thumb = null;
    try {
      const img = await Jimp.read(result.thumbnail);
      img.resize(300, Jimp.AUTO);
      thumb = await img.getBufferAsync(Jimp.MIME_JPEG);
    } catch (err) {
      console.log("Error al procesar miniatura:", err);
    }

    // Enviar el video
    await conn.sendMessage(m.chat, {
      document: { url: result.download },
      mimetype: "video/mp4",
      fileName: `${result.title}.mp4`,
      caption: `
🎬 *${result.title}*
⏱️ Duración: ${video.duration}
📺 Canal: ${video.author?.name || "Desconocido"}
🔧 Calidad: ${result.quality}p
🔗 Link: ${video.url}
      `.trim(),
      ...(thumb ? { jpegThumbnail: thumb } : {}),
      contextInfo: {
        externalAdReply: {
          title: result.title,
          body: "🚀 YouTube Video 💖",
          mediaUrl: video.url,
          sourceUrl: video.url,
          thumbnailUrl: result.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

    // Emoji reacción final
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error("[Error en ytmp4doc:]", err);
    // Reacción en error
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    conn.sendMessage(m.chat, { text: `💔 Error: ${err.message}` }, { quoted: m });
  }
}

handler.command = ['ytmp4doc', 'ytvdoc', 'ytdoc'];
handler.help = ['ytmp4doc'];
handler.tags = ['descargas'];

export default handler;

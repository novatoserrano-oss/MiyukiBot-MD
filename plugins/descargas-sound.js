import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🎶 *Por favor ingresa el nombre de una canción o artista para buscar en SoundCloud.*\n\n💡 *Ejemplo:* `.sound Tokyo Nights`');

  try {
    await m.react('🎧');

    const searchRes = await axios.get('https://delirius-apiofc.vercel.app/search/soundcloud', {
      params: { q: text, limit: 1 }
    });

    const song = searchRes.data.data[0];
    if (!song) return m.reply('🚫 *No se encontraron resultados en SoundCloud.*');

    const dlRes = await axios.get('https://api.siputzx.my.id/api/d/soundcloud', {
      params: { url: song.link }
    });

    if (!dlRes.data.status) {
      return m.reply('⚠️ *No se pudo descargar el audio. Inténtalo más tarde.*');
    }

    const audio = dlRes.data.data;

    const caption = `
🎧 *SOUND CLOUD - DESCARGA EXITOSA* 🎶

🎵 *Título:* ${audio.title || 'Desconocido'}
👤 *Artista:* ${audio.user || 'Desconocido'}
⏱️ *Duración:* ${msToTime(audio.duration) || 'Desconocido'}
📝 *Descripción:* ${audio.description || 'Sin descripción'}
🔗 *Enlace:* ${song.link || 'N/A'}

*𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢*`.trim();

    await conn.sendFile(m.chat, audio.thumbnail, 'cover.jpg', caption, m);

    await conn.sendMessage(m.chat, {
      audio: { url: audio.url },
      fileName: `${audio.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: `${audio.title}`,
          body: `🎧 Descarga completada | 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋`,
          thumbnailUrl: audio.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.react('✅');
  } catch (err) {
    console.error('[SOUNDCLOUD ERROR]', err);
    m.reply('💥 *Ocurrió un error al procesar la solicitud. Inténtalo nuevamente más tarde.*');
    await m.react('❌');
  }
};

function msToTime(ms) {
  let seconds = Math.floor((ms / 1000) % 60),
      minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

handler.command = ['sound', 'soundcloud'];
handler.help = ['soundcloud <nombre>'];
handler.tags = ['descargas'];
handler.register = true;
handler.limit = 2;

export default handler;
import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🎶 *Por favor, ingresa el nombre de una canción o artista para buscar en SoundCloud.*');

  try {
    await m.react('⏳');

    const searchRes = await axios.get('https://delirius-apiofc.vercel.app/search/soundcloud', {
      params: { q: text, limit: 1 }
    });

    const song = searchRes.data.data[0];
    if (!song) return m.reply('🚫 *No se encontraron resultados en SoundCloud.*');

    const dlRes = await axios.get('https://api.siputzx.my.id/api/d/soundcloud', {
      params: { url: song.link }
    });

    if (!dlRes.data.status) {
      return m.reply('⚠️ *No se pudo descargar el audio desde SoundCloud.*');
    }

    const audio = dlRes.data.data;

    const caption = `
╭───────────────────────╮
│ 🎧 *S O U N D C L O U D  🎵*
╰───────────────────────╯

✨ *Título:* ${audio.title || 'Desconocido'}
👤 *Artista:* ${audio.user || 'Desconocido'}
⏱️ *Duración:* ${msToTime(audio.duration) || 'Desconocido'}
📝 *Descripción:* ${audio.description || 'Sin descripción'}
🔗 *Link:* ${song.link || 'N/A'}

💿 *Descarga completada con éxito!*
🎶 *Disfruta tu música con estilo 🔥*
`;

    await conn.sendFile(m.chat, audio.thumbnail, 'cover.jpg', caption.trim(), m);

    await conn.sendMessage(m.chat, {
      audio: { url: audio.url },
      fileName: `${audio.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: `🎵 ${audio.title}`,
          body: `🎧 ${audio.user || 'Artista desconocido'} | SoundCloud`,
          thumbnailUrl: audio.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.react('✅');
  } catch (err) {
    console.error('[SOUNDCLOUD ERROR]', err);
    await m.react('❌');
    m.reply('💥 *Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.*');
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
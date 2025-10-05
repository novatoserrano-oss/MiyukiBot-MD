import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `*🌸✨ Onichan~ debes poner un link de TikTok uwu 💖*`, m, fake);
  }

  try {
    const tiktokData = await tiktokdl(args[0]);

    if (!tiktokData || !tiktokData.status || !tiktokData.data) {
      return conn.reply(m.chat, "❌ Uff... No pude traer tu video onichan 😿", m);
    }

    const thumbRes = await fetch('https://qu.ax/QvZCV.jpg');
    const thumbBuffer = await thumbRes.buffer();

    const fkontak = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: ` • 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙰𝙳𝙰 •`,
          jpegThumbnail: thumbBuffer
        }
      },
      participant: "0@s.whatsapp.net"
    };

    const data = tiktokData.data;
    const videoURL = data.meta.media[0]?.hd || data.meta.media[0]?.org;

    if (videoURL) {
      await conn.sendFile(
        m.chat,
        videoURL,
        "tiktok.mp4",
        `❀ *Título ›* \`${title || 'No disponible'}\`\n> ☕︎ Autor › *${author?.nickname || author?.unique_id || 'No disponible'}*\n> ✰ Duración › *${duration || 'No disponible'}s*${created_at ? `\n> ☁︎ Creado » ${created_at}` : ''}\n> 𝅘𝅥𝅮 Música » [${author?.nickname || author?.unique_id || 'No disponible'}] original sound - ${author?.unique_id || 'unknown'}`,
        fkontak
      );
    } else {
      return conn.reply(m.chat, "❌ No pude descargarlo nya~ 😿", m);
    }
  } catch (error1) {
    return conn.reply(m.chat, `❌ Error inesperado: ${error1.message}`, m);
  }
};

handler.help = ['tiktok'].map((v) => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
//handler.register = true;
//handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
  let api = `https://api.delirius.store/download/tiktok?url=${encodeURIComponent(url)}`;
  let response = await (await fetch(api)).json();
  return response;
}
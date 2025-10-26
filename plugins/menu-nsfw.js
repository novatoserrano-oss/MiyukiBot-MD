import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const img = 'https://qu.ax/TCKLQ.jpg'; 
    const taguser = '@' + m.sender.split('@')[0];
    const invisible = String.fromCharCode(8206).repeat(850);

    const fkontak = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },
      message: {
        contactMessage: {
          displayName: 'MiyukiBot-MD 🥵',
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Miyuki;;;\nFN:Miyuki\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Bot\nEND:VCARD`
        }
      }
    };

    const str = `
╭─❖ 🌹 𝐌𝐈𝐘𝐔𝐊𝐈𝐁𝐎𝐓 +𝟭𝟴 🌹 ❖─╮
│✨ Hola ${taguser}
│🔥 Bienvenido al *Modo Picante*
│${invisible}
╰─────────────────────╯

💞 *BÚSQUEDAS CALIENTES*
╭───────────────
│🔍 ${usedPrefix}xnxxsearch
│🔍 ${usedPrefix}pornhubsearch
│🔍 ${usedPrefix}xvsearch
│🔍 ${usedPrefix}rule34search
╰───────────────

🎬 *DESCARGAS ADULTAS*
╭───────────────
│📥 ${usedPrefix}xnxxdl
│📥 ${usedPrefix}xvideosdl
│📥 ${usedPrefix}pornhubdl
╰───────────────

💋 *ROLEPLAY +18*
╭───────────────
│💞 ${usedPrefix}sixnine @tag
│🍑 ${usedPrefix}anal @tag
│👄 ${usedPrefix}blowjob @tag
│🫦 ${usedPrefix}boobjob @tag
│💦 ${usedPrefix}cum @tag
│🖐️ ${usedPrefix}spank @tag
│🔥 ${usedPrefix}fuck @tag
│🦶 ${usedPrefix}footjob @tag
│💢 ${usedPrefix}lickpussy @tag
│❤️ ${usedPrefix}lesbianas @tag
╰───────────────

🍓 *PACKS / HENTAI*
╭───────────────
│🎁 ${usedPrefix}pack
│🎁 ${usedPrefix}pack2
│🎁 ${usedPrefix}pack3
│🎥 ${usedPrefix}videoxxx
│🌸 ${usedPrefix}hentai
╰───────────────

⚠️ *AVISO IMPORTANTE*
Este contenido es solo para mayores de edad.
Usa este modo con responsabilidad 🧠

> 💠 Powered By *OmarGranda*
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: str,
      mentions: [m.sender]
    }, { quoted: fkontak });

    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

  } catch (e) {
    conn.reply(m.chat, `⚠️ Error al enviar el menú.\n\n${e}`, m);
  }
};

handler.help = ['menu18', 'menunsfw'];
handler.command = ['menu18', 'menu+18', 'nsfwmenu', 'menuhot'];
handler.fail = null;

export default handler;
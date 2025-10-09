import fetch from 'node-fetch';

export async function before(m, { conn }) {
  if (!m.text || !global.prefix.test(m.text)) return;

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
  
  const thumbRes = await fetch("https://files.catbox.moe/3nmafy.jpg");
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
                name: `🌸｡･ﾟ♡ 𝐌𝐢𝐲𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃 ♡･ﾟ｡🌸`,
                jpegThumbnail: thumbBuffer
            }
        },
        participant: "0@s.whatsapp.net"
  };

  if (!command || command === 'bot') return;

  const isValidCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      const cmdList = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      if (cmdList.includes(command)) return true;
    }
    return false;
  };

  if (isValidCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];

    if (chat?.isBanned) {
      const avisoDesactivado = `╭─❀˚₊·  *💤 𝐌𝐢𝐲𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎 💫* ·₊˚❀─╮
│ 🚫 *${bot}* está durmiendo en este grupo.  
│ 🍓 No puedes usar comandos mientras está apagado.  
│ 🧁 Solo un *admin lindo* puede despertarla.  
│ 🌷 Usa: *${usedPrefix}bot on* para activarla~  
╰───────────────────────────────╯`;

      await conn.sendMessage(m.chat, {
        text: avisoDesactivado,
        mentions: [m.sender],
        contextInfo: {
          externalAdReply: {
            title: 'MiyukiBot-MD 🌸',
            body: '© 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢',
            thumbnailUrl: 'https://files.catbox.moe/mez710.jpg',
            sourceUrl: 'https://github.com/OmarGranda',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: fkontak });
      return;
    }

    if (!user.commands) user.commands = 0;
    user.commands += 1;
    return;
  }

  const mensajesNoEncontrado = [
    `₊˚⊹♡ *¡Nyaa~! El comando "${command}" no existe.*  
🌷 Usa *${usedPrefix}menu* para ver todos los comandos lindos 💖`,

    `🌸 *"${command}"* no forma parte del mundo kawaii~  
🍡 Mira el menú: *${usedPrefix}menu* (≧◡≦)`,

    `🩷 *"${command}"* no está registrado, gomen~  
🍰 Usa *${usedPrefix}menu* para ver opciones válidas.`,

    `🐰 El comando *"${command}"* no existe, nya~  
🍓 Consulta el menú: *${usedPrefix}menu*`,

    `🍥 *"${command}"* aún no está disponible, uwu~  
🎀 Menú de ayuda: *${usedPrefix}menu*`,

    `💫 *"${command}"* es un comando desconocido (｡>﹏<)  
🌸 Usa: *${usedPrefix}menu* para ver los disponibles.`
  ];

  const texto = mensajesNoEncontrado[Math.floor(Math.random() * mensajesNoEncontrado.length)];
  const thumb = 'https://files.catbox.moe/7gi8ch.jpg';

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: 'MiyukiBot-MD 🌸',
        body: '© 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢',
        thumbnailUrl: thumb,
        sourceUrl: 'https://instagram.com',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: fkontak });
}
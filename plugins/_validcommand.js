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
      id: "Hola"
    },
    message: {
      locationMessage: {
        name: `MiyukiBot-MD`,
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
      const avisoDesactivado = `
╭───〔 MiyukiBot-MD 〕───╮
│ ⚙️ Estado: *Desactivado*
│ 🕓 Los comandos no están disponibles.
│ 💡 Solo un *admin* puede activarlo.
│ 🔁 Usa: *${usedPrefix}bot on*
╰────────────────────────╯`;

      await conn.sendMessage(m.chat, {
        text: avisoDesactivado.trim(),
        mentions: [m.sender],
        contextInfo: {
          externalAdReply: {
            title: 'MiyukiBot-MD • Offline',
            body: '© Powered by OmarGranda',
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

  // --- Mensaje cuando el comando no existe ---
  const mensajesNoEncontrado = [
    `⚠️ El comando *"${command}"* no está registrado.\n💡 Usa *${usedPrefix}menu* para ver los disponibles.`,
    `🔍 No encontré el comando *"${command}"*.\n💡 Prueba *${usedPrefix}menu* para explorar las funciones.`,
    `⚙️ *"${command}"* no existe o fue removido.\n💡 Usa *${usedPrefix}menu* para ver los actuales.`,
    `💭 Comando *"${command}"* no reconocido.\n💡 Consulta *${usedPrefix}menu* para más información.`,
    `🧩 No hay coincidencias con *"${command}"*.\n💡 Usa *${usedPrefix}menu* para ver opciones válidas.`
  ];

  const texto = mensajesNoEncontrado[Math.floor(Math.random() * mensajesNoEncontrado.length)];
  const thumb = 'https://files.catbox.moe/oxt9wo.jpg';

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: 'MiyukiBot-MD • AI Assistant',
        body: '© Powered by OmarGranda',
        thumbnailUrl: thumb,
        sourceUrl: 'https://instagram.com',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: fkontak });
}
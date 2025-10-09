/*import fetch from 'node-fetch';

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
            title: 'MiyukiBot-MD',
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
}*/

export async function before(m, { groupMetadata }) {
if (!m.text || !global.prefix.test(m.text)) return
const usedPrefix = global.prefix.exec(m.text)[0]
const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()
if (!command || command.length === 0) return
const validCommand = (command, plugins) => {
for (let plugin of Object.values(plugins)) {
if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
return true
}}
return false
}
let chat = global.db.data.chats[m.chat]
let settings = global.db.data.settings[this.user.jid]
let owner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
if (chat.modoadmin) return
if (settings.self) return
if (command === 'mute') return
if (chat.isMute && !owner) return
if (command === 'bot') return
if (chat.isBanned && !owner) return
if (validCommand(command, global.plugins)) {
} else {
const comando = command
const mensajesNoEncontrado = [
    `❌ El comando *"${command}"* no existe.\n💬 Usa *${usedPrefix}menu* para ver todos los disponibles.`,
    `⚠️ No encontré el comando *"${command}"*.\n📖 Revisa *${usedPrefix}menu* para opciones válidas.`,
    `🧩 *"${command}"* no es un comando válido.\n➡️ Usa *${usedPrefix}menu* para ver los comandos.`,
    `💭 No reconozco *"${command}"*.\n✨ Mira *${usedPrefix}menu* para ver qué puedo hacer.`,
    `🔍 El comando *"${command}"* no está registrado.\n💡 Usa *${usedPrefix}menu* para ver la lista completa.`
  ];

  const texto = mensajesNoEncontrado[Math.floor(Math.random() * mensajesNoEncontrado.length)];
  const thumb = 'https://files.catbox.moe/oxt9wo.jpg';

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: 'MiyukiBot-MD 👽',
        body: '© Powered by OmarGranda',
        thumbnailUrl: thumb,
        sourceUrl: 'https://instagram.com',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: fkontak });
 }
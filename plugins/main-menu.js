// 🌸 MiyukiBot MD - Menú Mejorado v1.8.2
// 💫 Diseñado por: Omar Granda
// 🪷 Omar gay > att: Shadow-xyz

import os from 'os'
import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, __dirname }) => {
  try {
    await m.react('🌸')

    const user = global.db.data.users[m.sender] || {}
    const name = await conn.getName(m.sender)
    const totalUsers = Object.keys(global.db.data.users).length
    const groups = Object.values(conn.chats).filter(c => c.id.endsWith('@g.us')).length
    const uptime = clockString(process.uptime() * 1000)
    const date = moment.tz('America/Lima').format('hh:mm A')
    const day = moment.tz('America/Lima').format('dddd')
    const fullDate = moment.tz('America/Lima').format('DD MMMM YYYY')
    const isPremium = user.premium ? '✨ Premium' : '🪶 Gratis'
    const limit = user.limit || 0
    const country = '🇵🇪 Perú'

    const menu = `
╭━━━〔 🌸 𝑴𝑰𝒀𝑼𝑲𝑰ʙᴏᴛ • ᴹᴰ 💫 〕━━⬣
│👤  Usuario: ${name}
│💎  Estado: ${isPremium}
│🌍  País: ${country}
│⚙️  Límite: ${limit}
│👥  Usuarios: ${totalUsers}
│💬  Grupos: ${groups}
│⏱️  Uptime: ${uptime}
│🪷  Versión: v1.8.2 | Latest
│📚  Librería: Baileys Multi Device
│📆  Fecha: ${date} • ${day}, ${fullDate}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌙  Desarrollador: *Omar Granda*
───────────────────────────────
💫 *Menú Principal Disponible ↓*

╭───〔 🌸 𝙄𝙉𝙁𝙊 〕───⬣
│💬 .creador
│⚡ .ping / .p / .estado
│🧠 .newcommand
╰────────────────⬣

╭───〔 🌿 𝙐𝙏𝙄𝙇𝙄𝘿𝘼𝘿𝙀𝙎 〕───⬣
│🪞 .inspect / .ss / .translate  
│🧮 .cal / .tamaño <número>  
│🎨 .dalle / .flux / .ia / .chatgpt / .bard  
│🎵 .whatmusic <audio> / .lyrics  
│🔍 .wikipedia / .tourl / .ssweb
╰────────────────⬣

╭───〔 🎮 𝙅𝙐𝙀𝙂𝙊𝙎 & 𝘿𝙄𝙑𝙀𝙍𝙎𝙄𝙊𝙉 〕───⬣
│🎲 .slot / .slut / .rob  
│⚔️ .adventure / .cazar / .dungeon  
│💰 .bal / .baltop / .daily / .weekly  
│🪙 .depositar / .retirar / .pay  
│🏆 .lboard / .levelup / .lvl @user  
│🎵 .pokedex / .letra / .letra2  
╰────────────────⬣

╭───〔 🎮 𝙅𝙐𝙀𝙂𝙊𝙎 & 𝘿𝙄𝙑𝙀𝙍𝙎𝙄𝙊𝙉 〕───⬣
│🎲 .slot / .slut / .rob  
│⚔️ .adventure / .cazar / .dungeon  
│💰 .bal / .baltop / .daily / .weekly  
│🪙 .depositar / .retirar / .pay  
│🏆 .lboard / .levelup / .lvl @user  
│🎵 .pokedex / .letra / .letra2  
╰────────────────⬣

╭───〔 🌸 𝘼𝙉𝙄𝙈𝙀 𝙒𝙊𝙍𝙇𝘿 〕───⬣
│💞 .hug / .kiss / .pat / .poke / .love  
│😂 .laugh / .smile / .cringe / .drama  
│🥺 .cry / .sad / .shy / .enamorado  
│🍵 .coffee / .eat / .dance / .sleep  
│🫶 .waifu / .loli / .harem / .infoanime  
╰────────────────⬣

╭───〔 🎧 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎 〕───⬣
│🎵 .play / .play2 / .spotify  
│🎬 .mp3 / .mp4 / .twitter  
│📌 .pinterest / .catbox  
╰────────────────⬣

╭───〔 🩷 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙕𝙊𝙉𝙀 〕───⬣
│🎠 .sticker / .stickerly / .emojimix  
│💖 .take / .robar / .wm / .qc  
│🖼️ .pfp / .brat / .bratv  
╰────────────────⬣

╭───〔 🏮 𝙂𝙍𝙐𝙋𝙊𝙎 & 𝘼𝘿𝙈𝙄𝙉𝙎 〕───⬣
│📢 .invite / .todos / .listonline  
│🛡️ .autoadmin / .restrict / .restringir  
│🧾 .backup / .resetuser / .broadcastgroup  
╰────────────────⬣

╭───〔 💠 𝙊𝙒𝙉𝙀𝙍 & 𝙎𝙏𝘼𝙁𝙁 〕───⬣
│👑 .addprem / .delprem / .listprem  
│💎 .addcoin / .addxp  
│💻 .update / .restart / .setppbot  
│🧩 .saveplugin / .deletefile / .getplugin  
╰────────────────⬣

╭───〔 🍑 𝙈𝙊𝘿𝙊 +18 🔞 〕───⬣
│⚠️ Usa con precaución:  
│🔹 .nsfw1 / .nsfw2 / .r34 <tag>  
│🔹 .hentai / .cosplay / .tetas  
│🔹 .sexo / .follar / .spank / .lesbianas  
╰────────────────⬣

🌸 ʙʏ ᴏᴍᴀʀ ɢʀᴀɴᴅᴀ | ᴠᴇʀꜱɪᴏɴ 1.8.2  
💮 ᴍɪʏᴜᴋɪʙᴏᴛ ᴍᴅ — ᴇʟ ᴇsᴛɪʟᴏ ᴍᴇᴊᴏʀᴀᴅᴏ 💫
`;

  await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
};

handler.help = ['menu', 'help'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'comandos'];

export default handler;
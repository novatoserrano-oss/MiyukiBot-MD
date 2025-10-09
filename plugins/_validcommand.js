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
await m.reply(`⚠️ El comando *<${comando}>* no existe.\n> Usa *${usedPrefix}help* para ver la lista de comandos disponibles.`)
}}
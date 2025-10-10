if (args.length === 0) {
const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado'
const info = `「✦」Un administrador puede activar o desactivar a *${botname}* utilizando:\n\n✐ _Activar_ » *${usedPrefix}bot enable*\n✐ _Desactivar_ » *${usedPrefix}bot disable*\n\n✧ Estado actual » *${estado}*`
return conn.reply(m.chat, info, m)
}
if (args[0] === 'off') {
if (chat.isBanned) {
return conn.reply(m.chat, `《✦》${botname} ya estaba desactivado.`, m)
}
chat.isBanned = true
return conn.reply(m.chat, `❀ Has *desactivado* a ${botname}!`, m)
} else if (args[0] === 'on') {
if (!chat.isBanned) {
}
chat.isBanned = false
return conn.reply(m.chat, `❀ Has *activado* a ${botname}!`, m)
};

handler.help = ['bot [enable|disable]']
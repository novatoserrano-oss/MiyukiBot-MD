let handler = async (m, { conn, usedPrefix, command, args, isAdmin, isOwner }) => {
  let chat = global.db.data.chats[m.chat];
  const bot = global.botname || "🤖 Bot";
  
  // Aseguramos que exista la propiedad isBanned
  if (chat.isBanned === undefined) chat.isBanned = false;

  const estadoActual = chat.isBanned ? '✗ Desactivado' : '✓ Activado';

  // Si no se pasan argumentos, mostrar menú
  if (!args[0]) {
    const info = `
╭━━━〔 ⚙️ *Control del Bot* 〕━━⬣
┃ ✦ Solo *administradores* pueden usar:
┃
┃ 🟢 Activar » *${usedPrefix + command} enable*
┃ 🔴 Desactivar » *${usedPrefix + command} disable*
┃
┃ ✧ Estado actual » *${estadoActual}*
╰━━━━━━━━━━━━━━━━━━⬣`;
    return conn.reply(m.chat, info.trim(), m);
  }

  const arg = args[0].toLowerCase();

  // Solo admins o el dueño pueden cambiar el estado
  if (!isAdmin && !isOwner)
    return conn.reply(m.chat, `⚠️ Solo *administradores* pueden usar este comando.`, m);

  if (['off', 'disable', 'desactivar'].includes(arg)) {
    if (chat.isBanned)
      return conn.reply(m.chat, `⚠️ *${bot}* ya estaba *desactivado.*`, m);

    chat.isBanned = true;
    return conn.reply(m.chat, `🔒 Has *desactivado* a *${bot}* en este grupo.`, m);
  }

  if (['on', 'enable', 'activar'].includes(arg)) {
    if (!chat.isBanned)
      return conn.reply(m.chat, `⚠️ *${bot}* ya estaba *activado.*`, m);

    chat.isBanned = false;
    return conn.reply(m.chat, `✅ Has *activado* a *${bot}* en este grupo.`, m);
  }

  return conn.reply(m.chat, `❌ Opción no válida.\nUsa *${usedPrefix + command} enable* o *${usedPrefix + command} disable*`, m);
};

handler.help = ['bot [enable|disable]'];
handler.tags = ['grupo'];
handler.command = /^bot$/i;
handler.admin = true;

export default handler;
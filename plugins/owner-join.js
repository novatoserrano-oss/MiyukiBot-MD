let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, isOwner }) => {
    if (!text) {
        await m.react('❌');
        return m.reply(`🚩 *Debes enviar una invitación para que ${botname} se una al grupo.*\n\n📎 Ejemplo:\n.join https://chat.whatsapp.com/xxxxxxxxxxxxxxxxxxxxxx`);
    }

    let [_, code] = text.match(linkRegex) || [];

    if (!code) {
        await m.react('⚠️');
        return m.reply(`🚫 *Enlace de invitación no válido.*\nPor favor, asegúrate de enviar un link correcto de WhatsApp.`);
    }

    if (isOwner) {
        await m.react('🚩');
        await conn.groupAcceptInvite(code)
            .then(async () => {
                await m.react('✅');
                m.reply(`🎉 *¡Me he unido exitosamente al grupo!* 🥳\n\n✨ Gracias por la invitación.`);
            })
            .catch(async err => {
                await m.react('❌');
                m.reply(`💢 *Hubo un error al intentar unirme al grupo.*\nPor favor revisa el enlace o los permisos.`);
            });
    } else {
        await m.react('📨');
        let message = `💌 *Nueva invitación a un grupo:*\n\n🔗 ${text}\n\n👤 *Enviado por:* @${m.sender.split('@')[0]}`;
        await conn.sendMessage(`${suittag}` + '@s.whatsapp.net', { text: message, mentions: [m.sender] }, { quoted: m });
        await m.react('🩷');
        m.reply(`💌 *El link del grupo ha sido enviado al propietario.*\n\n🐾 ¡Gracias por tu invitación! ฅ^•ﻌ•^ฅ`);
    }
};

handler.help = ['invite'];
handler.tags = ['owner', 'tools'];
handler.command = ['invite', 'join'];

export default handler;
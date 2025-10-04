import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  m.reply(`🗿 Actualizando el bot...`);

  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      conn.reply(m.chat, `${msm} Error: No se pudo realizar la actualización.\nRazón: ${err.message}`, m);
      return;
    }

    if (stderr) {
      console.warn('Advertencia durante la actualización:', stderr);
    }

    if (stdout.includes('Already up to date.')) {
      conn.reply(m.chat, `🕸️ El bot ya está actualizado.`, m);
    } else {
      conn.reply(m.chat, `✔️ Actualización realizada con éxito.\n\n${stdout}`, m);
    }
  });
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'fix', 'actualizar'];

export default handler;
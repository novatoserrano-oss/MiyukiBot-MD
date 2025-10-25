import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  m.reply(`📡 *Iniciando proceso de actualizacion...*`);

  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      conn.reply(m.chat, `${msm} *Error: No se pudo realizar la actualización*.\nRazón: ${err.message}`, m);
      return;
    }

    if (stderr) {
      console.warn('*Advertencia durante la actualización:*', stderr);
    }

    if (stdout.includes('Already up to date.')) {
      conn.reply(m.chat, `🚀 *Ya está actualizada a la última versión*.`, m);
    } else {
      conn.reply(m.chat, `✅ *Actualización realizada con éxito*.\n\n${stdout}`, m);
    }
  });
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'fix', 'actualizar'];

handler.all = async function (m) {
  if (!m.text) return
  let txt = m.text.trim().toLowerCase()
  if (['update', 'fix', 'actualizar'].includes(txt)) {
    return handler(m, { conn: this, args: [] })
  }
}

export default handler;
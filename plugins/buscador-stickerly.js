import fetch from 'node-fetch';
import baileys from '@whiskeysockets/baileys';

const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys;

const STICKERLY_API = "https://delirius-apiofc.vercel.app/search/stickerly";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*🌸 Ingresa un texto para buscar en Stickerly.*\n> *Ejemplo:* ${usedPrefix + command} Alya San`);
  await m.react('⏰');

  try {
    const res = await fetch(`${STICKERLY_API}?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data || json.data.length === 0) {
      throw `⚠️ No encontré resultados para *${text}*`;
    }

    const results = json.data.slice(0, 15);

    async function createImage(url) {
      const { imageMessage } = await generateWAMessageContent(
        { image: { url } },
        { upload: conn.waUploadToServer }
      );
      return imageMessage;
    }

    let cards = [];
    for (let pack of results) {
      let image = await createImage(pack.preview);

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `📝 *Nombre:* ${pack.name}\n👤 *Autor:* ${pack.author}\n🧩 *Stickers:* ${pack.sticker_count}\n👀 *Vistas:* ${pack.view_count}\n📤 *Exportados:* ${pack.export_count}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: '𝙼𝚒𝚢𝚞𝚔𝚒𝙱𝚘𝚝-𝙼𝙳 | © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 𝙾𝚖𝚊𝚛𝙶𝚛𝚊𝚗𝚍𝚊'
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '',
          hasMediaAttachment: true,
          imageMessage: image
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: "✅ Copiar Pack",
                id: "stickerlydl",
                copy_code: `.stickerlydl ${pack.url}`
              })
            }
          ]
        })
      });
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `*🌸 Resultados de:* \`${text}\`\n> Mostrando: ${results.length} packs encontrados`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '_Stickerly - Search_'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards
            })
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await m.react('✔️');

  } catch (e) {
    console.error(e);
    await m.reply('❌ Error en la búsqueda o envío del mensaje.');
  }
};

handler.help = ['stickerly <texto>'];
handler.tags = ['sticker'];
handler.command = ['stickerly'];

export default handler;
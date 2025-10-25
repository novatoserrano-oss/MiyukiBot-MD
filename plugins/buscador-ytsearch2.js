import fetch from 'node-fetch';
import yts from 'yt-search';
import baileys from '@whiskeysockets/baileys';

const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*🌸 𝘗𝘰𝘳 𝘧𝘢𝘷𝘰𝘳, 𝘪𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘯𝘰𝘮𝘣𝘳𝘦 𝘥𝘦 𝘶𝘯 𝘷𝘪𝘥𝘦𝘰 𝘰 𝘤𝘢𝘯𝘢𝘭 𝘱𝘢𝘳𝘢 𝘣𝘶𝘴𝘤𝘢𝘳 𝘦𝘯 𝘠𝘰𝘶𝘛𝘶𝘣𝘦.*\n> 𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix + command} Nightcore`);
  await m.react('🔮');

  try {
    const results = await yts(text);
    const videos = results.videos.slice(0, 8);

    if (!videos.length) throw '⚠️ *𝘕𝘰 𝘴𝘦 𝘦𝘯𝘤𝘰𝘯𝘵𝘳𝘢𝘳𝘰𝘯 𝘳𝘦𝘴𝘶𝘭𝘵𝘢𝘥𝘰𝘴 𝘱𝘢𝘳𝘢 𝘦𝘴𝘦 𝘵𝘦𝘹𝘵𝘰.*';

    async function createImage(url) {
      const { imageMessage } = await generateWAMessageContent(
        { image: { url } },
        { upload: conn.waUploadToServer }
      );
      return imageMessage;
    }

    let cards = [];
    for (let video of videos) {
      let image = await createImage(video.thumbnail);

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `╭─⌬・🎧 *𝘛𝘪́𝘵𝘶𝘭𝘰:* ${video.title}\n│ ✦・👤 *𝘊𝘳𝘦𝘢𝘥𝘰𝘳:* ${video.author.name}\n│ ✦・⏱️ *𝘋𝘶𝘳𝘢𝘤𝘪𝘰́𝘯:* ${video.timestamp}\n│ ✦・👁️ *𝘝𝘪𝘴𝘵𝘢𝘴:* ${video.views.toLocaleString()}\n╰─────────────⋆͛🦋`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: '🩵 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢'
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
                display_text: "💿 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳 𝘈𝘶𝘥𝘪𝘰",
                id: "ytmp3",
                copy_code: `.ytmp3 ${video.url}`
              })
            },
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: "🎬 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳 𝘝𝘪𝘥𝘦𝘰",
                id: "ytmp4",
                copy_code: `.ytmp4 ${video.url}`
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
              text: `🦋 *𝘙𝘦𝘴𝘶𝘭𝘵𝘢𝘥𝘰𝘴 𝘥𝘦:* \`${text}\`\n> 𝘔𝘰𝘴𝘵𝘳𝘢𝘯𝘥𝘰 ${videos.length} 𝘰𝘱𝘤𝘪𝘰𝘯𝘦𝘴 🎶`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '_🌐 𝘠𝘰𝘶𝘛𝘶𝘣𝘦 - 𝘚𝘦𝘢𝘳𝘤𝘩 𝘉𝘺 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵_'
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

    await m.react('💫');
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    await m.reply('🚫 𝘖𝘤𝘶𝘳𝘳𝘪𝘰́ 𝘶𝘯 𝘦𝘳𝘳𝘰𝘳 𝘢𝘭 𝘣𝘶𝘴𝘤𝘢𝘳 𝘰 𝘦𝘯𝘷𝘪𝘢𝘳 𝘦𝘭 𝘮𝘦𝘯𝘴𝘢𝘫𝘦.');
  }
};

handler.help = ['ytsearch2 <texto>'];
handler.tags = ['buscador'];
handler.command = ['ytsearch2', 'yts2'];

export default handler;
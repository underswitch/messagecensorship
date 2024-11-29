const { Client, GatewayIntentBits } = require('discord.js');

// 봇 토큰을 입력하세요
const token = 'YOUR_BOT_TOKEN';

// 검열할 키워드 목록
const blockedWords = ['badword1', 'badword2', 'example']; // 여기서 키워드를 추가하세요

// 디스코드 클라이언트 생성
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// 봇이 준비되었을 때 호출되는 이벤트
client.once('ready', () => {
    console.log('Bot is online!');
    // 봇이 참여한 서버들에서 첫 번째 서버를 선택하여 서버 ID 추출
    const targetGuild = client.guilds.cache.first();  // 첫 번째 서버를 선택
    if (targetGuild) {
        const targetGuildId = targetGuild.id;
        console.log(`Server ID is: ${targetGuildId}`);
        // 이제 특정 서버에서만 검열이 작동하도록 설정
        client.on('messageCreate', (message) => {
            // 봇의 메시지에는 반응하지 않음
            if (message.author.bot) return;

            // 메시지가 추출한 서버에서 발생했는지 확인
            if (message.guild.id !== targetGuildId) return;

            // 메시지 내용에서 키워드가 포함되어 있는지 확인
            for (let word of blockedWords) {
                if (message.content.toLowerCase().includes(word.toLowerCase())) {
                    // 키워드가 포함된 메시지를 삭제
                    message.delete()
                        .then(() => {
                            message.channel.send(`${message.author.tag}, 메시지에 금지된 단어가 포함되어 삭제되었습니다.`);
                        })
                        .catch(console.error);
                    break;
                }
            }
        });
    }
});

// 디스코드 봇 로그인
client.login(token);

// 팀장 이벤트 시스템
const TEAM_LEADERS = [
{
name: "고양이",
message: "고양이 등장! 알수없는..기운이 발생된다 🎇 ",
scoreThreshold: 100,
speedIncrease: 1.1
},

<script
  src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
  type="module"
></script>

<dotlottie-player
src="https://lottie.host/7ed38c4a-4553-4d12-9007-6947cdb39576/tlk9gIIrQI.lottie"
background="transparent"
speed="1"
style="width: 300px; height: 300px"
loop
autoplay

> </dotlottie-player>

    {
        name: "김영훈 파트장",
        message: "압타밀 파트장 출현! 분유보다 순한 얼굴에 KPI는 독하게! 🍼😈",
        scoreThreshold: 500,
        speedIncrease: 1.2
    },
    https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiNHV6N29pZG9scHRnc2ljajJ5czUzd2QwcnJrM2pnMnc4b3VpY3BhZCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/3ohze3kG5qO9DcTUbe/giphy.gif
    {
        name: "윤성규 파트장",
        message: "드리미 파트장 진입! 청소기보다 빠르게 너를 정리하러 왔다! 🤖🧹",
        scoreThreshold: 1000,
        speedIncrease: 1.3
    },
    https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiZjFib3kxenAzajZjN3RwNjB3bnVxdnRhcTNtaXlib3EyMHBrdTliNiZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/33zX3zllJBGY8/giphy.gif
    {
        name: "지연아 과장",
        message: "지과장 등장! 디자인 하나로 팀원 멘탈까지 리디자인 중! 🎨🧠",
        scoreThreshold: 1500,
        speedIncrease: 1.4
    },
    https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiejF3MHRndDJ6OW5vYTdocHJheXY3cnd5eTJ3YjBvemk2NGd5ZWdudyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/103JnbaqvpBFGE/giphy.gif
    {
        name: "신선주 팀장",
        message: "CS 팀장 출격! 민원 만큼 빠르게 블록을 내려주마 ! ☎️🕯️",
        scoreThreshold: 2000,
        speedIncrease: 1.5
    },
    https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiNHV6N29pZG9scHRnc2ljajJ5czUzd2QwcnJrM2pnMnc4b3VpY3BhZCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/3ohze3kG5qO9DcTUbe/giphy.gif
    {
        name: "강병훈 팀장",
        message: "드리미 총괄 병훈 팀장 출몰! 청소기도 숨죽이는 눈빛! 👀💢",
        scoreThreshold: 2500,
        speedIncrease: 1.6
    },
    https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjVjNWt4cjhyZmNmcTFrNzh6dGU4bHc5MGd6d3NvbGd5cnZpa3AzbCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/H5C8CevNMbpBqNqFjl/giphy.gif
    {
        name: "강병현 팀장",
        message: "전략기획 병현 팀장 강림! PPT는 이미 74장이다! 📊🔥",
        scoreThreshold: 3000,
        speedIncrease: 1.7
    },
    https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjVjNWt4cjhyZmNmcTFrNzh6dGU4bHc5MGd6d3NvbGd5cnZpa3AzbCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/1BXa2alBjrCXC/giphy.gif
    {
        name: "김정준 본부장",
        message: "정준 본부장 진입! 지금 흐름 이상하면 바로 호출당한다! 🧠📞",
        scoreThreshold: 3500,
        speedIncrease: 1.8
    },
    https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiNHV6N29pZG9scHRnc2ljajJ5czUzd2QwcnJrM2pnMnc4b3VpY3BhZCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/gjgWQA5QBuBmUZahOP/giphy.gif
    {
        name: "신선일 이사",
        message: "경영관리 신 이사님 등장! 계산기 들었다… 다 던져! 🧾📟",
        scoreThreshold: 4000,
        speedIncrease: 1.9
    },
    https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNib2Zyb3o5MzEzejkwb245amJmNGo3N2J2a3JnZ3I3YnU5dm1oN2VwZyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/EgkNhBeY289z2/giphy.gif
    {
        name: "대표이사",
        message: "대표님 출격! 회의실 문 열리면 그냥 박수 치자! 👑👏",
        scoreThreshold: 5000,
        speedIncrease: 2.5
    }
    https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNieHNoYjdnZW80OXh1Y203MWlnbWZjbTI5ajZxYzh0bTNrc210c3RtYSZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/VF65SrQlmClUc/giphy.gif

];

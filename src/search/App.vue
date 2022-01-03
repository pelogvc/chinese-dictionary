<template>
  <div
    class="chrome_extension_chinese_dictionary"
  >
    <div
      v-if="datas.length <= 0"
      class="noitem"
    >
      검색결과가 없습니다.
    </div>
    <div
      v-if="datas.length > 0"
      class="content"
    >
      <ul class="words">
        <li
          v-for="(data, key) in datas"
          :key="key"
        >
          <p>
            <a
              v-if="data.word"
              :href="data.link"
              target="_blank"
            >
              {{ data.word }}
            </a>
          </p>
          <span v-if="data.pinyin">[{{ data.pinyin }}]</span>
          <a
            class="audio"
            @click="playAudio(data.word)"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="volume-up"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              class="svg-inline--fa fa-volume-up fa-w-18 fa-2x"
            ><path
              fill="currentColor"
              d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"
              class=""
            /></svg>
          </a>
          <ul
            class="means"
          >
            <li
              v-for="(mean, meanKey) in data.means"
              :key="meanKey"
            >
              <span class="index">{{ meanKey + 1 }}.</span>
              <span
                v-if="mean.speech"
                class="parts"
              >{{ mean.speech }}</span>
              <span
                v-if="mean.value"
                class="mean"
              >
                {{ mean.value }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <audio ref="audio" />
  </div>
</template>

<script>
import Dexie from 'dexie';
import axios from 'axios';

export default {
  name: 'Search',

  data() {
    return {
      word: null,
      datas: [],
      audio: null,
    }
  },

  async mounted() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const search = urlParams.get('search');

    await this.search(search);
  },

  methods: {
    async addDictionary(query, data) {

      const db = new Dexie('chinese-dictionary');
      db.version(3).stores({
        wordbook: `++id, query, created, examples, means, [query+created]`
      });

      const currentDate = new Date();
      const latestDate = new Date();
      latestDate.setMinutes((currentDate.getMinutes() -5));

      const returnData = {
        query,
        created: currentDate,
        examples: [],
        means: [],
      }

      if (!data.searchResultMap.searchResultListMap) {
        return;
      }

      // eslint-disable-next-line no-restricted-syntax
      for(const value of data.searchResultMap.searchResultListMap.EXAMPLE.items) {
        returnData.examples.push({
          langType: value.exampleLangCode,
          entry: value.expEntry,
          exampleZh: value.expExample1,
          examplePinyin: value.expExample1Pronun,
          exampleKo: value.expExample2,
          sourceDictnameKO: value.sourceDictnameKO,
          sourceDictnameOri: value.sourceDictnameOri,
          sourceDictnameURL: value.sourceDictnameURL,
        })
      }

      // eslint-disable-next-line no-restricted-syntax
      for(const value of data.searchResultMap.searchResultListMap.WORD.items) {
        const ret = {
          langType: value.languageCode,
          entry: value.handleEntry,
          sourceDictnameKO: value.sourceDictnameKO,
          sourceDictnameOri: value.sourceDictnameOri,
          sourceDictnameURL: value.sourceDictnameURL,
          destinationLink: value.destinationLink,
          destinationLinkKo: value.destinationLinkKo,
          meansCollector: [],
          phoneticSymbol: [],
        }
        // eslint-disable-next-line no-restricted-syntax
        for(const v of value.meansCollector) {
          const collectorRet = {
            partOfSpeech: v.partOfSpeech,
            means: []
          }
          // eslint-disable-next-line no-restricted-syntax
          for(const mean of v.means) {
            collectorRet.means.push({
              code: mean.code,
              exampleOri: mean.exampleOri,
              value: mean.value,
            })
          }
          ret.meansCollector.push(collectorRet)
        }
        // eslint-disable-next-line no-restricted-syntax
        for(const v of value.searchPhoneticSymbolList) {
          ret.phoneticSymbol.push({
            phoneticSymbolType: v.phoneticSymbolType,
            phoneticSymbol: v.symbolValue,
            phoneticSymbolPath: v.phoneticSymbolPath
          })
        }
        returnData.means.push(ret)
      };

      db.table('wordbook').where('[query+created]').between([data.query, latestDate], [data.query, currentDate]).toArray().then((cursor) => {
        if ( !cursor.length ) {
          db.table('wordbook').add(returnData);
        }
      });

    },

    async search(search) {
      const data = await axios.get(`https://zh.dict.naver.com/api3/zhko/search?query=${encodeURIComponent(search)}&m=pc&lang=ko&articleAnalyzer=true&hid=156982484709810140`);
      const words  = data.data.searchResultMap.searchResultListMap.WORD.items;

      this.datas = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const word of words) {
        const means = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const meansCollector of word.meansCollector) {
          // eslint-disable-next-line no-restricted-syntax
          for(const mean of meansCollector.means) {
            means.push({
              speech: meansCollector.partOfSpeech || null,
              value: mean.value.replace(/(<([^>]+)>)/ig, "") || null,
            });
          }
        }

        let pinyin = (word.searchPhoneticSymbolList[0] && word.searchPhoneticSymbolList[0].symbolValue);
        if (typeof pinyin === 'string') {
          pinyin = pinyin.replace(/(<([^>]+)>)/ig, "");
        }
        this.datas.push({
          link: word.destinationLinkKo || null,
          pinyin: pinyin || null,
          audio: `https://learn.dict.naver.com/tts?speaker=zh_cn&service=today-conversation&domain=naver&from=mobile&speech_fmt=mp3&text=${(word.handleEntry || '찾을 수 없습니다.')}`,
          word: word.handleEntry || null,
          means,
        });
      }

      await this.addDictionary(search, data.data);
    },
    async playAudio(word) {
      const url = `https://learn.dict.naver.com/tts`;

      const data = await axios.get(url, {
        params: {
          speaker: 'zh_cn',
          service: 'today-conversation',
          domain: 'naver',
          from: 'mobile',
          speech_fmt: 'mp3',
          text: word,
        },
        responseType: "blob",
      })
      this.$refs.audio.pause();
      this.$refs.audio.src = URL.createObjectURL(data.data);
      this.$refs.audio.play();
    }
  },
}
</script>

<style lang="scss">
.chrome_extension_chinese_dictionary {
	background: #fff;
	z-index: 999999;
	color: #333;
	font-size: 15px;
  border-top: 1px solid #ededed;
	font-family: Helvetica,"Malgun Gothic","Apple SD Gothic Neo",AppleGothic,Dotum,Arial,Tahoma;
  font-size: 0.8em;
	.title {
		background: #00c73c;
		height: 30px;
		>h1 {
			font-size: 15px;
			line-height: 30px;
			padding: 0;
			padding-left: 5px;
			margin: 0;
			color: white;
			letter-spacing: -1px;
			display: inline-block;
			>span {
				font-size: 12px;
				vertical-align: top;
			}
		}
	}
  .noitem {
    text-align: center;
    margin: 20px 0;
  }
	.content {
		height: 270px;
		padding: 5px;
		box-sizing: border-box;
		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			li {
				list-style: none;
				padding: 0;
				margin: 0;
			}
		}
		ul.words {
			padding: 0 5px;
			>li {
				padding-bottom: 5px;
				padding-top: 10px;
				border-bottom: 1px solid #ddd;
				&:first-child {
					padding-top: 0;
				}
				&:last-child {
					border-bottom: 0px;
				}
				>p {
					margin: 0;
					padding: 0;
					font-weight: bold;
					display: inline-block;
					vertical-align: middle;
					font-family: "Microsoft Yahei, simsun, Arial, NanumGothic, Dotum, sans-serif";
					>a {
						text-decoration: none;
						color: #333;
						font-family: "Microsoft Yahei, simsun, Arial, NanumGothic, Dotum, sans-serif";
					}
					>strong {
						font-family: "Microsoft Yahei, simsun, Arial, NanumGothic, Dotum, sans-serif";
						color: #333;
					}
				}
				>span {
					vertical-align: top;
					font-size: 13px;
					margin-left: 5px;
				}
				>a {
					vertical-align: middle;
					font-size: 13px;
					margin-left: 5px;
				}
				>.audio {
					cursor: pointer;
					svg {
						width: 18px;
						color: #697994;
					}
				}
			}
			>li.example {
				>span {
					display: block;
				}
			}
		}
		ul.means {
			>li.source {
				margin: 0;
				font-size: 12px;
				color: #999;
			}
			>li {
				margin-top: 3px;
				font-size: 13px;
				width: 270px;
				>span {
					vertical-align: top;
					line-height: 16px;
				}
				>span.parts {
					height: 16px;
					margin: 0 0 0 1px;
					border: 1px solid #e0e0e0;
					background-color: #fff;
					padding: 0 5px;
					font-size: 12px;
					color: #999;
					box-sizing: content-box;
					vertical-align: top;
					margin: 0 5px;
					letter-spacing: -1px;
				}
				>span.mean {
					font-size: 13px;
				}
				>span.destEntry {
					font-size: 15px;
					>span.pinyin {
						font-size: 12px;
					}
				}
			}
		}
		ul.example {
			li {
				padding-bottom: 5px;
				padding-top: 10px;
				border-bottom: 1px solid rgb(221, 221, 221);
				font-size: 13px;
			}
			span {
				display: block;
			}
		}
	}
}
</style>

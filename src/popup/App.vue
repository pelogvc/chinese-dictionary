<template>
  <div class="chrome_extension_chinese_tab">
    <div class="search">
      <input
        v-model="word"
        type="text"
        placeholder="검색할 단어를 입력하세요."
        class="chrome_extension_chinese_tab_input"
        @keyup.enter="submit"
      >
      <input
        type="submit"
        value="搜索"
        @click="submit"
      >
      <ul>
        <li>
          <a
            href="./options.html"
            target="_blank"
          >
            단어장
          </a>
        </li>
      </ul>
    </div>
    <iframe
      v-if="url"
      :key="url"
      :src="url"
      class="iframe"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      word: '',
      url: null,
    }
  },

  methods: {
    submit() {
      if (!this.word) {
        alert('검색어를 입력해주세요.');
        return;
      }
      this.url = `${chrome.extension.getURL('search.html')}?search=${this.word}`;
    }
  }
}
</script>

<style lang="scss">
.chrome_extension_chinese_tab {
	width: 330px;
  padding: 0 5px;
	>.search {
		margin: 10px 0;
		height: 25px;
		position: relative;
		>input {
			outline: none;
		}
		>input[type="text"] {
			width: 185px;
			box-sizing: border-box;
			height: 25px;
			padding: 5px 7px;
			float: left;
			border: 1px solid #ddd;
		}
		>input[type="submit"] {
			background-color: #d44645;
			border: 0;
			color: white;
			height: 25px;
			float: left;
			width: 50px;
			cursor: pointer;
			font-family: "Microsoft Yahei, simsun, Arial, NanumGothic, Dotum, sans-serif";
			font-size: 13px;
			letter-spacing: -1px;
			margin-left: 5px;
		}
		>ul {
			list-style-type: none;
			padding: 0;
			margin: 0;
			>li {
				padding: 0;
				margin: 0;
				>a {
					display: block;
					float: right;
					width: 50px;
					height: 25px;
					line-height: 25px;
					text-decoration: none;
					color: #888;
					box-sizing: border-box;
					text-align: center;
          font-size: 0.75em;
					&::before {
						content: " ";
						width: 1px;
						height: 25px;
						display: block;
						background-color: #ddd;
						float: left;
						overflow: hidden;
						margin-right: 4px;
					}
				}
			}
		}
	}
}
.iframe {
  width: 100%;
  height: 300px;
}
</style>

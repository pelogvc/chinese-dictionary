<template>
  <Layout>
    <a-table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="data"
      :loading="loading"
    >
      <span
        slot="means"
        slot-scope="means"
        class="mean-column"
      >
        <ul
          v-for="(mean, i) in means"
          :key="`mean-${i}`"
          class="means"
        >
          <li>
            <div class="handle-entry">
              {{ i + 1 }}. {{ mean.entry }}
              <span
                v-if="mean.phoneticSymbol[0] && mean.phoneticSymbol[0].phoneticSymbol"
                class="pinyin"
              >
                [{{ mean.phoneticSymbol[0].phoneticSymbol }}]
              </span>
            </div>
            <ul class="mean">
              <template v-for="(item, k) in mean.meansCollector">
                <li
                  v-for="(m, j) in item.means"
                  :key="`${k}-${j}`"
                >
                  {{ k + j + 1 }}.
                  <span
                    v-if="item.partOfSpeech"
                    class="parts"
                  >{ item.partOfSpeech }}</span>
                  <span
                    v-if="m.value"
                  >
                    {{ strip(m.value) }}
                  </span>
                </li>
              </template>
            </ul>
          </li>
        </ul>
      </span>
      <span
        slot="examples"
        slot-scope="examples"
      >
        <ul class="examples">
          <li
            v-for="(example, exampleIndex) in examples"
            :key="`example-${exampleIndex}`"
          >
            {{ exampleIndex + 1 }}.
            <span
              v-if="example.exampleZh"
              class="example1"
            >
              {{ strip(example.exampleZh) }}
            </span>
            <span
              v-if="example.examplePinyin"
              class="example1Pronun"
            >
              {{ strip(example.examplePinyin) }}
            </span>
            <span
              v-if="example.exampleKo"
              class="example2"
            >
              {{ strip(example.exampleKo) }}
            </span>
          </li>
        </ul>
      </span>
    </a-table>
  </Layout>
</template>

<script>
import Dexie from 'dexie';
import Layout from "./layout.vue"

const columns = [
  {
    title: '번호',
    dataIndex: 'id',
    width: '5%',
  },
  {
    title: '검색한 단어',
    dataIndex: 'query',
    width: '10%',
  },
  {
    title: '단어 설명',
    dataIndex: 'means',
    width: '40%',
    scopedSlots: { customRender: 'means' },
  },
  {
    title: '예문',
    dataIndex: 'examples',
    width: '40%',
    scopedSlots: { customRender: 'examples' },
  },
];

export default {
  components: { Layout },
  data() {
    return {
      data: [],
      loading: false,
      columns,
      wordbook: null,
      db: null,
    }
  },

  async mounted() {
    this.db = new Dexie('chinese-dictionary');
    this.db.version(3).stores({
      wordbook: `++id, query, created, examples, means, [query+created]`
    });

    this.wordbook = await this.db.table("wordbook");
    await this.fetch();
  },

  methods: {
    async fetch() {
      this.loading = true;

      this.data = await this.wordbook
        .orderBy("id")
        .reverse()
        .toArray();

      this.loading = false;
    },

    strip(html) {
      const tmp = document.implementation.createHTMLDocument("New").body;
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }
  }
}
</script>

<style lang="scss">

.mean-column {
  .means {
    margin-bottom: 6px !important;
    margin-top: 0;
  }
  .means:last-child {
    border-bottom: 0;
  }

  .mean {
    margin-left: 5px;
    font-size: 13px;
  }
  .handle-entry {
    font-weight: bold;
    margin-bottom: 2px;
  }
  .sound {
    cursor: pointer;
    margin-left: 10px;
    color: #1890ff;
  }
  .pinyin {
    font-weight: normal;
    font-size: 14px;
    margin-left: 5px;
  }
  .parts {
    padding: 0.1em 0.3em;
    border-radius: 3px;
    background: #f1f3f5;
    border: 1px solid #ced4da;
    color: #868e96;
    margin-left: 0.5em;
    margin-right: 0.5em;
    font-size: 11px;
  }
}

.examples {
  font-size: 13px;
  .example1 {
    font-weight: bold;
    margin-left: 5px;
  }
  .example1Pronun {
    display: block;
  }
  li {
    margin-bottom: 10px;
  }
}

.ant-table-pagination.ant-pagination {
  float:none !important;
  text-align: center;
}
</style>

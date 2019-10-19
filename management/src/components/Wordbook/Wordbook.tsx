import { Pagination, Table } from "antd";
import React, { useEffect } from "react";
// import { WordbookDatabase } from "../../lib/WordbookDatabase";
import "./Wordbook.scss";
import useWordbookPage from "../../hooks/wordbook/useWordbookPage";
import useWordbookSetPage from "../../hooks/wordbook/useWordbookSetPage";
import useWordbookData from "../../hooks/wordbook/useWordbookData";
import { MeansEntity, Word, Means, Examples } from "../../modules/wordbook";
import useWordbookCount from "../../hooks/wordbook/useWordbookCount";

function Wordbook() {
  // const dexie = new WordbookDatabase();
  // dexie.restore();

  const page = useWordbookPage();
  const setPage = useWordbookSetPage();
  const wordbookData = useWordbookData();
  const count = useWordbookCount();

  //console.log(wordbookData);

  useEffect(() => {
    setPage(page);
  }, []);

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
      key: "id",
      width: "5%",
      className: "id-column"
    },
    {
      title: "검색한 단어",
      dataIndex: "query",
      key: "query",
      width: "10%"
    },
    {
      title: "단어 설명",
      dataIndex: "means",
      key: "means",
      width: "40%",
      className: "mean-column",
      render: (arr: Means[]) => {
        return arr.map((v, i) => {
          const pinyin =
            v.phoneticSymbol &&
            v.phoneticSymbol[0] &&
            v.phoneticSymbol[0].phoneticSymbol;
          return (
            <ul className="means" key={i}>
              <li>
                <div className="handle-entry">
                  {i + 1}. {v.entry}
                  {pinyin && <span className="pinyin">[{pinyin}]</span>}
                </div>
                <ul className="mean">
                  {v.meansCollector &&
                    v.meansCollector.map((item, k) => {
                      const parts = item.partOfSpeech;

                      return (
                        item.means &&
                        item.means.map((mean, j) => {
                          return (
                            <li key={j}>
                              {j + 1}.
                              {parts && <span className="parts">{parts}</span>}
                              {mean.value.replace(/(<([^>]+)>)/gi, "")}
                            </li>
                          );
                        })
                      );
                    })}
                </ul>
              </li>
            </ul>
          );
        });
      }
    },
    {
      title: "예문",
      dataIndex: "examples",
      key: "examples",
      render: (arr: Examples[]) => {
        console.log(arr);
        return (
          <ul className="examples">
            {arr.map((example, i) => {
              return (
                <li key={i}>
                  {i + 1}.
                  {example.exampleKo && (
                    <span className="example1">
                      {example.exampleKo.replace(/(<([^>]+)>)/gi, "")}
                    </span>
                  )}
                  {example.examplePinyin && (
                    <span className="example1Pronun">
                      [{example.examplePinyin.replace(/(<([^>]+)>)/gi, "")}]
                    </span>
                  )}
                  {example.exampleZh && (
                    <span className="example2">
                      {example.exampleZh.replace(/(<([^>]+)>)/gi, "")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        );
        /*
          <ul className="examples">
            {arr.map((obj: ItemsEntity2, i: number) => {
              if (obj.expExample1 && obj.expExample1Pronun && obj.expExample2) {
                return (
                  <li key={i}>
                    {i + 1}.
                    <span className="example1">
                      {obj.expExample1.replace(/(<([^>]+)>)/gi, "")}
                    </span>
                    <span className="example1Pronun">
                      [{obj.expExample1Pronun.replace(/(<([^>]+)>)/gi, "")}]
                    </span>
                    <span className="example2">
                      {obj.expExample2.replace(/(<([^>]+)>)/gi, "")}
                    </span>
                  </li>
                );
              }
            })}
          </ul>
          */
      }
    },
    {
      title: "",
      dataIndex: "etc",
      key: "etc"
    }
  ];

  const onChangePage = (n: number): void => {
    setPage(n);
  };

  return (
    <div>
      {wordbookData.length === 0 ? (
        <div>검색한 단어가 없습니다.</div>
      ) : (
        <div>
          <Table
            dataSource={wordbookData}
            columns={columns}
            pagination={false}
          />
          <div className="Wordbook-pagination">
            <Pagination
              size="small"
              total={count}
              current={page}
              onChange={onChangePage}
              defaultPageSize={10}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Wordbook;

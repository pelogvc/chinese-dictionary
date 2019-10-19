import { Pagination, Table } from "antd";
import React, { useEffect } from "react";
// import { WordbookDatabase } from '../../lib/wordbook'
import "./Wordbook.scss";
import useWordbookPage from "../../hooks/wordbook/useWordbookPage";
import useWordbookSetPage from "../../hooks/wordbook/useWordbookSetPage";
import useWordbookData from "../../hooks/wordbook/useWordbookData";
import {
  ItemsEntity,
  MeansCollectorEntity,
  MeansEntity,
  ItemsEntity2
} from "../../modules/wordbook";
import useWordbookCount from "../../hooks/wordbook/useWordbookCount";

function Wordbook() {
  // const dexie = new WordbookDatabase();
  // dexie.restore();

  const page = useWordbookPage();
  const setPage = useWordbookSetPage();
  const wordbookData = useWordbookData();
  const count = useWordbookCount();

  useEffect(() => {
    setPage(page);
  }, []);

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
      key: "id",
      width: "5%"
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
      render: (arr: any) =>
        arr.map((obj: ItemsEntity, i: number) => {
          const pinyin =
            obj.searchPhoneticSymbolList &&
            obj.searchPhoneticSymbolList[0] &&
            obj.searchPhoneticSymbolList[0].phoneticSymbol;

          return (
            <ul className="means" key={i}>
              <li>
                <div className="handle-entry">
                  {i + 1}. {obj.handleEntry}
                  <span className="pinyin">[{pinyin}]</span>
                </div>
                <ul className="mean">
                  {obj.meansCollector &&
                    obj.meansCollector.map(
                      (item: MeansCollectorEntity, a: number) => {
                        return (
                          item.means &&
                          item.means.map((mean: MeansEntity, b: number) => {
                            if (mean.value) {
                              return (
                                <li key={b}>
                                  {b + 1}.{" "}
                                  {mean.value.replace(/(<([^>]+)>)/gi, "")}
                                </li>
                              );
                            }
                          })
                        );
                      }
                    )}
                </ul>
              </li>
            </ul>
          );
        })
    },
    {
      title: "예문",
      dataIndex: "meanExamples",
      key: "meanExamples",
      render: (arr: any) => {
        return (
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
        );
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

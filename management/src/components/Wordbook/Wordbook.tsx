import { Pagination, Table } from "antd";
import React from "react";
// import { WordbookDatabase } from '../../lib/wordbook'
import "./Wordbook.scss";
import useWordbookPage from "../../hooks/wordbook/useWordbookPage";
import useWordbookSetPage from "../../hooks/wordbook/useWordbookSetPage";

function Wordbook() {
  // const dexie = new WordbookDatabase();
  // dexie.restore();

  const page = useWordbookPage();
  const setPage = useWordbookSetPage();

  const data = [
    {
      key: "1",
      searchWord: "Mike",
      example: 32,
      resultWord: "10 Downing Street"
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street"
    }
  ];

  const columns = [
    {
      title: "번호",
      dataIndex: "num",
      key: "num"
    },
    {
      title: "검색한 단어",
      dataIndex: "searchWord",
      key: "searchWord"
    },
    {
      title: "단어 설명",
      dataIndex: "resultWord",
      key: "resultWord"
    },
    {
      title: "예문",
      dataIndex: "example",
      key: "example"
    },
    {
      title: "etc",
      dataIndex: "etc",
      key: "etc"
    }
  ];

  const onChangePage = (n: number): void => {
    setPage(n);
  };

  return (
    <div>
      {data === [] ? (
        <div>검색한 단어가 없습니다.</div>
      ) : (
        <Table dataSource={data} columns={columns} pagination={false} />
      )}
      <div className="Wordbook-pagination">
        <Pagination
          size="small"
          total={500}
          current={page}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}

export default Wordbook;

import React from 'react';
import { PageHeader } from 'antd';
import './App.css';
import Header from './components/Header/Header';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <div className="App-main">
        <PageHeader
          style={{
            borderBottom: '1px solid rgb(235, 237, 240)',
          }}
          title="Title"
          subTitle="This is a subtitle"
        />
        ㅇㅇㅇ
      </div>
    </>
  );
}

export default App;

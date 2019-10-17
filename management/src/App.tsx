import React from 'react';
import { PageHeader } from 'antd';
import './App.css';
import Header from './components/Header/Header';
import usePage from './hooks/usePage';
import Wordbook from './components/Wordbook/Wordbook';
import TemplateMain from './components/Template/TemplateMain';

const App: React.FC = () => {

  const page = usePage();

  if ( !page.id ) return <></>;

  return (
    <>
      <Header />
      <div className="App-main">
        { page.id === 'wordbook' && 
          <TemplateMain title="단어장" >
            <Wordbook />
          </TemplateMain>
        }
      </div>
    </>
  );
}

export default App;

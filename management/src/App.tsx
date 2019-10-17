import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import TemplateMain from "./components/Template/TemplateMain";
import Wordbook from "./components/Wordbook/Wordbook";
import usePage from "./hooks/usePage";

const App: React.FC = () => {
  const page = usePage();

  if (!page.id) {
    return <></>;
  }

  return (
    <div className="App">
      <Header />
      <div className="App-main">
        {page.id === "wordbook" && (
          <TemplateMain title="단어장">
            <Wordbook />
          </TemplateMain>
        )}
      </div>
    </div>
  );
};

export default App;

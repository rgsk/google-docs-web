import React from 'react';
import TextEditor from './components/TextEditor';
import { v4 as uuidV4 } from 'uuid';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { GeneralStateProvider } from './context/GeneralStateProvider';
function App() {
  return (
    <BrowserRouter>
      <GeneralStateProvider>
        <Switch>
          <Route path="/" exact>
            <Redirect to={`/documents/${uuidV4()}`} />
          </Route>
          <Route path="/documents/:id" exact component={TextEditor}></Route>
        </Switch>
      </GeneralStateProvider>
    </BrowserRouter>
  );
}

export default App;

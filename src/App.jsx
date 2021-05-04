import React from 'react';
import TextEditor from './components/TextEditor';
import { v4 as uuidV4 } from 'uuid';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { GeneralStateProvider } from './context/GeneralContext';
import { AuthProvider } from './context/AuthContext';
import Auth from './components/Auth/Auth';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GeneralStateProvider>
          <Switch>
            <Route path="/auth" component={Auth}></Route>
            <Route path="/documents/:id" component={TextEditor}></Route>
            <Route path="/">
              <Redirect to={`/documents/${uuidV4()}`} />
            </Route>
          </Switch>
        </GeneralStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

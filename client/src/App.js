import React from 'react';
import {RouterWrapper} from './components/components.ts'
import { Provider } from "react-redux";
import { store } from "./store/index"

function App() {
  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-gray-100">
      <Provider store={store}>
        <RouterWrapper/>
      </Provider>
    </div>
  );
}

export default App;

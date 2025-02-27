import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./src/redux/store";
import NavRoutes from "./src/routes/Routes";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;

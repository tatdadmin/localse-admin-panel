// import React from "react";
// import NavRoutes from "./src/routes/Routes";
// import "bootstrap/dist/css/bootstrap.min.css";

// function App() {
//   return <NavRoutes />;
// }

// export default App;

import React from "react";
import NavRoutes from "./src/routes/Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "./src/redux/store";
import { persistStore } from "redux-persist";

function App() {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;

import { createContext } from "react";

export const ApiContext = createContext("http://localhost:4000");
export const ApiProvider = ({ children }) => (
  <ApiContext.Provider value="http://localhost:4000">
    {children}
  </ApiContext.Provider>
);

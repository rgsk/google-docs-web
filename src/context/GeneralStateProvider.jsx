import React, { useContext } from 'react';
const GeneralStateContext = React.createContext();
export function useGeneralState() {
  return useContext(GeneralStateContext);
}
export function GeneralStateProvider({ children }) {
  const value = {};
  return (
    <GeneralStateContext.Provider value={value}>
      {children}
    </GeneralStateContext.Provider>
  );
}

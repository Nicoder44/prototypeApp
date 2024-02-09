// MatchContext.js
import { createContext, useReducer } from 'react';

export const MatchContext = createContext();

export const matchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MET_USER':
      return { ...state, metUser: action.payload };
    case 'CREATE_MATCH':
      return { ...state, matches: [...state.matches, action.payload] };
    // Ajoutez d'autres types d'action selon vos besoins
    default:
      return state;
  }
};

export const MatchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, {
    metUser: null,
  });


  console.log('MatchContext state:', state);

  return (
    <MatchContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
};

// MatchContext.js
import { createContext, useReducer, useEffect } from 'react';

export const MatchContext = createContext();

export const matchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MET_USER':
      return { ...state, metUser: action.payload };
    case 'CREATE_MATCH':
      const existingMatch = state.matches.find(match => match._id === action.payload._id);
      if (existingMatch) {
        return state; 
      } else {
        return { ...state, matches: [...state.matches, action.payload] };
      }
    default:
      return state;
  }
};

export const MatchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, {
    metUser: null,
    matches: []
  });

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem('token'));
    

    if (tokenData) {
      const matcheds = tokenData.matchedUsers;
      for(const user of matcheds){
        dispatch({ type: 'CREATE_MATCH', payload: user })
      } 
    }
    }, [])


  console.log('MatchContext state:', state);

  return (
    <MatchContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
};

import { createStore as reduxCreateStore } from "redux"
import actions from "./actions/index"


const reducer = (state, action) => {

  switch(action.type){
    case actions.updateCurrentCard:
      return {
        ...state,
        currentCard: {
          tickerData: action.payload,
          ticker: action.payload.ticker,
          companyName: action.payload.company_name,
          priceChange: action.payload.price_change,
          priceClosing: action.payload.price_closing,

        }
      }
    case actions.concatCardToCardArray:
      return{
        ...state,
        cardArray: state.cardArray.concat(action.payload)
      }
    case actions.updateSearchTicker:
      return{
        ...state,
        searchTicker: action.payload
      }
    case actions.updateCardArrayFromServer:
      return{
        ...state,
        updateCardArrayFromServer: action.payload
      }
    case actions.concatCardArrayFromServer:
      return{
        concatCardArrayFromServer: state.cardArrayFromServer.concat(action.payload)
      }      
  }

  return state
}

const initialState = { 
  currentCard: {        
    ticker: "",
    tickerData: "",
    companyName: "",
    priceChange: "",
    priceClosing: "",},
    searchTicker: "",
    cardArray: [],
    cardArrayFromServer: [],
    
    


}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore
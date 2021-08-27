import actions from "../actions/index"



export function updateCurrentCard(value){
    return{
        type: actions.updateCurrentCard,
        payload:value
    }
}

export function concatCardToCardArray(value){
    return{
        type: actions.concatCardToCardArray,
        payload:value
    }
}

export function updateSearchTicker(value){
    return{
        type: actions.updateSearchTicker,
        payload:value
    }
}

export function updateCardArrayFromServer(value){
    return{
        type: actions.updateCardArrayFromServer,
        payload:value
    }
}

export function concatCardArrayFromServer(value){
    return{
        type: actions.concatCardArrayFromServer,
        payload:value
    }
}
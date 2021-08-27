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
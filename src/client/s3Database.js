import axios from "axios";

export async function saveArr(cardArr){
    var result = await axios.post(
        "https://4xonwmwmjk.execute-api.us-west-2.amazonaws.com/dev/save",{
            cardArr:cardArr,
        })
        .then((response) => {
        return response.data
    })
    return result
}

export async function loadArr(){
    var result = await axios.get(
        "https://4xonwmwmjk.execute-api.us-west-2.amazonaws.com/dev/load"
    ).then((response) => {
        return response.data
    })
    return result
}
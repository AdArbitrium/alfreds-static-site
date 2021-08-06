import axios from "axios";

export async function scrapeStock(stockName){
     var result = await axios
      .get(
        `https://2e009tkipf.execute-api.us-west-2.amazonaws.com/dev/${stockName}/price`
      )
      .then((response) => {
        return response.data
      });
    
      return result
}
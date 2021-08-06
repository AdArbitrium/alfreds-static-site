import * as React from "react";
import { scrapeStock } from "../client/StockScraperClient";
import { Button, Jumbotron, Row, Col, Container, Card } from "react-bootstrap";
import { loadArr, saveArr } from "../client/s3Database";
import "bootstrap/dist/css/bootstrap.min.css"


// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};


class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverArr: [],
      ticker: "",
      tickerData: "",
      companyName: "",
      priceChange: "",
      priceClosing: "",
      cardArr: [],
    };
  }

  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    await this.scrapeStockAndSaveToState();
  };

  scrapeStockAndSaveToState = async(ticker) => {
    let targetTicker = ticker || this.state.stockName
    let card;
    await scrapeStock(targetTicker).then((result) => {
      card = {
        ticker: result.ticker,
        tickerData: result,
        companyName: result.company_name,
        priceChange: result.price_change,
        priceClosing: result.price_closing,
      };

      let newCardArr = this.state.cardArr.concat(card);
      console.log(newCardArr)

      this.setState({
        cardArr: newCardArr,
      });
    });
  }


  renderButtons = () => {
    return this.state.serverArr.map((item, index) => (
      <Row key={index}>
        <Button onClick={() => this.loadCardsFromButton(item)}>{item}</Button>
      </Row>
    ));
  };

  componentDidMount = async () => {
    let serverArr = await loadArr();
    this.setState({
      serverArr: serverArr.cardArr,
    });
  };

  renderTickerCards = () => {
    let arr = [];
    this.state.cardArr.forEach((card, index) => {
      arr.push(
        <div key={index}>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{JSON.stringify(card.companyName)}</Card.Title>
              <Card.Text>
                {JSON.stringify(card.priceClosing)}
                {JSON.stringify(card.priceChange)}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      );
    });
    return arr;
  };

  saveCurrentCardArr = async() => {
    let justTheTickerArr = this.state.cardArr.map((card) => card.ticker)
    console.log(justTheTickerArr)
    await saveArr(justTheTickerArr)
    let newArr = this.state.serverArr.push(justTheTickerArr)
    this.setState({
      serverArr: newArr
    })
  }

  
  loadCardsFromButton = async(item) =>{
    this.setState({
      cardArr: []
    })
    item.map(async(currentTicker) => {
      await this.scrapeStockAndSaveToState(currentTicker);
    })
  }
  
  render() {
    return (
      <main style={pageStyles}>
        <Container>
        <Row>
          <Col sm={10}> <Jumbotron>
            <h1>Stock Data</h1>
            <p>Search for stock data</p>
          </Jumbotron>
          <form onSubmit={this.handleFormSubmit}>
                <label>
                  Input Ticker
                  <input
                    name="stockName"
                    value={this.state.stockName}
                    onChange={this.handleOnChange}
                  ></input>
                </label>
   
                <Button variant="primary" type="submit">
                  Search
                </Button>
                <Button className = "m-1" onClick = {this.saveCurrentCardArr}>
                  Save
                </Button>

              </form>
          </Col>
    

          <Col sm={2}>
          {this.renderButtons()}
          </Col>
        </Row>
          <br />

          {this.state.cardArr.length > 0 && this.renderTickerCards()}
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default IndexPage;

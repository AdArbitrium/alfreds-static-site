import * as React from "react";
import { scrapeStock } from "../client/StockScraperClient";
import { Button, Jumbotron, Row, Col, Container } from "react-bootstrap";
import { loadArr, saveArr } from "../client/s3Database";
import "bootstrap/dist/css/bootstrap.min.css";
import StockCard from "../components/StockCard";
import { connect } from "react-redux";
import { updateCurrentCard, concatCardToCardArray, updateSearchTicker, updateCardArrayFromServer, concatCardArrayFromServer} from "../state/actionCreators";

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const mapStateToProps = (state) => {
  const {currentCard, cardArray, searchTicker, cardArrayFromServer,} = state;
  return {
    currentCard,
    cardArray,
    searchTicker,
    cardArrayFromServer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentCard: (val) => dispatch(updateCurrentCard(val)),
    concatCardToCardArray: (val) => dispatch(concatCardToCardArray(val)),
    updateSearchTicker: (val) => dispatch(updateSearchTicker(val)),
    updateCardArrayFromServer: (val) => dispatch(updateCardArrayFromServer(val)),
    concatCardArrayFromServer: (val) => dispatch(concatCardArrayFromServer(val)),
  };
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
    };
  }

  handleOnChange = (event) => {
    var ele = event.target;
    this.setState({
      [ele.name]: ele.value,
    });
    this.props.updateSearchTicker(String(ele.value))
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    await this.scrapeStockAndSaveToState();
  };

  scrapeStockAndSaveToState = async (ticker) => {
    let targetTicker = ticker || this.props.searchTicker;
    await scrapeStock(targetTicker).then((result) => {
      this.props.updateCurrentCard(result);
      this.props.concatCardToCardArray(this.props.currentCard);

    });
  };

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
    this.props.cardArray.forEach((card, index) => {
      arr.push(
        <StockCard
          key={index}
          ticker={card.ticker}
          companyName={card.companyName}
          priceClosing={card.priceClosing}
          priceChange={card.priceChange}
        />
      );
    });
    return arr;
  };

  saveCurrentCardArr = async () => {
    let justTheTickerArr = this.props.cardArray.map((card) => card.ticker);
    console.log(justTheTickerArr);
    await saveArr(justTheTickerArr);
    let newArr = this.state.serverArr.push(justTheTickerArr);
    this.setState({
      serverArr: newArr,
    });
  };

  loadCardsFromButton = async (item) => {
    this.setState({
      cardArr: [],
    });
    item.map(async (currentTicker) => {
      await this.scrapeStockAndSaveToState(currentTicker);
    });
  };

  render() {
    return (
      <main style={pageStyles}>
        <Container>
          <Row>
            <Col sm={10}>
              {" "}
              <Jumbotron>
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
                <Button className="m-1" onClick={this.saveCurrentCardArr}>
                  Save
                </Button>
              </form>
            </Col>

            <Col sm={2}>{this.renderButtons()}</Col>
          </Row>
          <br />

          {this.props.cardArray.length > 0 && this.renderTickerCards()}
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);

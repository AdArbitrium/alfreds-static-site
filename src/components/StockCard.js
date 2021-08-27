import * as React from "react";
import { Card } from "react-bootstrap";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  const { count } = state;
  return { count };
};

const mapDispatchToProps = (dispatch) => {};

class StockCard extends React.Component {
  render() {
    return (
      <div key={this.props.index}>
        {this.props.count}
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{JSON.stringify(this.props.companyName)}</Card.Title>
            <Card.Text>
              {JSON.stringify(this.props.priceClosing)}
              {JSON.stringify(this.props.priceChange)}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockCard);

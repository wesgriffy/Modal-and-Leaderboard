import React, { Component } from "react";
import Modal from "react-modal";
import "./App.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import { MarginDiv, MarginalDiv, TableWrapper } from "./Leaderboard";
import styled from "styled-components";
import Ethjs from "ethjs";
import EthEvents from "eth-events";
import Token from "./EIP20.json";
import BN from "bn.js";

const Eth = require("ethjs");
const eth = new Eth(new Eth.HttpProvider("localhost:3000"));

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

Modal.setAppElement(document.getElementById("root"));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      revealVoteEnded: false,
      value: 65,
      voting: "Current Votes",
      applicationSubmittedModal: false,
      applicationChallengedModal: false,
      listingChallengedModal: false,
      dataArray: [],
      open: false,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
    // this.setState({ dataArray })
    this.getAllLogs()
  }

  openModal(modalName) {
    this.setState({
      open: modalName
    })
    // switch (modalName) {
    //   case "ApplicationSubmitted":
    //     if (this.state.applicationSubmittedModal === true) {
    //       break;
    //     }
    //     this.setState({ applicationSubmittedModal: true });
    //     break;
    //   case "ApplicationChallenged":
    //     if (this.state.applicationChallengedModal === true) {
    //       break;
    //     }
    //     this.setState({ applicationChallengedModal: true });
    //     break;
    //   case "ListingChallenged":
    //     if (this.state.listingChallengedModal === true) {
    //       break;
    //     }
    //     this.setState({ listingChallengedModal: true });
    //     break;
    //   default:
    //     console.log("No Modal");
    // }
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({
      applicationSubmittedModal: false,
      applicationChallengedModal: false,
      listingChallengedModal: false
    });
  }

  /*<Button color = "primary" onClick={() => this.openModal('ApplicationSubmitted')}>ApplicationSubmitted</Button>
      <Button color = "warning"onClick={() => this.openModal('ApplicationChallenged')}>ApplicationChallenged</Button>
      <Button color = "danger" onClick={() => this.openModal('ListingChallenged')}>ListingChallenged</Button>
      <Button ><Router><Link to="/">Close</Link></Router></Button>
      <Router>
      <Button><a href="https://etherscan.io">Etherscan</a></Button>
      </Router>
      <Button><Router><Link to="/Home">Home</Link></Router></Button>*/

  getModal(modalType, amountStaked, Status) {
    switch (modalType) {
      case "Application":
        return (
          <Modal
            isOpen={this.state.open === 'ApplicationSubmitted'}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="ApplicationSubmitted Modal"
          >
            <h2 ref={subtitle => (this.subtitle = subtitle)}>
              Application `ApplicationName` Submitted
            </h2>
            <div>
              Details:
              <ul>Amount Staked: {amountStaked}</ul>
              <ul>Application Status: {Status}</ul>
            </div>
            <form>
              <button onClick={this.closeModal}>
                <Router>
                  <Link to="/Application">View Application</Link>
                </Router>
              </button>
            </form>
            <button onClick={this.closeModal} color={"Tomato"}>
              Close
            </button>
          </Modal>
        );
      case "Challenge":
        return (
          <Modal
            isOpen={this.state.open === 'ApplicationChallenged'}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="ApplicationChallenged Modal"
          >
            <h2 ref={subtitle => (this.subtitle = subtitle)}>
              Application `ApplicationName` Challenged
            </h2>
            <div>
              Details:
              <ul>Challenger</ul>
              <ul>Amount at Stake: </ul>
              <ul>Challenge Status: </ul>
            </div>
            <form>
              <button onClick={this.closeModal}>
                <Router>
                  <Link to="/Challenge">View Challenge</Link>
                </Router>
              </button>
            </form>
            <button onClick={this.closeModal} color={"Tomato"}>
              Close
            </button>
          </Modal>
        );
    }
  }

  getAllLogs = async () => {
    const provider = new Ethjs.HttpProvider(`https://rinkeby.infura.io`);
    const ethjs = new Ethjs(provider);

    const contract = {
      abi: Token.abi,
      address: "0x73064ef6b8aa6d7a61da0eb45e53117718a3e891"
    };
    const ethEvents = new EthEvents(ethjs, contract);

    const fromBlock = "0";
    const toBlock = "latest";
    const eventNames = ["Transfer"];
    const indexedFilterValues = {};

    const events = await ethEvents
      .getLogs(fromBlock, toBlock, eventNames, indexedFilterValues)
      .then(logs => {
        const obj = this.handleTokenTransfers(logs);
        console.log('obj:', obj)
        return Object.keys(obj).map(key => {
          return { address: key, balance: obj[key].toString() };
        });
      });

    console.log('events:', events)
    const sortedEvents = this.sortLogData(events)
    console.log('sortedEvents:', sortedEvents)
    this.setState({
      dataArray: sortedEvents
    })
  }

  handleTokenTransfers = logs => {
    let addressBalances = {};

    logs.forEach(({ logData }) => {
      if (
        addressBalances.hasOwnProperty(logData._to) &&
        addressBalances.hasOwnProperty(logData._from)
      ) {
        addressBalances[logData._to] = new BN(addressBalances[logData._to])
          .add(logData._value)
          .toString();
        addressBalances[logData._from] = new BN(addressBalances[logData._from])
          .sub(logData._value)
          .toString();
      } else if (
        !addressBalances.hasOwnProperty(logData._to) &&
        addressBalances.hasOwnProperty(logData._from)
      ) {
        addressBalances[logData._to] = logData._value.toString();
        addressBalances[logData._from] = new BN(addressBalances[logData._from])
          .sub(logData._value)
          .toString();
      } else {
        addressBalances[logData._to] = logData._value.toString();
        addressBalances[logData._from] = logData._value.toString();
      }
    });

    return addressBalances;
  };

  sortLogData = (addressBalances) => {
    return addressBalances.sort((addrBal1, addrBal2) => {
      return addrBal2.balance - addrBal1.balance;
    });
  }

  getLeaderboardItem(dataArray) {
    let iterator = 0;
    let a = [];
    while (iterator < dataArray.length) {
      let leaderboardAddress = dataArray[iterator].address;
      let netChange = dataArray[iterator].balance;
      //let percentGain = netChange/eth.getBalance(leaderboardAddress);
      a[iterator] = (
        <tr>
          <th scope="row">{iterator + 1}</th>
          <td>{leaderboardAddress}</td>
          <td>percentGain</td>
          <td>{netChange}</td>
        </tr>
      );
      iterator = iterator + 1;
    }
    return a;
  }

  render() {
    return (
      <div>
        <Button
          color="primary"
          onClick={() => this.openModal("ApplicationSubmitted")}
        >
          ApplicationSubmitted
        </Button>
        <Button
          color="warning"
          onClick={() => this.openModal("ApplicationChallenged")}
        >
          ApplicationChallenged
        </Button>
        <Button
          color="danger"
          onClick={() => this.openModal("ListingChallenged")}
        >
          ListingChallenged
        </Button>
        <Button>
          <Router>
            <Link to="/">Close</Link>
          </Router>
        </Button>
        <Router>
          <Button>
            <a href="https://etherscan.io">Etherscan</a>
          </Button>
        </Router>
        <Button>
          <Router>
            <Link to="/Home">Home</Link>
          </Router>
        </Button>
        <TableWrapper>
          <Table dark>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Address</th>
                <th>% Growth</th>
                <th>Token Growth</th>
              </tr>
            </thead>

            <tbody>
              {this.getLeaderboardItem(this.state.dataArray)}

              <tr>
                <th scope="row">4</th>
                <td>Kareem</td>
                <td>20%</td>
                <td>100</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Nigel</td>
                <td>-5%</td>
                <td>-10000000</td>
              </tr>
            </tbody>
          </Table>
        </TableWrapper>

        <Modal
          isOpen={this.state.open === 'ApplicationSubmitted'}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="ApplicationSubmitted Modal"
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}>
            Application `ApplicationName` Submitted
          </h2>
          <div>
            Details:
            <ul>Amount Staked: </ul>
            <ul>Application Status: </ul>
          </div>
          <form>
            <button onClick={this.closeModal}>
              <Router>
                <Link to="/Application">View Application</Link>
              </Router>
            </button>
          </form>
          <button onClick={this.closeModal} color={"Tomato"}>
            Close
          </button>
        </Modal>
      </div>
    );
  }
}

export default App;

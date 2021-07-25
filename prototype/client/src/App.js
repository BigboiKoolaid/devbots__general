import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import BotHullContract from "./contracts/BotHull.json";
import BotPartContract from "./contracts/BotPart.json";
import DevLaunchersTokenContract from "./contracts/DevLaunchersToken.json";
import LootBoxContract from "./contracts/LootBox.json";
import getWeb3 from "./getWeb3";
import Token from "./Token";
import ERC721 from "./ERC721";
import LootBox from "./LootBox"
import EIP712Forwarder from "./contracts/EIP712Forwarder.json";
import "./App.css";

class App extends Component {
  childs = {};
  state = {
    web3: null, accounts: null, botHull: null, botPart: null, devLaunchersToken: null,
    lootBox: null, forwarder: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = BotHullContract.networks[networkId];
      const botHull = new web3.eth.Contract(
        BotHullContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      deployedNetwork = BotPartContract.networks[networkId];
      const botPart = new web3.eth.Contract(
        BotPartContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      deployedNetwork = DevLaunchersTokenContract.networks[networkId];
      const devLaunchersToken = new web3.eth.Contract(
        DevLaunchersTokenContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const obj = { type: web3.utils.toHex("ERC20"), options: { address: deployedNetwork.address } };
      console.log(obj);
      deployedNetwork = LootBoxContract.networks[networkId];
      const lootBox = new web3.eth.Contract(
        LootBoxContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      deployedNetwork = EIP712Forwarder.networks[networkId];
      const forwarder = new web3.eth.Contract(
        EIP712Forwarder.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods. 
      this.setState({ web3, accounts, botHull, botPart, devLaunchersToken, lootBox, forwarder });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateState = async () => {
    for (var key in this.childs) {
      if (this.childs[key] != null) {
        this.childs[key].updateState();
      }
    };
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h2>Tokens:</h2>
        <Token accounts={this.state.accounts} token={this.state.devLaunchersToken} parentUpdateState={this.updateState} ref={(node) => { this.childs["devs"] = node }}></Token>
        <Tabs>
          <TabList>
            <Tab>BotParts</Tab>
            <Tab>LootBoxes</Tab>
            <Tab>BotHulls</Tab>
          </TabList>
          <TabPanel>
            <ERC721 accounts={this.state.accounts} token={this.state.botPart} ref={(node) => { this.childs["erc721"] = node }}></ERC721>
          </TabPanel>
          <TabPanel>
            {(<LootBox web3={this.state.web3} forwarder={this.state.forwarder} accounts={this.state.accounts} lootboxContract={this.state.lootBox} devLaunchersToken={this.state.devLaunchersToken} parentUpdateState={this.updateState} ref={(node) => { this.childs["lootbox"] = node }}></LootBox>)}
          </TabPanel>
          <TabPanel></TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;

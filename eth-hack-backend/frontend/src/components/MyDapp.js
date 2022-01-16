// We'll use ethers to interact with the Ethereum network and our contract
import {ethers} from "ethers";
import React from "react";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/ShinewToken.json";
import StakerArtifact from "../contracts/TokenStaker.json";

import {stakedToken, stakerContract, imageUri } from "../constants.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import {Loading} from "./Loading";

const Moralis = require('moralis');

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

/* Moralis init code */
const serverUrl = "https://ybo5fc1ry3ke.usemoralis.com:2053/server";
const appId = "DmUxkX1Pipgbm0CEQmG7X1pPW5vfuCv73JQn0cvs";
Moralis.start({ serverUrl, appId });



export class MyDapp extends React.Component {
    constructor(props) {
        super(props);

        // We store multiple things in Dapp's state.
        // You don't need to follow this pattern, but it's an useful example.
        this.initialState = {
            // The info of the token (i.e. It's Name and symbol)
            tokenData: undefined,
            stakerData: undefined,
            // The user's address and balance
            selectedAddress: undefined,
            stakedTokens: undefined,
            ownedTokens: undefined,
            // The ID about transactions being sent, and any possible error with them
            txBeingSent: undefined,
            transactionError: undefined,
            networkError: undefined,
        };

        this.state = this.initialState;
    }

    render() {
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install MetaMask.
        if (window.ethereum === undefined) {
            return <NoWalletDetected />;
        }

        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, we are going to save the users's address
        // in the component's state. So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        // Note that we pass it a callback that is going to be called when the user
        // clicks a button. This callback just calls the _connectWallet method.
        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }

        // If the token data or the user's balance hasn't loaded yet, we show
        // a loading component.
        if (!this.state.tokenData) {
            return <Loading />;
        }

        // If everything is loaded, we render the application.
        return (
            <div className="container p-4">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            {this.state.tokenData.mintedAmount}/{this.state.tokenData.supply}
                        </h1>
                        <img src={this.state.tokenData.tokenImageUri + "1.png"} alt="f"/>
                        <button onClick={() => this._mint()}>Mint Token</button>
                    </div>
                </div>

                <hr />

                <div className="row">

                    <div className="col-12">
                        {/*Amount of owned tokens: {this.state.ownedTokens.length}*/}
                        <br/>
                        Owned token ids: {this.state.ownedTokens}
                        <br/>

                        <form
                            onSubmit={(event) => {
                                // This function just calls the transferTokens callback with the
                                // form's data.
                                event.preventDefault();

                                const formData = new FormData(event.target);
                                const tokenId = formData.get("tokenId");

                                if (tokenId) {
                                    this._stake(tokenId);
                                }
                            }}
                        >
                            <div className="form-group">
                                <label>Token to stake </label>
                                <input
                                    className="form-control"
                                    type="number"
                                    step="1"
                                    name="tokenId"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input className="btn btn-primary" type="submit" value="Stake" />
                            </div>
                        </form>
                    </div>

                </div>

                <hr />

                <div className="row">

                    <div className="col-12">
                        Amount of staked tokens: {this.state.stakedTokens.length}
                        <br/>
                        Staked token ids: {this.state.stakedTokens}
                            <br/>
                        Chance to win: {this._getWiningChance()*100}%
                                <br/>
                        <form
                            onSubmit={(event) => {
                                // This function just calls the transferTokens callback with the
                                // form's data.
                                event.preventDefault();

                                const formData = new FormData(event.target);
                                const tokenId = formData.get("tokenId");

                                if (tokenId) {
                                    this._unstake(tokenId);
                                }
                            }}
                        >
                            <div className="form-group">
                                <label>Token to unstake </label>
                                <input
                                    className="form-control"
                                    type="number"
                                    step="1"
                                    name="tokenId"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input className="btn btn-primary" type="submit" value="Unstake" />
                            </div>
                        </form>
                    </div>

                </div>



            </div>
        );
    }

    async _connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.

        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.enable();

        // Once we have the address, we can initialize the application.

        // First we check the network
        if (!this._checkNetwork()) {
            return;
        }

        this._initialize(selectedAddress);

        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();
            // `accountsChanged` event can be triggered with an undefined newAddress.
            // This happens when the user removes the Dapp from the "Connected
            // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
            // To avoid errors, we reset the dapp state
            if (newAddress === undefined) {
                return this._resetState();
            }

            this._initialize(newAddress);
        });

        // We reset the dapp state if the network is changed
        window.ethereum.on("networkChanged", ([networkId]) => {
            this._stopPollingData();
            this._resetState();
        });
    }

    _initialize(userAddress) {
        // This method initializes the dapp

        // We first store the user's address in the component's state
        this.setState({
            selectedAddress: userAddress,
        });

        // Then, we initialize ethers, fetch the token's data, and start polling
        // for the user's balance.

        // Fetching the token data and the user's balance are specific to this
        // sample project, but you can reuse the same initialization pattern.
        this._intializeEthers();
        this._getTokenData();
    }

    async _intializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);

        // When, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        this._token = new ethers.Contract(
            stakedToken,
            TokenArtifact.abi,
            this._provider.getSigner(0)
        );

        this._staker = new ethers.Contract(
            stakerContract,
            StakerArtifact.abi,
            this._provider.getSigner(0)
        );

        this._startPollingData();
    }

    // The next two methods are needed to start and stop polling data. While
    // the data being polled here is specific to this example, you can use this
    // pattern to read any data from your contracts.
    //
    // Note that if you don't need it to update in near real time, you probably
    // don't need to poll it. If that's the case, you can just fetch it when you
    // initialize the app, as we do with the token data.
    _startPollingData() {
        this._pollDataInterval = setInterval(() => {this._update()}, 20000);

        // We run it once immediately so we don't have to wait for it
        this._update();
    }

    _update() {
        this._updateOwnedTokens(this.state.selectedAddress);
        this._updateStakedTokens(this.state.selectedAddress);
    }

    _stopPollingData() {
        clearInterval(this._pollDataInterval);
        this._pollDataInterval = undefined;
    }


    // Read from the contract and store the results in the component state.
    async _getTokenData() {
        const name = await this._token.name();
        const symbol = await this._token.symbol();
        const supply = await this._token.SUPPLY();
        const mintPrice = await this._token.MINT_PRICE();
        const mintedAmount = await this._token.getNumberMinted();
        const tokenMetadataUri = await this._token.BASE_URI;
        const tokenImageUri = imageUri;


        this.setState({ tokenData: { name, symbol,  mintedAmount: mintedAmount.toNumber(), mintPrice: mintPrice.toNumber(), supply: supply.toNumber(), tokenMetadataUri, tokenImageUri } });
    }

    async _getStakerData() {
        const minStakeTime = await this._staker.minStakeTime();

        this.setState(( { stakerData: {minStakeTime}}));
    }

    async _updateOwnedTokens(wallet) {
        const response = await Moralis.Web3API.account.getNFTsForContract({address: wallet, token_address: stakedToken});

        console.log(response)
        // this.setState( {
        //     ownedTokens: response.result.map(token =>
        //         token.token_id
        //     )
        // });
    }

    async _updateStakedTokens(wallet) {
        console.log(wallet)
        const walletStake = await this._staker.getUserStakedTokens(wallet);
        console.log(walletStake)
        this.setState( {
            stakedTokens: (!walletStake) ? [] : walletStake.map(elem => elem.toNumber())
        });
    }

    /**
     * Returns undefined if there are no current staked tokens
     * @returns {Promise<number|undefined>}
     * @private
     */
    async _getWiningChance() {
        const result = await this._staker.getParticipantList();
        const totalTickets = result[1];
        if (totalTickets === 0) {
            return undefined;
        }
        const userParticipation = result[0].find(elem => elem.addr === this.state.selectedAddress.address);
        if (userParticipation !== undefined) {
            return userParticipation.tickets / totalTickets;
        } else return 0;
    }

    _getTokenImage(tokenId) {
        return this._token.tokenImageUri + tokenId.toString() + ".png";
    }

    // Result in seconds
    async _getStakedTime(tokenId) {
        // Get time the token was staked in seconds
        const timeWhenStaked = await this._staker.tokenStakedTime(tokenId);

        const currentTime = Math.floor((new Date()).getTime() / 1000);
        return currentTime - timeWhenStaked;
    }

    async _isSuitableForRaffle(tokenId) {
        return (await this._getStakedTime(tokenId)) > this.state.stakerData.minStakeTime;
    }

    async _stake(tokenId) {
        try {
            // If a transaction fails, we save that error in the component's state.
            // We only save one such error, so before sending a second transaction, we
            // clear it.
            this._dismissTransactionError();

            const stakerAddress = await this._staker.address;

            const approvedAccountForTheToken = await this._token.getApproved(tokenId);
            const approvedAsOperatorForAccount = await this._token.isApprovedForAll(this.state.selectedAddress, stakerAddress);
            if (!(approvedAccountForTheToken === stakerAddress || approvedAsOperatorForAccount)) {
                // If we have not, we need to approve the staker to make transfers
                // We send the transaction to add approval, and save its hash in the Dapp's state. This
                // way we can indicate that we are waiting for it to be mined.
                const approvalTx = await this._token.approve(stakerAddress, tokenId);
                await this._checkToCompletion(approvalTx);
            }

            // Stake transaction
            const stakeTx = await this._staker.stake(tokenId);
            await this._checkToCompletion(stakeTx);

            // If we got here, the transaction was successful, so you may want to
            // update your state. Here, we update the user's balance.
            await this._updateStakedTokens(this.state.selectedAddress);
            await this._updateOwnedTokens(this.state.selectedAddress);
        } catch (error) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            this.setState({ transactionError: error });
        } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({ txBeingSent: undefined });
        }
    }

    async _unstake(tokenId) {

        await this._doTransaction(async () => {
            return await this._staker.unstake(tokenId);
        }, async () => {
            await this._updateStakedTokens(this.state.selectedAddress);
            await this._updateOwnedTokens(this.state.selectedAddress);
        });
    }

    async _mint() {


        let overrides = {
            value: this.state.tokenData.mintPrice
        };

        await this._doTransaction(async () => {
            return await this._token.mintToken(this.state.selectedAddress, overrides);
        }, async () => {
            await this._updateOwnedTokens()
        });
    }


    // This method just clears part of the state.
    _dismissTransactionError() {
        this.setState({ transactionError: undefined });
    }

    async _doTransaction(txCreator, txCallbacks) {
        try {
            // If a transaction fails, we save that error in the component's state.
            // We only save one such error, so before sending a second transaction, we
            // clear it.
            this._dismissTransactionError();

            // Unstake transaction
            const tx = await txCreator();
            await this._checkToCompletion(tx);

            // If we got here, the transaction was successful, so you may want to
            // update your state. Here, we update the user's balance.
            txCallbacks();
        } catch (error) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            this.setState({ transactionError: error });
        } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({ txBeingSent: undefined });
        }
    }

    // Wait for the transaction to fulfill of fail
    async _checkToCompletion(tx) {
        console.log(tx)
        this.setState({txBeingSent: tx.hash});
        // We use .wait() to wait for the transaction to be mined. This method
        // returns the transaction's receipt.
        const receipt = await tx.wait();
        // The receipt, contains a status flag, which is 0 to indicate an error.
        if (receipt.status === 0) {
            // We can't know the exact error that made the transaction fail when it
            // was mined, so we throw this generic one.
            throw new Error("Failed to approve NFT transfers");
        }
    }

    // This method checks if Metamask selected network is Localhost:8545
    _checkNetwork() {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true;
        }

        this.setState({
            networkError: 'Please connect Metamask to Localhost:8545'
        });

        return false;
    }
}




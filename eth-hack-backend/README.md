### What is the project?

We have developed an NFT collection, where each owner of the NFT will be able to participate in a fair raffle. The raffle prizes will be provided by the team and will consist of a curated list of novel NFT Artists. 
The fact that raffles will be held at a random time period and will require staking tokens for a long period of time before a user can win, would make users want to always stake not to miss out on a raffle. The website that we have developed allows users to mint, stake and buy our NFTs, as well as look through current and previous raffles.

### How is it made?

The project makes use of the Ethereum blockchain as a transparent way to hold raffles, where the winner is publicly determined. The randomness is currently supplied via the blockhash, yet in the next iteration we will make use of ChainLink. For development, we used Hardhat with a set of plugins. 

The frontend is a stateless client. We use Ether.js library to perform  contract interactions and React.js to implement the UI. We also made use of Moralis API and Server to get access to NFT token data, accessible only form events.
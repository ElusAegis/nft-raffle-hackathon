const { ethers } = require('hardhat')

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const ShinewToken = await ethers.getContractFactory('ShinewToken');
    const shinewToken = await ShinewToken.deploy();
    console.log(`Staked Token address: ${shinewToken.address}`);

    const ERC721 = await ethers.getContractFactory('NFT');
    const raffledNft = await ERC721.deploy();
    console.log(`Raffled Token address: ${raffledNft.address}`);

    const StakeNFT = await ethers.getContractFactory('TokenStaker');
    const stakeNFT = await StakeNFT.deploy(shinewToken.address);
    console.log(`StakeNFT address: ${stakeNFT.address}`);

    const TokenStaker = await ethers.getContractFactory('TokenRaffler');
    const tokenStaker = await TokenStaker.deploy();
    console.log(`RaffleNFT address: ${tokenStaker.address}`);

    // await stakedNftToken.mint(deployer.address, 1);
    // const nftOwner = await stakedNftToken.ownerOf(1);
    // console.log(`NFT #1 owner is ${nftOwner}`);
    //
    // await stakedNftToken.approve(stakeNFT.address, 1);
    // await stakeNFT.stake(1)
    //
    // const stakeList = await stakeNFT.stakers(0);
    // console.log(`NFT stakers ${stakeList}`);
    //
    // // Allow staking for only one minute before one can participate
    // await stakeNFT.changeMinStakeTime(1);
    // await new Promise(res => setTimeout(() => res(null), 1000));
    //
    // const raffleTokenId = 4;
    // await raffledNftToken.mint(deployer.address, raffleTokenId);
    // await raffledNftToken.approve(raffleNFT.address, raffleTokenId);
    //
    // raffleNFT.provider.pollingInterval = 100;
    // raffleNFT.on("RaffleCreated", (raffleId) => {
    //     console.log(`Raffle #${raffleId} created`);
    // })
    //
    // raffleNFT.on("WinnerChosen", (raffleId, prizeTokenId, winner) => {
    //     console.log(`Raffle #${raffleId} winner chosen: ${winner} won ${prizeTokenId} token`);
    // })
    //
    // await raffleNFT.CreateRaffle('First Raffle', 1, raffledNftToken.address, [raffleTokenId], stakeNFT.address);
    //
    // await new Promise(res => setTimeout(() => res(null), 1000));
    // await raffleNFT.CloseRaffle(1);
    //
    // const winner = await raffledNftToken.ownerOf(raffleTokenId);
    // console.log(`NFT #${raffleTokenId} winner is ${winner}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
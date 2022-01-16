const { expect } = require('chai')

const { ethers } = require("hardhat");

describe('Token contract', () => {
    let Token, token, owner, addr1, addr2;

    beforeEach(async () => {
        Token = await ethers.getContractFactory('Token');
        token = await Token.deploy();
        [owner, addr1, addr2, _] = await ethers.getSigners();
    });

    describe('Deloyment', () => {
        it('Should set rght owner', async () => {
            expect(await token.owner()).to.equal(owner.address);
        });

        it('Should assign all tokens to the owner', async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSup()).to.equal(ownerBalance);
        });
    });

    describe('Transactions',  () => {
        it('Should transfer tokens between accounts', async () => {
            await token.transfer(addr1.address, 50);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            await token.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it('Should fail when transfering form empty', async  () => {
            const initialBalanceOwner = await token.balanceOf(owner.address);

            await expect(
                token
                    .connect(addr1)
                    .transfer(owner.address, 1)
            )
                .to
                .be
                .revertedWith('Not enough tok');

            expect(await token.balanceOf(owner.address)).to.equal(initialBalanceOwner);

        });
    });
});




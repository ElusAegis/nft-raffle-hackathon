// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IParticipantList.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";

contract TokenRaffler is Ownable, IERC721Receiver {
    using Counters for Counters.Counter;

    bytes4 private constant ERC721_STRING = 0x150b7a02;

    // A constructor to deal with randomness
    bytes32 public VRFKeyHash;

    constructor() {}

    event RequestRandomness(bytes32 requestId);
    event RaffleCreated(uint256 raffleId, IERC721 prizeToken, uint256[] prizeTokenIds);
    event WinnerChosen(uint256 raffleId, uint256 prizeTokenId, address winner);

    enum RaffleState {
        Open,
        Finished
    }
    // Open: The raffle is open for entry
    // Finished: The raffle is finished and the winners have been selected

    struct Raffle {
        uint256 id; // unique identifier for the raffle
        string name; // name of the raffle
        IERC721 prizeToken; // address of the NFT being distributed
        uint256[] prizeTokenIds; // a list of NFTs Ids that will be distributed among the participants randomly
        uint256 startTime; // unix timestamp of the start of the raffle
        uint256 endTime; // unix timestamp of the end of the raffle
        RaffleState state; // state of the raffle
        IParticipantList participantContract; // contract that determines who is eligible for the raffle
    }

    Counters.Counter public RaffleCount;

    mapping(uint256 => Raffle) public Raffles; // mapping of raffle id to raffle data


    function CreateRaffle(string calldata _raffleName, uint256 _raffleLength, IERC721 _prizeToken, uint256[] calldata _prizeTokenIds, IParticipantList _participantContract) external {
        RaffleCount.increment();
        uint256 _id = RaffleCount.current();
        Raffle storage raffle = Raffles[_id];
        _transferTokens(_prizeToken, _prizeTokenIds);
        raffle.id = _id;
        raffle.name = _raffleName;
        raffle.prizeToken = _prizeToken;
        raffle.prizeTokenIds = _prizeTokenIds;
        raffle.startTime = block.timestamp;
        raffle.endTime = block.timestamp + _raffleLength;
        raffle.state = RaffleState.Open;
        raffle.participantContract = _participantContract;
        emit RaffleCreated(_id, _prizeToken, _prizeTokenIds);
    }

    function CloseRaffle(uint256 _id) public {
        require(block.timestamp >= Raffles[_id].endTime, "The raffle has not closed yet");
        require(Raffles[_id].state == RaffleState.Open, "The raffle is not possible to close");

        Raffle storage raffle = Raffles[_id];
        (ParticipantLib.Participant[] memory participants, uint256 totalTickets) = raffle.participantContract.getParticipantList();
        require(participants.length > 0, "At least one participant required for a raffle");


        uint256 randomness = uint256(blockhash(block.number)); // We consider this secure as we do not plan to distribute expensive art in the ruffles
        // Alternatively, we would use Chain-link solution to obtain randomness
        
        for (uint256 i = 0; i < raffle.prizeTokenIds.length; i++) {
            uint256 currentTokenId = raffle.prizeTokenIds[i];

            // For each NFT prize we regenerate a random 
            randomness = uint256(keccak256(abi.encodePacked(randomness)));
            
            // We determine the sequential number of the winning tickets
            uint256 winnerTicket = randomness % totalTickets;

            // We find who is the holder of that ticket
            uint256 currentTicket = participants[0].tickets;
            uint256 participantN;
            while(currentTicket <= winnerTicket) {
                currentTicket += participants[participantN].tickets;
                participantN++;
            }

            // We give out the prize
            address winnerAddress = participants[participantN].addr;
            raffle.prizeToken.transferFrom(address(this), winnerAddress, currentTokenId);
            emit WinnerChosen(_id, currentTokenId, winnerAddress);
        }

        // Close this raffle
        raffle.state = RaffleState.Finished;


    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external pure override returns(bytes4) {
        return ERC721_STRING;
    }

    function _transferTokens(IERC721 _token, uint256[] calldata _tokenIds) private {
        // To save gas first run a check of NFTs
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(_token.ownerOf(_tokenIds[i]) == msg.sender, "The sender does not own provided NFT");
        }

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _token.safeTransferFrom(msg.sender, address(this), _tokenIds[i]);
        }
    }
}
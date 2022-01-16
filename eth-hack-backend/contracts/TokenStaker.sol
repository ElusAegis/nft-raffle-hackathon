// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./IParticipantList.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenStaker is IParticipantList, Ownable, IERC721Receiver {
    using SafeMath for uint256;


    bytes4 private constant ERC721_STRING = 0x150b7a02;

    IERC721 stakedNFT;

    /// @notice The structure to store information about the staker
    struct Stake {
        uint256[] tokenIds; // Ids of staked tokens by this Staker
        bool isValue; // Will be equal to 0 if staker is not initialised
        uint256 stakerIndex; // Index of the staker in the all stakers list
    }

    // Mapping of current stakers to their staked tokenIds
    mapping (address => Stake) public stakes;

    // Mapping between token and the amount of time it was stacked
    mapping (uint256 => uint256) public tokenStakedTime;

    /// @notice a list of stakers
    /// @dev the only guarantee is that if a person has staked, he is in the list
    /// @dev Note - the opposite might not be true, the person present might have no staked tokens
    address[] public stakers;

    uint256 public minStakeTime = 864000; // 10 days = 10 * 24 * 60 * 60

    ////// EVENTS

    /// @notice event emitted when a user has staked a token
    event Staked(address owner, uint256 tokenId);

    /// @notice event emitted when a user has unstaked a token
    event Unstaked(address owner, uint256 amount);


    ////// MAIN LOGIC

    constructor(IERC721 _stakedNFT) {
        stakedNFT = _stakedNFT;
    }

    function getParticipantList() override public view returns(ParticipantLib.Participant[] memory, uint256) {
        ParticipantLib.Participant[] memory participants = new ParticipantLib.Participant[](stakers.length);
        uint256 totalTickets;
        for (uint256 i = 0; i < stakers.length; i++) {
            Stake storage userStake = stakes[stakers[i]];
            uint256 tickets;
            for (uint256 tokenIdN = 0; tokenIdN < userStake.tokenIds.length; tokenIdN++) {
                uint256 tokenId = userStake.tokenIds[tokenIdN];
                if (block.timestamp - tokenStakedTime[tokenId] > minStakeTime) {
                    tickets++;
                }
            }
            totalTickets += tickets;
            ParticipantLib.Participant memory participant = ParticipantLib.Participant(stakers[i], userStake.tokenIds.length);
            participants[i] = participant;
        }
        return (participants, totalTickets);
    }

    function getUserStakedTokens(address _user) public view returns(uint256[] memory){
        uint256[] memory tokensForUser = stakes[_user].tokenIds;
        return tokensForUser;
    }

    function changeMinStakeTime(uint256 _stakeTime) external onlyOwner {
        minStakeTime = _stakeTime;
    }

    function stake(uint256 _tokenId) external {
        _stake(msg.sender, _tokenId);
    }

    function stakeBatch(uint256[] memory _tokenIds) external {
        for (uint i = 0; i < _tokenIds.length; i++) {
            _stake(msg.sender, _tokenIds[i]);
        }
    }

    function unstake(uint256 _tokenId) external {
        require(_hasStakedToken(msg.sender, _tokenId), "Sender has not staked provided TokenId");
        _unstake(msg.sender, _tokenId);
    }

    function unstakeBatch(uint256[] memory _tokenIds) external {
        for (uint i = 0; i < _tokenIds.length; i++) {
            if (_hasStakedToken(msg.sender, _tokenIds[i])) {
                _unstake(msg.sender, _tokenIds[i]);
            }
        }
    }

    /**
     * @dev All the staking goes through this function
    */
    function _stake(address _user, uint256 _tokenId) internal {
        Stake storage userStake = stakes[_user];

        tokenStakedTime[_tokenId] = block.timestamp;

        // If this is the first time the address made a stake
        // Add it to the stakers list
        if (!userStake.isValue) {
            userStake.stakerIndex = stakers.length;
            stakers.push(_user);
            userStake.isValue = true;
        }

        userStake.tokenIds.push(_tokenId);
        stakedNFT.safeTransferFrom(
            _user,
            address(this),
            _tokenId
        );

        emit Staked(_user, _tokenId);
    }

    function _hasStakedToken(address _user, uint256 _tokenId) view private returns(bool) {
        Stake storage userStake = stakes[_user];

        for (uint i = 0; i < userStake.tokenIds.length; i++) {
            if (userStake.tokenIds[i] == _tokenId) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev All the unstaking goes through this function
    */
    function _unstake(address _user, uint256 _tokenId) internal
    {
        Stake storage userStake = stakes[_user];

        delete tokenStakedTime[_tokenId];

        // If the staker will have no more staked tokens
        // Remove him from stakers list and his stake from stakes
        if (userStake.tokenIds.length == 1) {
            uint256 stakerIndex = userStake.stakerIndex;

            delete stakes[_user];

            // Remove the staker from the staker list
            uint256 amountOfStakers = stakers.length;
            stakers[stakerIndex] = stakers[amountOfStakers - 1];
            stakers.pop();
        } else {
            // If the staker has more than one token
            // Find the index of the staked token in the list
            // The token is present as we have checked before
            uint256 tokenIndex;
            for (uint i = 0; i < userStake.tokenIds.length; i++) {
                if (userStake.tokenIds[i] == _tokenId) {
                    tokenIndex = i;
                }
            }

            // Remove the staked token from the staked token list for the staker
            uint256 amountOfStakedTokens = userStake.tokenIds.length;
            userStake.tokenIds[tokenIndex] = userStake.tokenIds[amountOfStakedTokens - 1];
            userStake.tokenIds.pop();
        }


        stakedNFT.safeTransferFrom(
            address(this),
            _user,
            _tokenId
        );

        emit Unstaked(_user, _tokenId);

    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns(bytes4) {
        return ERC721_STRING;
    }

}

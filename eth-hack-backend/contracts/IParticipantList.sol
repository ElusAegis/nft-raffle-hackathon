// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ParticipantLib {

    struct Participant {
        address addr;
        uint256 tickets;
    }

}

/**
 * @title IParticipantList
 * @dev Returns an array of addresses that can participate in the raffle.
 * The addresses returned are considered valid at the moment they are pooled.
 *
 */
interface IParticipantList {



    function getParticipantList() external view returns(ParticipantLib.Participant[] memory, uint256);

}

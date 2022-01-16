pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ShinewToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    uint256 public SUPPLY = 10000;
    uint256 public MINT_PRICE = 10^17; // 0.1 ETH to mint an NFT
    string public BASE_URI = "https://ipfs.io/ipfs/QmUwpJRtSR2w77E2bEzsL8VBc5pgrG7uuoX95yV5BPVMvm/";

    constructor() ERC721("ShinewNFT", "SFT") { }


    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked(BASE_URI, tokenId.toString(), ".json"));
    }

    function mintToken(address recipient) public payable returns (uint256) {
        require(msg.value >= MINT_PRICE, "Not enough ETH sent!");
        require(_tokenIds._value < SUPPLY, "Max number of tokens have been minted!");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);

        return newItemId;
    }

    function getNumberMinted() public view returns(uint256) {
        return _tokenIds._value;
    }

    function _baseURI() override internal view virtual returns (string memory) {
        return BASE_URI;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}

# 🏛️ EnhancedDAO

A powerful and extensible Solidity smart contract that enables users to **create and manage Decentralized Autonomous Organizations (DAOs)** with proposal voting, funding, and membership functionality — all with a one-DAO-per-creator constraint.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.17-purple.svg)

---

## ✨ Features

- ✅ **One DAO per Wallet** – Prevents DAO spamming and ensures clear creator identity.
- ✅ **On-chain Proposals & Voting** – Create, vote, and execute decisions transparently.
- ✅ **DAO Treasury** – Accept ETH funding and track balance per DAO.
- ✅ **Role-Based Access** – Creators manage DAO lifecycle; members vote and propose.
- ✅ **Metadata Support** – Link off-chain data using IPFS CIDs.
- ✅ **Active DAO Tracking** – Easily query currently functioning DAOs.

---

## 🧠 Smart Contract Architecture

### DAO Structure

```solidity
struct DAO {
  string name;
  string metadataCID;
  address creator;
  uint256 treasuryBalance;
  uint256 proposalCount;
  bool active;
  mapping(uint256 => Proposal) proposals;
  mapping(address => bool) members;
}
````

### Proposal Structure

```solidity
struct Proposal {
  uint256 id;
  string description;
  uint256 deadline;
  uint256 yesVotes;
  uint256 noVotes;
  bool executed;
  mapping(address => bool) voters;
}
```

---

## 🛠️ Core Functions

| Function                                     | Description                                       |
| -------------------------------------------- | ------------------------------------------------- |
| `createDAO(name, metadataCID)`               | Creates a DAO. Creator becomes the first member.  |
| `joinDAO(daoAddress)`                        | Allows any wallet to join an existing DAO.        |
| `fundDAO(daoAddress)`                        | Sends ETH and becomes a member.                   |
| `createProposal(daoAddress, desc, duration)` | Member creates a proposal with a vote deadline.   |
| `voteOnProposal(daoAddress, id, support)`    | Member votes `yes` or `no` on an active proposal. |
| `executeProposal(daoAddress, id)`            | Creator executes the proposal after voting ends.  |
| `shutDownDAO(daoAddress)`                    | Creator can shut down the DAO (deactivates it).   |

---

## 🔔 Events

* `DAOCreated(address daoAddress, string name, address creator)`
* `DAOShutDown(address daoAddress, address creator)`
* `MemberJoined(address daoAddress, address member)`
* `ProposalCreated(address daoAddress, uint256 proposalId, string description)`
* `Voted(address daoAddress, uint256 proposalId, address voter, bool vote)`
* `ProposalExecuted(address daoAddress, uint256 proposalId)`
* `FundsReceived(address daoAddress, address from, uint256 amount)`
* `FundsTransferred(address daoAddress, address to, uint256 amount)`

---

## 🧪 Contract Usage

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title EnhancedDAO
 * @dev DAO platform with creator/joiner roles and one-DAO-per-wallet limit
 */
contract EnhancedDAO {

    struct Proposal {
        uint256 id;
        string description;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(address => bool) voters;
    }

    struct DAO {
        string name;
        string metadataCID; // IPFS CID
        address creator;
        uint256 treasuryBalance;
        uint256 proposalCount;
        bool active; // New field to track if DAO is active or shut down
        mapping(uint256 => Proposal) proposals;
        mapping(address => bool) members; // Track all members (including creator)
    }

    mapping(address => DAO) public daos;
    mapping(address => address) public creatorToDao; // Track which DAO an address has created
    address[] public daoAddresses;
    address[] public activeDaoAddresses; // Only active DAOs

    event DAOCreated(address daoAddress, string name, address creator);
    event DAOShutDown(address daoAddress, address creator);
    event MemberJoined(address daoAddress, address member);
    event ProposalCreated(address daoAddress, uint256 proposalId, string description);
    event Voted(address daoAddress, uint256 proposalId, address voter, bool vote);
    event ProposalExecuted(address daoAddress, uint256 proposalId);
    event FundsReceived(address daoAddress, address from, uint256 amount);
    event FundsTransferred(address daoAddress, address to, uint256 amount);

    modifier onlyCreator(address _daoAddress) {
        require(msg.sender == daos[_daoAddress].creator, "Not DAO creator");
        _;
    }

    modifier daoActive(address _daoAddress) {
        require(daos[_daoAddress].active, "DAO is not active");
        _;
    }

    modifier onlyMember(address _daoAddress) {
        require(daos[_daoAddress].members[msg.sender], "Not a DAO member");
        _;
    }

    function createDAO(string memory _name, string memory _metadataCID) external returns (address) {
        // Check if creator already has an active DAO
        require(creatorToDao[msg.sender] == address(0) || !daos[creatorToDao[msg.sender]].active, 
                "You already have an active DAO");
        
        address daoAddress = address(uint160(uint256(keccak256(abi.encodePacked(_name, msg.sender, block.timestamp)))));
        DAO storage dao = daos[daoAddress];
        dao.name = _name;
        dao.creator = msg.sender;
        dao.metadataCID = _metadataCID;
        dao.treasuryBalance = 0;
        dao.active = true;
        
        // Add creator as a member
        dao.members[msg.sender] = true;
        
        // Track this DAO as created by this address
        creatorToDao[msg.sender] = daoAddress;
        
        daoAddresses.push(daoAddress);
        activeDaoAddresses.push(daoAddress);

        emit DAOCreated(daoAddress, _name, msg.sender);
        return daoAddress;
    }

    function shutDownDAO(address _daoAddress) external onlyCreator(_daoAddress) daoActive(_daoAddress) {
        DAO storage dao = daos[_daoAddress];
        dao.active = false;
        
        // Remove from active DAOs list
        for (uint i = 0; i < activeDaoAddresses.length; i++) {
            if (activeDaoAddresses[i] == _daoAddress) {
                // Replace with the last element and pop
                activeDaoAddresses[i] = activeDaoAddresses[activeDaoAddresses.length - 1];
                activeDaoAddresses.pop();
                break;
            }
        }
        
        emit DAOShutDown(_daoAddress, msg.sender);
    }

    function joinDAO(address _daoAddress) external daoActive(_daoAddress) {
        require(bytes(daos[_daoAddress].name).length > 0, "DAO does not exist");
        daos[_daoAddress].members[msg.sender] = true;
        emit MemberJoined(_daoAddress, msg.sender);
    }

    function fundDAO(address _daoAddress) external payable daoActive(_daoAddress) {
        require(bytes(daos[_daoAddress].name).length > 0, "DAO does not exist");
        daos[_daoAddress].treasuryBalance += msg.value;
        daos[_daoAddress].members[msg.sender] = true; // Funding makes you a member
        emit FundsReceived(_daoAddress, msg.sender, msg.value);
        emit MemberJoined(_daoAddress, msg.sender);
    }

    function createProposal(address _daoAddress, string memory _desc, uint256 _duration) 
        external onlyMember(_daoAddress) daoActive(_daoAddress) {
        DAO storage dao = daos[_daoAddress];
        uint256 newId = dao.proposalCount++;
        Proposal storage prop = dao.proposals[newId];
        prop.id = newId;
        prop.description = _desc;
        prop.deadline = block.timestamp + _duration;
        prop.executed = false;

        emit ProposalCreated(_daoAddress, newId, _desc);
    }

    function voteOnProposal(address _daoAddress, uint256 _id, bool _support) 
        external onlyMember(_daoAddress) daoActive(_daoAddress) {
        DAO storage dao = daos[_daoAddress];
        Proposal storage prop = dao.proposals[_id];

        require(block.timestamp < prop.deadline, "Voting closed");
        require(!prop.voters[msg.sender], "Already voted");

        prop.voters[msg.sender] = true;

        if (_support) {
            prop.yesVotes++;
        } else {
            prop.noVotes++;
        }

        emit Voted(_daoAddress, _id, msg.sender, _support);
    }

    function executeProposal(address _daoAddress, uint256 _id) 
        external onlyCreator(_daoAddress) daoActive(_daoAddress) {
        DAO storage dao = daos[_daoAddress];
        Proposal storage prop = dao.proposals[_id];

        require(block.timestamp >= prop.deadline, "Still active");
        require(!prop.executed, "Already executed");

        prop.executed = true;
        emit ProposalExecuted(_daoAddress, _id);
    }

    function transferFunds(address _daoAddress, address payable _to, uint256 _amount) 
        external onlyCreator(_daoAddress) daoActive(_daoAddress) {
        DAO storage dao = daos[_daoAddress];
        require(dao.treasuryBalance >= _amount, "Insufficient funds");

        dao.treasuryBalance -= _amount;
        _to.transfer(_amount);

        emit FundsTransferred(_daoAddress, _to, _amount);
    }

    // Utility functions
    function getDaoCount() external view returns (uint256) {
        return daoAddresses.length;
    }

    function getActiveDaoCount() external view returns (uint256) {
        return activeDaoAddresses.length;
    }

    function getDaoSummary(address _daoAddress) external view returns (
        string memory name,
        string memory metadataCID,
        address creator,
        uint256 balance,
        uint256 proposalCount,
        bool active
    ) {
        DAO storage dao = daos[_daoAddress];
        return (dao.name, dao.metadataCID, dao.creator, dao.treasuryBalance, dao.proposalCount, dao.active);
    }

    function getProposalDetails(address _daoAddress, uint256 _id) external view returns (
        string memory description,
        uint256 deadline,
        uint256 yesVotes,
        uint256 noVotes,
        bool executed
    ) {
        DAO storage dao = daos[_daoAddress];
        require(_id < dao.proposalCount, "Proposal does not exist");
        
        Proposal storage prop = dao.proposals[_id];
        return (prop.description, prop.deadline, prop.yesVotes, prop.noVotes, prop.executed);
    }

    function hasVoted(address _daoAddress, uint256 _id, address _voter) external view returns (bool) {
        DAO storage dao = daos[_daoAddress];
        require(_id < dao.proposalCount, "Proposal does not exist");
        
        return dao.proposals[_id].voters[_voter];
    }

    function isMember(address _daoAddress, address _member) external view returns (bool) {
        return daos[_daoAddress].members[_member];
    }

    function getCreatorDao(address _creator) external view returns (address) {
        return creatorToDao[_creator];
    }

    function getActiveDAOs(uint256 _start, uint256 _limit) external view returns (address[] memory) {
        uint256 end = _start + _limit;
        if (end > activeDaoAddresses.length) {
            end = activeDaoAddresses.length;
        }
        
        uint256 length = end - _start;
        address[] memory result = new address[](length);
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = activeDaoAddresses[_start + i];
        }
        
        return result;
    }
}
```

---

## 🧱 Tech Stack

* **Solidity** `^0.8.17`
* **IPFS** (for metadata storage via CID)
* **EVM-compatible chains** – Works on Ethereum, Sepolia, Mumbai, etc.

---

## 🚀 Deployment (Hardhat)

1. Clone the repo:

```bash
git clone https://github.com/your-username/EnhancedDAO.git
cd EnhancedDAO
```

2. Install dependencies:

```bash
npm install
```

3. Compile contracts:

```bash
npx hardhat compile
```

4. Deploy to testnet (example: Sepolia):

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

> You’ll need a `.env` file with your `PRIVATE_KEY` and `INFURA/ALCHEMY_API_KEY`.

---

## 📁 Project Structure

```
contracts/
  └── EnhancedDAO.sol     # Main contract
scripts/
  └── deploy.js           # Deployment script
README.md                 # Project documentation
hardhat.config.js         # Hardhat config
```

---

## 🔐 Security Considerations

* DAO creators have full control over shutdown and execution — future versions may include decentralized execution logic.
* No direct fund withdrawal logic yet — can be added in extended versions.
* DAO proposals are only logic markers — actual actions (e.g., fund transfers) can be encoded off-chain or in upgrades.

---

## 🧠 Future Improvements

* ✅ Token-based voting instead of address-based
* ✅ Treasury withdrawal proposals
* ✅ Role system (admins, contributors, voters)
* ✅ DAO types (public/private)
* ✅ Frontend dashboard

---

## 🧾 License

This project is licensed under the MIT License.
© 2025 \[Your Name or Organization]

---

## 🤝 Contributing

Contributions, suggestions, and issues are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/awesome`)
3. Push your changes and open a PR

---

## 📬 Contact

* Twitter: [@spandan\_twts](https://x.com/spandan_twts)

---

## 🌐 Live Demo

Check out the full working app here:
👉 **[xdc-ai-dao-rwai.vercel.app](https://xdc-ai-dao-rwai.vercel.app/)**

---

## ❤️ Built With

* [Solidity](https://soliditylang.org/)
* [Hardhat](https://hardhat.org/)
* [IPFS](https://ipfs.tech/)
* [Ethereum](https://ethereum.org/)

```


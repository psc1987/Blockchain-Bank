
pragma solidity ^0.4.21;

contract BlockchainBank {
    address private bankAddress = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;
    
    uint256 private totalSupply = 100000000;
    
    mapping (address => uint256) private balances;
    mapping (address => bool) private hasAccounts;
    
    struct transInfo {
        address transFrom;
        address transTo;
        uint256 amount;
        string memo;
    }
    
    function BlockchainBank() {
        balances[bankAddress] = totalSupply;
    }
    
    function createAccount(address _walletAddress) returns (bool) {
        if(!hasAccounts[_walletAddress]) {
            balances[bankAddress] -= 100;
            balances[_walletAddress] = 100;
            hasAccounts[_walletAddress] = true;
            return true;
        } else {
            return false;
        }
    }
    
    function getBalance(address _account) constant returns(uint256){ 
       return balances[_account]; 
    }
    
    function userTransfer(address _from, address _to, uint256 _amount, string _memo) returns (bool) {
        if(balances[_from] <= _amount) {
            return false;
        } else if(!hasAccounts[_to]) {
            return false;
        } else {
            transInfo newTrans;
            newTrans.transFrom = _from;
            newTrans.transTo = _to;
            newTrans.amount = _amount;
            newTrans.memo = _memo;
            
            balances[_from] -= _amount;
            balances[_to] += _amount;
            
            return true;
        }
    }
    
    function deposit(address _from, uint256 _amount) payable returns (bool) {
        if(balances[bankAddress] >= _amount) {
            balances[bankAddress] -= _amount;
            balances[_from] += _amount;
            
            return true;
        } else {
            return false;
        }
    }
    
   function withdraw(address _from, uint256 _amount) payable returns (bool){
       //require(balances[msg.sender] >= _amount);
       if(balances[_from] >= _amount) {
            balances[bankAddress] += _amount;
            balances[_from] -= _amount;
            return true;
       } else {
           return false;
       }
   }
}
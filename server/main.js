import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Web3 from 'web3';
const abiDecoder=require('abi-decoder');
Meteor.startup(() => {
  // code to run on server at startup
  console.log('Blockchain Bank Server Start');
});

var bankAddress = "0x68a897c7ea890be1a7b42e4ed861d0b6d2468ce9";
var bankKey = "eth";
var bankGas = 30000;
var transactionGas = {
  from: bankAddress,
  gas: bankGas
};

Users = new Mongo.Collection('users');
Accounts = new Mongo.Collection('accounts');
Transfers = new Mongo.Collection('transfers');
const Transactions = new Mongo.Collection('transactions');

Meteor.publish('myAccounts', function (userId) {
  console.log('myAccounts publish');
  return Accounts.find({
    userId: userId
  });
});

if (typeof web3 != 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var bankContract = web3.eth.contract([
   {
      "constant": true,
      "inputs": [
         {
            "name": "_account",
            "type": "address"
         }
      ],
      "name": "getBalance",
      "outputs": [
         {
            "name": "",
            "type": "uint256"
         }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
   },
   {
      "constant": false,
      "inputs": [
         {
            "name": "_walletAddress",
            "type": "address"
         }
      ],
      "name": "createAccount",
      "outputs": [
         {
            "name": "",
            "type": "bool"
         }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
   },
   {
      "constant": false,
      "inputs": [
         {
            "name": "_from",
            "type": "address"
         },
         {
            "name": "_amount",
            "type": "uint256"
         }
      ],
      "name": "deposit",
      "outputs": [
         {
            "name": "",
            "type": "bool"
         }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
   },
   {
      "constant": false,
      "inputs": [
         {
            "name": "_from",
            "type": "address"
         },
         {
            "name": "_to",
            "type": "address"
         },
         {
            "name": "_amount",
            "type": "uint256"
         },
         {
            "name": "_memo",
            "type": "string"
         }
      ],
      "name": "userTransfer",
      "outputs": [
         {
            "name": "",
            "type": "bool"
         }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
   },
   {
      "constant": false,
      "inputs": [
         {
            "name": "_from",
            "type": "address"
         },
         {
            "name": "_amount",
            "type": "uint256"
         }
      ],
      "name": "withdraw",
      "outputs": [
         {
            "name": "",
            "type": "bool"
         }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
   },
   {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
   }
]).at("0xf47abc7c09289b64be7c4af63200eae1a163eeb8");

var transactionABI=[
  {
     "constant": true,
     "inputs": [
       {
         "name": "_account",
         "type": "address"
       }
     ],
     "name": "getBalance",
     "outputs": [
       {
         "name": "",
         "type": "uint256"
       }
     ],
     "payable": false,
     "stateMutability": "view",
     "type": "function"
  },
  {
     "constant": false,
     "inputs": [
       {
         "name": "_walletAddress",
         "type": "address"
       }
     ],
     "name": "createAccount",
     "outputs": [
       {
         "name": "",
         "type": "bool"
       }
     ],
     "payable": false,
     "stateMutability": "nonpayable",
     "type": "function"
  },
  {
     "constant": false,
     "inputs": [
       {
         "name": "_from",
         "type": "address"
       },
       {
         "name": "_amount",
         "type": "uint256"
       }
     ],
     "name": "deposit",
     "outputs": [
       {
         "name": "",
         "type": "bool"
       }
     ],
     "payable": true,
     "stateMutability": "payable",
     "type": "function"
  },
  {
     "constant": false,
     "inputs": [
       {
         "name": "_from",
         "type": "address"
       },
       {
         "name": "_to",
         "type": "address"
       },
       {
         "name": "_amount",
         "type": "uint256"
       },
       {
         "name": "_memo",
         "type": "string"
       }
     ],
     "name": "userTransfer",
     "outputs": [
       {
         "name": "",
         "type": "bool"
       }
     ],
     "payable": false,
     "stateMutability": "nonpayable",
     "type": "function"
  },
  {
     "constant": false,
     "inputs": [
       {
         "name": "_from",
         "type": "address"
       },
       {
         "name": "_amount",
         "type": "uint256"
       }
     ],
     "name": "withdraw",
     "outputs": [
       {
         "name": "",
         "type": "bool"
       }
     ],
     "payable": true,
     "stateMutability": "payable",
     "type": "function"
  },
  {
     "inputs": [],
     "payable": false,
     "stateMutability": "nonpayable",
     "type": "constructor"
  }
];
abiDecoder.addABI(transactionABI);

Meteor.methods({
  'signUp' : function (info) {
    console.log(info);
    var createdId = Users.findOne({id: info.id});
    if(createdId) {
      return false;
    }
    var result = Users.insert({id: info.id, pw: info.pw, name: info.name, email: info.email});
    if(result) {
      console.log('success3');

      return true;
    } else {
      console.log('error');
      console.log(result.error);

      return false;
    }
  },
  'logIn' : function (info) {
    var user = Users.findOne({id: info.id});

    if(user.pw !== info.pw)
      return false;

    if(user) {
      console.log('success');

      return true;
    } else {
      console.log('error');
      console.log(result.error);

      return false;
    }
  },
  'createAccount' : function (info) {
      var createdAddress = web3.personal.newAccount(info.pw);
      if(web3.personal.unlockAccount(bankAddress, bankKey)) {
        var result = bankContract.createAccount(createdAddress, transactionGas);
        result = Accounts.insert({
          address: createdAddress,
          pw: info.pw,
          balance: 100,
          recentScan: 150,
          userId: info.id
        });

        if(result) {
          console.log('success4');

          return true;
        } else {
          console.log('error');
          console.log(result.error);

          return false;
        }
      } else {
        return false;
      }
  },
  'checkBalance' : function (info) {
    var balance = Accounts.findOne({address: info.address_account}).balance;
    console.log(balance);
    return balance;
  },
  'sendToken' : function (info) {
    var fromAddress = info.fromAddress;
    var toAddress = info.toAddress;
    var tokenAmount = info.tokenAmount;
    var memo = info.memo;
    var date = new Date();

    console.log('in serndToken in server');

    if(web3.personal.unlockAccount(bankAddress, bankKey)) {
      var result = bankContract.userTransfer(fromAddress, toAddress, tokenAmount, memo, {from: bankAddress, gas: bankGas});

      if(result) {
        console.log('success sendToken');
        console.log(result);

        Transfers.insert({
          txId: result,
          accountId: info.userId,
          fromAddress: fromAddress,
          toAddress: toAddress,
          tokenAmount: tokenAmount,
          memo: memo,
          date: date
        });

        var fromAccount = Accounts.findOne({address: fromAddress});
        var toAccount = Accounts.findOne({address: toAddress});
        console.log(toAccount);

        console.log('a'+fromAccount.balance);
        var fromBalance = fromAccount.balance;
        fromBalance = Number(fromBalance) - Number(tokenAmount);

        console.log('b'+toAccount.balance);
        var toBalance = toAccount.balance;
        toBalance = Number(toBalance) + Number(tokenAmount);

        Accounts.update(fromAccount, {$set: {balance: fromBalance}});
        Accounts.update(toAccount, {$set: {balance: toBalance}});

        return true;
      } else {
        console.log('error');
        console.log(result.error);

        return false;
      }
    } else {
      return false;
    }
  },  'deposit' : function(infoa)  {
        var userId = infoa.userId;
        var address = infoa.address;
        var amount = infoa.amount;

        if(web3.personal.unlockAccount(bankAddress, bankKey) == true){
          if(bankContract.deposit(address, amount, {from: bankAddress, gas: 3000000})) {
            var fromAccount = Accounts.findOne({address: address});

            var fromBalance = fromAccount.balance;
            fromBalance = Number(fromBalance) + Number(amount);

            Accounts.update(fromAccount, {$set: {balance: fromBalance}});
            return true;
          }
          else
              return false;
        }

        else
          return false;

  }, 'withdraw' : function(infoa)  {
      var userId = infoa.userId;
      var address = infoa.address;
      var amount = infoa.amount;

      if(web3.personal.unlockAccount(bankAddress, bankKey) == true){
        if(bankContract.withdraw(address, amount, {from: bankAddress, gas: 3000000})) {
          var fromAccount = Accounts.findOne({address: address});

          var fromBalance = fromAccount.balance;
          fromBalance = Number(fromBalance) - Number(amount);

          Accounts.update(fromAccount, {$set: {balance: fromBalance}});

          return true;
        }
        else
            return false;
      }
      else
        return false;
  },
  'transactionScan' : function (info) {
    var account=info.account;
    var userData=Accounts.findOne({'address':account});
    var userBlockNum=userData.recentScan;
    var curBlockNum=web3.eth.blockNumber;
      //if blockNum not same, search recent transaction history
      if (userBlockNum!=curBlockNum){
         for (var i=userBlockNum;i<=curBlockNum;i++){
            var transList=web3.eth.getBlock(i).transactions;
        var transLength=transList.length;
        if (transLength>0){
          for (var j=0;j<transLength;j++){
            var decodeData=abiDecoder.decodeMethod(web3.eth.getTransaction(transList[j]).input);
            //decodeData.name : 함수 이름 (getBalance,createAccount,userdeposit,withdraw)
            //decodeData.params[0].name: 인자 이름(_from, _to, _walletAddress)
            //decodeData.params[0].value: 각 인자에 담긴 값
            if(decodeData!==undefined){
            var func=decodeData.name;
            console.log(func);
            var d=new Date();
            var m = d.getMonth()+1;
            var _time= d.getFullYear().toString()+"-"+m.toString()+"-"+d.getDate().toString()+"-"
            +d.getDate().toString()+"-"+d.getHours().toString()+"-"+d.getMinutes().toString()+"-"
            +d.getMilliseconds().toString();
            switch (func){
              case "userTransfer":
                if(account==decodeData.params[0].value || account==decodeData.params[1].value){
                  result = Transactions.insert({
                    time: _time,
                    txId: transList[j],
                    accountId: account,
                    fromAddress: decodeData.params[0].value,
                    toAddress: decodeData.params[1].value,
                    tokenAmount: decodeData.params[2].value,
                    memo: decodeData.params[3].value
                    });
                }
                  break;
              case "deposit":
                if(account==decodeData.params[0].value){
                  result = Transactions.insert({
                    time: _time,
                    txId: transList[j],
                    accountId: account,
                    fromAddress: "-",
                    toAddress: decodeData.params[0].value,
                    tokenAmount: decodeData.params[1].value,
                    memo: "-"
                    });

                }
                  break;
              case "withdraw":
                if(account==decodeData.params[0].value){
                  result = Transactions.insert({
                    time: _time,
                    txId: transList[j],
                    accountId: account,
                    fromAddress: decodeData.params[0].value,
                    toAddress: "-",
                    tokenAmount: decodeData.params[1].value,
                    memo: "-"
                    });

                }
                  break;
             } // finish switch

          } // finish checking undefined
        }
        curBlockNum=web3.eth.blockNumber;
        }
      }
      // here is update
      Accounts.update({'address':account},{$set:{'recentScan':curBlockNum}});
    }
      ///////////////Get Transaction History from MongoDB///////////////////////
    var transactionHistory=Transactions.find({'accountId':account}).fetch();
    return transactionHistory;
   }

});
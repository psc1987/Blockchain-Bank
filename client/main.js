import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Accounts = new Mongo.Collection('accounts');

let myAccounts;
Template.accounts.onCreated(function accountsOnCreate() {
  getAccounts();


})

// ---- Routes Start -----

// index page road
FlowRouter.route('/', {
  name: 'home',
  action() {
    console.log("index page");
    BlazeLayout.render('main', { content: "index" });
  }
});

// signup page road
FlowRouter.route('/signup', {
  name: 'signup',
  action() {
    console.log("signup page");
    BlazeLayout.render('main', { content: "signup" });
  }
});

// login page road
FlowRouter.route('/login', {
  name: 'login',
  action() {
    console.log("login page");
    BlazeLayout.render('main', { content: "login" });
  }
});

// accounts page road
FlowRouter.route('/accounts', {
  name: 'accounts',
  action() {
    console.log("accounts page");
    BlazeLayout.render('main', { content: "accounts" });
  }
});

// deposit route
FlowRouter.route('/deposit', {
  name: 'deposit',
  action() {
    console.log("deposit page");
    BlazeLayout.render('main', { content: "deposit" });
  }
});
// withdrawal route
FlowRouter.route('/withdrawal', {
  name: 'withdrawal',
  action() {
    console.log("withdrawal page");
    BlazeLayout.render('main', { content: "withdrawal" });
  }
});
// transfer route
FlowRouter.route('/transfer', {
  name: 'transfer',
  action() {
    console.log("transfer page");
    BlazeLayout.render('main', { content: "transfer" });
  }
});
// transfer route
FlowRouter.route('/transactions', {
  name: 'transactions',
  action() {
    console.log("transactions page");
    BlazeLayout.render('main', { content: "transactions" });
  }
});

// ---- Routes End -----


// ---- Template Start -----

// main page
Template.main.events({
  'click .logo': function(){
    FlowRouter.go("/");
  },
  'click .wallet' : function(){
    FlowRouter.go("/accounts");
  },
  "click button[name=logout]" (evt,tmpl){
    Session.set('userId', '');
    Session.set('address', '');
    Session.set('balance', 0);
    FlowRouter.go("/");
  }
});

// index page for signup and login
Template.index.events({
  // signup button
  "click button[name=signup]" (evt,tmpl){
    console.log('clicked signup');
    FlowRouter.go("/signup");
  },
  // login button
  "click button[name=login]" (evt,tmpl){
    console.log('clicked login');
    FlowRouter.go("/login");
  }
});

// sign up
Template.signup.events({
  'click button[name=signUp]'(event, instance) {

    // console.log($('#signup-userId').val());
    // console.log($('#signup-email').val());
    // console.log($('#signup-name').val());
    // console.log($('#signup-password').val());

    var myId = instance.find("input[name=userId]").value;
    var myEmail = instance.find("input[name=email]").value;
    var myName = instance.find("input[name=name]").value;
    var myPw = instance.find("input[name=password]").value;
    console.log(myId);
    console.log(myEmail);
    console.log(myName);
    console.log(myPw);
    // document.getElementById("amountToPay").innerHTML = 'Amount to Pay: ' + '$' + tokenAmount + ' USD';

    var info = {
      id: myId,
      email: myEmail,
      name: myName,
      pw: myPw
    }

    Meteor.call('signUp', info, function (error, result) {
      if(error) {
        console.log(error);
      } else if(result) {
        console.log('success1');
        Meteor.call('createAccount', info, function (error, result) {
          if(error) {
            console.log(error);
          } else if(result) {
            console.log('success2');
            FlowRouter.go("/login");
          } else {
            console.log('Create Account Failed');
          }
        });
      } else {
        console.log('Sign Up failed');
      }
    })

  }
});

// login
Template.login.events({
  'click button[name=logIn]'(event, instance) {

    var myId = instance.find("input[name=id]").value;
    var myPw = instance.find("input[name=password]").value;
    console.log(myId);
    console.log(myPw);

    var info = {
      id: myId,
      pw: myPw
    }

    Meteor.call('logIn', info, function (error, result) {
      if(error) {
        console.log(error);
      } else if(result) {
        console.log('success');
        // Session.set('userId', myId);
        Session.setPersistent('userId', myId);
        FlowRouter.go("/accounts");
      } else {
        console.log('log In failed');
      }
    })

  }
//   "click button[name=logout]" (evt,tmpl){
//     Meteor.logout();
// }
});

// Template.login.onCreated(function loginOncreate() {
//   Session.set('userId', '');
// });

// when logined
Template.main.helpers({
  loginYn(){
    var id = Session.get('userId');
    if(id === '' || id === 'undefined') {
      return false;
    } else {
      return true;
    }
      // return !!Meteor.user();
  }
});

// when logined
Template.index.helpers({
  loginYn(){
    var id = Session.get('userId');
    if(id === '' || id === 'undefined') {
      return false;
    } else {
      return true;
    }
      // return !!Meteor.user();
  }
});

// async function getAccountAddress() {
//   var fromAddressAccount = "";

//   Meteor.subscribe('myAccounts', Session.get('userId'), function () {
//     const myAccounts = Accounts.find({});
//     console.log(myAccounts.count());

//     let count = 0;
//     myAccounts.forEach((account) => {
//       count++;
//       if(count === Accounts.find({}).count()) {
//         fromAddressAccount = account.address;
//       }

//       Session.set('address', fromAddressAccount);
//     })
//   });
// }


async function getAccounts() {
  Meteor.subscribe('myAccounts', Session.get('userId'), function () {
    myAccounts = Accounts.find({});
    console.log(myAccounts.count());

    let count = 0;
    var balance = 0;
    myAccounts.forEach((account) => {
    count++;
    if(count === Accounts.find({}).count()) {
      Session.set('address', account.address);
      Session.set('balance', account.balance);
    }
    console.log(myAccounts);
  })
  });
}

	// 사용자의 계좌들을 select로 만듭니다.
	// function makeSelect() {
	// 	// var list = web3.eth.accounts;
	// 	var select =  document.getElementById('fromAddress1');
	// 	// for(var i = 0; i<list.length; i++){
	// 		var opt=document.createElement('option');
	// 		opt.value = list[i];
	// 		opt.innerHTML = list[i];
	// 		select.appendChild(opt);
	// 	// }
	// }


Template.transfer.helpers({
  address() {
    console.log('get address');
    // getAccountAddress();
    var fromAddressAccount = Session.get('address');
    return fromAddressAccount;
  }
})

Template.deposit.helpers({
  address() {
    console.log('get address deposit');
    // getAccountAddress();
    var fromAddressAccount = Session.get('address');
    return fromAddressAccount;
  }
})

Template.withdrawal.helpers({
  address() {
    console.log('get address withdrawal');
    // getAccountAddress();
    var fromAddressAccount = Session.get('address');
    return fromAddressAccount;
  }
})

// accounts action
// Template.accounts.helpers({
//   address() {
//     console.log('account address');
//     console.log('userId: ' + Session.get('userId'));
//     getAccountAddress();
//     var fromAddressAccount = Session.get('address');

//     console.log('what');
//     console.log(fromAddressAccount);
//     // add address to transfer select bar
//     // var select = document.getElementById('#fromAddress1');
//     // var select = document.querySelector('#fromAddress1');
//     // console.log(select);
//     // var opt = document.createElement('option');
//     // opt.value = fromAddressAccount;
//     // opt.innerHTML = fromAddressAccount;
//     // select.appendChild(opt);

//     return fromAddressAccount;
//   },
//   balance() {
//     console.log('account balance');

//   }
// })


Template.accounts.onCreated(function (){

  var self=this;
  var info={account:Session.get('address')}
  self.myAsyncValue_bal = new ReactiveVar([]);
  Meteor.call('checkBalance',info, function (err, asyncValue) {
      if (err)
          console.log(err);
      else 
          self.myAsyncValue_bal.set(asyncValue);
  });
});

Template.accounts.helpers({
  address() {
    var fromAddressAccount = Session.get('address');
    // add address to transfer select bar
    console.log('what');
    // makeSelect();
    // document.getElementById('opt').innerText = fromAddressAccount;
    return fromAddressAccount;
  },
  accountBalance() {
      return Template.instance().myAsyncValue_bal.get();
    
    // var info = {
    //   address_account: Session.get('address')
    // }
    // Meteor.call('checkBalance', info, function (error, result) {
    //   if(error) {
    //     return 0;
    //   } else {
    //     console.log(result);
    //     return result;
    //   }
    // });
    //return Session.get('balance');
  }
});


// Template.accounts.helpers({
//   address() {
//     var fromAddressAccount = Session.get('address');
//     // add address to transfer select bar
//     console.log('what');
//     // makeSelect();
//     // document.getElementById('opt').innerText = fromAddressAccount;
//     return fromAddressAccount;
//   },
//   accountBalance() {
//     // var info = {
//     //   address_account: Session.get('address')
//     // }
//     // Meteor.call('checkBalance', info, function (error, result) {
//     //   if(error) {
//     //     return 0;
//     //   } else {
//     //     console.log(result);
//     //     return result;
//     //   }
//     // });
//     return Session.get('balance');
//   }
// })


Template.accounts.events({
  // deposit button
  "click button[name=deposit]" (evt,tmpl){
    console.log('clicked deposit');
    FlowRouter.go("/deposit");
  },
  // withdrawal button
  "click button[name=withdrawal]" (evt,tmpl){
    console.log('clicked withdrawal');
    FlowRouter.go("/withdrawal");
  },
  // transfer button
  "click button[name=transfer]" (evt,tmpl){
    console.log('clicked transfer');
    FlowRouter.go("/transfer");
  },
  // transactions button
  "click button[name=transactions]" (evt,tmpl){
    console.log('clicked transactions');
    FlowRouter.go("/transactions");
  }
});

// deposit send button
Template.deposit.events({
  // when clicking 'Deposit' button
  "click button[name=send-deposit]" (evt,tmpl){
    console.log('clicked send deposit');

    /* 템플릿에서 데이터 가져오기 */
    var tokenAmount = tmpl.find("input[type=number]").value;
    document.getElementById("amountToPay").innerHTML = 'Amount to Pay: ' + '$' + tokenAmount + ' USD';
  },

  // when clicking 'pay' button
  "click button[name=pay-deposit]" (evt,tmpl){
    console.log('clicked despoit pay button');

    var infoa = {
      userId: Session.get('userId'),
      address: Session.get('address'),
      amount: tmpl.find("input[type=number]").value
    }

    console.log(tmpl.find("input[type=number]").value);

    Meteor.call('deposit', infoa, function(error, result){
      if (error) {
        console.log(error);
      } else {
        // hide modal
        $('#depositModal')
          .on('hidden.bs.modal', function() {
              FlowRouter.go('/accounts');
          })
          .modal('hide');

          if(result) {
            console.log('deposit success');
            alert('depoist was successed!');
          } else {
            console.log('deposit failed');
            alert('deposit failed');
          }
      }
    });





    // myAccounts.findOne({address: Session.get('tempAddress')});
    // var depositInfo = {
    //   // toAddress: instance.account.get(),
    //   tokenAmount: $('#amountTokens').val(),
    //   password: $('#password').val(),
    //   memo: 'temp'
    // }

    // Meteor.call('depositToken', depositInfo, function (error, result) {
    //   if(error) {
    //     console.log(error);
    //   } else {
    //     console.log('success');
    //   }
    // })
    // BlazeLayout.render('main', { content: "accounts" });

    // issue.. because of using  modal?
    // FlowRouter.go("/accounts");
  }
});
// withdrawal send button
Template.withdrawal.events({
  "click button[name=send-withdrawal]" (evt,tmpl){
    console.log('clicked send withdrawal');

    /* 템플릿에서 데이터 가져오기 */
    var tokenAmount = tmpl.find("input[type=number]").value;
    document.getElementById("amountToGet").innerHTML = 'Amount to Receive: ' + '$' + tokenAmount + ' USD';
  },

  // when clicking receive button
  "click button[name=get-withdrawal]" (evt,tmpl){
    console.log('clicked withdrawal get button');

    var infoa = {
      userId: Session.get('userId'),
      address: Session.get('address'),
      amount: tmpl.find("input[type=number]").value
      }

      Meteor.call('withdraw', infoa, function(error, result){
        if (error) {
          console.log(error);
          alert('error !');
        } else {
          // hide modal
          $('#withdrawalModal')
            .on('hidden.bs.modal', function() {
                FlowRouter.go('/accounts');
            })
            .modal('hide');

          if(result) {
            alert('withdrawal was successed!');
          } else {
            alert('withdrawal failed');
          }


        }
      });
    }



    // myAccounts.findOne({address: Session.get('tempAddress')});
    // var withdrawalInfo = {
    //   // fromAddress: instance.account.get(),
    //   toAddress: $('#toUSDAcc').val(),
    //   tokenAmount: $('#amountTokens').val(),
    //   password: $('#password').val(),
    //   memo: 'temp'
    // }

    // Meteor.call('withdrawalToken', withdrawalInfo, function (error, result) {
    //   if(error) {
    //     console.log(error);
    //   } else {
    //     console.log('success');
    //   }
    // })

    // issue.. because this is modal?
    // FlowRouter.go("/accounts");
});

// transfer send button
Template.transfer.events({
  "click button[name=send-transfer]" (evt,instance){

    var userId = instance.find("input[name=id]").value;

    var info = {
      userId: Session.get('userId'),
      fromAddress: Session.get('address'),//instance.account.get(),
      toAddress: instance.find("input[type=text]").value,
      tokenAmount: instance.find("input[type=number]").value,
      password: instance.find("input[type=password]").value,
      memo: 'temp'
    }

    console.log(instance.find("input[type=number]").value);

    Meteor.call('sendToken', info, function (error, result) {
      if(error) {
        console.log(error);
      } else if(result) {
        console.log('success');
        Session.setPersistent('userId', userId);
        alert('transfer was successed!');
        FlowRouter.go("/accounts");
      } else {
        console.log('Send Token Failed');
      }
    })


  }
});

Template.transfer.onCreated(function transferOnCreated() {
  Meteor.subscribe('myAccounts');
});


// get a list of transactions from MongoDB collection
// Template.transactions.helpers({
//   list(){
//     return ["a"];
//       // Transfer = new Mongo.Collection("transfer");
//       // return Transfer.find({},{ /* limit:10 , */ sort :{name:1}});
//   }
// });

// transactionListItem template




Template.transactions.onCreated(function (){

  var self=this;
  var info={ account: Session.get('address')}
  self.myAsyncValue = new ReactiveVar([]);
  Meteor.call('transactionScan',info, function (err, asyncValue) {
      if (err)
          console.log(err);
      else
          self.myAsyncValue.set(asyncValue);
  });
  });

  // get a list of transactions from MongoDB collection
  Template.transactions.helpers({



    list() {
      console.log(Template.instance().myAsyncValue);
      return Template.instance().myAsyncValue.get();
    }
    // list(){
    //   list1 = [{
    //     time : 'fdafdsa',
    //     txId : 'fdafdsafdsaf',
    //     fromAddress: 'dfdfsdf',
    //     toAddress: 'dfdfsd',
    //     tokenAmount: 'dfsdfdsf'
    //   }]
    //   console.log(list1);
    //   return list1;
    // }
    // Test data format


    // list(){
    //     var info={ account: Session.get('address')}
    //     Meteor.call('transactionScan', info, function(error, result){
    //       if (error){
    //         console.log(error);
    //       } else if (result){
    //         //return result1;
    //       }
    //     })
    //     return result1;
    // //     //return result1;
    // //     // Transfer = new Mongo.Collection("transfer");
    // //     //return Transfer.find({},{ /* limit:10 , */ sort :{name:1}});
    // }
  });



// ---- Template End -----

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
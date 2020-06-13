Template.accounts.onCreated(function accountsOnCreate() {
  getAccounts();

  let count = 0;
  myAccounts.forEach((account) => {
    count++;
    if(count === Accounts.find({}).count()) {
      Session.set('address', account.address);
    }
  })
})

let myAccounts;
async function getAccounts() {
  Meteor.subscribe('myAccounts', Session.get('userId'), function () {
    myAccounts = Accounts.find({});
    console.log(myAccounts.count());
  });
}

Template.accounts.helpers({
  address() {
    var fromAddressAccount = Session.get('address');
    // add address to transfer select bar
    console.log('what');
    makeSelect();
    // document.getElementById('opt').innerText = fromAddressAccount;
    return fromAddressAccount;
  },
  balance() {
    console.log('account balance');
    var balance = myAccounts.findOne({address: Session.get('address')}).balance;
    return balance;
  }
})
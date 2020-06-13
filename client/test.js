import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

Accounts = new Mongo.Collection('accounts');

Template.template_logIn.onCreated(function template_logInOncreate() {
  Session.set('userId', '');
});

Template.template_sendToken.onCreated(function template_sendTokenOnCreated() {
  // Meteor.subscribe('myAccounts');
});

Template.template_sendToken.helpers({

});

Template.template_signUp.events({
  'click button'(event, instance) {
    var info = {
      id: $('#userId1').val(),
      pw: $('#password1').val(),
      name: $('#name1').val(),
      email: $('#email1').val()
    }

    Meteor.call('signUp', info, function (error, result) {
      if(error) {
        console.log(error);
      } else if(result) {
        console.log('success');
      } else {
        console.log('Sign Up failed');
      }
    })
  }
});

Template.template_logIn.events({
  'click button'(event, instance) {
    var userId = $('#userId2').val();

    var info = {
      id: userId,
      pw: $('#password2').val()
    }

    Meteor.call('logIn', info, function (error, result) {
      if(error) {
        console.log(error);
      } else if(result) {
        console.log('success');
        Session.set('userId', userId);
      } else {
        console.log('log In failed');
      }
    })
  }
});

Template.template_createAccount.events({
  'click button'(event, instance) {
    var info = {
      userId: Session.get('userId'),
      pw: $('#password3').val()
    }

    Meteor.call('createAccount', info, function (error, result) {
      if(error) {
        console.log(error);
      } else if(result) {
        console.log('success');
      } else {
        console.log('Create Account Failed');
      }
    })
  }
});

Template.template_sendToken.events({
  'click button'(event, instance) {
    Meteor.subscribe('myAccounts', Session.get('userId'), function () {
      const myAccounts = Accounts.find({});

      let count = 0;
      var fromAddressAccount = "";
      myAccounts.forEach((account) => {
        count++;
        if(count === Accounts.find({}).count()) {
          fromAddressAccount = account.address;
        }
      })

      var info = {
        userId: Session.get('userId'),
        fromAddress: fromAddressAccount,//instance.account.get(),
        toAddress: $('#toAddress').val(),
        tokenAmount: $('#tokenAmount').val(),
        password: $('#password4').val(),
        memo: 'temp'
      }

      Meteor.call('sendToken', info, function (error, result) {
        if(error) {
          console.log(error);
        } else if(result) {
          console.log('success');
        } else {
          console.log('Send Token Failed');
        }
      })
    });
  }
});
/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes EventFire.
function EventFire() {
    this.checkSetup();

    // Shortcuts to DOM Elements.
    this.messageList = document.getElementById('messages');
    this.messageForm = document.getElementById('message-form');
    this.eventTitle = document.getElementById('title');
    this.eventLocation = document.getElementById('location');
    this.eventType = document.getElementById('type');
    this.eventHost = document.getElementById('host');
    this.eventStartDatetime = document.getElementById('startDatetime');
    this.eventEndDatetime = document.getElementById('endDatetime');
    this.eventGuestList = document.getElementById('guest-list');
    this.eventMoreInfo = document.getElementById('more-info');
    this.submitButton = document.getElementById('submit');
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');
    this.signUpEmailPsw = document.getElementById('sign-up-email-psw');
    this.logInEmailPsw = document.getElementById('log-in-email-psw');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');

    // Saves message on form submit.
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    // Toggle for the button.
    //var buttonTogglingHandler = this.toggleButton.bind(this);
    //this.eventTitle.addEventListener('keyup', buttonTogglingHandler);
    //this.eventTitle.addEventListener('change', buttonTogglingHandler);


    this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
EventFire.prototype.initFirebase = function () {
    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    // Initiates Firebase auth and listen to auth state changes.
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Loads chat messages history and listens for upcoming ones.
EventFire.prototype.loadMessages = function () {
    // Reference to the /messages/ database path.
    this.messagesRef = this.database.ref('events');
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    // Loads the last 12 messages and listen for new ones.
    var setMessage = function (data) {
        var val = data.val();
        this.displayMessage(
            data.key,
            val.text, // event title
            val.type,
            val.host,
            val.location,
            val.startDatetime,
            val.endDatetime,
            val.guestList,
            val.moreInfo,
            val.name,
            val.imageUrl);
    }.bind(this);
    this.messagesRef.limitToLast(12).on('child_added', setMessage);
    this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};

// Saves a new message on the Firebase DB.
EventFire.prototype.saveMessage = function (e) {
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (this.eventTitle.value && this.checkSignedInWithMessage()) {
        var currentUser = this.auth.currentUser;
        // Add a new message entry to the Firebase Database.
        this.messagesRef.push({
            name: currentUser.displayName,
            text: this.eventTitle.value,
            location: this.eventLocation.value,
            type: this.eventType.value,
            host: this.eventHost.value,
            startDatetime: this.eventStartDatetime.value,
            endDatetime: this.eventEndDatetime.value,
            guestList: this.eventGuestList.value,
            moreInfo: this.eventMoreInfo.value,
            photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        }).then(function () {
            // Clear message text field and SEND button state.
            EventFire.resetMaterialTextfield(this.eventTitle);
            EventFire.resetMaterialTextfield(this.eventType);
            EventFire.resetMaterialTextfield(this.eventLocation);
            EventFire.resetMaterialTextfield(this.eventHost);
            EventFire.resetMaterialTextfield(this.eventStartDatetime);
            EventFire.resetMaterialTextfield(this.eventEndDatetime);
            EventFire.resetMaterialTextfield(this.eventGuestList);
            EventFire.resetMaterialTextfield(this.eventMoreInfo);
            this.toggleButton();
        }.bind(this)).catch(function (error) {
            console.error('Error writing new message to Firebase Database', error);
        });
    }
};

// Signs-in EventFire.
EventFire.prototype.signIn = function (googleUser) {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

// Signs-out of EventFire.
EventFire.prototype.signOut = function () {
    // Sign out of Firebase.
    this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
EventFire.prototype.onAuthStateChanged = function (user) {
    if (user) { // User is signed in!
        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photoURL;
        var userName = user.displayName;

        // Set the user's profile pic and name.
        this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || '/images/profile_placeholder.png') + ')';
        this.userName.textContent = userName;

        // Show user's profile and sign-out button.
        this.userName.removeAttribute('hidden');
        this.userPic.removeAttribute('hidden');
        this.signOutButton.removeAttribute('hidden');

        // Hide sign-in buttons (both the one for google auth and the one for email/psw auth.
        this.signInButton.setAttribute('hidden', 'true'); // sign in w google
        this.logInEmailPsw.setAttribute('hidden', 'true'); // log in with email/psw
        this.signUpEmailPsw.setAttribute('hidden', 'true'); // sign up with email/psw


    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');

        // Show sign-in button.
        this.signInButton.removeAttribute('hidden');
        this.logInEmailPsw.removeAttribute('hidden'); // log in with email/psw
        this.signUpEmailPsw.removeAttribute('hidden'); // sign up with email/psw
    }
    // We load list of events.
    this.loadMessages();
};

// Returns true if user is signed-in. Otherwise false and displays a message.
EventFire.prototype.checkSignedInWithMessage = function () {
    // Return true if the user is signed in Firebase
    if (this.auth.currentUser) {
        return true;
    }

    // Display a message to the user using a Toast.
    var data = {
        message: 'You must sign in first',
        timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
};

// Resets the given MaterialTextField.
EventFire.resetMaterialTextfield = function (element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
EventFire.MESSAGE_TEMPLATE =
    '<div class="orange message-container demo-card-wide mdl-card mdl-shadow--2dp">' +
    '<div class="spacing"></div>' +
    '<div class="message mdl-card__title text"></div>' +
    '<div class="mdl-card__supporting-text">Type: <span class="type"></span></div>' +
    '<div class="mdl-card__supporting-text">Location: <span class="location"></span></div>' +
    '<div class="mdl-card__supporting-text">Host: <span class="host"></span></div>' +
    '<div class="mdl-card__supporting-text">Start date and time: <span class="startDatetime"></span></div>' +
    '<div class="mdl-card__supporting-text">End date and time: <span class="endDatetime"></span></div>' +
    '<div class="mdl-card__supporting-text">Guests: <span class="guestList"></span></div>' +
    '<div class="mdl-card__supporting-text">Additional Info: <span class="moreInfo"></span></div>' +
    '</div>';

// A loading image URL.
EventFire.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
EventFire.prototype.displayMessage = function (key, text, type, host, location, startDatetime, endDatetime, guestList,  moreInfo) {
    var div = document.getElementById(key);

    // If an element for that message does not exists yet we create it.
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = EventFire.MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        this.messageList.appendChild(div);
    }

    div.querySelector('.text').textContent = text;
    div.querySelector('.type').textContent = type;
    div.querySelector('.location').textContent = location;
    div.querySelector('.host').textContent = host;
    div.querySelector('.startDatetime').textContent = startDatetime;
    div.querySelector('.endDatetime').textContent = endDatetime;
    div.querySelector('.guestList').textContent = guestList;
    div.querySelector('.moreInfo').textContent = moreInfo;

    var messageElement = div.querySelector('.message');


    // Show the card fading-in.
    setTimeout(function () {
        div.classList.add('visible')
    }, 1);
    this.messageList.scrollTop = this.messageList.scrollHeight;
    this.eventTitle.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
//EventFire.prototype.toggleButton = function () {
//    if (this.eventTitle.value) {
//        this.submitButton.removeAttribute('disabled');
//    } else {
//        this.submitButton.setAttribute('disabled', 'true');
//    }
//};

// Checks that the Firebase SDK has been correctly setup and configured.
EventFire.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
        window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
            'actually a Firebase bug that occurs rarely.' +
            'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
            'and make sure the storageBucket attribute is not empty.');
    }
};

window.onload = function () {
    window.eventFire = new EventFire();
};

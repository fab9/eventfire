/**
 * Created by fab9 on 7/4/16.
 */
console.log("Form validation js starts");

$(function () {
    console.log("jquery works");
    var title = document.getElementById('title');
    var type = document.getElementById('type');
    var host = document.getElementById('host');
    var startDatetime = document.getElementById('startDatetime');
    var endDatetime = document.getElementById('endDatetime');
    var guestList = document.getElementById('guest-list');
    var location = document.getElementById('location');
    var moreInfo = document.getElementById('more-info');


    // Remove `is-invalid` classes that MDL adds to each input onload,
    // should be added `onblur` instead (only if input value doesn't pass
    // validation.

        title.parentElement.classList.remove('is-invalid');
        type.parentElement.classList.remove('is-invalid');
        host.parentElement.classList.remove('is-invalid');
        startDatetime.parentElement.classList.remove('is-invalid');
        endDatetime.parentElement.classList.remove('is-invalid');
        guestList.parentElement.classList.remove('is-invalid');
        location.parentElement.classList.remove('is-invalid');
        moreInfo.parentElement.classList.remove('is-invalid');


    // Title input
    title.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Event name is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Must be at least 3 characters.");
            }
        }
    };

    title.onchange = function (e) {
        //e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Event name is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Must be at least 2 characters.");
            }
        }
    };


    // Type input
    type.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Event type is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Must be at least 3 characters.");
            }
        }
    };

    type.onchange = function (e) {
        //e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Event name is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Must be at least 2 characters.");
            }
        }
    };




    // Host input
    host.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Host name is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Host name must be at least 2 characters.");
            }
        }
    };

    host.onchange = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Host name is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Host name must be at least 2 characters.");
            }
        }
    };

    // Guest List input
    guestList.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Guest list name is required.");
            } else if (e.target.value.length < 2) {
                e.target.setCustomValidity("Guest list name must be at least 2 characters.");
            }
        }
    };

    guestList.onchange = function (e) {
        //e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Guest list is required.");
            } else if (e.target.value.length < 2) {
                e.target.setCustomValidity("Guest list must be at least 2 characters.");
            }
        }
    };


    // Location input
    location.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Location is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Location must be at least 3 characters.");
            }
        }
    };

    location.onchange = function (e) {
        //e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("Location is required.");
            } else if (e.target.value.length < 3) {
                e.target.setCustomValidity("Must be at least 2 characters.");
            }
        }
    };



});


const config = {
    host: 'http://localhost:3000'
}

$(document).ready(() => {
    checktoken()
})


function checktoken() {
    const token = localStorage.getItem('token')

    if (token) {
        $('#login-form').hide()
        $('#register-form').hide()
        $('#logo').hide()
        $('#nav-login').hide()
        $('#nav-register').hide()
        $('#nav-logout').show()
        $('#sidebar').show()

    } else {
        $('#nav-logout').hide()
        $('#login-form').show()
        $('#register-form').show()
        $('#logo').show()
        $('#nav-login').show()
        $('#nav-register').show()
        $('#login-form').hide()
        $('#register-form').hide()
        $('#sidebar').hide()
       
    }
}

function displayLogin() {
    $('#login-form').hide()
    $('#register-form').show()
    $('#logo').hide()
}

function displayRegister() {
    $('#login-form').hide()
    $('#register-form').show()
    $('#logo').hide()
}

function register(e) {
    e.preventDefault()
    $.ajax({
        method: 'post',
        url: `${config.host}/register`,
        data: {
            name: $('#register-name').val(),
            email: $('#register-email').val(),
            password: $('#register-password').val()
        }
    })
        .done(user => {
            checktoken()
            localStorage.setItem('token', user.token)
            $('#register-name').val(''),
            $('#register-email').val(''),
            $('#register-password').val('')
            Swal.fire(
                'Registered',
                'Success',
                'success'
              )
        })
        .fail(err => {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
}

function displayLogin() {
    $('#register-form').hide()
    $('#login-form').show()
}

function login(e) {
    e.preventDefault()
    $.ajax({
        method: 'post',
        url: `${config.host}/login`,
        data: {
            email: $('#login-email').val(),
            password: $('#login-password').val()
        }
    })
        .done(user => {
            localStorage.setItem('token', user.token)
            $('#login-email').val('')
            $('#login-password').val('')
            Swal.fire(
                'Logged in',
                'Success',
                'success'
            )
            checktoken()
        })
        .fail(err => {
            console.log(err)
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
}

function onSignIn(googleUser) {
    var googleToken = googleUser.getAuthResponse().id_token;

    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    $.ajax ({
        method: 'POST',
        url: `${config.host}/gsignin`,
        data: {
            id_token: googleToken
        }
    })
    .done(token => {
        localStorage.setItem('token', token)
        checktoken()
    })
    .fail(err => {
        console.log(err)
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        })
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem('token')
        Swal.fire(
            'Logged out',
            'Success',
            'success'
        )
        $('#login-form').show()
        checktoken()
    });
}
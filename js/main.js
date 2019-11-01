const config = {
    host: 'http://localhost:3000'
}

$(document).ready(() => {
    checktoken()
    currentStock()
    $('#chart_div').hide()
    $('#7days').on('click', function (event) {
        historyOneComp()
        event.preventDefault()
        $('#chart_div').show()
    })
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

    } else {
        $('#nav-logout').hide()
        $('#login-form').show()
        $('#register-form').show()
        $('#logo').show()
        $('#nav-login').show()
        $('#nav-register').show()
        $('#login-form').hide()
        $('#register-form').hide()

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

    $.ajax({
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


function currentStock() {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Price', 'Open', 'Current', 'Day High', 'Day Low',
                'W High', '', {
                    role: 'annotation'
                }
            ],
            ['Apple Inc', 248.76, 247.24, 248.76, 249.17, 243.26, 249.75, ''],
            ['Microsoft', 143.37, 144.90, 143.37, 144.93, 143.03, 145.67, ''],
            ['HSBC Holdings', 583, 587.40, 583, 587.40, 579.70, 687.70, ''],
            ['Snap Inc', 15.06, 14.82, 15.06, 15.17, 14.55, 18.36, ''],
            ['Twitter Inc', 29.97, 29.47, 29.97, 29.98, 28.84, 45.86, '']
        ]);

        var options = {
            width: 600,
            height: 400,
            legend: {
                position: 'top',
                maxLines: 3
            },
            bar: {
                groupWidth: '75%'
            },
            isStacked: true
        };
        var chart = new google.visualization.BarChart(document.getElementById("chart_container"));
        chart.draw(data, options);
    }
}

function historyOneComp() {
    google.charts.load('current', {
        'packages': ['line']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Day');
        data.addColumn('number', 'Apple Inc');
        data.addColumn('number', 'Microsoft Crops');
        data.addColumn('number', 'HSBC Holdings');
        data.addColumn('number', 'Twitter Inc');
        data.addColumn('number', 'Snap Inc');

        data.addRows([
            [1, 247.24, 583.00, 143.37, 15.06, 29.97],
            [2, 244.76, 582.50, 112.37, 17.06, 35.97],
            [3, 147.97, 372.50, 234.37, 51.06, 88.16],
            [4, 298.42, 452.50, 82.37, 5.00, 65.77],
            [5, 243.16, 592.50, 142.00, 72.06, 40.97],
            [6, 244.51, 602.50, 139.37, 14.06, 12.97],
        ]);

        var options = {
            chart: {
                title: 'Currrent Stock Price',
                subtitle: 'USD'
            },
            width: 900,
            height: 300
        };

        var chart = new google.charts.Line(document.getElementById('chart_div'));

        chart.draw(data, google.charts.Line.convertOptions(options));
    }
}
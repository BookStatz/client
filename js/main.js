const config = {
  host: 'http://localhost:3000'
}

$(document).ready(() => {
  checktoken()

  // $('#news').hide()
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
    $('#bookmarks').hide()
    $('#events').hide()
    $('#7days').hide()
    displayNews()
    getNews()

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
    $('#bookmarks').hide()
    $('#news').hide()
    $('#chart_div').hide()
    $('#7days').hide()
    $('.chart').hide()
    $('#events').hide()
  }
}

function displayLogin() {
  $('#login-form').show()
  $('#register-form').hide()
  $('#logo').hide()
}

function displayRegister() {
  $('#login-form').hide()
  $('#register-form').show()
  $('#logo').hide()
}

function displayBookmarks() {
  displayNewsBookmarks()
  $('#bookmarks').show()
  $('#news').hide()
  $('#chart_div').hide()
  $('#7days').hide()
  $('.chart').hide()
  $('#events').hide()
}

function displayNews() {
  $('#news').show()
  $('#chart_div').hide()
  $('#events').hide()
  $('#bookmarks').hide()
  $('#7days').hide()
  $('.chart').hide()
  getNews()
}

function displayEvents() {
  $('#chart_div').hide()
  $('#7days').hide()
  $('.chart').hide()
  $('#events').show()
  $('#bookmarks').hide()
  $('#news').hide()
  getEvents()
}

function displayStock() {
  $('#news').hide()
  $('#events').hide()
  $('#bookmarks').hide()
  currentStock()
  $('#chart_div').show()
  $('.chart').show()
  $('#7days').show()
  $('#7days').on('click', function (event) {
      historyOneComp()
      event.preventDefault()
      $('#chart_div').show()
  })
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
      getNews()
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

// News functions

function getNews() {
  return $.ajax({
    url: 'http://localhost:3000/news/top-headlines',
    method: 'get'
  })
    .done(news => {
      news.articles.forEach(article => {
        let params = {
          title: article.title,
          desc: article.description,
          imgSrc: article.urlToImage,
          date: article.publishedAt,
          source: article.source.name,
          link: article.url
        }
        $("#news #headlines-default").append(renderNews(params))
      })
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

function searchNews(event) {
  event.preventDefault()
  let query = $("#news #search").val()
  getSearchedNews(query)
}

function getSearchedNews(query) {
  return $.ajax({
    url: `http://localhost:3000/news/search/${query}`,
    method: 'get'
  })
    .done(news => {
      $("#news #header").text('Search result')
      $("#news #headlines-default").hide()
      news.articles.forEach(article => {
        let params = {
          title: article.title,
          desc: article.description,
          imgSrc: article.urlToImage,
          date: article.publishedAt,
          source: article.source.name,
          link: article.url
        }
        $("#news #headlines-searched").append(renderNews(params))
      })
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

function renderNews(params) {
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  let rendering =
    `
    <div id="news-card">
      <div class="card m-3 shadow" style="width: 100%; margin: 2% auto !important;">
        <img id="news-img" src="${params.imgSrc}" class="card-img-top" alt="..."></img>
        <div class="card-body">
          <h5 class="card-title">${params.title}</h5>
          <p class="card-text">${params.desc}</p>
          <p class="card-text">${new Date(params.date).toLocaleDateString('id-ID', options)}</p>
          <center><button onclick="addNews('${params.title}', '${params.desc}', '${params.imgSrc}')" type="button" class="btn btn-success">Add to Bookmarks</button> <a href="${params.link}" class="btn btn-primary">Details</a></center>
        </div>
      </div>
    </div>
  
  `
  return rendering
}

function addNews(title, desc, img) {
  const token = localStorage.getItem('token')

  $.ajax({
    method: 'post',
    url: `${config.host}/bookmarks/news`,
    data: {
      title: title,
      description: desc,
      img: img
    },
    headers: { token }
  })
    .then(result => {
      Swal.fire(
        'Added to Bookmarks',
        'Success',
        'success'
      )
    })
    .catch(err => {
      console.log(err)
    })
}

function removeNews(id) {
  const token = localStorage.getItem('token')

  $.ajax({
    method: 'delete',
    url: `${config.host}/bookmarks/news/${id}`,
    headers: { token }
  })
    .then(result => {
      displayNewsBookmarks()
      Swal.fire(
        'Removed from Bookmarks',
        'Success',
        'success'
      )
    })
    .catch(err => {
      console.log(err)
    })
}

function displayNewsBookmarks() {
  const token = localStorage.getItem('token')
  $('#news-fav').empty()

  $.ajax({
    method: 'get',
    url: `${config.host}/bookmarks/news`,
    headers: {token}
  })
    .then(result => {
      console.log(result)
      for (let i = 0; i < result.length; i++) {
        $('#news-fav').prepend(`
        <center>
        <div id="news-1" class="card" style="width: 45rem;">
          <img src="${result[i].img}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${result[i].title}</h5>
            <p class="card-text">${result[i].description}</p>
            <a href="#" onclick="removeNews('${result[i]._id}')" class="btn btn-danger">Remove</a>
          </div>
        </div>
        </center> <br><br>
        `)
      }
      
    })
}

// Events

function getEvents() {
  $("#events #headlines-default2").empty()
  return $.ajax({
    url: `http://localhost:3000/eventbrite/categories`,
    method: 'get'
  })
    .done(data => {
      data.categories.forEach(event => {
        console.log("ini events");
        
        let params = {
          title: event.name,
          link: event.resource_uri
        }
        $("#events #headlines-default2").append(renderEvents(params))
      })
    })
    .fail(err => {
      console.log(err)
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Your rate is limited!'
      })
    })
}

function searchEvent(event) {
  event.preventDefault()
  let query = $("#events #search").val()
  getSearchedEvent(query)
}

function getSearchedEvent(query) {
  return $.ajax({
    url: `http://localhost:3000/eventbrite/name`,
    method: 'get',
    data: {
      query: query
    }
  })
    .done(data => {
      $("#events #header").text('Search results')
      $("#events #headlines-default2").hide()
      data.events.forEach(event => {
        let params = {
          title: event.name.text,
          desc: event.description.text,
          startDate: event.start.utc,
          endDate: event.end.utc,
          link: event.url,
        }
        $("#events #headlines-searched").append(renderSearchedEvents(params))
      })
    })
    .fail(err => {
      console.log(err)
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Your rate is limited!'
      })
    })
}

function renderEvents(params) {
  let rendering =
    `
    <center>
  <div class="card m-3 shadow" style="width: 100%; margin: 2% auto !important;">
      <div class="card-body">
        <h5 class="card-title">${params.title}</h5>
        <a href="${params.link}" class="btn btn-primary">Details</a>
      </div>
  </div>
  </center>
  
  `
  return rendering
}

function renderSearchedEvents(params) {
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  let rendering =
    `
    <center>
  <div class="card m-3 shadow" style="width: 100%; margin: 2% auto !important;">
      <div class="card-body">
        <h5 class="card-title">${params.title}</h5>
        <p class="card-text">${params.desc}</p>
        <p class="card-text">${new Date(params.startDate).toLocaleDateString('id-ID', options)} - ${new Date(params.endDate).toLocaleDateString('id-ID', options)}</p>
        <a href="${params.link}" class="btn btn-primary">Details</a>
      </div>
  </div>
  </center>
  
  `
  return rendering
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
const config = {
  host: 'http://localhost:3000'
}

$(document).ready(() => {
  checktoken()
  $('#news').hide()
  $('#events').hide()
})


function checktoken() {
  const token = localStorage.getItem('token')

// function displayLogin() {
//     $('#login-form').show()
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

// News functions

function displayNews() {
  $('#news').show()
  getNews()
}

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
      $("#news #header").text('Hasil Pencarian')
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
  <div class="card m-3 shadow" style="width: 100%; margin: 2% auto !important;">
      <img src="${params.imgSrc}" class="card-img-top" alt="..."></img>
      <div class="card-body">
        <h5 class="card-title">${params.title}</h5>
        <p class="card-text">${params.desc}</p>
        <p class="card-text">${new Date(params.date).toLocaleDateString('id-ID', options)}</p>
        <a href="${params.link}" class="btn btn-primary">Tautan artikel</a>
      </div>
  </div>
  
  `
  return rendering
}

// Events

function displayEvents() {
  $('#events').show()
  getEvents()
}

function getEvents() {
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
        $("#events #headlines-default").append(renderEvents(params))
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
      $("#events #header").text('Hasil Pencarian')
      $("#events #headlines-default").hide()
      data.events.forEach(event => {
        let params = {
          title: event.name.text,
          imgSrc: event.logo.url,
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
  <div class="card m-3 shadow" style="width: 100%; margin: 2% auto !important;">
      <div class="card-body">
        <h5 class="card-title">${params.title}</h5>
        <a href="${params.link}" class="btn btn-primary">Tautan</a>
      </div>
  </div>
  
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
  <div class="card m-3 shadow" style="width: 100%; margin: 2% auto !important;">
      <img src="${params.imgSrc}" class="card-img-top" alt="..."></img>
      <div class="card-body">
        <h5 class="card-title">${params.title}</h5>
        <p class="card-text">${params.desc}</p>
        <p class="card-text">${new Date(params.startDate).toLocaleDateString('id-ID', options)} - ${new Date(params.endDate).toLocaleDateString('id-ID', options)}</p>
        <a href="${params.link}" class="btn btn-primary">Tautan artikel</a>
      </div>
  </div>
  
  `
  return rendering
}
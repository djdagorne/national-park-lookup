'use strict';

const apiKey = 'fYiToeDaKUPFtZY4zUX9cVb5ZXMDTMkmlsUmEU6q'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function displayResults(responseJson, maxResults) {
    console.log('displaying results based on ' + responseJson)
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++){
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <p>Street Address: ${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}</p>
        <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
        </li>`
      )};
    $('#results').removeClass('hidden');
  };

function formatQueryParams(params) { //turning an object of key:value pairs into an array, then formatting it into a GET request
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getNationalParks(searchStates, maxResults){ //fetching the data using a formatted url
    const params = {
        api_key: apiKey,
        stateCode: searchStates,
        limit: maxResults,
        fields: 'addresses'
    }

    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    console.log('searching for this url= ' + url);

    fetch(url)
      .then(response => {        
          return response.json();
        // if (response.ok) {
        //   console.log('response is ok')
        //   return response.json();
        // }
      })
      .then(responseJson =>{
        
        if(responseJson.total>0) {
          console.log(responseJson);
          $('#js-error-message').empty();
          displayResults(responseJson, maxResults);
          //results formatted, now to display
        }else{
        $('#results').addClass('hidden');
        $('#results-list').empty();
        throw new Error('no results found');
        }
      })
      //.then(responseJson => displayResults(responseJson, maxResults))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchStates = $('#js-search-states').val();
      const maxResults = $('#js-max-results').val();     
      getNationalParks(searchStates, maxResults);
    });
  }
  
  $(watchForm);
function fetchCountries (searchQuery) { 
    return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
 }

export default fetchCountries;
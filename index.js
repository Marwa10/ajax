
// Name: Marwa Elatrache
// Date: 10/31/2018
// Section: AK
// this is the index.js page, it is used to modify DOM element and handle event listener
//



(function() {
  "use strict";
  const NASA_URL = "https://images-api.nasa.gov/search?keywords=galaxy&media_type=image&title=star";
  const DICTIONARY_URL= "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
  const KEY = "fa001811-0cac-4294-8daf-93edde8f116f";
  let object = null;
  let object2= null;
  let word ="";


  /**
  *Add a function that will be called when the window is loaded.
  */
  window.addEventListener("load", initialize);

  /**
    *  Initialize the page by adding the click event to the search button
    *  then show the dictionary.
    */
  function initialize() {
    fetchImages();
    $("dictionary").classList.add("hidden");
    $("search").addEventListener("click",showSection);
  }

  /**
   * this function fetch the all the images dispalyed on the page using AJAX fetch
   */
  function fetchImages(){
    fetch(NASA_URL,{mode : "cors"})
    .then(checkStatus)
    .then(JSON.parse)
    .then(implementData)
    .catch(console.log);
  }

  /**
   *  Once the fetch returns (from the checkStatus and JSON.parse), it arrives here
   *  to populate the page with the images.
   * @param {object} json object, already converted to an Object
   */
  function implementData(json){
    object = json.collection.items;
    for(let i =0; i < object.length; i++){
      let container = document.createElement("div");
      let img = document.createElement("img");
      img.src =json.collection.items[i].links[0].href;
      container.id=i;
      container.appendChild(img);
      $("images").appendChild(container);
      container.addEventListener("click", showInfo);
    }
  }

  /**
   * Display the description if an image is clicked
   */
  function showInfo(){
    this.removeEventListener("click", showInfo);
    let title = document.createElement("h2");
    let description = document.createElement("p");
    title.innerText= object[parseInt(this.id)].data[0].title;
    description.innerHTML=object[parseInt(this.id)].data[0].description;
    this.appendChild(title);
    this.appendChild(description);
    hideImg(this.id);
  }

  /**
   Function to hide all the images except the one clicked
   *  @param {string} a's id
   */
  function hideImg(a){
    let imgId = qsa("div");
    for (let i = 0; i< imgId.length; i++){
      if(imgId[i].id !== a){
        imgId[i].classList.add("hidden");
      }
    }
  }

  /**
   * Once the search button is clicked, the search bar is revealed
   */
  function showSection(){
    $("dictionary").classList.remove("hidden");
    $("images").classList.add("hidden");
    $("btn-search").addEventListener("click", searchDictionary);
  }

  /**
   * this function fetch the definition of the word typed
   */
  function searchDictionary (){
    word= $("word-container").value;
    fetch(DICTIONARY_URL+word+"?key="+KEY+"&keyword=main headword" , {mode : "cors"})
    .then(checkStatus)
    .then(JSON.parse)
    .then(implementDefinition)
    .catch(console.log);
  }

  /**
   *  Once the fetch returns (from the checkStatus and JSON.parse), it arrives here
   *  to populate the page with the definitions.
   * @param {object} json object, already converted to an Object
   */
  function implementDefinition(json){
    object2= json[0].shortdef;
    let definition = document.createElement("p");
    definition.innerText= word+" : "+object2;
    $("dictionary").appendChild(definition);

  }
  
  function handleError(error){
    if (error.status <= 200 && error.status > 300 || error.status !== 0) {
       return new Error(error.status + ": " + error.statusText);
	}
  }

  /**
  * Returns the element that has the ID attribute with the specified value.
  * @param {string} id - element ID
  * @returns {object} DOM object associated with id.
  */
  function $(id) {
    return document.getElementById(id);
  }


  /**
  * Returns the array of elements that match the given CSS selector.
  * @param {string} query - CSS query selector
  * @returns {object[]} array of DOM objects matching the query.
  */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status == 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();

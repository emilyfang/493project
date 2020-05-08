var resultheader = new Vue({
  el: '#rapp',
  data: {

  },
  methods : {
    goHome: function() {
      window.location="index.html"
    }
  }

})
var resultsView = new Vue({
  el: "#app-results",
  data: {
  	params: {},
    results:[],
    numPages:0,  //maxOffset
    currentOffset:0,
    recipeData:[],
    readyState:true,

    numShowingResults:0,
    totalNumResults:0,

  },



  methods: {
    hello(){
      alert('e')
      var info_storage = JSON.parse(window.localStorage.getItem("info"));
      this.params = info_storage
      console.log(info_storage)
      console.log(this.params.includeIngredients)



      this.getSearchResults()
    }, 

    getURL: function getAPIURL(pageOffset){ 
      var url = 'https://api.spoonacular.com/recipes/complexSearch?'
      var encoded_q = ''

      //includeIngredients - csv - url in form of apple,+pear,+grape
      if (this.params.includeIngredients != ''){
        encoded_q = this.encode('includeIngredients', this.params.includeIngredients)
        url += encoded_q
      }
      if (this.params.excludeIngredients != ''){ 
        encoded_q = this.encode('excludeIngredients', this.params.excludeIngredients)
        url += encoded_q
      }
      if (this.params.intolerances != ''){
        encoded_q = this.encode('intolerances', this.params.intolerances)
        url += encoded_q
      }

      if (this.params.type != ''){ 
        encoded_q = this.encode('type', this.params.type)
        url += encoded_q
      }

      if (this.params.maxReadyTime){ 
        url +=  'maxReadyTime=' + this.params.maxReadyTime.toString() +'&'
      }


      if (this.params.maxCalories){ 
        url +=  'maxCalories=' + this.params.maxReadyTime.toString() +'&'
      }

      if (this.params.difficulty === 'Easy'){
        url += 'sort=time&'
        url += 'sortDirection=asc&'
      }
      else if (this.params.difficulty === 'Medium'){
        url += 'sort=popularity&'
        url += 'sortDirection=desc&'
      }
      else if (this.params.difficulty === 'Hard'){
        url += 'sort=time&'
        url += 'sortDirection=desc&'
      }

      //default params
      url += 'instructionsRequired=True&'

      // paging 0-990
      url += 'offset=' + pageOffset.toString()
      //Num results - max is 10
      url += '&number=10&'


      //If no user does not put in any search parameters, aka url === below
      if (url ===  "https://api.spoonacular.com/recipes/complexSearch?instructionsRequired=True&offset=0&number=10&"){
        // Return url that sorts by popularity desc
        url += 'sort=popularity&'
        url += 'sortDirection=desc&'

      }

      console.log(url)

      url += 'apiKey=e04e7de7138d45fd885a201c1d05a5b8'


      return url
    },


    encode: function getEncodedURI_csv(q, param){ 
      var encoded_url = q + '='
      var l = param
      if (typeof param === 'string'){
        l = param.split(',')
      }
 
      for (i in l){
          l[i] = l[i].trim()
          console.log(i)
          if (i==0){
            encoded_url += encodeURIComponent(l[i])
          }
          else{
            encoded_url += '+' + encodeURIComponent(l[i])
          }
          
      }
      encoded_url += '&'
      return encoded_url
    },

    getSearchResults(pageOffset = 0){
      console.log(pageOffset)
      var url = this.getURL(pageOffset)
      console.log(url)
      axios
        .get(url)
        .then(response => {
          console.log(response.data)
          console.log(pageOffset)
          //first page of results 
          if (pageOffset == 0) { 
            this.results = response.data.results
           

            this.getRecipeInfo(this.results)
          }
          //infinite scroll - add more results
          else{
            this.results = this.results.concat(response.data.results)
           
            this.getRecipeInfo(response.data.results)

          }

          this.numShowingResults = this.results.length

          console.log("number of total results:")
          console.log(response.data.totalResults)
          this.numPages = response.data.totalResults / 10 //also maxOffset
          this.totalNumResults = response.data.totalResults
          console.log('number of pages:')
          console.log(this.numPages)
          
        })
        .catch(error => console.log(error))
    },



    //Fill the card with meta-data
    getRecipeInfo(results){ 

      console.log(results)

      //compile list of all ids
      id_list = []
      for (i in results){
        id_list.push(this.results[i].id.toString())
      }
      console.log(id_list)
      console.log('end')
      var url_param = id_list.join(',')
      var recipeBulk_url = 'https://api.spoonacular.com/recipes/informationBulk?ids=' + url_param
      //recipeBulk_url += '&apiKey=a842b40a14b8445ca1c087bc0f8f395b'
      recipeBulk_url += '&apiKey=e04e7de7138d45fd885a201c1d05a5b8'
      console.log(recipeBulk_url)

      axios
        .get(recipeBulk_url)
        .then(response => {
          console.log(response.data)

          this.recipeData= this.recipeData.concat(response.data)

          this.readyState = false

          //@@@ Use this to stop making all the api calls. Step(1)
          // window.localStorage.setItem("recipeData", JSON.stringify(this.recipeData))
          // window.localStorage.setItem("results", JSON.stringify(this.results))
          //@@@
        })
        .catch(error => console.log(error))

    },


    gotoRecipe(recipeData){

      window.localStorage.setItem("recipeInfo", JSON.stringify(recipeData))

      //Change this.  
      window.location.href="feelingLucky/detailPage/index.html"





    },


    scroll(){
      window.onscroll = () => {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

      if (bottomOfWindow) {
    // Do something, anything!
        if (this.currentOffset != this.numPages){
          this.currentOffset += 1
          this.getSearchResults(this.currentOffset)
        }
        
      }
    };




    },
  },

  created(){ 
        var info_storage = JSON.parse(window.localStorage.getItem("info"));
        this.params = info_storage
        this.results = []
        this.recipeData = []
        this.currentOffset = 0
        this.totalNumResults = 0


        //@@@Use this to stop making all api calls. Step(2)
        // this.recipeData = JSON.parse(window.localStorage.getItem("recipeData"))
        // this.results = JSON.parse(window.localStorage.getItem("results"))
        // this.readyState = true
        //@@@


        // comment this out to stop making api calls Step(1)
        this.getSearchResults()

        console.log(this.recipeData)
        
  },

  mounted(){
    console.log('mounted')
    this.scroll()

  },

});

var resultView = new Vue({
    el: '#feelingLucky',
    data: {
      randomRecipe: [],
    },
    methods: {
      reroll: function() {
        window.location.reload()
      },
      goHome: function() {
        window.location="../index.html"
      },
      fullDetails: function(){
        window.localStorage.setItem("recipeInfo", JSON.stringify(this.randomRecipe))
        var info_storage = JSON.parse(window.localStorage.getItem("recipeInfo"));
        console.log(info_storage)
        window.location="detailPage/index.html"
      }
    },
    created(){
      axios
        .get('https://api.spoonacular.com/recipes/random?apiKey=' + '04db686779414126864696f0e0dfa534')
        .then(response => {
          console.log(response)
          this.randomRecipe = response.data.recipes[0]
        })
        .catch(error => console.log(error))
    }
  })
  
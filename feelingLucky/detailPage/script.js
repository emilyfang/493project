let timerSetup = {
	template:`
	<form>
		 <label for="min">Minutes<br />
		 <input type="number" v-model="minutes" name="time_m" id="min" min="0" max="59">
		 </label>
		 <label for="sec">Seconds<br />
			  <input type="number" v-model="seconds" name="time_s" id="sec" max="59" min="0">
		 </label>
		 <button type="button" @click="sendTime">Set time</button>
	</form>`,
	data () {
		 return {
			  minutes:0,
			  seconds:0
		 }
	},
	methods: {
		 sendTime() {
			  this.$emit('set-time', {minutes:this.minutes, seconds:this.seconds})
		 }
	}
}

let Timer = {
	template: `
		 <div class="timer">{{ time | prettify }}</div>
	`,
	props:['time'],
	filters: {
		 prettify : function(value) {
			  let data = value.split(':')
			  let minutes = data[0]
			  let seconds = data[1]
			  if (minutes < 10) {
					minutes = "0"+minutes
			  }
			  if (seconds < 10) {
					seconds = "0"+seconds
			  }
			  return minutes+":"+seconds
		 }
	}
}

var resultView = new Vue(
{
    el: "#detailsPage",
    components: {
        'timer-setup':timerSetup,
        'timer':Timer
   },
    data: {
        result: JSON.parse(window.localStorage.getItem("recipeInfo")),
        isRunning: false,
		minutes:0,
		seconds:0,
		time:0,
		timer:null,
		sound:new Audio("sound.mp3")
    },
    computed: {
		prettyTime () {
			 let time = this.time / 60
			 let minutes = parseInt(time)
			 let seconds = Math.round((time - minutes) * 60)
             return minutes+":"+seconds
        }
	},
    methods: {
        goHome: function() {
            console.log(this.result)
            window.location="../../index.html"
        },
        launchYoutube: function() {
            var link = "https://www.youtube.com/results?search_query=" + this.result.title
            window.open(link, "_blank")
        },
        start () {
            this.isRunning = true
            if (!this.timer) {
                 this.timer = setInterval( () => {
                       if (this.time > 0) {
                            this.time--
                       } else {
                            clearInterval(this.timer)
                            this.sound.play()
                            this.reset()
                       }
                 }, 1000 )
            }
        },
        stop () {
            this.isRunning = false
            clearInterval(this.timer)
            this.timer = null
        },
        reset () {
             this.stop()
             this.time = 0
             this.seconds = 0
             this.minutes = 0
        },
        setTime (payload) {
            this.time = (payload.minutes * 60 + payload.seconds)
        }
    }
})
<template>
    <nav>
      <router-link to="/">Home</router-link>
      <button @click="logout">Uitloggen</button>
    </nav>
    <div class="body">
      <!-- MY DESIGNS -->
      <section class="card">
        <div class="flex2">
            <h2>My designs</h2>
          <p v-if="myBags.length < 5 && myBags.length > 0">
            <button class="cta" @click="goToConfigurator">
              Design your Lays!
            </button>
          </p>
        </div>
         <p class="text">Welcome {{ user?.name || 'Guest' }} <br> You can create up to 5 designs!</p>
         <div v-if="myBags.length === 0">
          <button class="cta" @click="goToConfigurator">
              Design je eigen chipszak!
            </button>
          </div>

        <div v-if="myBags.length > 0">
        <div class="scroll">
      <div class="carousel">
        <div class="bag-card-my" v-for="bag in myBags" :key="bag._id" :style="getBagBackground(bag)">
          <div class="bag-float">
             <BagPreview :bag="bag"/>
          </div>
          <button class="trash" @click="deleteBag(bag._id)">
            <img src="/assets/trash-2.svg" alt="">
          </button>
        </div>
      </div>
    </div>
        </div>
      </section>
  
      <!-- ALL DESIGNS -->
      <section class="card">
        <h2 class="tweedetitel">Alle designs</h2>
        <p class="text" style="margin-top: 10px">You can like up to 3 designs!</p>

        <div class="scroll">
      <div class="carousel">
        <div class="bag-card" v-for="bag in allBags" :key="bag._id" :style="getBagBackground(bag)">
          <div class="bag-float">
            <BagPreview :bag="bag" />
            </div>
            <div class="madeby">
                <p>Made by {{ bag.user?.name || 'Unknown' }}</p>
              <div class="madeflex">
                <span>{{ bag.votes || 0 }} 👍</span>
                <button class="vote" @click="vote(bag)">
                  {{ bag.hasVoted ? "unvote" : "vote" }}
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
      </section>
    </div>
  </template>
  
  <script>
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  import BagPreview from "../components/BagPreview.vue";
  import { io } from "socket.io-client"
  const socket = io(import.meta.env.VITE_API_BASE_URL, {
  transports: ["websocket", "polling"]
})


export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      myBags: [],
      allBags: []
    }
  },
  components: {
  BagPreview
},

  async mounted() {
    if (!this.user) {
    this.$router.push("/login")
    return
  }

    await this.fetchMyBags()
    await this.fetchAllBags()

    // SOCKET.IO SETUP
    socket.on("connect", () => {
      console.log("Connected to socket.io server")
    })
    socket.on("vote:update", ({ bagId, votes, voters }) => {
  const userId = this.user._id

  const bag = this.allBags.find(b => b._id === bagId)
  if (bag) {
    bag.votes = votes
    bag.hasVoted = voters.includes(userId)
  }

  const mine = this.myBags.find(b => b._id === bagId)
  if (mine) mine.votes = votes
})

  },
  beforeUnmount() {
  socket.off("vote:update")
},
  methods: {
    async fetchMyBags() {
      const res = await fetch(`${API_URL}/api/v1/bag/mine`, {
        credentials: "include"
      })
      if (res.status === 401) {
    this.logout()
    return
  }
      if (res.ok) this.myBags = await res.json()
    },

    async fetchAllBags() {
      const res = await fetch(`${API_URL}/api/v1/bag`, {
        credentials: "include"
      })
      if (!res.ok) return

      const bags = await res.json()

      this.allBags = bags.map(bag => ({
        ...bag,
        votes: bag.votes || 0,
        hasVoted: false
      }))
    },
    
    vote(bag) {
  socket.emit("vote", {
    bagId: bag._id,
    userId: this.user._id,
    action: bag.hasVoted ? "unvote" : "vote"
  })

  bag.hasVoted = !bag.hasVoted
}

,
    async deleteBag(bagId) {
      const res = await fetch(`${API_URL}/api/v1/bag/${bagId}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!res.ok) return

      this.myBags = this.myBags.filter(b => b._id !== bagId)
      this.allBags = this.allBags.filter(b => b._id !== bagId)
    },

    logout() {
      localStorage.removeItem("user")
      this.$router.push("/login")
    },

    goToConfigurator() {
      window.location.href = "https://lays-configurator-vert.vercel.app/"
    },

    getBagBackground(bag) {
      if (bag.backgroundImage) {
        return {
          backgroundImage: `url(${bag.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      }

      if (bag.backgroundPreset) {
        return {
          backgroundImage: `url(assets/${bag.backgroundPreset}-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      }

      return { backgroundColor: bag.backgroundColor || "#05060a" }
    }
  }
}
</script>

<style scoped>
    .card {
      padding: 40px;
      font-family: Arial, Helvetica, sans-serif;
      padding: 10px;
    }

    router-link {
      text-decoration: none;
      color: black;
    }
    
    .scroll {
        overflow-x: scroll;
        padding-top: 50px;
    }
    
    h2 {
      margin: 0px;
      font-size: 22px;
      color: #d50e0e;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
    }

    .tweedetitel {
      padding-top: 20px;
    }

    .madeby {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.9em;
      flex-direction: column;
      position: absolute;
      bottom: 10px;
      width: 95%;
    }
    
    .madeby p {
      font-weight: bold;
    }

    .madeflex {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 3px;
    }
    
    .trash {
      width: 40px;
      height: 40px;
      position: absolute;
      right: 15px;
      z-index: 999999;
      background: linear-gradient(135deg, #ffcc00, #ff9900);
      border: none;
      color: white;
      padding-top: 5px;
      border-radius: 999px;
      cursor: pointer;
    }

    .trash:hover {
      background: linear-gradient(135deg, #ffdd33, #ffbb00);
    }

    span {
      color: white;
      font-weight: bold;
    }

    .cta {
      background: linear-gradient(135deg, #ffcc00, #ff9900);
      border: none;
      padding: 12px 18px;
      color: white;
      border-radius: 999px;
      font-weight: bold;
      cursor: pointer;
    }

    .cta:hover {
      background: linear-gradient(135deg, #ffdd33, #ffbb00);
    }

    
    .trash img {
      width: 100%;
      height: 20px !important;
    }
    
    .carousel {
      display: flex;
      gap: 20px;
      overflow: visible;
    }
    
    .bag-card {
      border-radius: 16px;
      padding: 10px;
      text-align: center;
      min-width: 250px;
      height: 285px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: visible;
    }

    .bag-card-my {
      border-radius: 16px;
      padding: 10px;
      text-align: center;
      min-width: 250px;
      height: 240px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: visible;
    }

    .body {
      background-image: url('/assets/background.png');
      background-size: cover;
      background-repeat: repeat;  
      border-radius: 20px;  
      margin: 0;
      height: 100vh;
    }
    
    .bag-card {
      position: relative;
      border-radius: 20px;
      overflow: visible; 
      background-color: #ffbb00;
      box-shadow: inset 0px -50px 30px rgba(0, 0, 0, 0.2);
    }
    
    .bag-float {
      position: absolute;
      top: -50px; 
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      pointer-events: none;
    }
    
    .bag-card:hover .bag-float {
      top: -70px;
      transition: top 0.3s ease;
    }
    
    /* iframe zelf */
    .bag-preview {
      width: 180px;
      height: 260px;
      border: none;
      background: transparent;
      pointer-events: none;
    }

    .flex2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .text {
      font-size: 14px;
      color: gray;
      margin-bottom: 20px;
    }
  

    .madeby p {
      margin-bottom: 10px;
    }
    
    
    .bag-card img {
      width: 100%;
      height: 160px;
      object-fit: contain;
    }
    
    .vote {
      background: linear-gradient(135deg, #ffcc00, #ff9900);
      border: none;
      padding: 6px 12px;
      color: white;
      border-radius: 999px;
      font-weight: bold;
      cursor: pointer;
      margin-left: 10px;
    }

    .vote:hover {
      background: linear-gradient(135deg, #ffdd33, #ffbb00);
    }
    
    .carousel p {
      color: white;
    }

    nav {
      padding: 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, Helvetica, sans-serif;
      border-bottom: gray 1px solid;
    }

    nav a {
      text-decoration: none !important;
      color: #ff9900;
      font-size: 18px;
    }
    
    nav button {
      background: linear-gradient(135deg, #ffcc00, #ff9900);
      border: none;
      padding: 12px 18px;
      color: white;
      border-radius: 999px;
      font-weight: bold;
      cursor: pointer;
    }

    nav a.router-link-exact-active {
      font-weight: bold;
    }
    
    </style>
    
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
        <!-- <div> -->
        <div class="scroll">
      <div class="carousel">
        <div class="bag-card" v-for="bag in myBags" :key="bag._id" :style="getBagBackground(bag)">
          <!-- <div class="bag-card"> -->
          <div class="bag-float">
            <!-- <iframe
              :src="`https://lays-configurator-vert.vercel.app/?preview=true&bagId=${bag._id}`"
              class="bag-preview"
            /> -->
            <!-- <BagPreview :bag="bag" /> -->
             <BagPreviewTest :bag="bag"/>
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
            <!-- <iframe
              :src="`https://lays-configurator-vert.vercel.app/?preview=true&bagId=${bag._id}`"
              class="bag-preview"
            /> -->
            <BagPreview :bag="bag" />
            </div>

            <div class="madeby">
                <p>Made by {{ bag.user?.name || 'Unknown' }}</p>
              <div class="madeflex">
                <span>{{ bag.votes || 0 }} 👍</span>
                <button class="vote" @click="vote(bag._id)">
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
  import BagPreviewTest from "../components/BagPreviewTest.vue";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      myBags: [],
      allBags: []
    }
  },
  components: {
  BagPreview,
  BagPreviewTest
},

  // async mounted() {
  //   if (!this.user) {
  //   this.$router.push("/login")
  //   return
  // }

  //   await this.fetchMyBags()
  //   await this.fetchAllBags()
  // },
  async mounted() {
  // 🔥 LOCAL DEV: skip API calls
  if (import.meta.env.DEV) {
    console.log("DEV mode: skipping API fetches")
    return
  }

  if (!this.user) {
    this.$router.push("/login")
    return
  }

  await this.fetchMyBags()
  await this.fetchAllBags()
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

    async vote(bagId) {
      const bag = this.allBags.find(b => b._id === bagId)
      if (!bag) return

      const res = await fetch(`${API_URL}/api/v1/vote/${bagId}`, {
        method: bag.hasVoted ? "DELETE" : "POST",
        credentials: "include"
      })

      if (!res.ok) {
        alert("You already voted on this bag")
        return
      }

      bag.votes += bag.hasVoted ? -1 : 1
      bag.hasVoted = !bag.hasVoted
    },

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
      font-size: 14px;
      flex-direction: column;
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
    
    /* tekst blijft onder */
    .madeby {
      margin-top: 170px;
      color: white;
      font-weight: bold;
      gap: 0;
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
    
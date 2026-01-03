<template>
    <nav>
      <p to="/">Admin</p>
      <button @click="logout">Uitloggen</button>
    </nav>

    <div class="body">
    <section class="card">
      <h2>Alle designs</h2>

      <div class="scroll">
      <div class="carousel">
        <div class="bag-card" v-for="bag in allBags" :key="bag._id" :style="getBagBackground(bag)">
          <div class="bag-float">
             <BagPreview :bag="bag"/>
          </div>
            <p class="made-by">Made by {{ bag.user?.name || 'Unknown' }}</p>
            <span>{{ bag.votes || 0 }} 👍</span>
          <button class="trash" @click="deleteBag(bag._id)">
            <img src="/assets/trash-2.svg" alt="">
          </button>
        </div>
      </div>
    </div>
    </section>
    <p class="copyright">Lays 2025 - Design your Lays</p>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_BASE_URL
import BagPreview from "../components/BagPreview.vue";


const url = `${API_URL}/api/v1/bag`
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      allBags: []
    }
  },
  components: {
  BagPreview
},
  async mounted() {
    await this.fetchAllBags()
  },

  methods: {
async fetchAllBags() {
const res = await fetch(url, {
  method: "GET",
  credentials: "include"
})

if (!res.ok) {
  console.error("fetchAllBags failed:", res.status)
  return
}

const bags = await res.json()
  const userId = this.user._id

  this.allBags = bags.map(bag => ({
    ...bag,
    votes: bag.votes || 0,
    hasVoted: bag.voters?.includes(userId) || false
  }))
}
,

async deleteBag(bagId) {
  const res = await fetch(`${url}/${bagId}`, {
    method: "DELETE",
    credentials: "include"
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    console.error("DELETE failed:", res.status, txt)
    alert("Delete mislukt")
    return
  }

  // ✅ meteen UI updaten
  this.allBags = this.allBags.filter(b => b._id !== bagId)
}
,

    logout() {
      localStorage.removeItem("user")
      this.$router.push("/login")
    },

    goToConfigurator() {
      window.location.href = "https://lays-configurator-vert.vercel.app/"
},
getBagBackground(bag) {
// 1. custom background image (base64 of url)
if (bag.backgroundImage) {
  return {
    backgroundImage: `url(${bag.backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }
}

// 2. preset background (blue, red, green, ...)
if (bag.backgroundPreset) {
  return {
    backgroundImage: `url(assets/${bag.backgroundPreset}-bg.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }
}

// 3. fallback kleur
return {
  backgroundColor: bag.backgroundColor || "#05060a"
}
}



  }
}
</script>

<style scoped>
  .card {
    padding: 40px;
    font-family: Arial, Helvetica, sans-serif;
    padding: 10px;
    margin-bottom: 20px;
  }

  nav p {
    text-decoration: none;
    color: black;
  }
  
  .scroll {
      overflow-x: scroll;
      padding-top: 50px;
  }
  
  h2 {
    margin-top: 20px;
    font-size: 22px;
    color: #e01414;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
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

  .cta {
    background: linear-gradient(135deg, #ffcc00, #ff9900);
    border: none;
    padding: 12px 18px;
    color: white;
    border-radius: 999px;
    font-weight: bold;
    cursor: pointer;
  }

  .body {
      background-image: url('/assets/background.png');
      background-size: cover;
      background-repeat: repeat;  
      border-radius: 20px;  
    }

    .copyright {
      text-align: center;
      color: rgb(160, 160, 160);
      margin-top: 25vh;
      padding-bottom: 10px;
      font-size: 12px;
      font-family: Arial, Helvetica, sans-serif;
    }
    
  .cta:hover {
    background: linear-gradient(135deg, #ffdd33, #ffbb00);
  }

  span {
    color: white;
    font-weight: bold;
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
    height: 280px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: visible;
  }
  
  .bag-card {
    position: relative;
    border-radius: 20px;
    overflow: visible; 
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
    top: -60px;
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
    margin-top: -10px;
    margin-bottom: 20px;
  }
  
  /* tekst blijft onder */
  .made-by {
    margin-top: 230px;
    color: white;
    font-weight: bold;
  }
  
  
  .bag-card img {
    width: 100%;
    height: 160px;
    object-fit: contain;
  }
  
  .carousel p {
    color: white;
  }

  nav {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    border-bottom: gray 1px solid;
  }

  nav p {
    text-decoration: none !important;
    color: #ff9900;
    font-size: 18px;
    font-weight: bold;
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
  
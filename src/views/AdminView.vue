<template>
  <nav>
    <p>Admin panel</p>
    <button @click="logout">Uitloggen</button>
  </nav>

    <section class="card">
      <h2>Alle designs</h2>

      <div class="scroll">
      <div class="carousel">
        <div class="bag-card" v-for="bag in allBags" :key="bag._id" :style="getBagBackground(bag)">
          <div class="bag-float">
            <iframe
              :src="`http://localhost:5173/?preview=true&bagId=${bag._id}`"
              class="bag-preview"
            />
          </div>

          <p class="made-by">Made by user</p>
          <button class="trash" @click="deleteBag(bag._id)">
            <img src="../assets/trash-2.svg" alt="">
          </button>
        </div>
      </div>
    </div>
    </section>
</template>

<script>
const API_URL = "http://localhost:4000/api/v1"
const url = `${API_URL}/bag`
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      allBags: []
    }
  },

  async mounted() {
    await this.fetchAllBags()
  },

  methods: {
async fetchAllBags() {
const res = await fetch(`${API_URL}/bag`, {
  method: "GET",
  credentials: "include"
})

if (!res.ok) {
  console.error("fetchAllBags failed:", res.status)
  return
}

this.allBags = await res.json()
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
      window.location.href = "http://localhost:5173/"
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
    backgroundImage: `url(${new URL(
      `/src/assets/${bag.backgroundPreset}-bg.png`,
      import.meta.url
    ).href})`,      backgroundSize: "cover",
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
  min-height: 100vh;
  padding: 40px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 10px;
  margin-bottom: 20px;
}

.scroll {
    overflow-x: scroll;
    padding-top: 50px;
}

h2 {
  margin-bottom: 0px;
  font-size: 22px;
  color: #ff0000;
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
  top: -40px; 
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

/* tekst blijft onder */
.made-by {
  margin-top: 220px;
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


button {
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  border: none;
  padding: 10px;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
}

nav {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  font-family: Arial, Helvetica, sans-serif;
  border-bottom: gray 1px solid;
}

nav button {
  padding: 0px 20px;
  text-decoration: none;
  color: black;
}

nav a.router-link-exact-active {
  font-weight: bold;
}

</style>

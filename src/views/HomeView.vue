<template>
    <nav>
      <router-link to="/">Home</router-link>
      <button @click="logout">Uitloggen</button>
    </nav>
  
    <div class="profile">
      <!-- USER INFO -->
      <section class="card">
        <h2>Mijn profiel</h2>
        <p><strong>Naam:</strong> {{ user?.name }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>
      </section>
  
      <!-- MY DESIGNS -->
      <section class="card">
        <h2>Mijn designs</h2>
  
        <p v-if="myBags.length === 0">
          <button class="cta" @click="goToConfigurator">
            Design je eigen chipszak!
          </button>
        </p>
  
        <div class="grid">
          <div class="bag-card" v-for="bag in myBags" :key="bag._id">
            <img :src="bag.image" />
            <p>{{ bag.name }}</p>
          </div>
        </div>
      </section>
  
      <!-- ALL DESIGNS -->
      <section class="card">
        <h2>Alle designs</h2>
  
        <div class="carousel">
          <div class="bag-card" v-for="bag in allBags" :key="bag._id">
            <img :src="bag.image" />
            <p>{{ bag.name }}</p>
            <small>door {{ bag.user?.name || "user" }}</small>
            <button @click="vote(bag._id)">Vote</button>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  const API_URL = "http://localhost:4000/api/v1"
const url = `${API_URL}/bag`
  export default {
    data() {
      return {
        user: JSON.parse(localStorage.getItem("user")),
        myBags: [],
        allBags: []
      }
    },
  
    async mounted() {
      await this.fetchMyBags()
      await this.fetchAllBags()
    },
  
    methods: {
      async fetchMyBags() {
  const res = await fetch(`${API_URL}/bag/mine`, {
    method: "GET",
    credentials: "include"
  })

  if (!res.ok) {
    console.error("fetchMyBags failed:", res.status)
    return
  }

  this.myBags = await res.json()
}
,
  
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
  
      async vote(bagId) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include", // ⬅️ VERPLICHT
            headers: {
                "Content-Type": "application/json"
            }
            })

  
        if (!res.ok) {
          alert("Stemmen mislukt")
          return
        }
  
        alert("Gestemd!")
      },
  
      logout() {
        localStorage.removeItem("user")
        this.$router.push("/login")
      },
  
      goToConfigurator() {
        window.location.href = "http://localhost:5174/"
}

    }
  }
  </script>
  
  <style scoped>
  .profile {
    min-height: 100vh;
    padding: 40px;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .card {
    padding: 10px;
    margin-bottom: 20px;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 22px;
    color: #ff0000;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
  
  .carousel {
    display: flex;
    gap: 20px;
    overflow-x: auto;
  }
  
  .bag-card {
    background: #111;
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    min-width: 180px;
  }
  
  .bag-card img {
    width: 100%;
    height: 160px;
    object-fit: contain;
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
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  nav a {
    margin-right: 15px;
    text-decoration: none;
    color: black;
  }
  
  nav a.router-link-exact-active {
    font-weight: bold;
  }
  </style>
  
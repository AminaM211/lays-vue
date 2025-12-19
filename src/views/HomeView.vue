<template>
    <nav>
        <router-link to="/">Home</router-link>
        <button @click="logout">Uitloggen</button>
    </nav>
  
    <div class="profile">
  
      <!-- USER INFO -->
      <section class="card">
        <h2>Mijn profiel</h2>
        <p><strong>Naam:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </section>
  
      <!-- MY DESIGNS -->
      <section class="card" >
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
  const API = "http://localhost:4000/api/v1"
  
  export default {
    data() {
      return {
        user: JSON.parse(localStorage.getItem("user")),
        token: localStorage.getItem("token"),
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
        const res = await fetch(`${API}/bag/mine`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.myBags = await res.json()
      },
  
      async fetchAllBags() {
        const res = await fetch(`${API}/bag`)
        this.allBags = await res.json()
      },
  
      async vote(bagId) {
        await fetch(`${API}/vote/${bagId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        alert("Gestemd!")
      },
        logout() {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            this.$router.push("/login")
  },
  goToConfigurator() {
    window.location.href = "http://localhost:5174/" 
  }
}}

  </script>
  
  <style scoped>
  .profile {
    min-height: 100vh;
    padding: 40px;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .card {
    /* background: linear-gradient(145deg, #1f1f1f, #141414);
    border-radius: 20px; */
    padding: 10px;
    margin-bottom: 20px;
    /* box-shadow: 0 20px 40px rgba(0,0,0,0.6); */
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
  
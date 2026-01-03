<template>
    <div class="login-page">
       <!-- LOADER -->
    <div v-if="loading" id="loader">
      <div class="spinner"></div>
      <p>{{ loaderText }}</p>
    </div>
      <img src="/favico.ico" alt="">
      <h1>Design your Lays!</h1>
      <div class="login-card">
        <h2>Maak een account aan</h2>
        <input
          type="name"
          placeholder="Username"
          v-model="name"
        />

        <input
          type="email"
          placeholder="E-mailadres"
          v-model="email"
        />
  
        <input
          type="password"
          placeholder="Wachtwoord"
          v-model="password"
        />
  
        <button class="primary" @click="register" :disabled="loading">
          Aanmelden
        </button>
    
        <hr />
  
        <div class="flex">
            <p>Al een account?</p>
            <router-link class="secondary" to="/login">Inloggen</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  const API_URL = import.meta.env.VITE_API_BASE_URL

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      loading: false,
      loaderText: "Account aanmaken…"
    }
  },
  methods: {
    async register() {
      this.loading = true
      this.loaderText = "Account aanmaken…"

      try {
        const res = await fetch(`${API_URL}/api/v1/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password
          })
        })

        const data = await res.json()

        if (!res.ok) {
          alert(data.message)
          return
        }

        // Na registratie terug naar login
        this.$router.push("/login")

      } catch (err) {
        console.error(err)
        alert("Server error")
      } finally {
        this.loading = false
      }
    }
  }
}

</script>
  
  <style scoped>
      h1, h2 {
        font-family: Arial, Helvetica, sans-serif;
    }

    h1 {
      color: #df1f27;
      font-style: oblique;
      font-variant: small-caps;
    }

    .login-page {
      /* min-height: 100vh; */
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    img {
      width: 120px;
      margin-top: 10px;
    }
    
    .login-card {
      background: white;
      padding: 20px;
      width: 360px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    
    input {
      padding: 14px;
      font-size: 16px;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
    
    input:focus {
      outline: none;
      border-color: rgb(233, 9, 9);
    }
    
    .primary {
      background: rgb(233, 9, 9);
      color: white;
      border: none;
      padding: 14px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }

    #loader {
  position: fixed;
  inset: 0;
  background: #05060a45;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  font-family: Arial, sans-serif;
}

#loader p {
  margin-left: 12px;
  font-size: 18px;
  font-weight: bold;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 9px solid rgba(255,255,255,0.5);
  border-top: 10px solid #ffd700;
  border-radius: 60%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}


    p {
      font-family: Arial, Helvetica, sans-serif;
    }
    
    .secondary:hover {
      background: #ecca0d;
    }

    .primary:hover {
      background: rgb(216, 7, 7); 
    }
    
    .secondary {
      background: #ffd700;
      color: white;
      border: none;
      padding: 15px 30px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      font-family: Arial, Helvetica, sans-serif;
    }
    
    .forgot {
      text-align: center;
      color: #1877f2;
      font-size: 14px;
      cursor: pointer;
    }
    
    hr {
      border: none;
      height: 1px;
      background: #ddd;
      margin: 10px 0;
    }

    .flex {
        display: flex;
        justify-content: space-between;
        gap: 6px;
        flex-direction: row;
    }
</style>
    
<template>
    <div class="login-page">
      <div class="login-card">
        <h1>Maak een account aan</h1>
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
  
        <button class="primary" @click="register">
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
  const url = `${API_URL}/api/v1/user/register`

  export default {
    data() {
      return {
        name: "",
        email: "",
        password: ""
      }
    },
    methods: {
      async register() {
        try {
          const res = await fetch(url, {
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
          this.$router.push("/login")
  
        } catch (err) {
          console.error(err)
          alert("Server error")
        }
      }
    }
  }
  </script>
  
  <style scoped>
      h1 {
        font-family: Arial, Helvetica, sans-serif;
    }
    .login-page {
      min-height: 100vh;
      background: #f0f2f5;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .login-card {
      background: white;
      padding: 32px;
      width: 360px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
    
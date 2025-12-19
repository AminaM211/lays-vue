<template>
    <div class="login-page">
      <div class="login-card">
        <h1>Log in</h1>
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
  
        <button class="primary" @click="login">
          Inloggen
        </button>
    
        <hr />
  
        <div class="flex">
            <p>Nog geen account?</p>
            <router-link class="secondary" to="/register">Account maken</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    const API_URL = "http://localhost:4000/api/v1"

  export default {
    data() {
      return {
        email: "", // Initialize email
        password: "" // Initialize password
      }
    },
    methods: {
        async login() {
  try {
    const res = await fetch("http://localhost:4000/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      return
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    if (data.user.role === "admin") {
      this.$router.push("/admin")
    } else {
      this.$router.push("/")
    }


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
      border-color: #ffd700;
    }
    
    .primary {
      background: #ffd700;
      color: white;
      border: none;
      padding: 14px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .primary:hover {
      background: #ecca0d;
    }

    .secondary:hover {
      background: rgb(216, 7, 7);
    }
    
    .secondary {
      background: rgb(233, 9, 9);
      color: white;
      border: none;
      padding: 15px 20px;
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
    
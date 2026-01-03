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
        <h2>Log in</h2>
        <input
          type="email"
          placeholder="Email address"
          v-model="email"
        />
  
        <input
          type="password"
          placeholder="Password"
          v-model="password"
        />
  
        <button class="primary" @click="login" :disabled="loading">
          Log in
        </button>
    
        <hr />
  
        <div class="flex">
            <p>not registered yet?</p>
            <router-link to="/register" class="secondary">
              Create an account
            </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  const API_URL = import.meta.env.VITE_API_BASE_URL

  export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      loaderText: "Logging in…"
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.loaderText = "Logging in…"

      try {
        const res = await fetch(`${API_URL}/api/v1/user/login`, {
          method: "POST",
          credentials: "include",
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

        localStorage.setItem("user", JSON.stringify(data.user))

        this.$router.push(
          data.user.role === "admin" ? "/admin" : "/"
        )

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

    p {
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


    #loader {
  position: fixed;
  inset: 0;
  background: #05060a45;
  display: flex;
  flex-direction: row;
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
  margin-bottom: 12px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
    
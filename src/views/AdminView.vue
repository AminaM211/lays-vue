<template>
  <div class="admin">
    <h1>Alle designs</h1>

    <div v-if="bags.length === 0">
      Nog geen designs
    </div>

    <div v-for="bag in bags" :key="bag._id" class="card">
      <p><strong>Naam:</strong> {{ bag.name }}</p>
      <p><strong>Kleur:</strong> {{ bag.bagColor }}</p>

      <img
        v-if="bag.image"
        :src="bag.image"
        alt="bag image"
        width="150"
      />
    </div>
  </div>
</template>

<script>
    const API_URL = "http://localhost:4000/api/v1"
    const url = `${API_URL}/bag`
export default {
  data() {
    return {
      bags: []
    }
  },
  async mounted() {
  const res = await fetch(url, {
  method: "POST",
  credentials: "include", // ⬅️ VERPLICHT
  headers: {
    "Content-Type": "application/json"
  },})


    const data = await res.json()
    this.bags = data
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 12px;
}
</style>

<template>
    <h1>Home</h1>
    <p>abc</p>
  </template>
  <script setup>
    fetch("http://localhost:4000/api/v1/bag")
      .then(res => res.json())
      .then(data => console.log(data))
    </script>
    
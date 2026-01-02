<template>
    <div ref="container" class="preview"></div>
  </template>
  
  <script>
  import * as THREE from "three"
  import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
  import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
  import { onBeforeUnmount } from "vue"
  
  export default {
    mounted() {
      const width = 200
      const height = 280
  
      // SCENE
      const scene = new THREE.Scene()
  
      // CAMERA
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
      camera.position.set(0, 1.5, 2.1)
      camera.lookAt(0, 1, 0)
  
      // RENDERER
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.$refs.container.appendChild(renderer.domElement)
  
      // LIGHTS
      scene.add(new THREE.AmbientLight(0xffffff, 1.2))
      const dir = new THREE.DirectionalLight(0xffffff, 1)
      dir.position.set(2, 4, 3)
      scene.add(dir)
  
      // LOAD MODEL
      const mtlLoader = new MTLLoader()
      let rafId
  
      mtlLoader.load("/assets/chips-bag-obj/bag.mtl", (materials) => {
        materials.preload()
  
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
  
        objLoader.load("/assets/chips-bag-obj/bag.obj", (bag) => {
          // POSITION DIE ALTIJD WERKT
          bag.scale.set(0.5, 0.5, 0.6)
          bag.position.set(0, 0.9, 0)
  
          scene.add(bag)
  
          // SIMPLE ROTATION
          const animate = () => {
            bag.position.y = 1.8 + Math.sin(Date.now() * 0.0017) * 0.06
            renderer.render(scene, camera)
            rafId = requestAnimationFrame(animate)
          }
          animate()
        })
      })
  
      onBeforeUnmount(() => {
        if (rafId) cancelAnimationFrame(rafId)
        renderer.dispose()
        renderer.domElement.remove()
      })
    }
  }
  </script>
  
  <style scoped>
  .preview {
    width: 200px;
    height: 280px;
  }
  .preview canvas {
    display: block;
  }
  </style>
  
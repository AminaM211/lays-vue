<template>
  <div ref="container" class="preview"></div>
</template>

<script>
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { createBackTexture, updateBagTexture } from "../bagTexture.js"

import laysLogo from "/assets/lays.png"
import backImg1 from "/assets/back-img1.png"
import backImg2 from "/assets/back-img2.png"

export default {
  props: {
    bag: Object
  },

  async mounted() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      window.innerWidth <= 800 ? 60 : 35,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.lookAt(0, 1.8, 0)
    camera.fov = 55
    camera.position.set(0, 1.2, 2)
    camera.updateProjectionMatrix()
    
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    })
    renderer.setSize(160, 220)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    THREE.ColorManagement.enabled = false
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.$refs.container.appendChild(renderer.domElement)

    scene.add(new THREE.DirectionalLight(0xffffff, 1))
    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2))

    const logoImg = new Image()
    logoImg.src = laysLogo

    const back1 = new Image()
    const back2 = new Image()
    back1.src = backImg1
    back2.src = backImg2

    const customImage = new Image()
    let customImageLoaded = false

    if (this.bag.image) {
      customImage.src = this.bag.image
      customImage.onload = () => {
        customImageLoaded = true
      }
    }

    // ───────── LOAD MODEL
    const mtlLoader = new MTLLoader()
    mtlLoader.load("/assets/chips-bag-obj/bag.mtl", (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)

      objLoader.load("/assets/chips-bag-obj/bag.obj", (bagMesh) => {
        bagMesh.scale.set(0.5, 0.5, 0.6)
        bagMesh.position.y = 0.9
        bagMesh.rotation.y = 0.7

        scene.add(bagMesh)

        // ───────── CONFIG (zelfde structuur als configurator)
        const config = {
          name: this.bag.name || "",
          bagColor: this.bag.bagColor || "#d32b2b",
          keyFlavours: this.bag.keyFlavours || [],
          backgroundColor: this.bag.backgroundColor || "#05060a",
          backgroundPreset: this.bag.backgroundPreset || ""
        }

        // BACK + FRONT
        createBackTexture(bagMesh, config, back1, back2)
        updateBagTexture(
          bagMesh,
          config,
          logoImg,
          customImage,
          customImageLoaded
        )

        // ───────── ANIMATE
        const animate = () => {
          bagMesh.position.y = 1.8 + Math.sin(Date.now() * 0.0017) * 0.06
          renderer.render(scene, camera)
          requestAnimationFrame(animate)
          
        }
        animate()
      })
    })
  }
}
</script>

<style scoped>
.preview {
  width: 160px;
  height: 220px;
}
</style>

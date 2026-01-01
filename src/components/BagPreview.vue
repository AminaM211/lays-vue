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

  mounted() {
    // === 1) FIXED SIZES (moeten matchen met CSS) ===
    const width = 200
    const height = 280
    const aspect = width / height

    // === 2) SCENE / CAMERA (aspect klopt nu) ===
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100)
    camera.position.set(0, 1.25, 2.25)
    camera.lookAt(0, 1.15, 0)

    // === 3) RENDERER (geen scaling/blur) ===
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    })

    renderer.setSize(width, height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    THREE.ColorManagement.enabled = false
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace

    this.$refs.container.appendChild(renderer.domElement)

    // === 4) LIGHTS (zelfde vibe als configurator) ===
    scene.add(new THREE.DirectionalLight(0xffffff, 1))
    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2))

    // === 5) LOAD IMAGES (wachten tot alles klaar is) ===
    const logoImg = new Image()
    logoImg.src = laysLogo

    const back1 = new Image()
    const back2 = new Image()
    back1.src = backImg1
    back2.src = backImg2

    const customImage = new Image()

    const loadImage = (img) =>
      new Promise((resolve) => {
        if (!img) return resolve(false)
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
      })

    // === 6) MODEL LOAD ===
    const mtlLoader = new MTLLoader()

    let bagMesh = null
    let rafId = null

    const applyTextures = () => {
      if (!bagMesh) return

      const config = {
        name: this.bag?.name || "",
        bagColor: this.bag?.bagColor || "#d32b2b",
        keyFlavours: this.bag?.keyFlavours || [],
        backgroundColor: this.bag?.backgroundColor || "#05060a",
        backgroundPreset: this.bag?.backgroundPreset || ""
      }

      createBackTexture(bagMesh, config, back1, back2)

      const hasCustom = !!this.bag?.image
      updateBagTexture(
        bagMesh,
        config,
        logoImg,
        customImage,
        hasCustom // true alleen als image effectief bestaat
      )
    }

    const startRenderLoop = () => {
      const animate = () => {
        if (bagMesh) bagMesh.rotation.y += 0.004
        renderer.render(scene, camera)
        rafId = requestAnimationFrame(animate)
      }
      animate()
    }

    mtlLoader.load("/assets/chips-bag-obj/bag.mtl", (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)

      objLoader.load("/assets/chips-bag-obj/bag.obj", async (object) => {
        bagMesh = object

        // === 7) POSITION zoals configurator preview ===
        bagMesh.scale.set(0.5, 0.5, 0.6)
        bagMesh.position.set(0.6, 1.0, 0) // zelfde als main.js
        bagMesh.rotation.y = 0

        scene.add(bagMesh)

        // === 8) WACHT op assets, dan pas texture draw ===
        const promises = [
          loadImage(logoImg),
          loadImage(back1),
          loadImage(back2)
        ]

        if (this.bag?.image) {
          customImage.src = this.bag.image
          promises.push(loadImage(customImage))
        }

        await Promise.all(promises)

        applyTextures()
        startRenderLoop()
      })
    })

    // === 9) CLEANUP (belangrijk bij Vue) ===
    this.$once("hook:beforeUnmount", () => {
      if (rafId) cancelAnimationFrame(rafId)
      renderer.dispose()
      if (renderer.domElement?.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    })
  }
}
</script>

<style scoped>
.preview {
  width: 200px;
  height: 280px;
  overflow: visible;
}

.preview :deep(canvas) {
  width: 200px;
  height: 280px;
  display: block;
}
</style>

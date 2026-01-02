<template>
  <div ref="container" class="preview"></div>
</template>

<script>
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { onBeforeUnmount } from "vue"

import { createBackTexture, updateBagTexture } from "../bagTexture.js"

import laysLogo from "/assets/lays.png"
import backImg1 from "/assets/back-img1.png"
import backImg2 from "/assets/back-img2.png"

export default {
  props: {
    bag: Object
  },

  mounted() {
    const width = 200
    const height = 280

    // SCENE
    const scene = new THREE.Scene()

    // CAMERA
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 1.5, 2.1)
    camera.lookAt(0, 1, 0)

    // RENDERER (⚠️ sharp)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.$refs.container.appendChild(renderer.domElement)

    // LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2))

    const dir = new THREE.DirectionalLight(0xffffff, 1)

    dir.position.set(2, 4, 3)
    scene.add(dir)

    // IMAGES (identiek aan configurator)
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

    // LOAD MODEL
    let bagMesh = null
    let rafId = null

    const mtlLoader = new MTLLoader()
    mtlLoader.load("/assets/chips-bag-obj/bag.mtl", (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)

      objLoader.load("/assets/chips-bag-obj/bag.obj", () => {}, undefined, console.error)

      objLoader.load("/assets/chips-bag-obj/bag.obj", (object) => {
        bagMesh = object
        bagMesh.scale.set(0.5, 0.5, 0.6)
        bagMesh.position.set(0, 0.9, 0)

        scene.add(bagMesh)

        // CONFIG — exact zoals backend
        const config = {
          name: this.bag.name || "",
          bagColor: this.bag.bagColor || "#d32b2b",
          keyFlavours: this.bag.keyFlavours || [],
          backgroundColor: this.bag.backgroundColor || "#05060a",
          backgroundPreset: this.bag.backgroundPreset || ""
        }

        // 🔥 TEXTURES TOEPASSEN
        createBackTexture(bagMesh, config, back1, back2)
        updateBagTexture(
          bagMesh,
          config,
          logoImg,
          customImage,
          customImageLoaded
        )

        // LOOP
        const animate = () => {
          // bagMesh.rotation.y += 0.005
          bagMesh.position.y = 1.8 + Math.sin(Date.now() * 0.0017) * 0.06
          renderer.render(scene, camera)
          rafId = requestAnimationFrame(animate)
        }
        animate()
      })
    })

    onBeforeUnmount(() => {
      if (rafId) cancelAnimationFrame(rafId)
      renderer.dispose()
      renderer.domElement?.remove()
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

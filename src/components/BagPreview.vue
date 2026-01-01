<template>
  <div ref="container" class="preview"></div>
</template>

<script>
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { onBeforeUnmount } from "vue"

export default {
  props: {
    bag: Object
  },

  mounted() {
    // === SIZES ===
    const width = 200
    const height = 280

    // === SCENE ===
    const scene = new THREE.Scene()

    // === CAMERA (SUPER BELANGRIJK) ===
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 1.2, 3)
    camera.lookAt(0, 1.2, 0)

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.$refs.container.appendChild(renderer.domElement)

    // === LIGHTS ===
    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const dir = new THREE.DirectionalLight(0xffffff, 1)
    dir.position.set(2, 4, 3)
    scene.add(dir)

    // === LOAD MODEL ===
    const mtlLoader = new MTLLoader()
    let bagMesh = null
    let rafId = null

    mtlLoader.load("/assets/chips-bag-obj/bag.mtl", (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)

      objLoader.load("/assets/chips-bag-obj/bag.obj", (object) => {
        bagMesh = object

        // 🔥 DEZE 3 LIJNEN ZIJN CRUCIAAL
        bagMesh.scale.set(0.5, 0.5, 0.6)
        bagMesh.position.set(0, 0.9, 0)
        bagMesh.rotation.y = 0

        scene.add(bagMesh)

        // === RENDER LOOP ===
        const animate = () => {
          // bagMesh.rotation.y += 0.005
          renderer.render(scene, camera)
          rafId = requestAnimationFrame(animate)
        }
        animate()
      })
    })

    // === CLEANUP ===
    onBeforeUnmount(() => {
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
}
.preview canvas {
  display: block;
}
</style>

<template>
    <div ref="container" class="preview"></div>
  </template>
  
  <script>
    import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"

export default {
  props: {
    image: String
  },
  mounted() {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(180, 220)
    this.$refs.container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1))

    const mtlLoader = new MTLLoader()
    mtlLoader.load("/assets/chips-bag-obj/bag.mtl", (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.load("/assets/chips-bag-obj/bag.obj", (bag) => {
        bag.scale.set(0.4, 0.4, 0.4)

        // texture toepassen
        const tex = new THREE.TextureLoader().load(this.image)
        bag.traverse((c) => {
          if (c.isMesh) {
            c.material.map = tex
            c.material.needsUpdate = true
          }
        })

        scene.add(bag)

        const animate = () => {
          bag.rotation.y += 0.01
          renderer.render(scene, camera)
          requestAnimationFrame(animate)
        }
        animate()
      })
    })
  }
}

  </script>
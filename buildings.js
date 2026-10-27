
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function createEgyptianBuildings(scene) {
  const buildings = new THREE.Group();
  buildings.name = 'EgyptianRoadsideBuildings';

  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0x9d5940,
      roughness: 0.95
    }),
    new THREE.MeshStandardMaterial({
      color: 0xb47d5a,
      roughness: 0.95
    }),
    new THREE.MeshStandardMaterial({
      color: 0xbab1a0,
      roughness: 0.95
    }),
    new THREE.MeshStandardMaterial({
      color: 0xc3a47e,
      roughness: 0.95
    })
  ];

  const concrete = new THREE.MeshStandardMaterial({
    color: 0xaaa397,
    roughness: 1
  });

  const brick = new THREE.MeshStandardMaterial({
    color: 0x88452f,
    roughness: 1
  });

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x354b53,
    roughness: 0.4,
    metalness: 0.1
  });

  const black = new THREE.MeshStandardMaterial({
    color: 0x242526,
    roughness: 0.8
  });

  const dishMaterial = new THREE.MeshStandardMaterial({
    color: 0xbcb9ae,
    roughness: 0.7,
    side: THREE.DoubleSide
  });

  function addBox(parent, w, h, d, material, x, y, z) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    parent.add(mesh);
    return mesh;
  }

  function addBuilding(x, z, seed) {
    const rng = (n) => {
      const v = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
      return v - Math.floor(v);
    };

    const width = 9 + rng(1) * 5;
    const depth = 8 + rng(2) * 4;
    const floors = 4 + Math.floor(rng(3) * 5);
    const floorHeight = 3.1;
    const height = floors * floorHeight;
    const material = materials[seed % materials.length];

    const building = new THREE.Group();
    building.position.set(x, 8.25, z);
    buildings.add(building);

    // جسم العمارة: طوب أحمر أو دهان مصري قديم.
    addBox(
      building,
      width,
      height,
      depth,
      material,
      0,
      height / 2,
      0
    );

    // شريط الطوب الظاهر فوق سطح العمارة.
    if (seed % 3 === 0) {
      addBox(
        building,
        width + 0.12,
        0.7,
        depth + 0.12,
        brick,
        0,
        height - 0.35,
        0
      );
    }

    // تقسيمات الواجهة والشبابيك والبلكونات.
    const columns = Math.max(2, Math.floor(width / 2.1));

    for (let floor = 0; floor < floors; floor++) {
      const y = 1.0 + floor * floorHeight;

      for (let col = 0; col < columns; col++) {
        const wx =
          -width / 2 +
          (col + 0.5) * (width / columns);

        // الشبابيك.
        addBox(
          building,
          0.95,
          1.25,
          0.08,
          windowMaterial,
          wx,
          y + 0.35,
          depth / 2 + 0.045
        );

        // إطار علوي للشباك.
        addBox(
          building,
          1.08,
          0.12,
          0.12,
          concrete,
          wx,
          y + 1.02,
          depth / 2 + 0.08
        );

        // بلاطة البلكونة.
        addBox(
          building,
          1.45,
          0.14,
          0.85,
          concrete,
          wx,
          y - 0.35,
          depth / 2 + 0.38
        );

        // سور البلكونة.
        addBox(
          building,
          1.35,
          0.48,
          0.08,
          concrete,
          wx,
          y - 0.08,
          depth / 2 + 0.78
        );

        // فتحات الطوب حول بعض البلكونات.
        if ((seed + floor + col) % 4 === 0) {
          addBox(
            building,
            1.48,
            0.12,
            0.1,
            brick,
            wx,
            y - 0.27,
            depth / 2 + 0.82
          );
        }
      }
    }

    // حافة السطح.
    addBox(
      building,
      width + 0.35,
      0.22,
      depth + 0.35,
      concrete,
      0,
      height + 0.1,
      0
    );

    // غرفة صغيرة فوق السطح في بعض العمارات.
    if (seed % 2 === 0) {
      addBox(
        building,
        width * 0.35,
        1.8,
        depth * 0.4,
        brick,
        -width * 0.18,
        height + 1.0,
        0
      );
    }

    // خزان مياه فوق السطح.
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.9, 10),
      concrete
    );

    tank.position.set(
      width * 0.23,
      height + 0.65,
      -depth * 0.18
    );

    building.add(tank);

    // أطباق دش.
    for (let i = 0; i < 2; i++) {
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(
          0.45,
          12,
          8,
          0,
          Math.PI * 2,
          0,
          Math.PI / 2
        ),
        dishMaterial
      );

      dish.scale.set(1, 0.22, 1);
      dish.rotation.x = Math.PI / 2.6;
      dish.position.set(
        -width * 0.25 + i * 1.1,
        height + 0.48,
        depth * 0.18
      );

      building.add(dish);

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.65, 6),
        black
      );

      pole.position.set(
        dish.position.x,
        height + 0.25,
        dish.position.z
      );

      building.add(pole);
    }

    // أبواب المحلات في الدور الأرضي.
    const shopCount = Math.max(2, Math.floor(width / 3));

    for (let i = 0; i < shopCount; i++) {
      const sx =
        -width / 2 +
        (i + 0.5) * (width / shopCount);

      addBox(
        building,
        2.0,
        2.2,
        0.12,
        black,
        sx,
        1.15,
        depth / 2 + 0.07
      );

      addBox(
        building,
        2.05,
        0.22,
        0.14,
        seed % 2 === 0 ? brick : concrete,
        sx,
        2.35,
        depth / 2 + 0.09
      );
    }
  }

  // المباني على جانبي الطريق.
  // مركز الطريق عند X=0، والحاجز عند X=±9.15.
  // أقرب حافة مبنى تبعد مسافة صغيرة عن الحاجز.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 24; i++) {
      const z = -410 + i * 19;

      const width = 9 + ((i + 1) % 3) * 2.5;
      const x = side * (15.5 + (i % 3) * 0.8);

      addBuilding(x, z, i + (side === 1 ? 30 : 0));
    }
  }

  scene.add(buildings);
  return buildings;
}

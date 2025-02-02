import { useLoader } from "@react-three/fiber";
import { TextureLoader, MeshStandardMaterial, Vector2, Texture, RepeatWrapping } from "three";
import { TextureMaps } from "@/lib/shared/types";
import { useMemo } from "react";

// 1x1 transparent PNG as a data URL
const BLANK_TEXTURE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

interface TexturedMaterialProps {
  maps: TextureMaps;
  color?: string;
}

export function TexturedMaterial({ maps, color = "#ffffff" }: TexturedMaterialProps) {
  // Load textures separately to avoid conditional hooks
  const diffuseMap = useLoader(TextureLoader, maps.diffuse || BLANK_TEXTURE);
  const normalMap = useLoader(TextureLoader, maps.normal || BLANK_TEXTURE);
  const armMap = useLoader(TextureLoader, maps.arm || BLANK_TEXTURE);

  // Create material with textures
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color,
      map: maps.diffuse ? diffuseMap : null,
      normalMap: maps.normal ? normalMap : null,
      aoMap: maps.arm ? armMap : null,
      roughnessMap: maps.arm ? armMap : null,
      metalnessMap: maps.arm ? armMap : null,
      normalScale: maps.normal ? new Vector2(1, 1) : undefined,
    });

    // Configure texture settings only for loaded textures
    [diffuseMap, normalMap, armMap].forEach((texture, index) => {
      const isUsed = index === 0 ? maps.diffuse : index === 1 ? maps.normal : maps.arm;
      if (isUsed) {
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.repeat.set(1, 1);
      }
    });

    return mat;
  }, [diffuseMap, normalMap, armMap, color, maps]);

  return <primitive object={material} />;
}

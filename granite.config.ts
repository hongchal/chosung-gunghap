import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "chosung-gunghap",
  brand: {
    displayName: "이름궁합",
    primaryColor: "#3182F6", // 토스 블루 (브랜드 컬러 확정 시 변경)
    icon: "", // 아이콘 이미지 URL은 콘솔 등록 후 추가
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});

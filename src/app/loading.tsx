import { figmaAssets } from "@/features/portfolio/data";

export default function Loading() {
  return (
    <main className="figma-loading" data-node-id="4:225">
      <img
        alt=""
        className="figma-loading-wave"
        height={386}
        src={figmaAssets.loadingWave}
        width={1512}
      />
      <div className="figma-loading-logo" data-node-id="4:227">
        <img alt="" height={40} src={figmaAssets.logo} width={40} />
        <p>王璐瑶的作品集</p>
        <strong>86%</strong>
      </div>
    </main>
  );
}

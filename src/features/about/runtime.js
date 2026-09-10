import {
  entryPage,
  section,
  action,
} from "../../shared/components/content-detail.js";
export function createAboutRuntime({ main, aboutData }) {
  function renderAbout() {
    main.innerHTML = entryPage({
      item: { title: aboutData.name },
      label: "ABOUT / 关于这里",
      back: "#/home",
      backLabel: "首页",
      summary: aboutData.tagline,
      body:
        section("为什么建立这里", aboutData.mission) +
        section("这里会记录什么", aboutData.records) +
        section("现在正在做", aboutData.now) +
        section("怎样阅读这里", aboutData.readingGuide) +
        (aboutData.links || [])
          .map((link) => action(link.label, link.url))
          .join(""),
    });
  }
  return { renderAbout };
}

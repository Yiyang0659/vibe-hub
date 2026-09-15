import { renderAboutStory, renderAboutNow } from '../columns/about-details.js';
import { renderAboutPage } from './page.js';
export function createAboutRuntime({ main }) {
  function renderAbout(id) { main.innerHTML = id === "me" ? renderAboutStory() : id === "now" ? renderAboutNow() : renderAboutPage(); }
  return { renderAbout };
}

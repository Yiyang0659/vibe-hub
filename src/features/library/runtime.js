export function createLibraryRuntime(context) {
  const { main, state, practice, lessons, topicsWithDomain, WHY_LOOKUP, papers, library, aboutData, getAllNotes, getAllWork, getAllToolbox, getAllDigests, topicById, noteById, paperById, workById, toolById, categoryOf, showToast, saveState, isFavorite, isCompleted, toggleCompleted, renderTopicsIndex, mountTopicsIndex, renderArticlesIndex, renderReadingIndex, renderWorkIndex, renderToolboxIndex, renderLibraryIndex, renderRelatedTrail, escapeHTML, openQuickCaptureModal, calculateProgress } = context;

function renderLibrary() {
  main.innerHTML = renderLibraryIndex({ items: library });
}

  return { renderLibrary };
}

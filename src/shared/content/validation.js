export const isPublished = (item) =>
  !["draft", "review"].includes(item.publication);
export function safeHref(value = "") {
  return /^(https?:\/\/|#\/|\.\/)/i.test(value) && !/[\s<>"]/.test(value)
    ? value
    : "";
}
export function validateContent(type, item) {
  const errors = [];
  const required = (k) => {
    if (typeof item[k] !== "string" || !item[k].trim()) errors.push(k);
  };
  required("id");
  required("title");
  if (item.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id))
    errors.push("id 格式");
  if (type === "note") {
    required("question");
    required("myUnderstanding");
    if (!item.myTake?.trim() && !item.oneLiner?.trim())
      errors.push("myTake 或 oneLiner");
  }
  if (type === "work") {
    required("problem");
    required("solution");
    if (!item.result?.trim() && !item.statusLabel?.trim())
      errors.push("result 或 statusLabel");
  }
  if (type === "tool") {
    required("problemSolved");
    if (["PLUGIN", "SCRIPT"].includes(item.type)) {
      required("usage");
      if (!safeHref(item.url)) errors.push("url");
    } else if (!item.promptTemplate?.trim() && !item.checklist?.length)
      errors.push("promptTemplate 或 checklist");
  }
  return errors;
}

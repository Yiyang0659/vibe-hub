/** Export user-visible messages and original image attachments from one local task. */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const [sessionDirectory, threadId, destination] = process.argv.slice(2);
if (!sessionDirectory || !threadId || !destination) {
  throw new Error('Usage: node scripts/export-codex-conversation.mjs SESSION_DIRECTORY THREAD_ID DESTINATION');
}
const output = resolve(destination);
await mkdir(join(output, 'images'), { recursive: true });
const files = (await readdir(sessionDirectory)).filter((name) => name.endsWith('.jsonl') && name.includes(threadId)).sort();
if (!files.length) throw new Error('No matching task records found.');
const messages = [];
for (const file of files) {
  for (const line of (await readFile(join(sessionDirectory, file), 'utf8')).split('\n').filter(Boolean)) {
    const record = JSON.parse(line);
    const message = record.payload;
    if (record.type !== 'response_item' || message?.type !== 'message') continue;
    if (!['user', 'assistant'].includes(message.role)) continue;
    if (message.channel && !['commentary', 'final'].includes(message.channel)) continue;
    if (message.role === 'assistant' && message.recipient && message.recipient !== 'all') continue;
    const parts = message.content || [];
    let body = parts.filter((part) => ['input_text', 'output_text', 'text'].includes(part.type)).map((part) => part.text || '').join('\n\n');
    // Remove app-injected setup/context, retaining the user's requests and page comments.
    body = body.replace(/<(recommended_plugins|environment_context|in-app-browser-context)\b[^>]*>[\s\S]*?<\/\1>/g, '').trim();
    if (!body && !parts.some((part) => part.type === 'input_image')) continue;
    messages.push({ timestamp: record.timestamp, role: message.role, channel: message.channel, body, parts });
  }
}
messages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
const seen = new Set();
const images = new Map();
const sections = [];
for (const message of messages) {
  const key = createHash('sha256').update(JSON.stringify([message.timestamp, message.role, message.body, message.parts.filter(p => p.type === 'input_image')])).digest('hex');
  if (seen.has(key)) continue;
  seen.add(key);
  let body = message.body;
  // Local attachment paths are machine-specific; original images are embedded below.
  body = body.replace(/C:[/\\]Users[/\\][^\r\n]*?[/\\]codex-clipboard-([\w-]+\.png)/gi, '[原附件：codex-clipboard-$1，见本条附图]');
  const attachments = [];
  for (const part of message.parts) {
    const match = /^data:image\/(png|jpeg|webp);base64,([\s\S]+)$/.exec(part.image_url || '');
    if (!match) continue;
    const bytes = Buffer.from(match[2], 'base64');
    const digest = createHash('sha256').update(bytes).digest('hex');
    let name = images.get(digest);
    if (!name) {
      name = `reference-${String(images.size + 1).padStart(2, '0')}.${match[1] === 'jpeg' ? 'jpg' : match[1]}`;
      await writeFile(join(output, 'images', name), bytes);
      images.set(digest, name);
    }
    attachments.push(`![用户提供的页面参考图](images/${name})`);
  }
  const time = new Date(message.timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
  sections.push(`## ${sections.length + 1}. ${message.role === 'user' ? '用户' : 'Codex'} · ${time}\n\n${body}${attachments.length ? '\n\n' + attachments.join('\n\n') : ''}`);
}
const header = `# 首页优化：Codex 对话记录\n\n- 任务：优化首页首屏页面\n- 任务 ID：\`${threadId}\`\n- 导出时间：${new Date().toISOString()}\n- 时区：Asia/Shanghai\n- 范围：截至本次导出时，本任务本地记录中的用户消息、Codex 可见回复和进度说明；包括中断前已记录的消息。\n- 整理说明：移除平台注入的环境信息；本机附件路径替换为附件说明，原始参考图保存在 images/。不包含系统指令、内部推理、工具调用及日志。正文保留当时的建议与表述，不代表每个方案都已实施。\n- 记录数量：${sections.length} 条消息，${images.size} 张独立参考图。\n\n---\n\n`;
await writeFile(join(output, 'conversation.md'), header + sections.join('\n\n---\n\n') + '\n');
console.log(JSON.stringify({ messages: sections.length, images: images.size, document: join(output, 'conversation.md') }));

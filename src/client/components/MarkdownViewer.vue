<template>
  <div v-html="markdownSource" :class="$style._"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import copyIcon from "@/client/icons/copy.svg?url";
import "highlight.js/styles/github.css";
import { ElMessage } from "element-plus";

const props = defineProps<{
  source: string;
}>();

const markdownSource = ref<string>("");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 使用 highlight.js 作为 markdown-it 的高亮器
md.options.highlight = (str: string, lang: string) => {
  if (lang && hljs.getLanguage(lang)) {
    const hasLang = !!(lang && hljs.getLanguage(lang));
    const codes = str.split("\n");
    const id = uuid();
    const toolBox = getCodeToolBox(hasLang, lang, id);
    try {
      return `<pre>
      ${toolBox}
     <div class="code-box">
      ${getLineBox(codes)}
      <code id="${id}" class="hljs language-${lang}">${hljs.highlight(lang, str, true).value}</code>
        </div>
        </pre>`;
    } catch (e) {
      console.error(e);
    }
    return "";
  }
};
const getLineBox = (array: Array<string>) => {
  let lis = "";
  if (array) {
    for (let i = 1; i < array.length; i++) {
      lis += `<li>${i}</li>`;
    }
  }
  return `<ul class="line-box">${lis}</ul>`;
};

const getCodeToolBox = (hasLang: boolean, lang: string, codeId: string) => {
  return `<div class="tool-box" >
      ${hasLang ? ` <div class="code-lang">${lang}</div>` : ""}
      ${getCodeTool(codeId, "复制")}
      </div>`;
};

const getCodeTool = (codeId: string, txt: string) => {
  return `<div class="toolbar" onclick="copy('${codeId}')"><img src="${copyIcon}" alt="复制"/><div>${txt ? txt : ""}</div></div>`;
};

const copy = (codeId: string) => {
  const textarea = document.createElement("textarea");
  const text = document.getElementById(codeId)?.innerText;
  if (!text) return;
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  ElMessage({ type: "success", message: "复制成功" });
};
watch(
  () => props.source,
  (value) => {
    if (value) {
      const data = value.replace(
        /^(```markdown|```)([\s\S]*?)(```$|$)/g,
        (match: string, p1: string, p2: string) => {
          if (p2) return p2;
          return "";
        },
      );
      answer.value = data;
      markdownSource.value = md.render(data);
    }
  },
  {
    immediate: true,
  },
);
onMounted(() => {
  window.copy = copy;
});
</script>
<style module lang="scss">
@use "src/styles/theme";

._ {
  :global {
  }
}
</style>

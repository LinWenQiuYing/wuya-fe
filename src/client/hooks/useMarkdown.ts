import { onMounted } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { ElMessage } from "element-plus";
import copyIcon from "@/client/icons/copy.svg?url";
import mk from "@iktakahiro/markdown-it-katex";

const useMarkdown = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  const defaultLinkOpenRenderer =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const hrefIndex = tokens[idx].attrIndex("href");
    if (hrefIndex >= 0) {
      // 添加 target="_blank" 属性
      tokens[idx].attrPush(["target", "_blank"]);
      tokens[idx].attrPush(["rel", "noopener noreferrer"]); // 安全性考虑
    }

    return defaultLinkOpenRenderer(tokens, idx, options, env, self);
  };
  // 支持数学公式
  md.use(mk);

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
      for (let i = 1; i <= array.length; i++) {
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
    return `<div class="toolbar" onclick="copyCode('${codeId}')"><img src="${copyIcon}" alt="复制"/><div>${txt ? txt : ""}</div></div>`;
  };

  const copyCode = (codeId: string) => {
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
  onMounted(() => {
    window.copyCode = copyCode;
  });
  return md;
};
export default useMarkdown;

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

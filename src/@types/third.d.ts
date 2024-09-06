declare module "quill-delta-to-markdown" {
  import { Delta } from "quill-delta";
  type Markdown = string;

  /**
   * Converter from the Delta document format used by the Quill text editor to Markdown.
   * @param delta Quill [Delta](https://quilljs.com/docs/delta)
   */
  export function deltaToMarkdown(delta: Delta): Markdown;
}

declare module "@slite/quill-delta-markdown" {
  import { Delta } from "quill-delta";
  export function toDelta(markdown: string): Delta;
  export function fromDelta(delta: Delta): string;
}

declare module "@iktakahiro/markdown-it-katex";

import { ClassicEditor as ClassicEditorBase } from "@ckeditor/ckeditor5-editor-classic";

import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Typing } from "@ckeditor/ckeditor5-typing";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
} from "@ckeditor/ckeditor5-basic-styles";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import { FindAndReplace } from "@ckeditor/ckeditor5-find-and-replace";
import { WordCount } from "@ckeditor/ckeditor5-word-count";
import {
  SpecialCharacters,
  SpecialCharactersEssentials,
} from "@ckeditor/ckeditor5-special-characters";
import { PageBreak } from "@ckeditor/ckeditor5-page-break";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { Link, LinkImage } from "@ckeditor/ckeditor5-link";
import { List } from "@ckeditor/ckeditor5-list";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import {
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
} from "@ckeditor/ckeditor5-table";
import {
  Image,
  ImageToolbar,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  ImageInsert,
  ImageResize,
} from "@ckeditor/ckeditor5-image";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office";
import { RemoveFormat } from "@ckeditor/ckeditor5-remove-format";
import { HorizontalLine } from "@ckeditor/ckeditor5-horizontal-line";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload";
import { ClipboardPipeline } from "@ckeditor/ckeditor5-clipboard";
import { ContextualBalloon } from "@ckeditor/ckeditor5-ui";
import {
  FontColor,
  FontBackgroundColor,
  FontSize,
  FontFamily,
} from "@ckeditor/ckeditor5-font";
import { Highlight } from "@ckeditor/ckeditor5-highlight";

// Theme + core engine
import "@ckeditor/ckeditor5-theme-lark/dist/index.css";
import "@ckeditor/ckeditor5-core/dist/index.css";
import "@ckeditor/ckeditor5-engine/dist/index.css";

// Required UI plugin CSS
import "@ckeditor/ckeditor5-paragraph/dist/index.css";
import "@ckeditor/ckeditor5-basic-styles/dist/index.css";
import "@ckeditor/ckeditor5-heading/dist/index.css";
import "@ckeditor/ckeditor5-list/dist/index.css";
import "@ckeditor/ckeditor5-link/dist/index.css";
import "@ckeditor/ckeditor5-table/dist/index.css";
import "@ckeditor/ckeditor5-image/dist/index.css";
import "@ckeditor/ckeditor5-code-block/dist/index.css";
import "@ckeditor/ckeditor5-indent/dist/index.css";
import "@ckeditor/ckeditor5-media-embed/dist/index.css";
import "@ckeditor/ckeditor5-paste-from-office/dist/index.css";

class ClassicCustomEditor extends ClassicEditorBase {}

ClassicCustomEditor.builtinPlugins = [
  Essentials,
  Typing,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Paragraph,
  Heading,
  ContextualBalloon,
  Link,
  List,
  BlockQuote,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  ImageInsert,
  MediaEmbed,
  CodeBlock,
  PasteFromOffice,
  RemoveFormat,
  HorizontalLine,
  Indent,
  IndentBlock,
  Base64UploadAdapter,
  ClipboardPipeline,
  FontColor,
  FontBackgroundColor,
  FontSize,
  FontFamily,
  Highlight,
  LinkImage,
  TableProperties,
  TableCellProperties,
  Alignment,
  FindAndReplace,
  Autoformat,
  WordCount,
  SpecialCharacters,
  SpecialCharactersEssentials,
  PageBreak,
];

ClassicCustomEditor.defaultConfig = {
  licenseKey: "GPL",
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "subscript",
      "superscript",
      "removeFormat",
      "|",
      "fontFamily",
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "highlight",
      "|",
      "link",
      "linkImage",
      "bulletedList",
      "numberedList",
      "alignment",
      "outdent",
      "indent",
      "|",
      "blockQuote",
      "codeBlock",
      "insertTable",
      "horizontalLine",
      "pageBreak",
      "|",
      "imageUpload",
      "mediaEmbed",
      "|",
      "findAndReplace",
      "specialCharacters",
      "|",
      "undo",
      "redo",
    ],
  },
  balloonToolbar: [],
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      { model: "heading1", view: "h1", title: "Heading 1" },
      { model: "heading2", view: "h2", title: "Heading 2" },
      { model: "heading3", view: "h3", title: "Heading 3" },
      { model: "heading4", view: "h4", title: "Heading 4" },
      { model: "heading5", view: "h5", title: "Heading 5" },
      { model: "heading6", view: "h6", title: "Heading 6" },
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
    ],
  },
  image: {
    insert: {
      integrations: ["upload", "url"],
    },
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative",
    ],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  language: "en",
};

export default ClassicCustomEditor;

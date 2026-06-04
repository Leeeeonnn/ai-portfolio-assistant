import type { ReactNode } from "react";

type MarkdownRendererProps = {
  content: string;
};

type ListItem = {
  ordered: boolean;
  text: string;
};

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${token}-${match.index}`}>
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(<code key={`${token}-${match.index}`}>{token.slice(1, -1)}</code>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = linkMatch?.[2] ?? "";
      const isSafeHref = /^(https?:|mailto:|\/)/.test(href);

      nodes.push(
        <a
          href={isSafeHref ? href : "#"}
          key={`${token}-${match.index}`}
          rel="noreferrer"
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {linkMatch?.[1] ?? token}
        </a>,
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks: ReactNode[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <pre key={`code-${index}`}>
          <code data-language={language || undefined}>{codeLines.join("\n")}</code>
        </pre>,
      );
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);

    if (heading) {
      const level = heading[1].length;
      const text = heading[2];

      if (level === 1) {
        blocks.push(<h2 key={`heading-${index}`}>{renderInline(text)}</h2>);
      } else if (level === 2) {
        blocks.push(<h3 key={`heading-${index}`}>{renderInline(text)}</h3>);
      } else {
        blocks.push(<h4 key={`heading-${index}`}>{renderInline(text)}</h4>);
      }

      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].slice(2));
        index += 1;
      }

      blocks.push(
        <blockquote key={`quote-${index}`}>
          {quoteLines.map((quoteLine, quoteIndex) => (
            <p key={`${quoteLine}-${quoteIndex}`}>{renderInline(quoteLine)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    const listItems: ListItem[] = [];

    while (index < lines.length) {
      const current = lines[index];
      const unordered = current.match(/^\s*[-*]\s+(.+)$/);
      const ordered = current.match(/^\s*\d+\.\s+(.+)$/);

      if (!unordered && !ordered) {
        break;
      }

      listItems.push({
        ordered: Boolean(ordered),
        text: unordered?.[1] ?? ordered?.[1] ?? "",
      });
      index += 1;
    }

    if (listItems.length > 0) {
      const ordered = listItems.every((item) => item.ordered);
      const ListTag = ordered ? "ol" : "ul";

      blocks.push(
        <ListTag key={`list-${index}`}>
          {listItems.map((item, itemIndex) => (
            <li key={`${item.text}-${itemIndex}`}>{renderInline(item.text)}</li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;

    while (index < lines.length && lines[index].trim()) {
      const nextLine = lines[index];
      const startsNextBlock =
        nextLine.startsWith("```") ||
        nextLine.startsWith("> ") ||
        /^(#{1,3})\s+/.test(nextLine) ||
        /^\s*[-*]\s+/.test(nextLine) ||
        /^\s*\d+\.\s+/.test(nextLine);

      if (startsNextBlock) {
        break;
      }

      paragraphLines.push(nextLine.trim());
      index += 1;
    }

    blocks.push(
      <p key={`paragraph-${index}`}>
        {renderInline(paragraphLines.join("\n"))}
      </p>,
    );
  }

  return <div className="markdown-content">{blocks}</div>;
}

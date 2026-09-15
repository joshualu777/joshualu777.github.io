export const MAX_CSV_BYTES = 2 * 1024 * 1024;
export const MAX_CARDS = 5000;

/** RFC 4180-style CSV: quoted commas, escaped quotes, embedded newlines and BOMs. */
export function parseCsv(input: string): string[][] {
  if (new TextEncoder().encode(input).length > MAX_CSV_BYTES) {
    throw new Error('CSV must be smaller than 2 MB.');
  }
  const text = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let closedQuote = false;

  function endField() {
    row.push(field.trim());
    field = '';
    closedQuote = false;
  }
  function endRow() {
    endField();
    if (row.some((value) => value !== '')) rows.push(row);
    row = [];
    if (rows.length > MAX_CARDS + 1)
      throw new Error(
        `CSV supports up to ${MAX_CARDS.toLocaleString('en-US')} cards.`,
      );
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
        closedQuote = true;
      } else field += char;
    } else if (char === ',') endField();
    else if (char === '\r' || char === '\n') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      endRow();
    } else if (closedQuote) {
      if (!/\s/.test(char))
        throw new Error(
          `Unexpected text after a closing quote near record ${rows.length + 1}.`,
        );
    } else if (char === '"') {
      if (field.trim() !== '')
        throw new Error(`Unexpected quote near record ${rows.length + 1}.`);
      field = '';
      quoted = true;
    } else field += char;
  }
  if (quoted) throw new Error('An opening quote is missing its closing quote.');
  if (field || row.length || closedQuote) endRow();
  return rows;
}

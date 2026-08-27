// Runtime values for the content mapper protocol enums, copied from
// TypeScript's protocol definition in
// https://github.com/microsoft/typescript-go/pull/4712 (the `SpanMapKind`,
// `SpanMapFeature`, and `DiagnosticDirectivePolicy` enums; revised by
// https://github.com/microsoft/TypeScript/pull/63936). TypeScript owns these
// values; they must match what the compiler sends and expects.
// See src/protocol.ts for the full protocol types.

export const SpanMapKind = /** @type {const} */ ({
  Verbatim: 0,
  Atom: 1,
  Alias: 2,
});

export const DiagnosticDirectivePolicy = /** @type {const} */ ({
  Ignore: 0,
  Expect: 1,
});

export const SpanMapFeature = /** @type {const} */ ({
  None: 0,
  Hover: 1 << 0,
  SignatureHelp: 1 << 1,
  Completion: 1 << 2,
  Definition: 1 << 3,
  TypeDefinition: 1 << 4,
  Implementation: 1 << 5,
  References: 1 << 6,
  DocumentHighlights: 1 << 7,
  Rename: 1 << 8,
  CallHierarchy: 1 << 9,
  CodeActions: 1 << 10,
  Formatting: 1 << 11,
  InlayHints: 1 << 12,
  SemanticTokens: 1 << 13,
  FoldingRanges: 1 << 14,
  SelectionRanges: 1 << 15,
  LinkedEditing: 1 << 16,
  AutoInsert: 1 << 17,
  DocumentSymbols: 1 << 18,
  CodeLens: 1 << 19,
  All: (1 << 20) - 1,
});

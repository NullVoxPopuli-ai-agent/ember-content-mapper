// Type definitions for the TypeScript 7 content mapper protocol, as specified
// in https://github.com/microsoft/typescript-go/pull/4712 and revised in
// https://github.com/microsoft/TypeScript/pull/63936.
//
// This file is types-only. Runtime values for the enums live in
// `./constants.js` so that the mapper can run without a build step.

import type { CompilerOptions } from 'typescript';

export type PositionEncoding = 'utf-8' | 'utf-16';

export interface InitializeParams {
  /** Sent by current TypeScript nightlies; #63936 replaces this with capabilities. */
  protocolVersion: 1;
  /** The position encodings supported by TypeScript. The mapper must choose one of these encodings. */
  positionEncodings: PositionEncoding[];
  /** BCP 47 locale requested for diagnostics. */
  locale?: string;
}

export interface InitializeResult {
  /** Must match the protocolVersion sent in InitializeParams. */
  protocolVersion: 1;
  /** The position encoding the mapper will use for all span mapping positions and diagnostic positions. */
  positionEncoding: PositionEncoding;
  /**
   * The source identifier displayed for mapper-produced diagnostics.
   * Must not be "ts", "tsc", "typescript", or any file extension TypeScript understands.
   */
  diagnosticSource: string;
}

export interface OpenProjectParams {
  /** Absolute tsconfig path, or an empty string for a project without a config file. */
  configFileName: string;
  /** Opaque process-local handle assigned by TypeScript. */
  projectHandle: string;
  /** Object from the contentMappers entry, when specified. */
  options?: Record<string, unknown>;
  /** The project's effective compiler options. */
  compilerOptions: CompilerOptions;
}

export interface OpenProjectResult {
  /**
   * Stable fingerprint of all dynamically discovered configuration that can affect transforms.
   * Required, and only allowed, when the mapper declares `dynamicConfig: true`.
   */
  configIdentity?: string;
  /**
   * Absolute file names whose changes may alter configIdentity or transform output.
   * May only be returned when the package declares `dynamicConfig: true`.
   */
  watchedFiles?: string[];
  /** Diagnostics for invalid values in this mapper's contentMappers options object. */
  optionDiagnostics?: OptionDiagnostic[];
}

export interface OptionDiagnostic {
  /**
   * Property names and nonnegative array indexes relative to the mapper entry's options object.
   * An empty path reports the diagnostic on the options object itself.
   */
  path: (string | number)[];
  messageText: string;
  code?: number;
}

export interface TransformParams {
  fileName: string;
  /** Original content of the file to be transformed. */
  content: string;
  /** Project handle supplied in openProject. */
  projectHandle: string;
}

export interface MappedOutput {
  /** Valid JS, JSX, TS, TSX, or JSON text that TypeScript can parse. */
  text: string;
  /** The virtual file extension that determines how TypeScript parses this output. */
  extension: '.js' | '.jsx' | '.mjs' | '.cjs' | '.ts' | '.tsx' | '.mts' | '.cts' | '.json';
  /** Mappings between the original and transformed content. */
  mappings?: SpanMapping[];
  /** Framework-specific directives that suppress TypeScript diagnostics in virtual ranges. */
  diagnosticDirectives?: DiagnosticDirectives;
}

export type DiagnosticDirectivePolicy = 0 | 1;

export interface UnusedExpectDirectiveDiagnostic {
  /** Diagnostic code reported when an `Expect` directive suppresses no diagnostics. */
  code: number;
  /** Diagnostic text reported when an `Expect` directive suppresses no diagnostics. */
  messageText: string;
}

export interface DiagnosticDirectives {
  /** Shared diagnostics reported for unused `Expect` directives. */
  unusedExpectDirectiveDiagnostics: UnusedExpectDirectiveDiagnostic[];
  directives: MappedDiagnosticDirective[];
}

/** Positions and lengths are in the specified `positionEncoding`. */
export type MappedDiagnosticDirective = [
  /** Location of the framework directive in the original source. */
  originalStart: number,
  originalLength: number,
  /** Region of virtual code affected by the directive. */
  virtualStart: number,
  virtualEnd: number,
  policy: DiagnosticDirectivePolicy,
  /**
   * Index into `unusedExpectDirectiveDiagnostics`. Required for `Expect` directives
   * when the array contains more than one entry.
   */
  unusedExpectDirectiveIndex?: number,
];

export interface TransformResult extends MappedOutput {
  /** Parse errors in the original content. */
  diagnostics?: MapperDiagnostic[];
  /** Additional virtual files associated with this input. */
  supplemental?: MappedOutput[];
}

/** Start and length are in the specified `positionEncoding`. */
export interface MapperDiagnostic {
  messageText: string;
  start: number;
  length: number;
  code?: number;
}

export interface CloseProjectParams {
  /** Project handle supplied in openProject. */
  projectHandle: string;
}

/** Positions and lengths are in the specified `positionEncoding`. */
export type SpanMapping = [
  virtualStart: number,
  virtualLength: number,
  originalStart: number,
  originalLength: number,
  kind: SpanMapKind,
  features?: number,
];

/**
 * 0 = Verbatim: same length and content in both texts.
 * 1 = Atom: lengths and content may differ.
 * 2 = Alias: lengths and content may differ, but diagnostics display the original text.
 */
export type SpanMapKind = 0 | 1 | 2;

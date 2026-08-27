/**
 * @import { InitializeResult } from '../protocol.js'
 */

/**
 * @returns {InitializeResult}
 *   The result for the `initialize` request.
 */
export function initialize() {
  return {
    // TypeScript nightlies still implement the initial protocol from
    // microsoft/typescript-go#4712, which requires echoing protocolVersion.
    // microsoft/TypeScript#63936 replaces the field with capabilities.
    protocolVersion: 1,
    positionEncoding: 'utf-16',
    diagnosticSource: 'glint',
  };
}

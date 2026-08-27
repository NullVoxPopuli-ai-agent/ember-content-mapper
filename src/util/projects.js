/**
 * @import { GlintEnvironment } from '@glint/ember-tsc/config/index'
 * @import { OpenProjectParams } from '../protocol.js'
 */

/**
 * @typedef {object} Project
 * @property {OpenProjectParams} params
 *   The parameters the project was opened with.
 * @property {GlintEnvironment} environment
 *   The Glint environment used to transform files in this project.
 * @property {string} referencePrefix
 *   Triple-slash references prepended to every module transformed for this
 *   project, so that the types the transform needs do not have to be listed in
 *   the project's `compilerOptions.types`.
 */

/**
 * @type {Map<string, Project>}
 */
export const projects = new Map();

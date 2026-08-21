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
 */

/**
 * @type {Map<string, Project>}
 */
export const projects = new Map();

import { createRequire } from 'node:module';

/**
 * Resolve the installed `ember-source`, the same way Glint's
 * ember-template-imports environment probes it: starting from
 * `@glint/ember-tsc`'s own location. The probe's result decides whether the
 * transform treats the Ember 7.1 built-in keywords (`fn`, `eq`, `and`, ...)
 * as globals, so it is part of this mapper's dynamic configuration identity.
 *
 * @returns {{ version: string, packageJsonPath: string } | undefined}
 *   The resolved `ember-source` version and manifest path, if installed.
 */
export function probeEmberSource() {
  try {
    const fromEmberTsc = createRequire(import.meta.resolve('@glint/ember-tsc/transform'));
    const packageJsonPath = fromEmberTsc.resolve('ember-source/package.json');
    const manifest = /** @type {{ version?: unknown }} */ (fromEmberTsc(packageJsonPath));
    if (typeof manifest.version !== 'string') {
      return undefined;
    }

    return { version: manifest.version, packageJsonPath };
  } catch {
    return undefined;
  }
}

/*
useStdoutDimensions() hook copied from
https://github.com/cameronhunter/ink-monorepo/blob/99a99e7bb13bee76c0eace3ff3fc2ce2611ea3a7/packages/ink-use-stdout-dimensions/src/index.ts

Avoiding error about ESM compatibility:

  Error: require() of ES Module /Users/jrr/repos/inkle/.yarn/__virtual__/ink-virtual-3a3ad512cb/0/cache/ink-npm-4.0.0-667357cd7d-7cd120ed65.zip/node_modules/ink/build/index.js from /Users/jrr/repos/inkle/.yarn/__virtual__/ink-use-stdout-dimensions-virtual-ea691be763/0/cache/ink-use-stdout-dimensions-npm-1.0.5-f1d9dd12c6-71fb471ed6.zip/node_modules/ink-use-stdout-dimensions/build/index.js not supported.
  Instead change the require of /Users/jrr/repos/inkle/.yarn/__virtual__/ink-virtual-3a3ad512cb/0/cache/ink-npm-4.0.0-667357cd7d-7cd120ed65.zip/node_modules/ink/build/index.js in /Users/jrr/repos/inkle/.yarn/__virtual__/ink-use-stdout-dimensions-virtual-ea691be763/0/cache/ink-use-stdout-dimensions-npm-1.0.5-f1d9dd12c6-71fb471ed6.zip/node_modules/ink-use-stdout-dimensions/build/index.js to a dynamic import() which is available in all CommonJS modules.

(may be able to go back to using package in the future)
 */

import { useEffect, useState } from "react";
import { useStdout } from "ink";

export function useStdoutDimensions(): [number, number] {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState<[number, number]>([
    stdout.columns,
    stdout.rows,
  ]);

  useEffect(() => {
    const handler = () => setDimensions([stdout.columns, stdout.rows]);
    stdout.on("resize", handler);
    return () => {
      stdout.off("resize", handler);
    };
  }, [stdout]);

  return dimensions;
}

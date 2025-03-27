import PhysX from "physx-js-webidl/physx-js-webidl.js";

const PhysXWasm = PhysX({
  locateFile: (path: string, prefix: string) => {
    // Transform paths to be relative to the public folder
    return prefix
      ? `/physx-js-webidl/${prefix}/${path}`
      : `/physx-js-webidl/${path}`;
  },
});

export { PhysXWasm as PhysX };

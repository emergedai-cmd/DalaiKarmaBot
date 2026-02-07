// ESM-only minimal router.
// Deterministic and side-effect free for DalaiKarmaBot CLI tests.

/** @param {string[]} argv */
export async function tryRouteCli(argv) {
  void argv;
  return false;
}

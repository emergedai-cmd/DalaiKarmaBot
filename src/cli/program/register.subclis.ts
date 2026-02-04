import type { Command } from "commander";

const MINIMAL = process.env.DKB_PUBLISH_MINIMAL === "1";

export async function registerSubCLIs(program: Command) {
  // Always available
  const { registerInitSubcli } = await import("../init/register.js");
  registerInitSubcli(program);

  // Minimal publish build stops here
  if (MINIMAL) return;

  // Full build: load the rest only when not minimal
  const [
    { registerChatSubcli },
    { registerDoctorSubcli },
    // ...whatever else you have
  ] = await Promise.all([
    import("../chat/register.js"),
    import("../doctor/register.js"),
    // ...
  ]);

  registerChatSubcli(program);
  registerDoctorSubcli(program);
  // ...
}

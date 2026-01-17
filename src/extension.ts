import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";
import * as os from "os";

let hasPlayed = false;

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.onDidChangeDiagnostics(() => {
    const enabled = vscode.workspace
      .getConfiguration("fahhError")
      .get<boolean>("enabled", true);

    if (!enabled) return;

    const diagnostics = vscode.languages.getDiagnostics();

    let hasError = false;

    for (const [, issues] of diagnostics) {
      if (
        issues.some(d => d.severity === vscode.DiagnosticSeverity.Error)
      ) {
        hasError = true;
        break;
      }
    }

    // Play only once per error state
    if (hasError && !hasPlayed) {
      playFahh(context);
      hasPlayed = true;
    }

    // Reset when errors are fixed
    if (!hasError) {
      hasPlayed = false;
    }
  });
}

function playFahh(context: vscode.ExtensionContext) {
  const soundPath = path.join(context.extensionPath, "media", "fahh.mp3");
  const platform = os.platform();

  if (platform === "darwin") {
    exec(`afplay "${soundPath}"`);
  } else if (platform === "win32") {
    exec(
      `powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync();`
    );
  } else {
    exec(`aplay "${soundPath}"`);
  }
}

export function deactivate() {
  hasPlayed = false;
}

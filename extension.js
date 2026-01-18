const vscode = require("vscode");
const path = require("path");
const { exec } = require("child_process");
const os = require("os");

let lastErrorCount = 0;

function activate(context) {
  // 🔊 Manual test command (very important)
  const testCommand = vscode.commands.registerCommand(
    "fahhError.test",
    () => {
      playFahh(context);
      vscode.window.showInformationMessage("FAHH sound played!");
    }
  );

  context.subscriptions.push(testCommand);

  // 📡 Listen to VS Code diagnostics (red squiggles)
  vscode.languages.onDidChangeDiagnostics(() => {
    const enabled = vscode.workspace
      .getConfiguration("fahhError")
      .get("enabled", true);

    if (!enabled) return;

    const diagnostics = vscode.languages.getDiagnostics();
    let currentErrorCount = 0;

    for (const [, issues] of diagnostics) {
      currentErrorCount += issues.filter(
        d => d.severity === vscode.DiagnosticSeverity.Error
      ).length;
    }

    // 🔊 Play when error count increases
    if (currentErrorCount > lastErrorCount) {
      playFahh(context);
    }

    lastErrorCount = currentErrorCount;
  });
}

function playFahh(context) {
  const basePath = context.extensionPath;

  try {
    if (os.platform() === "darwin") {
      // 🍎 macOS — MP3 works
      const mp3 = path.join(basePath, "media", "fahh.mp3");
      exec(`afplay "${mp3}"`);
    } 
    else if (os.platform() === "win32") {
      // 🪟 Windows — MUST use WAV
      const wav = path.join(basePath, "media", "fahh.wav");

      exec(
        `powershell -NoProfile -Command `
        + `"$player = New-Object System.Media.SoundPlayer('${wav}'); `
        + `$player.Load(); `
        + `$player.PlaySync();"`
      );
    } 
    else if (os.platform() === "linux") {
      // 🐧 Linux — best effort
      const mp3 = path.join(basePath, "media", "fahh.mp3");
      exec(`aplay "${mp3}" || paplay "${mp3}"`);
    }
  } catch {
    // Never crash VS Code
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};

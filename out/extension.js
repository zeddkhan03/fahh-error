"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
let hasPlayed = false;
function activate(context) {
    vscode.languages.onDidChangeDiagnostics(() => {
        const enabled = vscode.workspace
            .getConfiguration("fahhError")
            .get("enabled", true);
        if (!enabled)
            return;
        const diagnostics = vscode.languages.getDiagnostics();
        let hasError = false;
        for (const [, issues] of diagnostics) {
            if (issues.some(d => d.severity === vscode.DiagnosticSeverity.Error)) {
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
function playFahh(context) {
    const soundPath = path.join(context.extensionPath, "media", "fahh.mp3");
    const platform = os.platform();
    if (platform === "darwin") {
        (0, child_process_1.exec)(`afplay "${soundPath}"`);
    }
    else if (platform === "win32") {
        (0, child_process_1.exec)(`powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync();`);
    }
    else {
        (0, child_process_1.exec)(`aplay "${soundPath}"`);
    }
}
function deactivate() {
    hasPlayed = false;
}
//# sourceMappingURL=extension.js.map
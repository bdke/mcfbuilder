import * as path from "path";
import { workspace, ExtensionContext, languages, DocumentSelector } from "vscode";
import * as vscode from "vscode";

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
} from "vscode-languageclient/node";
import { semanticProvier, semanticLegend } from "./semanticToken";
import { builtInClasses, builtInClassesData, executeKeywords, ifKeywords } from "./tokens";
import { Variables } from "./completion";

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(
        path.join("src", "js", "server.js")
    );
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions,
        },
    };

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: "file", language: "mcf" }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };

    // Create the language client and start the client.
    client = new LanguageClient(
        "mcf",
        "Language Server Example",
        serverOptions,
        clientOptions
    );
    const selector: DocumentSelector = {
        language: 'mcf',
        scheme: 'file'
    }
    languages.registerDocumentSemanticTokensProvider(selector, semanticProvier , semanticLegend);
    const completionProvider = languages.registerCompletionItemProvider(
        selector,
        {
            provideCompletionItems(document, position, token, context) {
                let variablesPattern = /(var|global)\s*([a-zA-Z_][a-zA-Z0-9_]*)/g;
                const linePrefix = document.lineAt(position).text.substring(0, position.character);
                for (let item of builtInClassesData) {
                    if (linePrefix.endsWith(`${item.name}.`)) {

                        var methods: vscode.CompletionItem[] = [];
                        for (let method of item.staticMethods) {
                            methods.push(new vscode.CompletionItem(method, vscode.CompletionItemKind.Method));
                        }
                        return methods;
                    }
                    var regex = /(var|global)\s*([a-zA-Z_][a-zA-Z0-9_]*)(\s*=\s*new\s*([a-zA-Z_][a-zA-Z0-9_]*))?/g

                    let result: any;
                    while ((result = regex.exec(document.getText())) !== null) {
                        var data = builtInClassesData.filter(v => v.name == result[4])[0]
                        if (linePrefix.endsWith(`${result[2]}.`)) {
                            var methods: vscode.CompletionItem[] = [];
                            for (let method of data.methods) {
                                methods.push(new vscode.CompletionItem(method, vscode.CompletionItemKind.Method));
                            }
                            return methods;
                        }
                    }
                }
                return undefined;
            }
        },
        "."
    )
    const completionProvider2 = languages.registerCompletionItemProvider(
        selector,
        {
            provideCompletionItems(document, position, token, context) {
                const linePrefix = document.lineAt(position).text.substring(0, position.character);
                if (linePrefix.endsWith("if ")) {
                    var items: vscode.CompletionItem[] = [];
                    for (var keyword of ifKeywords) {
                        var item = new vscode.CompletionItem(keyword.keyword, vscode.CompletionItemKind.Snippet);
                        item.insertText = new vscode.SnippetString(keyword.snippet);
                        item.command = {command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...'};
                        items.push(item);
                    }
                    return items;
                }
                else if (linePrefix.endsWith("execute ")) {
                    var items: vscode.CompletionItem[] = [];
                    for (var keyword of executeKeywords) {
                        var item = new vscode.CompletionItem(keyword.keyword, vscode.CompletionItemKind.Snippet);
                        item.insertText = new vscode.SnippetString(keyword.snippet);
                        item.command = {command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...'};
                        items.push(item);
                    }
                    return items;
                }
                return undefined;
            }
        },
        " "
    )
    // Start the client. This will also launch the server
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

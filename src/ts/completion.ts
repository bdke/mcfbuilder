import * as vscode from "vscode";
import { CompletionItem, CompletionItemKind } from "vscode-languageserver/node";
import { keywords, builtInClasses, builtInFuntions, builtInEnumsData } from "./tokens";

interface VariableType {
    name: string,
    type: string
}

export const Variables: VariableType[] = [];
let selectorKeywords = ["@s", "@p", "@r", "@e", "@a"];
//TODO: Remember to show the completion if it is visible in the current function
export async function getDefinedCompletionItems(text: string): Promise<CompletionItem[]> {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.

    let completion: CompletionItem[] = [];

    //built in things
    for (let i = 0; i < keywords.length; i++) {
        completion.push({
            label: keywords[i],
            kind: CompletionItemKind.Keyword,
        });
    }

    for (let i = 0; i < builtInFuntions.length; i++) {
        completion.push({
            label: builtInFuntions[i],
            kind: CompletionItemKind.Function,
        });
    }

    for (let i = 0; i < selectorKeywords.length; i++) {
        completion.push({
            label: selectorKeywords[i],
            kind: CompletionItemKind.Constant,
        });
    }

    for (let i of builtInClasses) {
        completion.push(
            {
                label: i,
                kind: CompletionItemKind.Class
            }
        );
    }

    for (let item of builtInEnumsData) {
        completion.push(
            {
                label: item.name,
                kind: CompletionItemKind.Enum
            }
        );
    }

    //Users Things
    let variablesPattern = /(var|global)\s*([a-zA-Z_][a-zA-Z0-9_]*)(\s*=\s*new\s*([a-zA-Z_][a-zA-Z0-9_]*))?/g;
    let variablesResult: any = text.match(variablesPattern);
    console.log(variablesResult);
    for (let i = 0; i < variablesResult?.length; i++) {
        completion.push({
            label: variablesResult[i].split(" ")[1],
            kind: CompletionItemKind.Variable,
        });
    }

    let functionPattern = /def\s*[a-zA-Z_][a-zA-Z0-9_]*/g;
    let funtionResult = text.match(functionPattern);
    if (funtionResult != null) {
        for (let i = 0; i < funtionResult.length; i++) {
            completion.push({
                label: funtionResult[i].split(" ")[1],
                kind: CompletionItemKind.Function,
            });
        }
    }

    //SUS
    completion.push({
        label: "AMOGUS",
        kind: CompletionItemKind.Text,
    });

    return completion;
}

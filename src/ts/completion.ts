import * as vscode from "vscode";
import { CompletionItem, CompletionItemKind, _Connection } from "vscode-languageserver/node";
import { keywords, builtInClasses, builtInFuntions, builtInEnumsData } from "./tokens";

interface VariableType {
    name: string,
    type: string
}

export const Variables: VariableType[] = [];
const definedVariables: {name:string,type:string}[] = [];
var globalDefinedVariables: {name:string,type:string}[] = [];
let selectorKeywords = ["@s", "@p", "@r", "@e", "@a"];

export async function getDefinedCompletionItems(text: string, connection: _Connection): Promise<CompletionItem[]> {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    let completion: CompletionItem[] = [];
    definedVariables.splice(0,definedVariables.length);

    let variablesPattern = /(var|global)\s*([a-zA-Z_][a-zA-Z0-9_]*)(\s*=\s*new\s*([a-zA-Z_][a-zA-Z0-9_]*))?/g;
    let variableResult: any;

    while ((variableResult = variablesPattern.exec(text)) !== null) {
        if (variableResult[1] == "var") {
            definedVariables.push({
                name: variableResult[2],
                type: variableResult[4]
            });
        }
        //Maybe detect for whole workspace
        //!have a nice day on debugging :))))))))))))
        else if (variableResult[1] == "global") {
            if (globalDefinedVariables.find(v => v.name == variableResult[2]) === undefined) {
                globalDefinedVariables.push({
                    name: variableResult[2],
                    type: variableResult[4]
                })
            }
        }
    }

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
    // let variablesResult: any = text.match(variablesPattern);
    // for (let i = 0; i < variablesResult?.length; i++) {
    //     completion.push({
    //         label: variablesResult[i].split(" ")[1],
    //         kind: CompletionItemKind.Variable,
    //     });
    // }
    for (let i of definedVariables) {
        completion.push(
            {
                label: i.name,
                kind: CompletionItemKind.Variable
            }
        )
    }

    for (let i of globalDefinedVariables) {
        completion.push(
            {
                label: i.name,
                kind: CompletionItemKind.Variable
            }
        )
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

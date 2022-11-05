import * as vscode from 'vscode';
import { builtInClasses, builtInClassesData, builtInEnumsData, builtInFuntions } from "./tokens";

const definedVariables: {name:string,type:string,file:string,modifier:string}[] = [];
const tokenTypes = ['class','variable','function','enum','enumMember','method'];
const tokenModifiers = ['declaration'];
export const semanticLegend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

//TODO: variable semantic highlight ok, remember to add *.static also :)))))))))
export const semanticProvier: vscode.DocumentSemanticTokensProvider = {
    provideDocumentSemanticTokens(
        document: vscode.TextDocument, 
        token: vscode.CancellationToken): 
        vscode.ProviderResult<vscode.SemanticTokens> {
            const builder = new vscode.SemanticTokensBuilder(semanticLegend);

            var text = document.getText();
            let variablesPattern = /(var|global)\s*([a-zA-Z_][a-zA-Z0-9_]*)(\s*=\s*new\s*([a-zA-Z_][a-zA-Z0-9_]*))?/g;
            //let variablesResult: RegExpMatchArray | null = text.match(variablesPattern);

            
            let variableResult;
            while ((variableResult = variablesPattern.exec(text)) !== null) {
                definedVariables.push({
                    name: variableResult[2],
                    type: variableResult[4],
                    file: document.fileName,
                    modifier: variableResult[1]
                })
            }

            var lines = text.split("\n")
            var lineDatas: number[] = [];
            for (var line of lines) {
                lineDatas.push(line.length + 1);
            }

            function getCharacterLine(num: number): number[] {
                var counter = 0;
                for (let i = 0; i < lineDatas.length; i++) {
                    var count = counter + lineDatas[i];
                    if (count >= num) {
                        return [i+1, (num - counter)]
                    }
                    counter += lineDatas[i];
                }
                throw new Error();
            }
            let result: any;
            for (let item of definedVariables) {
                if (item.file !== document.fileName) {
                    continue;
                }
                var regex = new RegExp("\\b" + item.name + "\\b","g");
                while ((result = regex.exec(text)) !== null) {
                    var pos = getCharacterLine(regex.lastIndex);
                    builder.push(
                        new vscode.Range(
                            new vscode.Position(pos[0]-1, pos[1]-item.name.length),
                            new vscode.Position(pos[0]-1, pos[1])
                        ),
                        'variable',
                        ['declaration']
                    )
                }
            }


            for (let item of builtInClasses) {
                var regex = new RegExp("\\b" + item + "\\b","g");
                while ((result = regex.exec(text)) !== null) {
                    var pos = getCharacterLine(regex.lastIndex);
                    builder.push(
                        new vscode.Range(
                            new vscode.Position(pos[0]-1, pos[1]-item.length),
                            new vscode.Position(pos[0]-1, pos[1])
                        ),
                        'class',
                        ['declaration']
                    )
                }
            }
            for (let i of builtInClassesData) {
                for (let variable of definedVariables) {
                    for (let method of i.methods) {
                        var regex = new RegExp("\\b" + variable.name + '\\.' + method + "\\b","g");
                        while ((result = regex.exec(text)) !== null) {
                            var pos = getCharacterLine(regex.lastIndex);
                            builder.push(
                                new vscode.Range(
                                    new vscode.Position(pos[0]-1, pos[1]-method.length),
                                    new vscode.Position(pos[0]-1, pos[1])
                                ),
                                'method',
                                ['declaration']
                            )
                        }
                    }
                }

                for (let method of i.staticMethods) {
                    var regex = new RegExp("\\b" + i.name + '\\.' + method + "\\b","g");
                    while ((result = regex.exec(text)) !== null) {
                        var pos = getCharacterLine(regex.lastIndex);
                        builder.push(
                            new vscode.Range(
                                new vscode.Position(pos[0]-1, pos[1]-method.length),
                                new vscode.Position(pos[0]-1, pos[1])
                            ),
                            'method',
                            ['declaration']
                        )
                    }
                }
            }

            for (let item of builtInFuntions) {
                var regex = new RegExp("\\b" + item + "\\b","g");
                while ((result = regex.exec(text)) !== null) {
                    var pos = getCharacterLine(regex.lastIndex);
                    builder.push(
                        new vscode.Range(
                            new vscode.Position(pos[0]-1, pos[1]-item.length),
                            new vscode.Position(pos[0]-1, pos[1])
                        ),
                        'function',
                        ['declaration']
                    )
                }
            }

            for (let item of builtInEnumsData) {
                var regex = new RegExp("\\b" + item.name + "\\b","g");
                while ((result = regex.exec(text)) !== null) {
                    var pos = getCharacterLine(regex.lastIndex);
                    builder.push(
                        new vscode.Range(
                            new vscode.Position(pos[0]-1, pos[1]-item.name.length),
                            new vscode.Position(pos[0]-1, pos[1])
                        ),
                        'enum',
                        ['declaration']
                    )
                }
            }
            
            for (let item of builtInEnumsData) {
                var regex = new RegExp("\\b" + item.name + "\\.([a-zA-Z_][a-zA-Z0-9_]*)" + "\\b","g");
                while ((result = regex.exec(text)) !== null) {
                    var pos = getCharacterLine(regex.lastIndex);
                    var member = item.members.find(v => v == result[1]);
                    if (member == null) {
                        continue;
                    }
                    builder.push(
                        new vscode.Range(
                            new vscode.Position(pos[0]-1, pos[1]-member?.length),
                            new vscode.Position(pos[0]-1, pos[1])
                        ),
                        'enumMember',
                        ['declaration']
                    )
                }
            }



            return builder.build();
    }
}

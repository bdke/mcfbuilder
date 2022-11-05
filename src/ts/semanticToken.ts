import * as vscode from 'vscode';
import { builtInClasses, builtInClassesData, builtInEnumsData, builtInFuntions } from "./tokens";


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

            let definedVariables: {name:string,type:string}[] = [];
            
            let variableResult;
            while ((variableResult = variablesPattern.exec(text)) !== null) {
                definedVariables.push({
                    name: variableResult[2],
                    type: variableResult[4]
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
            let result;
            for (let item of definedVariables) {
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
                    if (variable.type != i.name) {
                        continue;
                    }
                    for (let method of i.methods) {
                        var regex = new RegExp("\\b" + variable.name + '\\.' + method + "\\b","g");
                        console.log(i.name);
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
                            console.log(document.getText(                            new vscode.Range(
                                new vscode.Position(pos[0]-1, pos[1]-method.length),
                                new vscode.Position(pos[0]-1, pos[1])
                            )));
                        }
                    }
                }

                for (let method of i.staticMethods) {
                    var regex = new RegExp("\\b" + i.name + '\\.' + method + "\\b","g");
                    console.log(i.name);
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
                        console.log(document.getText(                            new vscode.Range(
                            new vscode.Position(pos[0]-1, pos[1]-method.length),
                            new vscode.Position(pos[0]-1, pos[1])
                        )));
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



            return builder.build();
    }
}

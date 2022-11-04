interface BuiltInClassCompletion {
    name: string,
    methods: string[],
    staticMethods: string[]
}

interface KeywordsSnippets {
    keyword: string,
    snippet: string
}

export const keywords: string[] = [
    "if",
    "while",
    "for",
    "return",
    "in",
    "to",
    "var",
    "global",
    "def",
    "true",
    "false",
    "score",
    "tag",
    "else",
    "new",
    "execute",
    "predicate"
];
export const builtInFuntions: string[] = [
    "Write", 
    "LoadFile"
];

export const builtInClasses: string[] = [
    "Function",
    "Selector"
]

export const ifKeywords: KeywordsSnippets[] = [
    {
        keyword: "entity",
        snippet: "entity (${1:SELECTOR}) {${2}}"
    },
    {
        keyword: "predicate",
        snippet: "predicate (${1:NAMESPACE},${2:FUNCTION_NAME}) {${3}}"
    },
    {
        keyword: "score (compare matches)",
        snippet: "score (${1} ${2} ${3|==,!=,>,<,>=,<=|}, ${4} {${5}})"
    },
    {
        keyword: "score (matches)",
        snippet: "score ${1} ${2:to ${3}}${3} ${4} {${5}}"
    },
    {
        keyword: "score (compare)",
        snippet: "score (${1} ${2} ${3:|==,!=,>,<,>=,<=|} ${4} ${5}) {${6}}"
    },
    {
        keyword: "block",
        snippet: "block ~${1} ~${2} ~${3} (${4}) {${5}}"
    },
    {
        keyword: "blocks",
        snippet: "blocks ~${1} ~${2} ~${3} ~${4} ~${5} ~${6} ~${7} ~${8} ~${9} ${10|masked,all|} {${11}}"
    },
    {
        keyword: "data (block)",
        snippet: "data block ~${1} ~${2} ~${3} ${4} {${5}}"
    },
    {
        keyword: "data (entity)",
        snippet: "data entity ${1} ${2} {${3}}"
    },
    {
        keyword: "data (storage)",
        snippet: "data storage ${1} ${2} {${3}}"
    }
]

export const executeKeywords: KeywordsSnippets[] = [
    {
        keyword: "as",
        snippet: "as ${1} {${2}}"
    },
    {
        keyword: "at",
        snippet: "at ${1} {${2}}"
    },
    {
        keyword: "positioned as",
        snippet: "positioned ${1} {${2}}"
    },
    {
        keyword: "positioned (vector)",
        snippet: "positioned ~${1} ~${2} ~${3} {${4}}"
    }
]

export const builtInClassesData: BuiltInClassCompletion[] = [
    {
        name: "Function",
        staticMethods: [
            "GetCurrentNamespace",
            "Create",
            "Call",
            "GetCurrentFile"
        ],
        methods: []
    },
    {
        name: "Selector",
        staticMethods: [],
        methods: [
            "SetCoordinate",
            "SetSelector",
            "SetDistance",
            "SetVolumeDistance",
            "GiveEffect"
        ]
    }
]
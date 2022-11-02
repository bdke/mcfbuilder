interface BuiltInClassCompletion {
    name: string,
    methods: string[],
    staticMethods: string[]
}

export const keywords = [
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
    "new"
];
export const builtInFuntions = [
    "Write", 
    "LoadFile"
];

export const builtInClasses = [
    "Function",
    "Selector"
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
            "SetCoordinate"
        ]
    }
]
interface OyezCaseListItem {
    name: string;
    description: string;
    granted: string;
    argued: string;
    decided: string;
    citation: string;
}

type OyezCaseListResults = Record<string, OyezCaseListItem[]>;

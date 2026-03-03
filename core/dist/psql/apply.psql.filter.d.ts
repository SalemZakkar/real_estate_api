export declare function applyPsqlFilter(input: {
    query: any;
    queryBuilder: any;
    options?: Record<string, TypeOrmDatabaseQueryOptions>;
    pagination?: boolean;
}): any;
interface TypeOrmDatabaseQueryOptions {
    value?: (data: any) => [string, any];
    newName?: string;
    skip?: boolean;
    regExp?: PSQLRegExp;
}
interface PSQLRegExp {
    regexp: 'contains' | 'startsWith' | 'endsWith';
    caseSensitive?: boolean;
}
export {};
//# sourceMappingURL=apply.psql.filter.d.ts.map
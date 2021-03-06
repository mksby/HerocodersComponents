const { get } = require('./lib/https');
const { createDir, writeFile } = require('./lib/fs');

module.exports = class Herocoders {
    #API_URL = 'https://herocoders.atlassian.net/rest/api/3';

    #routes = {
        components: '/project/IC/components',
        search: '/search'
    }

    init() {
        get(`${this.#API_URL}${this.#routes.components}`)
            .then(components => {
                const [noLeadComponents, jqlIssues] = this.#issuesQuery(components);

                return this.#loadPagedIssues(noLeadComponents, jqlIssues);
            })
            .then(({ components, issues }) => {
                const result = this.#match(components, issues);

                return createDir('./json').then(() => Promise.all([
                    writeFile('./json/no-lead-components.json', components),
                    writeFile('./json/no-lead-components-issues.json', issues),
                    writeFile('./json/final-result.json', result)
                ]))
            })
            .catch(console.error);
    }

    #loadPagedIssues(noLeadComponents, jqlIssues, startAt = 0, allPagesIssues = []) {
        const maxResults = 100;

        return get(`${this.#API_URL}${this.#routes.search}?${jqlIssues}&maxResults=${maxResults}&startAt=${startAt}`).then(({ issues, total }) => {
            allPagesIssues = allPagesIssues.concat(issues);

            if (allPagesIssues.length < total) {
                return {
                    components: noLeadComponents,
                    issues: allPagesIssues.concat(issues)
                }
            }

            return this.#loadPagedIssues(noLeadComponents, jqlIssues, startAt + maxResults, allPagesIssues);
        })
    }

    #issuesQuery(components) {
        const noLeadComponents = components.filter(({ lead }) => !lead);

        const jqlComponentsNames = noLeadComponents.map(({ name }) => `component = "${name}"`);
        const jqlIssues = `jql=project = IC AND (${jqlComponentsNames.join(' OR ')})`;

        return [noLeadComponents, jqlIssues];
    }

    #match(components, issues) {
        return components.reduce((acc, component) => {
            acc[component.name] = issues
                .filter(({ fields: { components: issueComponents } }) => {
                    return issueComponents.some(({ name: icName }) => icName === component.name)
                })
                .length;

            return acc;
        }, {});
    }

    get issuesQuery() {
        return this.#issuesQuery;
    }

    get match() {
        return this.#match;
    }
}
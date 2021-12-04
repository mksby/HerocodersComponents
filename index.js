const { get } = require('./lib/https');
const { createDir, writeFile } = require('./lib/fs');

const API_URL = 'https://herocoders.atlassian.net/rest/api/3';

const routes = {
    components: '/project/IC/components',
    search: '/search'
}

get(`${API_URL}${routes.components}`)
    .then(components => {
        const noLeadComponents = components.filter(({ lead }) => !lead);

        const jqlComponentsNames = noLeadComponents.map(({ name }) => `component = "${name}"`);
        const jqlIssues = `jql=project = IC AND (${jqlComponentsNames.join(' OR ')})`;

        return get(`${API_URL}${routes.search}?${jqlIssues}`).then(({ issues }) => ({
            components: noLeadComponents,
            issues
        }))
    })
    .then(({ components, issues }) => {
        const result = components.reduce((acc, component) => {
            acc[component.name] = issues
                .filter(({ fields: { components: issueComponents } }) => {
                    return issueComponents.some(({ name: icName }) => icName === component.name)
                })
                .map(({ id }) => id);

            return acc;
        }, {});

        return createDir('./json').then(() => Promise.all([
            writeFile('./json/no-lead-components.json', components),
            writeFile('./json/no-lead-components-issues.json', issues),
            writeFile('./json/final-result.json', result)
        ]))
    })
    .catch(console.error);
    
const TestBed = require('./lib/testbed');
const Herocoders = require('./herocoders');

const { define, it } = new TestBed();

const herocoders = new Herocoders();

define('Herocoders Components tests', () => {
    it('should returns two no lead components and jql issues query', expect => {
        const [noLeadComponents, jqlIssues] = herocoders.issuesQuery([
            { lead: {}, name: 'Name0' },
            { name: 'Name1' },
            { name: 'Name2' },
        ]);

        const result1 = noLeadComponents.length === 2;
        const result2 = jqlIssues === 'jql=project = IC AND (component = "Name1" OR component = "Name2")';

        expect(result1 && result2).toBeTruthy();
    });

    it('should returns map where key is component name and its value is array of issues\' ids', expect => {
        const result = herocoders.match([
            { name: 'Name1' },
            { name: 'Name2' },
        ], [
            { id: 1, fields: { components: [{name: 'Name0'}, {name: 'Name3'}] } },
            { id: 2, fields: { components: [{name: 'Name1'}, {name: 'Name3'}] } },
            { id: 3, fields: { components: [{name: 'Name0'}, {name: 'Name2'}] } },
        ]);

        const r1 = 'Name1' in result && 'Name2' in result;
        const r2 = result.Name1.includes(2) && result.Name2.includes(3);

        expect(r1 && r2).toBeTruthy();
    });
});

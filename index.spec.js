const TestBed = require('./lib/testbed');
const Herocoders = require('./herocoders');

const { define, it } = new TestBed();

const herocoders = new Herocoders();

define('Herocoders Components tests', () => {
    it('should return two no lead components and jql issues query', expect => {
        const [noLeadComponents, jqlIssues] = herocoders.issuesQuery([
            { lead: {}, name: 'Name0' },
            { name: 'Name1' },
            { name: 'Name2' },
        ]);

        const result1 = noLeadComponents.length === 2;
        const result2 = jqlIssues === 'jql=project = IC AND (component = "Name1" OR component = "Name2")';

        expect(result1 && result2).toBeTruthy();
    });

    it('should return map where key is component name and its value is the number of related issues', expect => {
        const result = herocoders.match([
            { name: 'Name1' },
            { name: 'Name2' },
        ], [
            { fields: { components: [{name: 'Name0'}, {name: 'Name3'}] } },
            { fields: { components: [{name: 'Name1'}, {name: 'Name3'}] } },
            { fields: { components: [{name: 'Name0'}, {name: 'Name2'}] } },
            { fields: { components: [{name: 'Name2'}, {name: 'Name4'}] } },
        ]);

        const result1 = 'Name1' in result && 'Name2' in result;
        const result2 = result.Name1 === 1 && result.Name2 === 2;

        expect(result1 && result2).toBeTruthy();
    });
});

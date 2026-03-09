const chance = require("chance").Chance();

module.exports = () => {
    return {
        applicantId: chance.integer({ min: 100, max: 9999}),
        name: chance.name({ nationality: "en"}),
        income: chance.integer({ min: 2000, max: 12000 }),
        savings: chance.integer({ min: 500, max: 50000 }),
        housing: chance.integer({ min: 700, max: 3500 }),
        food: chance.integer({ min: 200, max: 1200 }),
        transport: chance.integer({ min: 100, max: 900 }),
        utilities: chance.integer({ min: 100, max: 600 }),
        other: chance.integer({ min: 100, max: 1500 }),
        debt: chance.integer({ min: 0, max: 30000 }),
    };
}
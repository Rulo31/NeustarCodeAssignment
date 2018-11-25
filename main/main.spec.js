describe('Main controller', function() {
    var mainController;

    beforeEach(module('NeustarCodeAssignment'));

    beforeEach(inject(function($controller) {
        mainController = $controller('MainController');
    }));

    it('should normalize categories to upper case', function() {
        expect(mainController.normalizeCategories(["animal", 'oTHer'])).toEqual(['ANIMAL', 'OTHER']);
    });

    it('should fail normalizing categories', function() {
        expect(mainController.normalizeCategories(null)).toBe(false);
    });

    it('should initialize category count array', function() {
        var categoriesArray = [
            'TestCategory1',
            'TestCategory2',
            'TestCategory3'
        ]

        var categoryCountArray = [
            { category: 'TestCategory1', count: 0 },
            { category: 'TestCategory2', count: 0 },
            { category: 'TestCategory3', count: 0 }
        ]

        expect(mainController.initializeCategoryCountArray(categoriesArray)).toEqual(categoryCountArray);
    });

    it('should fail initializing category count array', function() {
        expect(mainController.initializeCategoryCountArray(null)).toBe(false);
    });

    it('should parse JSON successfully', function() {
        var json = `[
            {"test":"123"},
            {"test2":456}
        ]`;

        var jsonObj = [
            { test: "123" },
            { test2: 456 }
        ]

        expect(mainController.parseJSON(json)).toEqual(jsonObj);
    });

    it('should fail parsing invalid JSON', function() {
        var json = `{
            "test": "123",
            "test2": "456
        }`;

        expect(mainController.parseJSON(json)).toBe(false);
    });

    it('should fail parsing empty JSON', function() {
        var json = "";

        expect(mainController.parseJSON(json)).toBe(false);
    });

    it('should only accept JSON arrays', function() {
        var json = `{
            "test": "123",
            "test2": "456"
        }`;

        expect(mainController.parseJSON(json)).toBe(false);
    });

    it('should count categories and first ocurrences successfully', function() {
        var validCategories = [
            "PERSON",
            "PLACE",
            "ANIMAL",
            "COMPUTER",
            "OTHER"
        ];

        var json = `[
            {"PERSON":"Bob Jones"},
            {"PLACE":"Washington"},
            {"PERSON":"Mary"},
            {"COMPUTER":"Mac"},
            {"PERSON":"Bob Jones"},
            {"OTHER":"Tree"},
            {"ANIMAL":"Dog"},
            {"PLACE":"Texas"},
            {"FOOD":"Steak"},
            {"ANIMAL":"Cat"}
        ]`;

        var result = {
            categoryCount: [
                { category: "PERSON", count: 2 },
                { category: "PLACE", count: 2 },
                { category: "ANIMAL", count: 2 },
                { category: "COMPUTER", count: 1 },
                { category: "OTHER", count: 1 }
            ],
            categoryFirstOcurrence: [
                { category:"PERSON", value: "Bob Jones" },
                { category:"PLACE", value: "Washington" },
                { category:"PERSON", value: "Mary" },
                { category:"COMPUTER", value: "Mac" },
                { category:"OTHER", value: "Tree" },
                { category:"ANIMAL", value: "Dog" },
                { category:"PLACE", value: "Texas" },
                { category:"ANIMAL",value: "Cat" }
            ]
        }

        expect(mainController.submitJSON(json, validCategories)).toEqual(result);
    });
});
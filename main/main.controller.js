(function () {
	'use strict';

	angular.module('NeustarCodeAssignment').controller('MainController', MainController);

	/**
	 * Main Controller contains the core functionality of JSON Category Validator.
	 * @param {Factory} MainFactory - Factory in charge of getting the configuration data for the valid categories 
	 */
	function MainController(MainFactory) {
		var vm = this;
		vm.submitJSON = submitJSON;
		vm.back = back;
		vm.normalizeCategories = normalizeCategories;
		vm.initializeCategoryCountArray = initializeCategoryCountArray;
		vm.parseJSON = parseJSON;
		vm.validCategories = [];
		vm.errors = [];
		vm.warnings = [];

		getCategories();

		/**
		 * Get Categories from a configuration file located in config/config.json
		 */
		function getCategories() {
			vm.isLoading = true;

			MainFactory.getCategoriesFromConfig().then(
				function(resp) {
					vm.validCategories = resp.data.validCategories;
					vm.isLoading = false;
				}
			);
		}

		/**
		 * Initialize the categories count array in 0 for each valid category previously loaded
		 * @param {array} validCategories - The string array containing the valid categories
		 */
		function initializeCategoryCountArray(validCategories) {
			var categoryCount = [];

			try {
				validCategories.forEach(category => {
					categoryCount.push({
						category: category,
						count: 0
					});
				});
			} catch (e) {
				appendWarningOrError("An error ocurred while intializing the category count array.", true);
				return false;
			}
			
			return categoryCount;
		}

		/**
		 * Ensure that all categories will be upper case in case a new one will be added that could be in lower case
		 * @param {array} categories - Valid Categories array 
		 */
		function normalizeCategories(categories) {
			try {
				return categories.join("|").toUpperCase().split("|");
			} catch (e) {
				appendWarningOrError("An error ocurred while normalizing the categories.", true);
				return false;
			}
		}

		/**
		 * Main method to submit JSON to get the Category Count and Category first occurence arrays.
		 * @param {string} json - JSON string to be processed
		 * @param {array} validCategories - Array of legal categories
		 */
		function submitJSON(json, validCategories) {
			vm.isLoading = true;
			vm.resultsReady = false;
			vm.categoryFirstOcurrence = [];
			vm.errors = [];
			vm.warnings = [];

			validCategories = normalizeCategories(validCategories);
			vm.categoryCount = initializeCategoryCountArray(validCategories);
			var inputObj = parseJSON(json);

			if (inputObj && validCategories && vm.categoryCount) {
				inputObj.forEach(keyValuePair => {
					var categoryName = Object.keys(keyValuePair)[0];
					if (validCategories.indexOf(categoryName.toUpperCase()) > -1) {
						// Check if it is first ocurrence, otherwise we'll just ignore it.
						var ocurrence = vm.categoryFirstOcurrence.filter(x => x.category == categoryName && x.value == keyValuePair[categoryName]);

						if (ocurrence.length == 0) {
							vm.categoryFirstOcurrence.push({
								category: categoryName,
								value: keyValuePair[categoryName]
							})

							var categoryCount = vm.categoryCount.filter(x => x.category == categoryName)[0];
							categoryCount.count++;
						}
					} else {
						appendWarningOrError("Invalid Category: " + categoryName, false);
					}
				});
				vm.isLoading = false;
				vm.resultsReady = true;
			} else {
				vm.isLoading = false;
			}

			return {
				categoryCount: vm.categoryCount,
				categoryFirstOcurrence: vm.categoryFirstOcurrence
			}
		}

		/**
		 * Parse input JSON string provided, will validate JSON format validity, if it is empty and if it is not an array 
		 * @param {string} json - JSON string to be processed
		 */
		function parseJSON(json) {
			try {
				if (isNullOrWhitespace(json)) {
					appendWarningOrError("JSON cannot be empty", true);
					return false;
				} else {
					var parsedJSON = JSON.parse(json);

					if (!Array.isArray(parsedJSON)) {
						appendWarningOrError("JSON must be an array.", true);
						return false;
					}

					return parsedJSON;
				}
			} catch (e) {
				appendWarningOrError("Invalid JSON", true);
				return false;
			}
		}

		/**
		 * Back function used to reset scope values to default
		 */
		function back() {
			vm.errors = [];
			vm.warnings = [];
			vm.categoryCount = [];
			vm.categoryFirstOcurrence = [];
			vm.json = "";
			vm.isLoading = false;
			vm.resultsReady = false;
		}

		/**
		 * Miscelaneous function to append warning or error message to scope variable in charge of displaying the messages
		 * @param {string} text - Text to be appended.
		 * @param {boolean} isError - Boolean value indicating if the text provided is a Warning or Error message
		 */
		function appendWarningOrError(text, isError) {
			if (isError) {
				if (vm.errors.indexOf(text) < 0) {
					vm.errors.push(text);
				}
			} else {
				if (vm.warnings.indexOf(text) < 0) {
					vm.warnings.push(text);
				}
			}
		}

		/**
		 * Miscelaneous function to validate if an string in null or whitespace
		 * @param {string} input - The string to be validated.
		 */
		function isNullOrWhitespace( input ) {
			if (typeof input === 'undefined' || input == null) {
				return true;
			}

			return input.replace(/\s/g, '').length < 1;
		}
	}
})();

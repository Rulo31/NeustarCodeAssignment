(function () {
    'use strict';

    angular.module('NeustarCodeAssignment').factory('MainFactory', MainFactory);

    /**
     * Factory used to get JSON containing configuration values related with the categories.
     */
    function MainFactory($http) {

        return {
            getCategoriesFromConfig: getCategoriesFromConfig
        };

        function getCategoriesFromConfig() {
            return $http.get('./config/config.json');
        };
    }
})();

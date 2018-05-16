const app = angular.module('spellingCorrector', []);

app.controller('mainController', ($scope, $http) => {
    $scope.original = "";
    $scope.corrected = "";

    $scope.correct = () => {
        if ($scope.original === "") {
            $scope.corrected = "";
            return;
        }

        $http.get('api/' + $scope.original)
            .then((response) => {
                $scope.corrected = response.data.corrected;
            }, (err) => {
                // Intentionally blank
            });
    };
});
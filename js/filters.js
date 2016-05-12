
angular.module("bonierFilters", [])
        .filter("dateFilter", function () {
            return function(input){
                return input;
            };
            
            
            
        }).filter("searchFilter", function() {
            return function(input, params){
                return (
                        input.totalPrice < params.maxPrice &&
                        input.traveltime < params.maxTime
                        
                        ) ? input : null;
            };
        });
        
                



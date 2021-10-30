app.directive('fooditem', function(){

	return {
		restrict: "E",

		scope:{
			prot: '@prot',
			carbs: '@carbs',
			fat: '@fat',
			name: '@name',
			description: '@description',
			qty: '@qty',
			show: '@show', //all, prot, carbs, fat, kcal
		},

		controller: function($scope){
			$scope.getkcal = function(prot, fat, carbs){
				return 4 * prot + 4 * carbs + 9 * fat;
			}


		},

		template: `
		<div class="food-item">
			<div class='name' data-bs-toggle="popover" tabindex="0" data-bs-trigger="focus" data-bs-content="And here's some amazing content. It's very engaging. Right?">{{ name }}</div>
			<div class='multiplier' ng-if="qty">(x{{ qty }})</div>
			<div style='flex-grow:1'></div>
			
			<div class='stat-r' ng-if="show == 'prot'">{{ prot | number:0 }} g</div>
			<div class='stat-r' ng-if="show == 'fat'">{{ fat | number:0 }} g</div>
			<div class='stat-r' ng-if="show == 'carbs'">{{ carbs | number:0 }} g</div>
			<div class='stat-r' ng-if="show == 'kcal'">{{ getkcal(prot, fat, carbs) | number:0 }} kcal</div>

			<div class='stat' ng-if="show=='all'">{{ prot | number:0 }}</div>
			<div class='stat' ng-if="show=='all'">{{ fat | number:0 }}</div>
			<div class='stat' ng-if="show=='all'">{{ carbs | number:0 }}</div>
			<div class='stat' ng-if="show=='all'">{{ getkcal(prot, fat, carbs) | number:0 }}</div>
			
		</div>
		`,
	}
});
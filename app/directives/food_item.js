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
			
			<div class='stat-r' ng-if="show == 'prot'">{{ prot }} g</div>
			<div class='stat-r' ng-if="show == 'fat'">{{ fat }} g</div>
			<div class='stat-r' ng-if="show == 'carbs'">{{ carbs }} g</div>
			<div class='stat-r' ng-if="show == 'kcal'">{{ getkcal(prot, fat, carbs) }} kcal</div>

			<div ng-if="show=='all'">
				<div class='stat'>{{ prot }}</div>
				<div class='stat'>{{ fat }}</div>
				<div class='stat'>{{ carbs }}</div>
				<div class='stat'>{{ getkcal(prot, fat, carbs) }}</div>
			</div>
			
		</div>
		`,
	}
});
app.directive('daystats', function(){

	return {
		scope:{
			day: "=day",
			requirements: "=requirements",
		},
	

		controller: function($scope){
			
			$scope.get_totals = function(p){
				let sum = 0
				for(const f in $scope.day){
					if(f == "$$hashKey") continue
					let food = $scope.day[f];
					sum += food[p];
				}
				return sum
			}

		},

		template: '<planstats prot="{{ get_totals(\'protein\') }}" carbs="{{ get_totals(\'carbs\') }}" fat="{{ get_totals(\'fat\') }}" protreq="{{ requirements.protein }}" carbsreq="{{ requirements.carbs }}" fatreq="{{ requirements.fat }}"></planstats>',
	}

});


app.directive('planstats', function(){

	return {
		restrict: "E",

		scope:{
			prot: '@prot',
			carbs: '@carbs',
			fat: '@fat',
			protreq: '@protreq',
			carbsreq: '@carbsreq',
			fatreq: '@fatreq',
		},

		controller: function($scope){

			$scope.barwidth = function(x){ return 52.5 * 2 * (x - 0.75); };
	
			$scope.barcolor = function(x){
				if(x < 0.85  || x > 1.15) return 'background-color: #ef476f';  // red
				if(x < 0.93 || x > 1.07) return 'background-color: #ffd166'; // yellow
				return 'background-color: #118ab2'; // blue
			}

			$scope.getkcal = function(prot, fat, carbs){
				return 4 * prot + 4 * carbs + 9 * fat;
			}
		},

		template: `
		<table class='food-stats'>
			<tr>
				<td>{{ prot | number:0 }} g</td>
				<td>{{ fat | number:0 }} g</td>
				<td>{{ carbs | number:0 }} g</td>
				<td>{{ getkcal(prot, fat, carbs) | number:0 }}</td>
			</tr>
			<tr>
				<td><div class='bar'><div class='b' style='width: {{ barwidth(prot/protreq) }}px; {{ barcolor(prot/protreq) }};'></div></div></td>
				<td><div class='bar'><div class='b' style='width: {{ barwidth(fat/fatreq) }}px; {{ barcolor(fat/fatreq) }};'></div></div></td>
				<td><div class='bar'><div class='b' style='width: {{ barwidth(carbs/carbsreq) }}px; {{ barcolor(carbs/carbsreq) }};'></div></div></td>
				<td><div class='bar'><div class='b' style='width: {{ barwidth(getkcal(prot, fat, carbs)/getkcal(protreq, fatreq, carbsreq)) }}px; {{ barcolor(getkcal(prot, fat, carbs)/getkcal(protreq, fatreq, carbsreq)) }};'></div></div></td>
			</tr>
			<tr>
				<td><b>prot.</b></td>
				<td><b>fat</b></td>
				<td><b>carbs</b></td>
				<td><b>kcal</b></td>
			</tr>

		</div>
		`,
	}
});
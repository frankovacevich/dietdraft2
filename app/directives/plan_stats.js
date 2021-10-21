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
				if(x < 0.8  || x > 1.2) return 'background-color: #dd4d37';
				if(x < 0.85 || x > 1.15) return 'background-color: #dd8d37';
				if(x < 0.90 || x > 1.10) return 'background-color: #ddca37';
				if(x < 0.95 || x > 1.05) return 'background-color: #4dbf0b';
				return 'background-color: #4dbf0b';
			}

			$scope.getkcal = function(prot, fat, carbs){
				return 4 * prot + 4 * carbs + 9 * fat;
			}
		},

		template: `
		<table class='food-stats'>
			<tr>
				<td>{{ prot }} g</td>
				<td>{{ fat }} g</td>
				<td>{{ carbs }} g</td>
				<td>{{ getkcal(prot, fat, carbs) }}</td>
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
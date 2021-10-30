app.controller('app-ctrl', function($scope) {

	// Init
	$scope.selected_day = 1;
	$scope.display_mode = 'multiple';
	$scope.current_plan = userdata.current_plan;
	$scope.current_plan_totals = {protein: 0, fat: 0, carbs: 0, calories: 0};

	// Functions


	$scope.day_prev = function(){
		if($scope.selected_day > 0) $scope.selected_day --;
	}

	$scope.day_next = function(){
		if($scope.selected_day < $scope.current_plan.plan.length - 1) $scope.selected_day ++;
	}

	$scope.redo_day = function(day, event){
		angular.element(event.target).addClass('rotate');
		$scope.current_plan.plan[day] = C.create_day($scope.current_plan.requirements);
		$(event.target).removeClass('rotate');
		$scope.update_totals();
	}

	$scope.clear_day = function(day){
		$scope.current_plan.plan[day] = [];
		$scope.update_totals();
	}

	$scope.redo_plan = function(){
		alert("HI")
		$scope.current_plan.plan = C.create_plan($scope.current_plan.requirements);
		$scope.update_totals();
	}

	//

	$scope.update_totals = function(){
		let totals = {protein: 0, fat: 0, carbs: 0, calories: 0}
		for(const d in $scope.current_plan.plan){
			let day = $scope.current_plan.plan[d];
			for(const f in day){
				let food = day[f];
				if(f == "$$hashKey") continue
				if(!("calories" in food)){ food.calories = food.fat * 9 + food.protein * 4 + food.carbs * 4 }
				for(const t in totals){
					totals[t] += food[t];
				}
			}
		}

		// average per day
		for(const t in totals){
			totals[t] /= $scope.current_plan.plan.length;
		}


		$scope.current_plan_totals = totals;
	}

	$scope.update_totals();

});

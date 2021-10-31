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




	// Drag and drop food items

	$scope.drag_start = function(event){
		event.dataTransfer.setData("day", $(event.target).attr("day"));
		event.dataTransfer.setData("idx", $(event.target).attr("idx"));
	}

	$scope.drag_enter = function(event){
		$(event.target).css("borderColor","gray");
		$(".food-item").css("pointerEvents","none");
		$(".dropdown-food-area").children().css("pointerEvents","none");
		$(".dropdown-food-area").children().children().css("pointerEvents","none");
		$(".dropdown-food-area").children().children().children().css("pointerEvents","none");
		$(".dropdown-food-area").children().children().children().children().css("pointerEvents","none");

	}

	$scope.drag_leave = function(event){
		$(event.target).css("borderColor","transparent");
		$(".food-item").css("pointerEvents","auto");
		$(".dropdown-food-area").children().css("pointerEvents","auto");
		$(".dropdown-food-area").children().children().css("pointerEvents","auto");
		$(".dropdown-food-area").children().children().children().css("pointerEvents","auto");
		$(".dropdown-food-area").children().children().children().children().css("pointerEvents","auto");

	}

	$scope.drag_end = function(event){

	}

	$scope.allow_drop = function(event){
		event.preventDefault();
	}

	$scope.drop = function(event){
		event.preventDefault();
		$(event.target).css("borderColor","transparent");
		$(".food-item").css("pointerEvents","auto");

		let idx = parseInt(event.dataTransfer.getData("idx"));
		let day = parseInt(event.dataTransfer.getData("day"));
		let day_target = $(event.target).attr("day");
		let meal_target = $(event.target).attr("meal");

		$scope.current_plan.plan[day][idx].meal = meal_target;
		$scope.current_plan.plan[day_target].push( $scope.current_plan.plan[day][idx] );
		$scope.current_plan.plan[day].splice(idx, 1);

		$scope.update_totals();
		$scope.$apply();
	}

});

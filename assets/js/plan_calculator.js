class PlanCalculator{

	constructor(){
		this.error = 0.0005;
		this.max_iterations = 1000;

		this.food_data = [];
		this.food_data_by_meal = {}; // food data grouped by meal
	}

	/*
	food_data = [{
		name,
		protein,
		fat,
		carbs,
		multiplier,
		meals, // list []
	}]
	*/

	set_food_data(food_list){
		this.food_data = [];

		for(const i in food_list){
			let f = food_list[i];

			// add multiplier
			if(!("multiplier" in f)){ f.multiplier = 1; }

			// collect meals
			for(const m in f.meals){
				let meal = f.meals[m];			
				if(!(meal in this.food_data_by_meal)){ this.food_data_by_meal[meal] = []; }
				this.food_data_by_meal[meal].push(f);
			}

			this.food_data.push(f);
		}
	}

	// ==============================================================================
	// MAIN FUNCTIONS
	// ==============================================================================

	/* 
	requirements = {
		protein,
		fat,
		carbs,
		duration, // days
		calculation_method, // match_all, prioritize_carbs_intake, prioritize_protein_intake, match_calories_only
	}
	*/

	create_plan(requirements){
		let plan = [];

		for(let i = 0; i < requirements.duration; i++){
			plan.push(this.create_day(requirements));
		}

		return plan;
	}


	create_day(requirements){
		requirements.calories = requirements.protein * 4 + requirements.carbs * 4 + requirements.fat * 9;

		// Copy requirements
		var req = {};
		req = Object.assign(req,requirements);

		// aux variables
		let iter = 0;
		let max_iterations = this.max_iterations / requirements.duration;
		let offset = 10;
		let best_offset = 10;
		let result = [];
		let best_result = [];
		
		while(offset > this.error){
			result = [];
			for(const meal in this.food_data_by_meal){
				result = result.concat(this.create_meal(requirements, meal));
			}
			offset = this.get_requirements_offset_norm(result,requirements);
			if(best_offset > offset){
				best_offset = offset;
				Object.assign(best_result, result);
			}

			if(iter > max_iterations){ break; }
			iter += 1;
		}

		return best_result;
	}

	// creates a meal randomly
	create_meal(requirements, meal){
		if(!(meal in this.food_data_by_meal)) return [];
		requirements.calories = requirements.protein * 4 + requirements.carbs * 4 + requirements.fat * 9;

		// extend requirements
		let max_calories_per_meal = requirements.calories * 0.33;
		let min_calories_per_meal = 0;

		// aux variables
		let sample_size = 7; // number of food items per meal
		let r = 0; // random aux
		let reduced_food_data = [];
		let totals = {calories: max_calories_per_meal};

		let iter = 0;
		let max_iterations = 0.25 * this.max_iterations / requirements.duration;

		// randomly create a meal plan
		while(totals.calories > max_calories_per_meal || totals.calories > min_calories_per_meal){
			if(iter > max_iterations){ break; }
			iter += 1;

			let r = Math.random();
			if(r < 0.0228) sample_size = 1;
			else if(r < 0.1587) sample_size = 2;
			else if(r < 0.5000) sample_size = 3;
			else if(r < 0.8413) sample_size = 4;
			else if(r < 0.9772) sample_size = 5;
			else if(r < 0.9987) sample_size = 6;
			else sample_size = 7;

			reduced_food_data = this.get_random_subarray(this.food_data_by_meal[meal], sample_size);
			totals = this.get_totals(reduced_food_data);
		}

		for(const item in reduced_food_data){ reduced_food_data[item].meal = meal; }
		return reduced_food_data;
	}


	// ==============================================================================
	// TOTALS CALCULATION
	// ==============================================================================

	/*
	food_list = [{
		name,
		protein,
		fat,
		carbs,
		multiplier,
		meal,
	}]
	*/

	// get the 2-norm error of the offset (the norm squared)
	get_requirements_offset_norm(food_list, requirements){
		let offset = this.get_requirements_offset(food_list,requirements);
		let result = 0;
		for(const item in offset){ result += offset[item] * offset[item]; }
		return result;
	}


	// calculate the difference between the totals of a food list and the
	// requirements (relative error). This error is called 'offset'
	get_requirements_offset(food_list, requirements){
		let totals = this.get_totals(food_list);

		let offset = {protein:0, fat:0, carbs:0};
		if(requirements["calculation_method"] == "prioritize_protein_intake") offset = {calories:0, protein:0};
		if(requirements["calculation_method"] == "prioritize_carbs_intake") offset = {calories:0, carbs:0};
		if(requirements["calculation_method"] == "match_calories_only") offset = {calories:0};

		for(const item in offset){ offset[item] = 1-totals[item]/requirements[item]; }
		return offset;
	}

	// given a food list, calculate it's total calories, proteins, fat and carbs
	get_totals(food_list){
		let result = {calories:0, protein:0, fat:0, carbs:0};
		for(const food in food_list){
			for(const item in result){
				result[item] += food_list[food][item] * food_list[food]["multiplier"];
			}
		}
		return result;
	}

	// given a plan of multiple days, calculate the averages
	get_averages(plan){
		let result = {calories:0, protein:0, fat:0, carbs:0};
		for(const day in plan){
			let totals = this.get_totals(plan[day]);
			for(const item in result){ result[item] += totals[item]; }
		}

		for(const item in result){ result[item] /= plan.length; }
		return result;
	}

	// ==============================================================================
	// AUX FUNCTIONS
	// ==============================================================================

	get_random_subarray(arr, size) {
		if(size > arr.length) { size = arr.length; }

		var shuffled = arr.slice(0), i = arr.length, temp, index;
		while (i--) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(0, size);
	}

}


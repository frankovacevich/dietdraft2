class PlanCalculator{

	constructor(){
		this.error = 0.01;
		this.max_iterations = 500;
		this.survival_rate = 0.25;
		this.population_size = 1000;

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

	create_plan(requirements, progress_update = function(percentage){}){
		let plan = [];

		for(let i = 0; i < requirements.duration; i++){
			plan.push(this.create_day(requirements));
			progress_update((i + 1) / requirements.duration);
		}

		return plan;
	}


	create_day(requirements){

		// 1) Generate N random day plans
		let day_collection = []; // [plan, offset]
		for(let i=0; i < this.population_size; i++){
			let day = [];
			for(const meal in this.food_data_by_meal){ day = day.concat(this.create_meal(requirements, meal)); }
			day_collection.push([day, this.get_requirements_offset_norm(day, requirements)]);
		}

		// 2) Iterate generating new plans
		let survival_rate = this.survival_rate;
		let error_0 = 0;

		for(let k=0; k < this.max_iterations; k++){
			// 2) Select the fittest f*N

			// calculate how many survivors and newborns there will be
			let n_survived = Math.ceil(survival_rate * this.population_size);
			let n_newborns = this.population_size - n_survived;

			// sort population by fitness and kill the unfit
			day_collection = day_collection.sort(function(a, b){ return a[1]-b[1] });
			day_collection = day_collection.slice(0, n_survived);

			// break if error limit is reached
			if(day_collection[0][1] < this.error) break;

			// calculate new survival rate for next iteration
			// (a big survival rate gives a wider range of food but increases the error)
			if(error_0 == 0) error_0 = day_collection[0][1];
			survival_rate = 0.05 + (day_collection[0][1] - this.error) * (this.survival_rate - 0.05) / (error_0 - this.error);
			if(survival_rate > this.survival_rate) survival_rate = this.survival_rate;

			//Mate the surviving plans to produce N new plans
			let new_day_collection = [];
			for(let i=0; i < n_newborns; i++){
				let parents = this.get_random_subarray(day_collection, Object.keys(C.food_data_by_meal).length); // randomly chosen parents
				let child = []; // offspring
				let j = 0;
				for(const meal in this.food_data_by_meal){
					child = child.concat(parents[j][0].filter(item => item.meal == meal));
					j++;
				}
				new_day_collection.push([child, this.get_requirements_offset_norm(child, requirements)]);
			}

			day_collection = new_day_collection;
		}

		day_collection = day_collection.sort(function(a, b){ return a[1]-b[1] });

		let r = day_collection[0][0]
		return r;

	}

	create_meal(requirements, meal){
		/*
		Randomly creates a meal
		*/

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

		// copy array and set meals
		let new_array = [];
		for(const i in reduced_food_data){ 
			let item = reduced_food_data[i];
			let new_item = Object.assign({}, item);
			new_item.meal = meal;
			new_array.push(new_item)
		}
		return new_array;
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

		let offset = {protein:0, fat:0, carbs:0, calories:0};
		if(requirements["calculation_method"] == "prioritize_protein_intake") offset = {calories:0, protein:0};
		if(requirements["calculation_method"] == "prioritize_carbs_intake") offset = {calories:0, carbs:0};
		if(requirements["calculation_method"] == "match_calories_only") offset = {calories:0};

		for(const item in offset){ offset[item] = 1-totals[item]/requirements[item]; }
		return offset;
	}

	// given a food list, calculate it's total calories, proteins, fat and carbs
	get_totals(food_list){
		let result = {calories:0, protein:0, fat:0, carbs:0};
		for(const f in food_list){
			let food = food_list[f];
			if(!("calories" in food)){ food.calories = food.protein * 4 + food.carbs * 4 + food.fat * 9 }
			if(!("multiplier" in food)){ food.multiplier = 1; }
			for(const item in result){
				result[item] += food[item] * food["multiplier"];
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


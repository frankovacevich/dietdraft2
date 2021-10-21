app.directive('daytitle', function(){

	return {
		restrict: "E",

		scope:{
			day: "@day"
		},

		controller: function($scope){
			
		},

		template: `
		<div class="title">Day {{ day }}</div>
		<div class="btn-group">
		  <button type="button" class="btn btn-secondary">Reset</button>
		  <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
		    <span class="visually-hidden">Toggle Dropdown</span>
		  </button>
		  <ul class="dropdown-menu">
		    <li><a class="dropdown-item" href="#">Print</a></li>
		    <li><a class="dropdown-item" href="#">Clear</a></li>
		  </ul>
		</div>
		`,
	}
});

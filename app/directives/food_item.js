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
			day: '@day',
			idx: '@idx',
			ndragstart: '&ndragstart',
			ndragend: '&ndragend',
		},

		controller: function($scope){
			$scope.getkcal = function(prot, fat, carbs){
				return 4 * prot + 4 * carbs + 9 * fat;
			}
		},

		link: function link(scope, element, attrs, controller, transcludeFn){
			element.on('dragstart', function(event){ scope.ndragstart({event: event}); });
		    element.on('dragend', function(event){ scope.ndragend({event: event}); });
		},

		template: `
		<div style="pointer-events:auto" class="food-item" day="{{ day }}" idx="{{ idx }}" draggable="false" onmouseover="this.setAttribute('draggable', true)" onmouseout="this.setAttribute('draggable', false)" >
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


app.directive('droparea', function(){
	return {
        restrict: 'E',
		transclude: true,

		scope: {
			day: '@day',
			meal: '@meal',
			ndragenter: '&ndragenter',
			ndragleave: '&ndragleave',
			ndragover: '&ndragover',
			ndrop: '&ndrop',
		},

		controller: function($scope){

		},

		link: function link(scope, element, attrs, controller, transcludeFn){
			element.on('dragenter', function(event){ scope.ndragenter({event: event}); });
			element.on('dragleave', function(event){ scope.ndragleave({event: event}); });
			element.on('dragover', function(event){ scope.ndragover({event: event}); });
			element.on('drop', function(event){ scope.ndrop({event: event}); });
		},

		template: '<div day="{{ day }}" meal="{{ meal }}" class="dropdown-food-area"><div ng-transclude></div><div>'
	}
})
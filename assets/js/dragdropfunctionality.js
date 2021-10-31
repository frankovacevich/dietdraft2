




/*
function drag_item_enter(event){
	$(event.target).css("borderColor","gray");
	$(".dragdrop-box").children().css("pointerEvents","none");
	$(".l-trash").children().css("pointerEvents","none");
	//
}

function drag_item_leave(event){
	$(event.target).css("borderColor","transparent");
	$(".dragdrop-box").children().css("pointerEvents","auto");
	$(".l-trash").children().css("pointerEvents","none");
	//
}

function allow_item_drop(event){
	event.preventDefault();
	//
}

function drag_item(event){
	//$(".dragdrop-item").css("display","block");
	event.dataTransfer.setData("id_tag", $(event.target).attr("id_tag"));
	$(".l-trash").css("visibility","visible");
	//
}

function drop_item(event){
	event.preventDefault();
	$(event.target).css("borderColor","transparent");
	$(".dragdrop-box").children().css("pointerEvents","auto");

	item = parseInt(event.dataTransfer.getData("id_tag"));
	meal = $(event.target).attr("meal");

	foodlst = SELECTED_DAY_ID == "R" ? MY_EXPRESS_PLAN : MY_CURRENT_PLAN[SELECTED_DAY_ID] ;

	if(typeof meal == "undefined") return;
	foodlst[item]["meal"] = meal;	
	display_food_list(foodlst);
	upload();
}

function drop_item_trash(event){
	foodlst = SELECTED_DAY_ID == "R" ? MY_EXPRESS_PLAN : MY_CURRENT_PLAN[SELECTED_DAY_ID] ;
	item = parseInt(event.dataTransfer.getData("id_tag"));
	foodlst.splice( item, 1 );
	display_grocery_list();
	select_day();
	check_if_day_is_done();
	upload();
}

function drag_item_end(event){
	$(".dragdrop-item").css("display","none");
	$(".l-trash").css("visibility","hidden");
	//
}*/
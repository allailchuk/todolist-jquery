
$(document).ready(function () {

	var $list = $('#list');

	$.ajax({
		type: 'GET',
		url: '/restapi/todos',
		dataType: "json",
		cache: false,
		success: function(rsp){
			$.each(rsp.data, function(listItem){
				addElement(rsp.data[listItem].id, rsp.data[listItem].name, rsp.data[listItem].status);
			})
		},
		error: function(){
			alert('error loading elements');
		}
	});
	
	function addElement(id, name, status) {
		var $li = $('<li data-id>'+ name +' <span class="closeButton"> \u00D7 </span></li>');
		$li.find('.closeButton').on('click', function (e){
				deleteItem(e, id);
			})
		
		if (status == "1") {
			$li.addClass('checked');
		}		
		$list.append($li);
		$li.on('click', function(e){
			e.stopPropagation();
			$.ajax({
				type: 'PUT',
				url: '/restapi/todos/' + id,
				dataType: "json",
				data: JSON.stringify({
					status: status == 0 ? 1 : 0
				}),
				cache: false,
				success: function(rsp){
					status = rsp.status;
					if (status == "1") {
						$li.addClass('checked');
					} else {
						$li.removeClass('checked');
					}
				}
			})
		})
	}

	function deleteItem(e, id){
		e.stopPropagation();
		var $li = e.currentTarget.closest('li');
		$li.remove();
		
		$.ajax({
			type: 'DELETE',
			url: '/restapi/todos/' + id,
			dataType: "json",
			cache: false,
			success: function(){
			}
		});
	}

	$('.addButton').on('click', function add() {
		var inputValue = $('#inputBox').val();
		if (inputValue==""){
			alert("Type something!");
		} else {
			$.ajax({
				type: 'POST',
				url: '/restapi/todos',
				data: JSON.stringify({
					name: inputValue
				}),
				dataType: "json",
				cache: false,
				success: function(addedItem){
					addElement(addedItem.id, addedItem.name, addedItem.status);
					$('#inputBox').val("");
				}
			})
		}
	})

	$('#inputBox').on('keypress', keyboardPress);
	function keyboardPress (enter) {
		if (enter.keyCode == 13) {
			add();
		}
}


});









var options = {
		placeholderClass: 'placeholderClass',
		hintClass: 'hintClass',
		ignoreClass: 'clicable',
		currElClass: 'currElemClass',
		
		insertZone: 100,
		onDragStart: function(e, el)
		{
			null;
		},
		isAllowed: function( cEl, hint, target ) {
			if( cEl.hasClass('lineObject') && hint.parent().attr('id') == 'speednomenclature' ) {
				hint.css('background-color', '#9999ff');
				return true;
			}
			else if( target.hasClass('lineObject') || target.hasClass('workstation') /*|| target.closest('li').length==0*/ ) {
				hint.css('background-color', '#ff9999');
				return false;
			}
			else {
				hint.css('background-color', '#99ff99');
				return true;
			}
		},
		onChange:function(cEl) {
		 	
		}/*,
		opener: {
			active: true,
			close: './img/add.png',
			open: './img/remove.png',
			css: {
				'display': 'inline-block', // Default value
				'float': 'left', // Default value
				'width': '18px',
				'height': '18px',
				'margin-left': '5px',
				'margin-right': '5px',
				'background-position': 'center center', // Default value
				'background-repeat': 'no-repeat' // Default value
			}
		}*/
	};

$(document).ready(function() {
	//http://camohub.github.io/jquery-sortable-lists/
	$('#speednomenclature a').addClass('clicable');
	$('#speednomenclature').sortableLists( options );
	
	
	$('#speednomenclature').mousemove(function (e) {
        $('div#addto').offset({ top: e.pageY - 50 });
    });
	
	$('#speednomenclature li').mouseenter(function(e) {
		$('#speednomenclature li').removeClass('selectedElement');
		if(!$(this).hasClass('workstation')) {
			$(this).addClass('selectedElement');	
		}
	});
	
	$('input[name=AddProductNomenclature]').click(function() {
		
		label = $('#fk_product option:selected').text();
		if(label == '') label = $('#search_fk_product').val();
		addProduct($('#addto #fk_product').val(),label);
	});
	
	$('input[name=AddWorkstation]').click(function() {
		label = $('#fk_new_workstation option:selected').text();
		addWorkstation($('#addto #fk_new_workstation').val(),label);
	});
	
	$('input[name=SaveAll]').click(function() {
		var THierarchie = $('#speednomenclature').sortableListsToHierarchy();
		
		THierarchie = parseHierarchie(THierarchie);
		console.log(THierarchie);
		$.ajax({
			url:"script/interface.php"
			,data : {
				put:'nomenclatures'
				,THierarchie:THierarchie
				,fk_object:fk_object
				,object_type:object_type
			}
			,method:'post'
		});
	});
	
});

function parseHierarchie(THierarchie) {
	
	for(x in THierarchie) {
		
		$li = $('li#'+THierarchie[x].id);
		
		//if($li.attr('line-type') == 'nomenclature' || $li.attr('line-type') == 'workstation') {
		THierarchie[x].fk_object = $li.attr('fk_object');
		THierarchie[x].object_type = $li.attr('object_type');
		
		THierarchie[x].fk_product = $li.attr('fk_product');  
		THierarchie[x].fk_original_nomenclature = $li.closest('ul').attr('fk_original_nomenclature');
		THierarchie[x].fk_nomenclature = $li.closest('ul').attr('fk_nomenclature');
		
		THierarchie[x].qty = $li.find('input[rel=qty]').val();
		//THierarchie[x].k = $li.attr('k');
		//}
		
		if(THierarchie[x].children && THierarchie[x].children.length>0) {
			THierarchie[x].children = parseHierarchie(THierarchie[x].children);
		}	
		
	}
	
	return THierarchie;
}

function addWorkstation(fk_ws, label) {
	if($('li.selectedElement').length!=1) return false;
	console.log('addProduct',fk_ws,label);
	
	if($('li.selectedElement>ul').length == 0)$('li.selectedElement').append('<ul />');
	$to = $('li.selectedElement>ul');
	
	if(label == '')label='...';
	$li = $('<li id="new-ws-'+Math.floor(Math.random()*100000)+'" object_type="workstation" fk_object="'+fk_ws+'" class="newElement">'+label+'</li>');
	
	$to.append($li);
}

function addProduct(fk_product,label) {
	
	if($('li.selectedElement').length!=1) return false;
	
	console.log('addProduct',fk_product,label);
	if($('li.selectedElement>ul').length == 0)$('li.selectedElement').append('<ul />');
	$to = $('li.selectedElement>ul');
	
	if(label == '')label='...';
	$li = $('<li id="new-product-'+Math.floor(Math.random()*100000)+'" object_type="product" fk_object="'+fk_product+'" class="newElement">'+label+'</li>');
	
	$to.append($li);
	
}

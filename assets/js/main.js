



jQuery(document).ready(function ($) {
	$('[name="city"]').fias({
		type: $.fias.type.city,
		change: function (obj) {
			console.log('obj',obj);
			var address = $.fias.getAddress('.js-form-address');
			// console.log(address)

			// $('#address').text(address);
			// $('#address').text(obj.typeShort + ' ' + obj.name );
			// $('#kladrRegion').val(obj.id);
		},
		// api: function(query, response) {
		// 	console.log(query)
		// },
		'withParents': true

	});

});
// let btn = document.querySelector('button')
// btn.addEventListener('click', ()=> {
// 	console.dir($)
// 	console.log($.fias)
// 	console.log($.fias.getInputs('[name="city"]'))
// })



; (function () {
	let selects = document.querySelectorAll('.my-select');
	console.log('selects:', selects)
	if (!selects.length) return;
	selects.forEach(parent => {
		let header = parent.querySelector('.my-select-header');
		let options = parent.querySelectorAll('.my-select-dropdown__option');

		header.addEventListener('click', function (e) {
			event.preventDefault()
			let target = event.currentTarget
			let dropdown = target.parentNode.querySelector('.my-select-dropdown')
			dropdown.classList.toggle('active')
		})

		options.forEach(option => {
			option.addEventListener('click', function (event) {
				event.preventDefault()
				let target = event.currentTarget
				dropdownOptionSelect(target, parent)
			})
		})

		window.addEventListener('click', function (e) {
			if (parent.querySelector('.my-select-dropdown.active')) {
				if (!parent.querySelector('.my-select-dropdown.active').parentNode.contains(e.target)) {
					dropdownClose()
				}
			}
		});
	})
	function dropdownOptionSelect(option, parent) {
		let header = parent.querySelector('.my-select-header')
		header.querySelector('.my-select-header__selected').value = option.dataset.select
		header.querySelector('.my-select-header__option').innerHTML = option.innerHTML
		dropdownClose()
	}

	function dropdownClose() {
		let dropdowns = document.querySelectorAll('.my-select-dropdown')
		dropdowns.forEach(dropdown => {
			dropdown.classList.remove('active')
		})
		document.dispatchEvent(new CustomEvent("my-selected", {}));
	}
})();

document.addEventListener('my-selected', function (e) {
	console.log(e)
})

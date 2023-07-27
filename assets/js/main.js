

jQuery(document).ready(function ($) {
	$('[name="city"]').fias({
		type: $.fias.type.city,
		change: function (obj) {
			console.log('obj', obj);
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







let calcform = document.querySelector('.calcform')
let calculateBtn = document.querySelector('.calculate-btn')
let calculateAnswer = document.querySelector('.calcform-answer')
let calcformCallback = document.querySelector('.calcform-callback')
let driverAddBtn = document.querySelector('.add-driver')
let driverBlock = document.querySelector('.calcform-group-drivers')


function customSelect() {
	let selects = document.querySelectorAll('.my-select');
	// console.log('selects:', selects)
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
}
// function customSelect(e) {
// 	let select = e.target.closest('.my-select')
// 	if (!select) return

// 	console.log(e.currentTarget)
// 	let selects = document.querySelectorAll('.my-select');
// 	// console.log('selects:', selects)
// 	if (!selects.length) return;
// 	selects.forEach(parent => {
// 		let header = parent.querySelector('.my-select-header');
// 		let options = parent.querySelectorAll('.my-select-dropdown__option');

// 		header.addEventListener('click', function (e) {
// 			event.preventDefault()
// 			let target = event.currentTarget
// 			let dropdown = target.parentNode.querySelector('.my-select-dropdown')
// 			dropdown.classList.toggle('active')
// 		})

// 		options.forEach(option => {
// 			option.addEventListener('click', function (event) {
// 				event.preventDefault()
// 				let target = event.currentTarget
// 				dropdownOptionSelect(target, parent)
// 			})
// 		})

// 		window.addEventListener('click', function (e) {
// 			if (parent.querySelector('.my-select-dropdown.active')) {
// 				if (!parent.querySelector('.my-select-dropdown.active').parentNode.contains(e.target)) {
// 					dropdownClose()
// 				}
// 			}
// 		});
// 	})
// 	function dropdownOptionSelect(option, parent) {
// 		let header = parent.querySelector('.my-select-header')
// 		header.querySelector('.my-select-header__selected').value = option.dataset.select
// 		header.querySelector('.my-select-header__option').innerHTML = option.innerHTML
// 		dropdownClose()
// 	}

// 	function dropdownClose() {
// 		let dropdowns = document.querySelectorAll('.my-select-dropdown')
// 		dropdowns.forEach(dropdown => {
// 			dropdown.classList.remove('active')
// 		})
// 		document.dispatchEvent(new CustomEvent("my-selected", {}));
// 	}
// }
function calculate(e) {
	let form = e.target.closest('form')
	let inputs = form.querySelectorAll('.calcform-field-input')
	let erororNote = form.querySelector('.error-note')
	let isError = false;
	let res = {}
	inputs.forEach(input=> {
		if (input.value === '') {
			input.classList.add('is-error')
			isError = true
		}
		else {
			input.classList.remove('is-error')
		}
	})

	if (isError) {
		erororNote.classList.add('show')
		return
	} else {
		erororNote.classList.remove('show')
	}

	calculateAnswer.classList.remove('hidden')
	calcformCallback.classList.remove('hidden')

	res.address = form.querySelector('.calcform-address__input').value
	res.autoCategory = form.querySelector('#autoCategory').value
	res.autoPeriod = form.querySelector('#autoPeriod').value
	res.autoPowerL = form.querySelector('#autoPowerL').value
	res.autoPowerW = form.querySelector('#autoPowerW').value

	if (form.querySelector('#owner-1').checked) {
		res.owner = 'Частное лицо'
	} else {
		res.owner = 'Юридическое лицо'
	}

	if (form.querySelector('#owner-1').checked && form.querySelector('#driver-1').checked ) {
		res.drivers = []
		let groups = form.querySelectorAll('.calcform-group-drivers[data-owner="owner-1"]')
		console.log('calculate ~ groups:', groups)
		groups.forEach(group=> {
			let age = group.querySelector('.js-age').value
			let exp = group.querySelector('.js-exp').value
			let dtp = group.querySelector('.js-dtp').value
			res.drivers.push({age, exp, dtp})
		})
	}

	alert(JSON.stringify(res))



}
function addDriver() {
	let newDriverBlock = driverBlock.cloneNode(true)

	let form = document.querySelector('.calcform')
	let removeBtns = form.querySelectorAll('.remove-driver')
	removeBtns.forEach(btn => {
		btn.classList.remove('hidden')
	})

	newDriverBlock.querySelectorAll('.calcform-field-input').forEach(item => {
		item.value = ''
	})

	driverAddBtn.before(newDriverBlock)

}
function removeDriver(e) {
	let btn = e.target.closest('.remove-driver')
	if (!btn) return

	btn.closest('.calcform-group').remove()

	let form = document.querySelector('.calcform')
	let removeBtns = form.querySelectorAll('.remove-driver')

	if (removeBtns.length === 1) {
		removeBtns[0].classList.add('hidden')
	}
}
function checkedRadios(e) {
	// console.log(e)
	if (e.target.type !== 'radio') return
	let form = e.target.form
	let arrOwner1 = form.querySelectorAll('[data-owner="owner-1"]')
	let arrOwner2 = form.querySelectorAll('[data-owner="owner-2"]')
	let arrDriver = form.querySelectorAll('[data-driver="driver-1"]')

	switch (e.target.id) {
		case 'owner-1':
			arrOwner1.forEach(item => {
				if (!item.hasAttribute('data-driver-hidden')) {
					item.classList.remove('hidden')
				}
			});
			arrOwner2.forEach(item => { item.classList.add('hidden') });
			break
		case 'owner-2':
			arrOwner1.forEach(item => { item.classList.add('hidden') });
			arrOwner2.forEach(item => { item.classList.remove('hidden') });
			break
		case 'driver-1':
			arrDriver.forEach(item => {
				item.classList.remove('hidden')
				item.removeAttribute('data-driver-hidden', '')
			});
			break
		case 'driver-2':
			arrDriver.forEach(item => {
				item.classList.add('hidden')
				item.setAttribute('data-driver-hidden', '')
			});
			break
	}
}
// function validateInputs(e) {
// 	console.log(e.target.type)
// }


calcform.addEventListener('click', function (e) {
	removeDriver(e)
	customSelect(e)
})
calcform.addEventListener('change', function (e) {
	checkedRadios(e)
})
// calcform.addEventListener('input', function (e) {
// 	validateInputs(e)
// })
calculateBtn.addEventListener('click', (e) => {
	e.preventDefault()
	calculate(e)
})
driverAddBtn.addEventListener('click', (e) => {
	e.preventDefault()
	addDriver()
})

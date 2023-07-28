

jQuery(document).ready(function ($) {
	$('[name="city"]').fias({
		type: $.fias.type.city,
		change: function (obj) {
			// console.log('obj', obj);
			var address = $.fias.getAddress('.js-form-address');
			// console.log(address)
			// $('#address').text(address);
			// $('#address').text(obj.typeShort + ' ' + obj.name );
			// $('#kladrRegion').val(obj.id);
		},
		open: function () {
			var address = $.fias.getAddress('.js-form-address');
			let elFree = document.querySelector('#kladr_autocomplete ul li:first-child')
			if (elFree && elFree.textContent === 'Бесплатная версия kladr-api.ru') {
				elFree.remove()
			}
		},
		'withParents': true
	});
});









let calcform = document.querySelector('.calcform')
let calculateBtn = document.querySelector('.calculate-btn')
let calculateAnswer = document.querySelector('.calcform-answer')
let calcformCallback = document.querySelector('.calcform-callback')
let driverAddBtn = document.querySelector('.add-driver')
let driverBlock = document.querySelector('.calcform-group-drivers')



function customSelect(e) {
	let select = e.target.closest('.my-select')
	if (!select) {
		dropdownClose()
		return
	}
	e.preventDefault()

	let header = select.querySelector('.my-select-header');
	let dropdown = select.querySelector('.my-select-dropdown');

	if (e.target.closest('.my-select-header')) {
		document.querySelector('.my-select-dropdown.active')?.classList.remove('active')
		dropdown.classList.add('active')
	}

	if (e.target.closest('.my-select-dropdown__option')) {
		let option = e.target.closest('.my-select-dropdown__option')
		header.querySelector('.my-select-header__selected').value = option.dataset.select
		header.querySelector('.my-select-header__option').innerHTML = option.innerHTML
		dropdownClose()
	}

	function dropdownClose() {
		let dropdowns = document.querySelectorAll('.my-select-dropdown.active')
		if (!dropdowns.length) return
		dropdowns.forEach(dropdown => {
			dropdown.classList.remove('active')
		})
		document.dispatchEvent(new CustomEvent("my-selected", {}));
	}
}
function calculate(e) {
	let form = e.target.closest('form')
	let inputs = form.querySelectorAll('.calcform-field-input')
	let erororNote = form.querySelector('.error-note')
	let isError = false;
	let res = {}
	inputs.forEach(input => {
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

	if (form.querySelector('#owner-1').checked && form.querySelector('#driver-1').checked) {
		res.drivers = []
		let groups = form.querySelectorAll('.calcform-group-drivers[data-owner="owner-1"]')
		console.log('calculate ~ groups:', groups)
		groups.forEach(group => {
			let age = group.querySelector('.js-age').value
			let exp = group.querySelector('.js-exp').value
			let dtp = group.querySelector('.js-dtp').value
			res.drivers.push({ age, exp, dtp })
		})
	}
	if (form.querySelector('#owner-1').checked && form.querySelector('#driver-1').checked) {
		res.drivers = []
		let groups = form.querySelectorAll('.calcform-group-drivers[data-owner="owner-1"]')
		console.log('calculate ~ groups:', groups)
		groups.forEach(group => {
			let age = group.querySelector('.js-age').value
			let exp = group.querySelector('.js-exp').value
			let dtp = group.querySelector('.js-dtp').value
			res.drivers.push({ age, exp, dtp })
		})
	}
	if (form.querySelector('#owner-2').checked) {
		let driver = form.querySelector('.calcform-group-drivers[data-owner="owner-2"]')
		res.dtpYur = driver.querySelector('.js-dtp').value
	}

	console.log(res)

	let pre = document.createElement('pre')
	pre.textContent = `
	Адрес: ${res.address}
	Собственник: ${res.owner}
	Категория ТС: ${res.autoCategory}
	Период использования: ${res.autoPeriod}
	Мощность, л.с: ${res.autoPowerL}
	Мощность, кВт: ${res.autoPowerW}
	`
	if (res.dtpYur) {
		pre.textContent += 'Сколько лет без ДТП: ' + res.dtpYur
	}

	if (res.drivers) {
		pre.textContent += 'Водители:'
		res.drivers.forEach((driver, i) => {
			pre.textContent += `\n		${i+1}. возраст: ${driver.age}, стаж: ${driver.exp}, дтп: ${driver.dtp}`
		})
	}

	document.querySelector('.result-text').innerHTML = ''
	document.querySelector('.result-text').append(pre)

}
function addDriver() {
	let newDriverBlock = driverBlock.cloneNode(true)

	let form = document.querySelector('.calcform')
	let removeBtns = form.querySelectorAll('.remove-driver')
	removeBtns.forEach(btn => {
		btn.classList.remove('hidden')
	})

	let inputsNumber = newDriverBlock.querySelectorAll('.calcform-field-input')

	inputsNumber.forEach(input => {
		input.value = ''
		validateInputsNumber(input)
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
function calculatePower() {
	let powerL = document.querySelector('#autoPowerL')
	let powerW = document.querySelector('#autoPowerW')
	if (!powerL && !powerW) return

	let prevValueL = '';

	powerL.addEventListener('input', function (e) {
		let value = e.target.value


		if (value === '.' || value === '0') {
			e.target.value = ''
			powerW.value = ''
			return
		}

		value = value.replace(/[^.\d]+/g, "").replace(/^([^\.]*\.)|\./g, '$1');
		value = value.slice(0, 6)

		if (value === '') {
			e.target.value = ''
			powerW.value = ''
			return
		}

		if (!isNaN(value) && value < 1000) {
			prevValueL = value
			e.target.value = value
			powerW.value = Math.round(value * 0.7355 * 100) / 100
		} else {
			e.target.value = prevValueL
		}
	})

	let prevValueW = '';
	powerW.addEventListener('input', function (e) {
		let value = e.target.value

		if (value === '.' || value === '0') {
			e.target.value = ''
			powerL.value = ''
			return
		}
		value = value.replace(/[^.\d]+/g, "").replace(/^([^\.]*\.)|\./g, '$1');
		value = value.slice(0, 6)

		if (value === '') {
			e.target.value = ''
			powerL.value = ''
			return
		}

		if (!isNaN(value) && value < 1000) {
			prevValueW = value
			e.target.value = value
			powerL.value = Math.round(value * 1.3596 * 100) / 100
		} else {
			e.target.value = prevValueW
		}
	})
}
function validateInputsNumber(input) {
	let prevValue = ''
	let id = input.addEventListener('input', (e) => {
		let value = e.target.value

		if (value === '0') {
			e.target.value = ''
			return
		}

		value = value.replace(/[^\d]+/g, "")

		if (!isNaN(value) && value < 120) {
			prevValue = value
			e.target.value = value
		} else {
			e.target.value = prevValue
		}
	})
}


document.addEventListener('click', function (e) {
	customSelect(e)
})
calcform.addEventListener('click', function (e) {
	removeDriver(e)
})
calcform.addEventListener('change', function (e) {
	checkedRadios(e)
})

calculateBtn.addEventListener('click', (e) => {
	e.preventDefault()
	calculate(e)
})
driverAddBtn.addEventListener('click', (e) => {
	e.preventDefault()
	addDriver()
})

calculatePower()
document.querySelectorAll('.js-input-number').forEach(input => {
	validateInputsNumber(input)
})

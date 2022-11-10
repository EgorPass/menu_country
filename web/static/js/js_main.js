console.log("test");

onload = function (e) {
	
	const fetchStatus = {
		input: "",
		lang: "",
		status: "fullfiled",
	}

	const menu = {
		country: {
			root: null,
			menuNode: null,
		},
		regions: {
			root: null,
			menuNode: null,
		}
	}

	const dataForRequest = {
		regions: [],
		city: [],
		title: ''
	}

	menu["country"].root = document.querySelector("#id_country");
	menu["country"].root.setAttribute("autocomplete", "off");
	menu["regions"].root = document.querySelector("#id_regions_city");
	menu["regions"].root.setAttribute("autocomplete", "off");
	
	window.addEventListener("input", onInput);
	window.addEventListener("click", onClick);

	// установка городов в объект после клика из html
	function setArrayForDataForRequestCityAndRegionsAtClick(target) {
		dataForRequest.city = Array.from(target.querySelectorAll("input[name='city'][checked]")).map(it => it.value)
		dataForRequest.regions = Array.from(target.querySelectorAll("input[name='region'][checked]")).map(it => it.value)
	}

	//вывод списка в textarea 
	function printCityAtField(arr) {
		menu.regions.root.innerHTML = arr.join(",\n")
	}

	// обработка кликов на input
	async function clickAtInput(url, prop) {
	
		if (menu[prop].menuNode) return
		if (fetchStatus.status === "pending") return;
      	
		const res = await loadMenu(url);
			if (!res) return;
				
		createMenu(res, prop, fetchStatus.input);
	}

	// загрузка объекта и постановка pending
	async function loadMenu(url) {
		if (fetchStatus.status !== "pending") {
			fetchStatus.status = "pending"

			const data = await requestData(url);
			
			fetchStatus.status = "fullfiled"
			return data
		}
	}
	
	// создание меню
	function createMenu(data, prop, str = "") {
		if (str) data = searchWord(data, str)

		menu[prop].menuNode = createMenuTree(data)
		document.body.append(menu[prop].menuNode);
		positionAt(menu[prop].root, menu[prop].menuNode);
	}

	// удаление меню
	function removeMenu(prop) {
		menu[prop].menuNode.remove();
		menu[prop].menuNode = null;
	}

	// построение древовидного списка для меню
	function createMenuTree(data) {
		const container = document.createElement("ul");
		container.className = "inputMenuContainer";

		const countries = data?.data
		const region = data?.country
		
		if (countries) {
			for (let key of countries) {
				
				const li = document.createElement("li")
				li.className = 'inputMenuContainer__country'
				li.innerHTML = `<div class = "inputMenuContainer__listHover">${key}</div>`

				console.log(li.innerHTML)

				container.append(li)
			}
		}
		
		if (region) {
		
			const box = document.createElement("div")
			box.className = "inputMenuContainer__regionName inputMenuContainer__selectContainer"
			box.innerHTML = `
			<div class = "inputMenuContainer__listHover">
			<label class="inputMenuContainer__checkbox" ><input type = "checkbox"  name = "select" value = "" checked><div class="inputMenuContainer__checkboxStyled inputMenuContainer__checkboxStyled_check"></div><div class ="inputMenuContainer__inputDescription"><sapn class = 'inputMenuContainer__select'>select all</sapn></div></label>
			</div>
			`			
			
			const bufferForCity = []
			const bufferForRegions = [];

			for (let key of region) {
				const regionTitle = Object.keys(key).toString();
				let checkRegionName = "checked"

					if(dataForRequest.regions.length > 0) checkRegionName = dataForRequest.regions.includes(regionTitle) ? "checked" : "";

				const regionName = `
					<li class = "inputMenuContainer__regionName inputMenuContainer__regionName_close inputMenuContainer__regionName_toggle">
						<div class = "inputMenuContainer__listHover">
							<label class="inputMenuContainer__checkbox">
							<input type = "checkbox"  name = "region" value = "${regionTitle}" ${checkRegionName}  />
							<div class="inputMenuContainer__checkboxStyled inputMenuContainer__checkboxStyled_check"></div>
							</label>
							<span class ="inputMenuContainer__regionName_toggle" >${regionTitle}</span>
						</div>
				`;
				
				const city = Object.values(key)[0]
				const cityItem = city.map((it) => {
					let checked = "checked"
					if (dataForRequest.city.length > 0) checked = dataForRequest.city.includes(it) ? "checked" : "";
					return `
					<li class = "inputMenuContainer__city ">
						<div class = "inputMenuContainer__listHover">
							<label class="inputMenuContainer__checkbox">
								<input type = "checkbox"  name = "city" value = "${it}" ${checked} >
								<div class="inputMenuContainer__checkboxStyled inputMenuContainer__checkboxStyled_check"></div>
								<div class ="inputMenuContainer__inputDescription">${it}</div>	
							</label>
						</div>
					</li>`
				})
				
				const cityUl = "<ul class = 'inputMenuContainer__cityContainer'>" + cityItem.join('') + "</ul>"
				const result = regionName + cityUl + "</li>"

				box.innerHTML += result
				bufferForCity.push(...city)
				bufferForRegions.push(regionTitle)
			}
			
				if (!dataForRequest.city.length) dataForRequest.city = bufferForCity
				if (!dataForRequest.regions.length) dataForRequest.regions = bufferForRegions
			printCityAtField(dataForRequest.city)
			container.append(box)
		}

		return container
	}

	async function onClick(e) {
		e.preventDefault();
		const target = e.target;

		// onClick по input для выбора страны
		if (target.id == "id_country") {
			if(menu["regions"].menuNode) removeMenu("regions");
			
			await clickAtInput(`http://127.0.0.1:8000/api/active_country_json/`, "country")
		}

		// onClick по input для выбора городов
		// сработает, только если выбрана страна
		if (target.id === "id_regions_city") {
			if (menu["country"].menuNode) removeMenu("country");
			if (fetchStatus.lang.length < 2) return;

			await clickAtInput(`http://127.0.0.1:8000/api/${fetchStatus.lang}_json/`, "regions")
		}
			
		// on Click мимо наших меню,
		// сработает только если открыто
		// одно из меню
		if (!target.closest(".inputMenuContainer, #id_country, #id_regions_city") && (menu["country"].menuNode || menu["regions"].menuNode)) {
			if (menu["country"].menuNode) removeMenu("country");
			if (menu["regions"].menuNode) removeMenu("regions");
		}
			
		// onClick для вабора страны
		// из выпадающего меню	
		if (target.closest(".inputMenuContainer__country")) {
			
			if (dataForRequest.title && !menu["country"].root.value) menu["country"].root.value = dataForRequest.title
			
			const value = target.closest(".inputMenuContainer__listHover").innerHTML
			
			if (dataForRequest.title !== value) {

				menu["country"].root.value = value;
				fetchStatus.lang = value.match(/\(\w+\)/i)[0].replace(/[()]/g, "").toLowerCase();
				fetchStatus.input = "";
				
				dataForRequest.title = value
				dataForRequest.regions = []
				
				const lists = await loadMenu(`http://127.0.0.1:8000/api/${fetchStatus.lang}_json/`)
				const title = Object.keys(lists)[0]
				dataForRequest.city = lists[title].map(it => Object.values(it)[0] ).flat()
					
				printCityAtField(dataForRequest.city)
			}
			removeMenu("country");
		}
		
		// onClick для разворачивания или сворачивания
		// списка городов в регионе
		if (target.closest(".inputMenuContainer__regionName_toggle") && !target.closest(".inputMenuContainer__city") && !target.closest(".inputMenuContainer__checkboxStyled")) {
			toggleMenu(target.closest(".inputMenuContainer__regionName"))
		}
			
		// onClick при выделении города или региона
		if (target.closest(".inputMenuContainer__city") || target.closest(".inputMenuContainer__regionName")) {
			
			if (target.closest(".inputMenuContainer__city")) 
				setCheckAtCity(target.closest(".inputMenuContainer__city"))
			
			else if (target.closest(".inputMenuContainer__checkbox")) 
				setCheckAtRegion(target.closest(".inputMenuContainer__regionName"))

				setArrayForDataForRequestCityAndRegionsAtClick(target.closest(".inputMenuContainer"))
				printCityAtField(dataForRequest.city)
		}

		if (target.closest("#id_submit_country")) {
			const form = document.querySelector("#id_country_form")
			if (!form) return
			
			if(!menu.country.root.value || !menu.regions.root.value ) return 
			if (dataForRequest.title !== document.querySelector("#id_country").value) { 
				dataForRequest.title = ''
				dataForRequest.city = [];
				dataForRequest.regions = []
				return 
			}
			form.submit();
		}
			setStyleForCheckboxAtRegion()
	};

	function onInput(e) {
		const target = e.target
		const prop = target.id === "id_country" ? "country" : target.id === "id_regions_city" ? "regions" : ''
		const url = prop === "country" ? `http://127.0.0.1:8000/api/active_country_json/` : `http://127.0.0.1:8000/api/${fetchStatus.lang}_json/`


		if (!prop) return
		if (prop === "regions" && fetchStatus.lang.length < 2) return;

		new Promise(async (resolve, reject) => {
			const result = await loadMenu(url);
			resolve(result);
		})
			.then((data) => {
				if (menu[prop].menuNode) removeMenu(prop);
				createMenu(data, prop, fetchStatus.input);
		})
			.catch(err => {
				console.log(err)
				menu[prop] = {}
			});

		fetchStatus.input = e.target.value;

		if (fetchStatus.input === "") {
			if (prop === "country") fetchStatus.lang = "";
			if (menu[prop].menuNode) removeMenu(prop);
		}
	}
};

// поиск слов для вывода в меню
function searchWord(data, str) {	
	const countries = data?.data
	const region = data?.country
	
	if (countries) {
		const res = countries.filter((it) => it.toLowerCase().includes(str.toLowerCase()))
		data.data = res
	}
	if (region) {
		const newObj = []
		
		for (let key of region) {
			const title = Object.keys(key)[0]
			const arr = Object.values(key)[0].filter((it) => it.toLowerCase().includes(str.toLowerCase()))

			if (arr.length > 0) {
				newObj.push({[title]: arr})
			}
		}
		data.country = newObj
	}			

	return data
}

function toggleClass(at, to, from1, from2 ) {
	at.classList.add(to)
	at.classList.remove(from1)
		if(from2) at.classList.remove(from2)
}

// свернуть развернуть список в меню городов
function toggleMenu(node) {
	if (node.classList.contains("inputMenuContainer__regionName_open"))
		toggleClass( node, "inputMenuContainer__regionName_close", "inputMenuContainer__regionName_open")
	else
		toggleClass(node, "inputMenuContainer__regionName_open",  "inputMenuContainer__regionName_close")
}

// установка стиля checkbox для города
// исходя из их отмеченных потомках
function toggleCheckboxForCity(checkboxs) {
	checkboxs.forEach(it => { 
		const checkbox = it.querySelector(".inputMenuContainer__checkboxStyled")
		
		if (it.querySelector("input").hasAttribute("checked"))
			toggleClass(checkbox, "inputMenuContainer__checkboxStyled_check", "inputMenuContainer__checkboxStyled_uncheck")
		 else 
			toggleClass(checkbox, "inputMenuContainer__checkboxStyled_uncheck", "inputMenuContainer__checkboxStyled_check")
	}) 
}

// установка стиля checkbox для региона и select
// исходя из их отмеченных потомках
function toggleCheckboxForRegion(checkboxs) {
	checkboxs.forEach(it => {
		const checkbox = it.querySelector(".inputMenuContainer__checkboxStyled")
		const inputs = it.querySelectorAll("input[name='city']")
		const checkedInputs = it.querySelectorAll("input[name='city'][checked]");

		if (!checkedInputs.length) 
			toggleClass(checkbox, "inputMenuContainer__checkboxStyled_uncheck", "inputMenuContainer__checkboxStyled_check", "inputMenuContainer__checkboxStyled_pre")
	
		else if (inputs.length === checkedInputs.length)
			toggleClass(checkbox, "inputMenuContainer__checkboxStyled_check", "inputMenuContainer__checkboxStyled_uncheck", "inputMenuContainer__checkboxStyled_pre")
		
		else 
			toggleClass(checkbox, "inputMenuContainer__checkboxStyled_pre", "inputMenuContainer__checkboxStyled_check", "inputMenuContainer__checkboxStyled_uncheck")
	})	
}

function setCheckAtInput(node) {
	if (!node.hasAttribute("checked")) node.setAttribute("checked", "")			
	else 	node.removeAttribute("checked")
}

// снять выделить отдельный город
function setCheckAtCity(node) {
	setCheckAtInput(node.querySelector("input"))
}

// снять выделить все что находиться внутри региона и select
function setCheckAtRegion(node) {	
	const input = node.querySelector("input[name='region']")
	const lists = node.querySelectorAll("input")

	setCheckAtInput(input)

	for (let key of lists) {
		if (input.hasAttribute("checked"))	key.setAttribute("checked", "")
		else 	key.removeAttribute("checked")
	}
}

// поиск и установка стилей для сheck box
function setStyleForCheckboxAtRegion(node) {
	const container = document.querySelector(".inputMenuContainer")
	if (!container) return;

	toggleCheckboxForCity(container.querySelectorAll(".inputMenuContainer__city"))
	toggleCheckboxForRegion(container.querySelectorAll(".inputMenuContainer__regionName"))
}

// позиционирование выпадающего меню
function positionAt(anch, elem) {
	const anchCoords = anch.getBoundingClientRect();	
	let line = anchCoords.bottom
	let screen = document.documentElement.clientHeight;

	if (line + elem.offsetHeight > screen) line = line - elem.offsetHeight;

  elem.style.top = line + document.documentElement.scrollTop + "px";
  elem.style.left = anchCoords.left + 8 + "px";
}

// запрос объекта для меню
async function requestData(url) {
  try {
    const res = await window.fetch(url);
    if (!res.ok) throw new Error("что то не так");
    return await res.json();
  } catch (err) {
    console.log(err);
    return err.message;
  }
}

// искуственная задержка
async function delay(ms) {
  await new Promise((res) => setTimeout(() => res(), ms));
  return false;
}
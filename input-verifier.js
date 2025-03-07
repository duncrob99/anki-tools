window.setupInputVerification = veri_func => {
	let $ = qry => document.querySelector(qry);
	let $$ = qry => document.querySelectorAll(qry);

	let inp = $("#typeans");
	inp.addEventListener("input", validateInput);
	let markInvalidTimeout = null;

	function markInvalid() {
			inp.classList.add("invalid");
	}

	function validateInput() {
		let val = inp.value;
		//let is_kana = !val.match(/[^\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]/u);
    let valid = veri_func(val);
		if (valid) {
			clearTimeout(markInvalidTimeout);
			markInvalidTimeout = null;
			inp.classList.remove("invalid");
		} else if (markInvalidTimeout === null) {
			markInvalidTimeout = setTimeout(markInvalid, 1000);
		}
		return valid;
	}

	inp.addEventListener("keydown", ev => {
		let escaping_input = ev.key === "Tab";
		let submitting_invalid = ev.key === "Enter" && !validateInput();
		if (escaping_input || submitting_invalid) {
			ev.preventDefault();
		}
	});
	
	validateInput();
};

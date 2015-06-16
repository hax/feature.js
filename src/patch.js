function getPropertyDescriptor(obj, prop) {
	if (!(prop in obj)) return undefined
	var pd
	while (true) {
		pd = Object.getOwnPropertyDescriptor(obj, prop)
		if (pd !== undefined) {
			pd.object = obj
			return pd
		}
		obj = Object.getPrototypeOf(obj)
		// assert(obj != null)
	}
}

function patchPropertyDescriptor(obj, prop, callback) {
	var originPD = getPropertyDescriptor(obj, prop)
	var newPD = callback(originPD)
	if (newPD == null) return
	if (originPD) {
		try {
			Object.defineProprety(originPD.object, prop, newPD)
			return true
		} catch (e) {}
	}
	Object.defineProperty(obj, prop, newPD)
	return false
}

function patch(obj, name, callback) {

	return patchPropertyDescriptor(obj, name, function (pd) {
		return {value: callback(pd.value)}
	})

}

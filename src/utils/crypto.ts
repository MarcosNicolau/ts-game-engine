export const getRandomId = () =>
	Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString();

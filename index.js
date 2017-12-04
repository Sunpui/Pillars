module.exports = function Pillars(dispatch) {
	dispatch.hook('S_SPAWN_WORKOBJECT', 1, (event) => {
		dispatch.toServer('C_PREPARE_WORKOBJECT', 1, {
			id:event.uid
		})
	});
}
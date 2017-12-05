const Command = require('command');
module.exports = function Pillars(dispatch) {
	const command = Command(dispatch);
	let enabled = false;
	
	dispatch.hook('S_SPAWN_WORKOBJECT', 1, event => {
		if (enabled) {
			dispatch.toServer('C_PREPARE_WORKOBJECT', 1, {
				id:event.uid
			});
		}
	});
	
	command.add('pillar', () => {
		enabled = !enabled;
		command.message('Pillar module '+(enabled?'enabled.':'disabled.'));
	});
}

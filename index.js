//written by Bubble - https://github.com/Binkyface/Pillars

const Command = require('command');

module.exports = function Pillars(dispatch) {
	const command = Command(dispatch);
	let enabled = false;
	let jump = false;
	let pillar = [];
	
	dispatch.hook('S_SPAWN_WORKOBJECT', 1, event => {
		if (enabled) {
			if (jump) {
				for(var uid of pillar) {
					if (uid - event.uid === 0) {
						return;
					}
				}
				pillar.push(event.uid);
				notice(pillar.length)
			} else {
				dispatch.toServer('C_PREPARE_WORKOBJECT', 1, {
					id: event.uid
				});
			}
		}
	});
	
	dispatch.hook('S_DESPAWN_WORKOBJECT', 1, event => {
		if (enabled && jump && event.unk !== 0) { //unk = 0 -> unload because too far
			for(var i = 0; i < pillar.length; i++) {
				if (pillar[i] - event.uid === 0) {
					pillar.splice(i, 1);
					notice(pillar.length)
					return;
				}
			}
		}
	});
	
	dispatch.hook('S_LOAD_TOPO', 3, event => {
		pillar = [];
	});
	
	dispatch.hook('C_PLAYER_LOCATION', 1, event  => {
		if (enabled && event.type === 5 && pillar.length !== 0) {
			for(var uid of pillar) {
				dispatch.toServer('C_PREPARE_WORKOBJECT', 1, {
					id: uid
				});
			}
			dispatch.hookOnce('C_PLAYER_LOCATION', 1, event  => {
				return false;
			});
			return false;
		}
	});
	
	command.add('pillar', () => {
		enabled = !enabled;
		command.message('Pillar module ' + (enabled?'enabled.':'disabled.'));
	});
	
	command.add('pillarjump', () => {
		jump = !jump;
		enabled = jump;
		command.message('Pillar jump ' + (enabled?'activated':'deactivated') + ' and module ' + (enabled?'enabled.':'disabled.'));
	});
	
	function notice(msg) {
		dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 1, {
            unk1: 2,
            unk2: 0,
            unk3: 0,
            message: 'Pillars: ' + msg
        });
    }
}

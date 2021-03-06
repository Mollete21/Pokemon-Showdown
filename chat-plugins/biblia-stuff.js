/* Biblia League plugin
 * A fun script that holds all
 * of the league ranks in a JSON (now 2 JSON files)
 * file to be accessed at our leisure (Beta)
 * By: panpawn
 */
 
var fs = require('fs');
var serialize = require('node-serialize');
var leagueRanks = {};
var leagueFactions = {};
var leagueType = {};
var leagueName = "Biblia";
var leagueRanksToHave = ["e4", "champ", "gl", "purgatory", "prof"];
var leagueFactionsToHave = ["hell", "heaven", "earth", "space"];
var ptypesToHave = ['fire','water','grass','bug','ground','rock','steel','fighting','flying','dragon','fairy','poison','dark','psychic','electric','normal','ice','ghost','ou','all'];

if (typeof Gold === 'undefined') global.Gold = {};
Gold.biblia = {
	bibliafaction: {},
	biblia: {},
	type: {}
};

function loadFaction() {
	try {
		leagueFactions = serialize.unserialize(fs.readFileSync('config/biblia-league-factions.json', 'utf8'));
		Object.merge(Gold.biblia.bibliafaction, leagueFactions);
	} catch (e) {};
}
setTimeout(function(){loadFaction();},1000);

function saveFaction() {
	try {
		fs.writeFileSync('config/biblia-league-factions.json',serialize.serialize(leagueFactions));
		Object.merge(Gold.biblia.bibliafaction, leagueFactions);
	} catch (e) {};
}


function loadType() {
	try {
		leagueType = serialize.unserialize(fs.readFileSync('config/biblia-league-types.json', 'utf8'));
		Object.merge(Gold.biblia.type, leagueType);
	} catch (e) {};
}
setTimeout(function(){loadType();},1000);

function saveType() {
	try {
		fs.writeFileSync('config/biblia-league-types.json',serialize.serialize(leagueType));
		Object.merge(Gold.biblia.type, leagueType);
	} catch (e) {};
}


function loadLeague() {
	try {
		leagueRanks = serialize.unserialize(fs.readFileSync('config/biblia-league-ranks.json', 'utf8'));
		Object.merge(Gold.biblia.biblia, leagueRanks);
	} catch (e) {};
}
setTimeout(function(){loadLeague();},1000);

function saveLeague() {
	try {
		fs.writeFileSync('config/biblia-league-ranks.json',serialize.serialize(leagueRanks));
		Object.merge(Gold.biblia.biblia, leagueRanks);
	} catch (e) {};
}

exports.commands = {
	biblia: function (target, room, user) {
		if (!target) target = 'help';
		if (room.id !== 'thebiblialeague') return false;
		var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();
		try {
			switch (toId(parts[0])) {
				case 'giverank':
					if (!parts[1] || !parts[2]) return this.sendReply("ERROR!  Usage: /biblia giverank, [user], [rank] - Gives a user a league rank.");
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can give a " + leagueName + " rank!");
					var targetUser = toId(parts[1]);
					if (Gold.biblia.biblia[targetUser]) return this.sendReply("ERROR! The user " + targetUser + " already has a league rank!");
					if (toId(parts[2]).indexOf(leagueRanksToHave) < 0) return this.sendReply("Ahhhh!  You didn't enter a valid league rank! (" + leagueRanksToHave + ")");
					leagueRanks[targetUser] = Gold.biblia.biblia[targetUser] = toId(parts[2]); //shouldn't have to take the id here, this is for safety precautions
					saveLeague();
					this.sendReply(targetUser + " was given the league rank of " + parts[2]);
					this.logModCommand(targetUser + " was given the league rank of " + parts[2]);
					var rankLEBEL = "";
					switch (toId(parts[2])) {
						case 'e4':
							rankLEBEL = "Elite Four";
							break;
						case 'champ':
							rankLEBEL = "Champion";
							break;
						case 'gl':
							rankLEBEL = "Gym Leader";
							break;
						case 'prof':
							rankLEBEL = "Professor";
							break;
						case 'purgatory':
							rankLEBEL = "Purgatory";
							break;
					}
					room.add(targetUser + " was given the league rank of " + rankLEBEL + " by " + user.name + ".");
					break;
				case 'takerank':
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can take a " + leagueName + " rank!");
					if (!parts[1]) return this.sendReply("Usage: /biblia takerank, [user] - Removes a users rank.");
					var targetUser = toId(parts[1]);
					if (!Gold.biblia.biblia[targetUser]) return this.sendReply("ERROR!  The user " + targetUser + " does not have an existing rank to remove!");
					delete Gold.biblia.biblia[targetUser];
					delete leagueRanks[targetUser];
					saveLeague();
					this.sendReply(targetUser + "'s league rank was removed.");
					this.logModCommand(targetUser + "'s league rank was removed by " + user.name);
					room.add(targetUser + "'s league rank was removed by " + user.name);
					break;
				case 'givefaction':
					if (!parts[1] || !parts[2]) return this.sendReply("ERROR!  Usage: /biblia givefaction, [user], [faction] - Gives a user a league faction.");
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can give a " + leagueName + " faction!");
					var targetUser = toId(parts[1]);
					if (Gold.biblia.bibliafaction[targetUser]) return this.sendReply("ERROR! The user " + targetUser + " already has a league faction!");
					if (toId(parts[2]) !== 'hell' || toId(parts[2]) !== 'heaven' || toId(parts[2]) !== 'earth' || toId(parts[2]) !== 'space') return this.sendReply("Ahhhh!  You didn't enter a valid league faction! (" + leagueFactionsToHave + ")");
					leagueFactions[targetUser] = Gold.biblia.bibliafaction[targetUser] = toId(parts[2]); //shouldn't have to take the id here, this is for safety precautions
					saveFaction();
					this.sendReply(targetUser + " was given the league faction of " + parts[2]);
					this.logModCommand(targetUser + " was given the league faction of " + parts[2]);
					room.add(targetUser + " was given the league faction of " + parts[2] + " by " + user.name + ".");
					break;
				case 'takefaction':
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can take a " + leagueName + " faction!");
					if (!parts[1]) return this.sendReply("Usage: /biblia takefaction, [user] - Removes a users faction.");
					var targetUser = toId(parts[1]);
					if (!Gold.biblia.bibliafaction[targetUser]) return this.sendReply("ERROR!  The user " + targetUser + " does not have an existing faction to remove!");
					delete Gold.biblia.bibliafaction[targetUser];
					delete leagueFactions[targetUser];
					saveFaction();
					this.sendReply(targetUser + "'s league faction was removed.");
					this.logModCommand(targetUser + "'s league faction was removed by " + user.name);
					room.add(targetUser + "'s league faction was removed by " + user.name + ".");
					break;
				case 'givetype':
					if (!parts[1] || !parts[2]) return this.sendReply("ERROR!  Usage: /biblia givetype, [user], [type] - Gives a user a league type.");
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can give a " + leagueName + " rank!");
					var targetUser = toId(parts[1]);
					if (Gold.biblia.type[targetUser]) return this.sendReply("ERROR! The user " + targetUser + " already has a league rank!");
					var a = parts.splice(2, parts.length).join(',');
					if (ptypesToHave.split(",").indexOf(a)) return this.sendReply("Ahhhh!  You didn't enter a valid league type! (" + ptypesToHave + ")");
					leagueType[targetUser] = Gold.biblia.type[targetUser] = toId(parts[2]); //shouldn't have to take the id here, this is for safety precautions
					saveType();
					this.sendReply(targetUser + " was given the league type of " + parts[2]);
					this.logModCommand(targetUser + " was given the league type of " + parts[2]);
					room.add(targetUser + " was given the league type of " + parts[2] + " by " + user.name + ".");
					break;
					break;
				case 'taketype':
					if (!this.can('declare', null, room)) return this.sendReply("Only room owners and up can take a " + leagueName + " type!");
					if (!parts[1]) return this.sendReply("Usage: /biblia taketype, [user] - Removes a users type.");
					var targetUser = toId(parts[1]);
					if (!Gold.biblia.type[targetUser]) return this.sendReply("ERROR!  The user " + targetUser + " does not have an existing faction to remove!");
					delete Gold.biblia.type[targetUser];
					delete leagueType[targetUser];
					saveType();
					this.sendReply(targetUser + "'s league type was removed.");
					this.logModCommand(targetUser + "'s league type was removed by " + user.name);
					room.add(targetUser + "'s league type was removed by " + user.name + ".");
					break;
				//Development commands
				case 'rankobject':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					return this.sendReplyBox("Gold.biblia.biblia = " + fs.readFileSync('config/biblia-league-ranks.json', 'utf8'));
					break;
				case 'factionobject':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.sendReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					return this.sendReplyBox("Gold.biblia.bibliafaction = " + fs.readFileSync('config/biblia-league-factions.json', 'utf8'));
					break;
				case 'profile':
				case 'view':
				case 'show':
					if (!this.canBroadcast()) return;
					if (!parts[1]) parts[1] = user.name;
					var rank = Gold.biblia.biblia[toId(parts[1])];
					if (!rank) rank = "None.";
					if (!Gold.biblia.bibliafaction[toId(parts[1])]) fuckingFaction = "None.";
					var img = "";
					var rankLabel = "";
					var fuckingFaction = Gold.biblia.bibliafaction[toId(parts[1])];
					if (!fuckingFaction) fuckingFaction = "None.";
					var type = Gold.biblia.type[toId(parts[1])];
					if (!type) type = "None.";
					switch (rank) {
						case 'e4':
							rankLabel = "Elite Four";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/vgc.png" title="' + rankLabel + '">';
							break;
						case 'champ':
							rankLabel = "Champion";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tr.png" title="' + rankLabel + '">';
							break;
						case 'gl':
							rankLabel = "Gym Leader";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tour.png" title="' + rankLabel + '">';
							break;
						case 'purgatory':
							rankLabel = "Purgatory";
							img = '<img src="http://www.smogon.com/media/forums/images/badges/tc.png" title="' + rankLabel + '">';
							break;
						case 'prof':
							rankLabel = "Professor"
							img = '<img src="http://www.smogon.com/media/forums/images/badges/cc.png" title="' + rankLabel + '">';
							break;
						default:
							img = '';
							rankLabel = "None."
					}
					return this.sendReplyBox(
						"<b>User: <font color=\"" + Gold.hashColor(toId(parts[1])) + "\">" + parts[1] + "</font></b><br />" +
						"<b>League Faction</b>: " + leagueFaction.substring(0,1).toUpperCase() + leagueFaction.substring(1,leagueFaction.length) + "<br />" +
						"<b>League Rank</b>: " + rankLabel.substring(0,1).toUpperCase() + rankLabel.substring(1,rankLabel.length) + " " + img + "<br />" +
						"<b>Type:</b> " + leagueType.substring(0,1).toUpperCase() + leagueType.substring(1,leagueType.length) + "<br />"
					); 
					break;
				case 'help':
				default:
					if (!this.canBroadcast()) return;
					return this.sendReplyBox(
						"Biblia commands: <br />" +
						"/biblia giverank, [user], [rank] - Gives someone a league rank. Requires # and up.<br />" +
						"/biblia takerank, [user] - Removes that user's league rank.  Requires # and up.<br />" +
						"/biblia givefaction, [user], [faction] - Gives a user a league faction. Requires # and up.<br />" +
						"/biblia takefaction, [user] - Removes that user's league faction. Requires # and up.<br />" +
						"/biblia givetype, [user], [type] - Sets the type the user specializes in within the league. Requires # and up.<br />" +
						"/biblia taketype, [user] - Removes that user's league type. Requires # and up.<br />" +
						"/biblia profile, [user] - Shows that user's league rank and faction according to the biblia script."
					);
			}
		} catch (e) {
			console.log("AH!  THE BIBLIA SCRIPT HAS SELF DESTRUCTED!\n" + e.stack);
			this.sendReply("Something broke. PM panpawn. Do not PM Lights. He doesn't care.");
		}
	}
};

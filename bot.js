/******************************************************************************************************
	Turntable-API-Taco-Bot 0.1
	by Luis Gonzalez

*******************************************************************************************************/
var Bot    = require('ttapi');
var moderatorList = [];
var dJList = [];
var BOT_VERSION = '0.1.0';


/** Settings File - Adjust accordingly.	**/
	
	var settings = require('./bot_settings.js');

/** Connect to Turntable.fm **/

	var bot = new Bot(settings.AUTH, settings.USERID, settings.ROOMID);
	

	/** Update Room Moderators - on new mod, removed mod **/
	bot.on('new_moderator', function(data) { bot.roomInfo(function(data) { moderatorList = data.room.metadata.moderator_id; }); });
	bot.on('rem_moderator', function(data) { bot.roomInfo(function(data) { moderatorList = data.room.metadata.moderator_id; }); });
	
	bot.on('roomChanged', function (data) {
				/** Update Room Moderators - on room join **/
				moderatorList = data.room.metadata.moderator_id;
				dJList = data.room.metadata.djs;
		
				if (settings.DEBUG_LOGS) {
		
						bot.playlistAll(function (data) {
						   		console.log('----- begin room playlist data -----');
						      	console.log(data);
						   		console.log('----- end room playlist data -----');
						}); //end bot.playlistAll	
				} //end console logs.
	
	}); 
	
	
	/** settings.VOTE_POLLING **/

	if (settings.VOTE_POLLING) {
		
		bot.on('endsong', function (data) {
		console.log(data);
		var room = data.room;
		var upvotes = room.metadata.upvotes;
		var downvotes = room.metadata.downvotes;
		var listeners = room.metadata.listeners;
		var djcount = room.metadata.djcount;
		bot.speak(':musical_note: :thumbsup:'+upvotes+' :thumbsdown: '+downvotes+'');
		bot.speak(':man:: '+listeners+' :hash: dj\'s: :'+djcount+':');
		});
	}
	
	/** settings.AUTO_AWESOME - Use with caution **/
	if (settings.AUTO_AWESOME) {
		/**	if you want to fork my code and add an auto bop, have at it. **/
	}
	
	/** settings.TALK_IN_CHAT **/
	
	if (settings.TALK_IN_CHAT) {
		
		bot.on('speak', function (data) {
		   // Get the data
			var name = data.name;
			var text = data.text;
			var user = data.userid;


				/** if bot name is mentioned **/
				if (text.match('/mods')) {
					if (moderatorList) bot.speak('Mods: '+moderatorList+'');
				}
				if (text.match('/djs')) {
					if (dJList) bot.speak('DJs: '+dJList+'');
				}
				/** if bot name is mentioned **/
				if (text.match(settings.BOT_NAME)) {
					bot.speak('That\'s my name, don\'t wear it out!');
				}
				/** Room Rules **/
				if (text.match(/^(?:\*|\/)rules$/)) {
				bot.speak('See '+settings.ROOM_RULES_URL+' for the room rules.');
				}
				/** Song Information **/
				if (text.match(/^\/songinfo$/)) {
				   bot.roomInfo(true, function(data) {
						var current_song = data.room.metadata.current_song;
						if (current_song) {

						var songId = current_song._id;
						var songAlbum = current_song.metadata.album;
						var songGenre = current_song.metadata.genre;
						var songName = current_song.metadata.song;
					}
					
					if (settings.DEBUG_LOGS) {
						console.log('---- BEGIN CURRENT SONG METADATA --------------------');
						if (current_song) { console.log(current_song.metadata) } else  { console.log('No song is playing.');}
						console.log('---- END CURRENT SONG METADATA --------------------');
					}
					
												
					current_song ? bot.speak(':notes: "'+songName+'" :cd: Album: '+songAlbum+' :radio: Genre: '+songGenre+'') : bot.speak(':exclamation: No song is playing.');
						
					
				
						
						
						
						
						
				   });	
				} //end songinfo
				
				/** Look in Moderators array or room mods to see if chatting with an admin.
				If chatting with an admin, allow user to moderate. **/
				if (settings.BOT_MODERATORS_ARRAY.indexOf(user) >= 0||moderatorList.indexOf(user) >= 0) {

					/** Update Bot's DJ Queue - push playing song to top of queue **/
					if (text.match(/^\*top$/)) {
					   bot.roomInfo(true, function(data) {
					      var song = data.room.metadata.current_song._id;
					      var songName = data.room.metadata.current_song.metadata.song;

						if (song) { bot.playlistAdd(song); }
							bot.speak(''+songName+' - to the top you go!');
					   });
					}
					/** fart **/
					if (text.match(/^poop$/)) {
						bot.speak('feart.');
						bot.snag();
					}
					/** Disconnect from Turntable.fm **/

					if (text.match(/^\/die$/)) {

						bot.speak('/me dies tragically.'); 
						bot.close(); //fixme
					}
					/** Get DJ's Playlist **/
						if (text.match(/^\/playlist$/)) {

							if (settings.DEBUG_LOGS) { 

								bot.pm('Okay, '+name+'. Check log for playlist.',user);

					   			bot.playlistAll(function (data) {
				      				console.log(data);
				   				});

							} 
					}
					

					
						if (text.match(/^\/votes$/)) {

							
							bot.roomInfo(true, function(data) {
							
								if (settings.DEBUG_LOGS) {
									console.log('---- BEGIN ROOM DATA --------------------');
									console.log(data.room);
									console.log('---- END ROOM DATA --------------------');
								}
								

							var room = data.room;
							var upvotes = room.metadata.upvotes;
							var downvotes = room.metadata.downvotes;
							var listeners = room.metadata.listeners;
							var djcount = room.metadata.djcount;
							bot.speak(':musical_note: :thumbsup:'+upvotes+' :thumbsdown: '+downvotes+'');
							bot.speak(':man:: '+listeners+' :hash: dj\'s: :'+djcount+':');
							
						   });
					}
					
					
					
						if (text.match(/^\/votelog$/)) {

							
							bot.roomInfo(true, function(data) {
							
								if (settings.DEBUG_LOGS) {
									console.log('---- BEGIN ROOM DATA --------------------');
									console.log(data.room);
									console.log('---- END ROOM DATA --------------------');
								}
								
							var room = data.room;
							var upvotes = room.metadata.upvotes;
							var downvotes = room.metadata.downvotes;
							var listeners = room.metadata.listeners;
							var djcount = room.metadata.djcount;
							var creatorname = room.metadata.creator.name;
							var currentdj = room.metadata.current_dj;
							var vote_log = room.metadata.votelog;
							var current_song = room.metadata.current_song;
							if (current_song) {

							var songId = current_song._id;
							var songAlbum = current_song.metadata.album;
							var songGenre = current_song.metadata.genre;
							var songName = current_song.metadata.song;
							
						}
						
						if (vote_log) {
							//todo
							/** ---- BEGIN VOTELOG DATA --------------------
							[ [ '4f9b545caaa5cd2af400022f', 'up' ] ]
							---- END VOTELOG DATA --------------------
							**/
						}
					
	
							if (settings.DEBUG_LOGS) {
								console.log('---- BEGIN VOTELOG DATA --------------------');
								console.log(vote_log);
								console.log('---- END VOTELOG DATA --------------------');
							}
							
							/** Show Upvotes, Downvotes for the current song. Show listener count, DJ count. **/
							bot.speak(':musical_note: :thumbsup:'+upvotes+' :thumbsdown: '+downvotes+'');
							bot.speak(':man:: '+listeners+' :hash: dj\'s: :'+djcount+':');
							
						   });
					}
					
					
					
					
				} //end if name in settings.BOT_MODERATORS_ARRAY - end admin chat section

		}); //end on bot speak.
	
		
		
	} //end if settings.TALK_IN_CHAT. This ends the chat section.
	
	
	if (settings.TALK_IN_PRIVATE) {
		bot.on('pmmed', function (data) { 
		/** we have to get the variables again **/
		var name = data.name;
		var sender = data.senderid;
		var text = data.text;
		var user = data.userid;		
			/** Test for Bot Responsiveness **/
			if (text.match(/^hi$/)) {
		      	bot.pm('Hey! How are you ?',sender);
				bot.pm('I\'m just glad to have somebody to talk to.',sender);

		   }
		
		
			if (text.match(/^test$/)) {
				//if (moderatorList.indexOf(user) >= 0) {
				if (settings.BOT_MODERATORS_ARRAY.indexOf(user) >= 0||moderatorList.indexOf(user) >= 0) {
					bot.pm('hi mod',sender);
				} else {
					bot.pm('hi user '+user+'',sender);					
				}
		   }

		
		
				/** Look in Moderators array to see if private messaging (PM) with an admin.
		If in PM with an admin, allow user to moderate via PM. **/
		if (settings.BOT_MODERATORS_ARRAY.indexOf(user) >= 0||moderatorList.indexOf(user) >= 0) {
			
			/** Am I a bot admin? **/
			if (text.match(/^\/botadmin$/)) {
				bot.pm('Yes, you\'re my admin.',sender);
			} 
			
			/** Make Bot DJ if spot is open **/
			if (text.match(/^\/dj$/)) {

				bot.pm('Okay.',sender);
				bot.addDj();
			}
			
			/** Make Bot quit DJ'ing **/
			if (text.match(/^\/dj off$/)) {

				bot.pm('Okay.',sender);
				bot.remDj();
			}
			
			/** Upvote Current Song **/
			if (text.match(/^\/upvote|up$/)) {
				bot.bop();
			}
			/** Downvote Current Song **/
			if (text.match(/^\/downvote|down$/)) {
				bot.vote('down');
			}
			/** Skip Current Song if bot is DJ'ing **/
			if (text.match(/^\/skip$/)) {

				bot.pm('Gonna skip this song.',sender);
				bot.skip();
			}			
			/** Snag the Song Currently Playing **/
			if (text.match(/^\/feart|\/snag$/)) {
				bot.pm('Gonna heart this song',sender);
					bot.roomInfo(true, function(data) {
				      var song = data.room.metadata.current_song._id;
				      var songName = data.room.metadata.current_song.metadata.song;
						bot.snag();
				      	bot.playlistAdd(song);
				   });
			} //end snag
		}
		
	});
	} //end if settings.TALK_IN_PRIVATE. This ends the private message section.
	
	
	/** The following code is by Alain Gilbert, creator of the API **/
	//time_afk_list.js code
	var usersList = { };

	// Add everyone in the users list.
	bot.on('roomChanged',  function (data) {
	   usersList = { };
	   for (var i=0; i<data.users.length; i++) {
	      var user = data.users[i];
	      user.lastActivity = new Date();
	      usersList[user.userid] = user;
	   }
	});

	// Someone enter the room, add him.
	bot.on('registered',   function (data) {
	   var user = data.user[0];
		if (user.userid != settings.USERID) {
			if (settings.GREET_ON_ENTER) bot.speak('Welcome, '+user.name+'!');
		} else {
			bot.speak('Hey guys. I am back. (v. '+BOT_VERSION+')');	
		}
	   user.lastActivity = new Date();
	   usersList[user.userid] = user;
	});

	// Someone left, remove him from the users list.
	bot.on('deregistered', function (data) {
		var user = data.user[0];
		if (settings.GREET_ON_EXIT) bot.speak('Come back soon, '+user.name+'!');
	   delete usersList[data.user[0].userid];
	});

	// Someone talked, update his timestamp.
	bot.on('speak', function (data) {
	   usersList[data.userid].lastActivity = new Date();
	});

	// Someone voted, update his timestamp.
	/** do_not_use
	bot.on('update_votes', function (data) {
	   var votelog = data.room.metadata.votelog;
	   for (var i=0; i<votelog.length; i++) {
	      var userid = votelog[i][0];
	      usersList[userid].lastActivity = new Date();
	   }
	});
	**/

	// Someone stepped up to DJ, update his timestamp.
	bot.on('add_dj', function (data) {
	   var user = data.user[0];
		//bot.speak('Are you ready for DJ '+user.name+'?!');
	   usersList[user.userid].lastActivity = new Date();
	});

	// Someone step down, update his timestamp.
	bot.on('rem_dj', function (data) {
	   var user = data.user[0];
	   usersList[user.userid].lastActivity = new Date();
	});

	// Someone add the surrent song to his playlist.
	bot.on('snagged', function (data) {
	   var userid = data.userid;
	   usersList[userid].lastActivity = new Date();
	});
	//end userlist data

	
	

// ce script lance un jeu de puissance 4 (connect 4) à partir d'éléments dom contenu dans la variable globale 'connect_4.elems'

// Classes des objets utilisé au Puissance 4
class Piece{
	constructor(real_pos, rayon, color){
		this.color = color;
		// this.grid_pos = grid_pos;
		this.real_pos = real_pos;
		// console.log(real_pos);
		this.rayon = rayon;
	}
	draw(ctx){
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.real_pos.x, this.real_pos.y, this.rayon, 0, Math.PI*2, 0);
		ctx.fill();
	}
}

class Grid{
	constructor(dimesions){
		// dimensions réelles affichés lors du dessin
		this.dim = dimesions;
		// nombre de jetons sur l'axe x et y
		this.nb_pieces = {x: 7,y: 6};
		// tous les joueurs inscrits
		this.players = Array();
		// le numéro du joueur attendu
		this.player_await = 0;
		// la couleur gagnante
		this.winner = 0;
		// piecesleau de pieces
		this.pieces= Array();
		for (var i = 0; i < this.nb_pieces.x; i++) {
			this.pieces.push(Array());
			for (var j = 0; j < this.nb_pieces.y; j++) {
				this.pieces[i].push(0);
				this.setPiece(i, j, 'white');
			}
		}
	}
	draw(ctx){
		ctx.fillStyle = 'blue';
		ctx.fillRect	(0,0, this.dim.x, this.dim.y);
		for (var i = 0; i < this.pieces.length; i++) {
			var colone = this.pieces[i];
			for (var j = 0; j < colone.length; j++) {
				var piece = colone[j];
				piece.draw(ctx);
			}
		}
		if(this.winner!=0){
			ctx.font = this.dim.x/12+'px Trebuchet MS';
			ctx.fillStyle = this.winner;
			ctx.fillText	('La couleur '+this.winner+' a gagné.',
			this.dim.y/20, this.dim.x/4, this.dim.x/10*9);
			ctx.strokeStyle = 'black';
			ctx.strokeText	('La couleur '+this.winner+' a gagné.',
			this.dim.y/20, this.dim.x/4, this.dim.x/10*9);
		}
	}
	play(player, no_column){
		if(this.players[this.player_await].color == player.color&&this.winner==0){
			console.log('Le joueur '+player.color+' joue la collone '+no_column+'.');
			var column = this.pieces[no_column];
			for (var i = column.length-1; i >= 0; i--) {
				if(column[i].color == 'white'){
					this.setPiece(no_column, i, player.color);
					this.player_await++;
					this.player_await%=this.players.length;
					this.verif();
					break;
				}
			}

		}
	}
	setPiece(x, y, color){
		console.log('Un jeton de couleur '+color+' se positionne en x:'+x+' y:'+y);
		var rayon = Math.min(
			this.dim.x/this.nb_pieces.x,
			this.dim.y/this.nb_pieces.y,
		)/3;
		var position = {
			x: this.dim.x/this.nb_pieces.x*(x+0.5),
			y: this.dim.y/this.nb_pieces.y*(y+0.5)
		};
		var piece = new Piece(position, rayon, color);
		this.pieces[x][y] = piece;
	}
	verif(){
		console.log('On vérifie que aucun joueur n\'a encore gagné.');

      // variables de la fonction
		var colors_verif = ['red', 'yellow'], color;
		var i,j,k;
		var columns, rows, diag_m, diag_d, piece;
		var winner = this.winner;
		var players = this.players;
		var vthis = this;

      // structure des différents piecesleaux de jetons
		// verticales
		columns	= Array(this.nb_pieces.x);
		for (i = 0; i < columns.length; i++) {
			columns[i] = Array(this.nb_pieces.y);
		}
		// horizontales
		rows		= Array(this.nb_pieces.y);
		for (i = 0; i < rows.length; i++) {
			rows[i] = Array(this.nb_pieces.x);
		}
		// diagonales montantes
		diag_m	= Array(this.nb_pieces.x+this.nb_pieces.y-1);
		for (var i = 0; i < diag_m.length; i++) {
			diag_m[i]=Array(
				Math.min(i+1, diag_m.length-i, this.nb_pieces.x, this.nb_pieces.y)
			);
		}
		// diagonales descendantes
		diag_d	= Array(this.nb_pieces.x+this.nb_pieces.y-1);
		for (var i = 0; i < diag_d.length; i++) {
			diag_d[i]=Array(
				Math.min(i+1, diag_d.length-i, this.nb_pieces.x, this.nb_pieces.y)
			);
		}

      // on remplit les tableaux
		for (i = 0; i < this.pieces.length; i++) {
			for (j = 0; j < this.pieces[i].length; j++) {
				piece = this.pieces[i][j];

				columns	[i][j]		= piece;
				rows		[j][i]		= piece;
				diag_m	[i+j][Math.min(i,this.nb_pieces.y-j-1)] = piece;
				diag_d	[i+this.nb_pieces.y-j-1][Math.min(i,j)] = piece;
			}
		}

		// on effectue les tests pour chaque couleur
		for (i = 0; i < colors_verif.length; i++) {
			color = colors_verif[i];

			// fonction servant a tester un piecesleau de lignes
			function test_lines(lines){
				var compteur = 0;
				for (j = 0; j < lines.length; j++) {
					var line = lines[j];
					for (var k = 0; k < line.length; k++) {
						var piece = line[k];
						// console.log(piece);
						if(piece.color==color){
							compteur++;
							console.log('c: '+compteur);
							if(compteur>=4){
								for(var id_player=0;id_player<players.length;id_player++){
									if(players[id_player].color == color){
										vthis.choose_winner(id_player);
									}
								}
							}
						}else{
							compteur=0;
						}
					}
				}
			}

			// on teste les verticales
			console.log('on teste les verticales.');
			test_lines(columns);
			// on teste les horizontales
			console.log('on teste les horizontales.');
			test_lines(rows);
			// on teste les diagonales montantes
			console.log('on teste les diagonales montantes.');
			console.log(diag_m);
			test_lines(diag_m);
			// on teste les diagonales descendantes
			console.log('on teste les diagonales descendantes.');
			test_lines(diag_d);
		}
		// console.log(winner);
	}
	choose_winner(id_player){
		console.log(this);
		var winner = this.players[id_player];
		console.log('Le joueur '+winner.name+' gagne !');
		this.winner = winner;
		for (var i = 0; i < winner_elems.length; i++) {
			winner_elems[i].innerText = winner.name;
		}
	}
}

class Player{
	constructor(name, color){
		this.color = color;
		this.name = name;
		this.grid = 0;
	}
	play(no_column){
		this.grid.play(this, no_column);
	}
	affect(grid){
		this.grid = grid;
		grid.players.push(this);
	}
}

var connect_4 = {
	// attributs
	elems:	{},
	players: [
		new Player('joueur 1','red'),
		new Player('joueur 2','yellow')
	],
	grid:		0,
	// methodes
	// fonction qui dessine la partie
	draw:		function(){
		var cvs = connect_4.elems.cvs;
		var ctx = cvs.getContext('2d');
		if(ctx){
			ctx.clearRect(0, 0, cvs.clientWidth ,cvs.clientHeight);
			connect_4.grid.draw(ctx);
		}

	},
	// fonction qui démare la partie
	start:	function(){
		console.log('On lance la partie.');
		// on récupère le canvas
		var cvs		= connect_4.elems.cvs;

		// on récupère les dimesions du canvas
		var dim_cvs	= {x: cvs.clientWidth, y: cvs.clientHeight};

		// on récupère le context du canvas
		var ctx		= 0;
		if(!cvs.getContext('2d')){
			ctx = cvs.getContext('2d');
		}

		// on crée le jeu
		connect_4.grid = new Grid(dim_cvs);

		// on y affecte les joueurs
		connect_4.players[0].affect(connect_4.grid);
		connect_4.players[1].affect(connect_4.grid);

		// On dessine en boucle
		window.setInterval(connect_4.draw,100);

		// On réagit au touches de clavier
		document.addEventListener('keydown',function(e){
			var key = e.which;
			var player = connect_4.grid.players[connect_4.grid.player_await];
			// console.log('click sur une touche de clavier '+key);
			switch (key) {
				// valeur 0
				case 96:
					player.play(0);
					break;
				// valeur 1
				case 97:
					player.play(1);
				break;
				// valeur 2
				case 98:
					player.play(2);
				break;
				// valeur 3
				case 99:
					player.play(3);
				break;
				// valeur 4
				case 100:
					player.play(4);
				break;
				// valeur 5
				case 101:
					player.play(5);
				break;
				// valeur 6
				case 102:
					player.play(6);
				break;
				// valeur 7
				case 103:
					player.play(7);
				break;
				default:
					console.log('La touche n\'est pas reconue.');
			}
		});
	}
}

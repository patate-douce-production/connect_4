// ce script lance un jeu de puissance 4 (connect 4) à partir d'éléments dom contenu dans la variable globale 'connect_4.elems'

// Classes des objets utilisé au Puissance 4
class Piece{
    constructor(player, pos_aff, pos_math, rayon){
        this.player = player;
		// position affichée
        this.pos_aff = pos_aff;
		// position objectif
        this.pos_math = pos_math;
		this.rayon = rayon;
	}
    draw(ctx, texture) {
        ctx.drawImage(texture, this.player.IDColor * texture.width / 7, texture.height / 13 * 6, texture.width /7 , texture.height / 13, this.pos_aff.x-50/2, this.pos_aff.y-50/2, 50, 50);
	}
    update() {
        if (this.player == null || (this.pos_aff.x == this.pos_math.x && this.pos_aff.y == this.pos_math.y))
            return false;
        for (let i = 0; i < 13; i++) {
             /*
            if (this.pos_aff.x < this.pos_math.x) {
                this.pos_aff.x++;
            } else if (this.pos_aff.x > this.pos_math.x) {
                this.pos_aff.x--;
            }
            */
            if (this.pos_aff.y < this.pos_math.y) {
                this.pos_aff.y++;
            } else if (this.pos_aff.y > this.pos_math.y) {
                this.pos_aff.y--;
            }
        }
        return true;
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
        // id de la texture utilisée
        this.IDTexture = 'classic';
		// tableau de pieces
		this.pieces= Array();
		for (var i = 0; i < this.nb_pieces.x; i++) {
			this.pieces.push(Array());
			for (var j = 0; j < this.nb_pieces.y; j++) {
				this.pieces[i].push(0);
                this.setPiece(null, { x: i, y: j });
			}
        }
        // console.log(this.pieces);
	}
    draw(ctx) {
        var texture = connect_4.textures[this.IDTexture];
        // image de fond
        ctx.drawImage(texture, 0, texture.height / 13 * 7, texture.width, texture.height/13*6, 0, 0, 350, 300);
        for (let i = 0; i < this.pieces.length; i++) {
            let colone = this.pieces[i];
            for (let j = 0; j < colone.length; j++) {
                let piece = colone[j];
                if (piece.player != null)
                    piece.draw(ctx, texture);
            }
        }
        // plateau a l'avant
        ctx.drawImage(texture, 0, 0, texture.width, texture.height / 13 * 6, 0, 0  , 350, 300);
		if(this.winner!=0){
			ctx.font = this.dim.x/10+'px Trebuchet MS';
			var msg = 'Le '+this.winner.name+' a gagné !';
			ctx.fillStyle = this.winner.color;
			ctx.fillText	(msg, this.dim.y/20, this.dim.x/2, this.dim.x/10*9);
			ctx.strokeStyle = 'black';
			ctx.strokeText	(msg, this.dim.y/20, this.dim.x/2, this.dim.x/10*9);
		}
	}
	play(player, no_column){
		if(this.players[this.player_await].color == player.color&&this.winner==0){
            console.log(player.name + ' joue la collone ' + no_column + '.');
			var column = this.pieces[no_column];
            for (var i = column.length - 1; i >= 0; i--) {
                if (column[i].player == null) {
                    this.putPiece(player, no_column, i);
					this.player_await++;
                    this.player_await %= this.players.length;
                    connect_4.displayPlayers();
					this.verif();
					break;
				}
			}

		}
	}
    setPiece(player, p, pa) {
		if(player!=null)
			console.log('Un jeton du joueur '+player.name+' se positionne en x:'+p.x+' y:'+p.y);
		var rayon = Math.min(
			this.dim.x/this.nb_pieces.x,
			this.dim.y/this.nb_pieces.y,
		)/3;
        var position_math = {
            x: this.dim.x / this.nb_pieces.x * (p.x + 0.5),
            y: this.dim.y / this.nb_pieces.y * (p.y + 0.5)
        };
        var position_aff;
        if (pa == null) {
            position_aff = position_math
        } else {
            position_aff = {
                x: this.dim.x / this.nb_pieces.x * (p.x + 0.5),
                y: 0
            };
        }
        var piece = new Piece(player, position_aff, position_math, rayon);
		this.pieces[p.x][p.y] = piece;
	}
    putPiece(player, x, y) {
        this.setPiece(player, {
            x: x,
            y: y
        }, {
                x: x,
                y: 0
            }
        );
        connect_4.animation.start();
    }
    verif() {
        console.log('On vérifie que aucun joueur n\'a encore gagné.');
        // variables de la fonction
		var i,j,k;
		var columns, rows, diag_m, diag_d, piece;
		var winner = this.winner;
        var players = this.players, player;
		var var_grid = this;

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
		for (i = 0; i < players.length; i++) {
			player = players[i];

			// fonction servant a tester un tableau de lignes
			function test_lines(lines){
				for (let i = 0; i < lines.length; i++) {
					let compteur=0;
					let line = lines[i];
					for (let j = 0; j < line.length; j++) {
						let piece = line[j];
						if(piece.player===player){
							compteur++;
							if(compteur>=4){
                                for (let id_player = 0; id_player < players.length; id_player++){
                                    console.log(1)
                                    if (players[id_player] == player) {
                                        console.log(0)
										var_grid.choose_winner(id_player);
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
			//console.log('on teste les verticales.');
			test_lines(columns);
			// on teste les horizontales
			// console.log('on teste les horizontales.');
			test_lines(rows);
			// on teste les diagonales montantes
			//console.log('on teste les diagonales montantes.');
			test_lines(diag_m);
			// on teste les diagonales descendantes
			//console.log('on teste les diagonales descendantes.');
			test_lines(diag_d);
		}
		// console.log(winner);
	}
	choose_winner(id_player){
		// console.log(this);
		var winner = this.players[id_player];
		console.log('Le joueur '+winner.name+' gagne !');
		this.winner = winner;
		for (var i = 0; i < connect_4.DOM.winner.length; i++) {
			connect_4.DOM.winner[i].innerText = winner.name;
			connect_4.DOM.winner[i].style.color = winner.color;
		}
	}
    update() {
        var rep = false;
		for (let i = 0; i < this.pieces.length; i++) {
			for (let j = 0; j < this.pieces[j].length; j++) {
                if (this.pieces[i][j].update())
                    rep = true;
			}
        }
        return rep;
	}
}

class Player{
	constructor(name, ID, color){
        this.color = color;
        this.IDColor = ID;
		this.name = name;
		this.grid = 0;
	}
	play(no_column){
		this.grid.play(this, no_column);
	}
	affect(grid){
		this.grid = grid;
        grid.players.push(this);
        connect_4.displayPlayers();
    }
}

colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'black'];

var connect_4 = {
	// attributs
    DOM: {},

    // tableau contenant l'image correspondant a chaque thème
    textures: [],

	players: [
        new Player('joueur 1', 0,colors[0]),
        new Player('joueur 2', 1,colors[1])
    ],
    displayPlayers: function () {
        var text = '';
        for (let i = 0; i < connect_4.players.length; i++) {
            text += '<li style=\'color: ' + connect_4.players[i].color + '\'>' + connect_4.players[i].name + '</li>';
        }
        for (let i = 0; i < connect_4.DOM.players_list.length; i++) {
            connect_4.DOM.players_list[i].innerHTML = text;
        }
        for (var i = 0; i < connect_4.DOM.player_await.length; i++) {
            connect_4.DOM.player_await[i].innerText = connect_4.players[connect_4.grid.player_await].name;
            connect_4.DOM.player_await[i].style.color = connect_4.players[connect_4.grid.player_await].color;
        }
    },
	grid:		0,
    animation: {
        interval: 0,
        start: function () {
            if (this.interval != 0)
                return false;
            this.interval = window.setInterval(function () {
                // On actualise la grille
                if (connect_4.grid.update()) {
                    // On dessine en boucle
                    connect_4.draw();
                } else {
                    connect_4.animation.stop();
                }
            }, 1000 / 17);
            return true;
        },
        stop: function () {
            if (this.interval == 0)
                return false;
            window.clearInterval(this.interval);
            this.interval = 0;
            return true;
        }
    },
	// methodes
	// fonction qui dessine la partie
    draw: function () {
        // console.log('draw')
        var cvs = connect_4.DOM.cvs;
		var ctx = cvs.getContext('2d');
		if(ctx){
			ctx.clearRect(0, 0, cvs.clientWidth ,cvs.clientHeight);
			connect_4.grid.draw(ctx);
        }
	},
	// fonction qui démare la partie
	start:	function(){
        console.log('On lance la partie.');

		// on récupère les dimesions du canvas
		var dim_cvs	= {x: 350, y: 300};

		// on crée le jeu
		connect_4.grid = new Grid(dim_cvs);

		// on y affecte les joueurs
		connect_4.players[0].affect(connect_4.grid);
        connect_4.players[1].affect(connect_4.grid);

        this.draw();

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
					// console.log('La touche n\'est pas reconue.');
			}
        });

        // On réagit au clics
        this.DOM.cvs.addEventListener('click', function (e) {
            var element_rect = connect_4.DOM.cvs.getBoundingClientRect();
            var grid = connect_4.grid;
            grid.play(grid.players[grid.player_await], parseInt((e.clientX - element_rect.left) * 7 / element_rect.width));
            return false;
        })

        this.DOM.theme_select.addEventListener('input', function (e) {
            console.log(e.target);
            connect_4.grid.IDTexture = e.target.selectedOptions[0].innerHTML;
            connect_4.draw();
        })

        for (let i = 0; i < this.DOM.select_color.length; i++) {
            this.DOM.select_color[i].addEventListener('input', function (e) {
                connect_4.players[i].IDColor = e.target.selectedOptions[0].index;
                colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'black'];
                connect_4.players[i].color = colors[e.target.selectedOptions[0].index];
                connect_4.draw();
                connect_4.displayPlayers();
            })
        }
	}
}
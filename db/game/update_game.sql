update games
set title = $1, description = $2, game_picture = $3
where game_id = $4 and user_id = $5;

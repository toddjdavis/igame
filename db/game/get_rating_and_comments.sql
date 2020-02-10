select * from rating r
join comments c on r.game_id  = r.game_id
where r.game_id = $1
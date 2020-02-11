select * from rating r
join comments c on r.game_id  = r.game_id
join users s on c.user_id = s.user_id
where r.game_id = $1
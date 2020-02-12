select * from liked l
join games g on l.game_id = g.game_id
where l.user_id = $1